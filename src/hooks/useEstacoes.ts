import { useState, useEffect, useCallback } from 'react';
import { Estacao } from '@/interfaces/Estacoes';
import { estacaoServices } from '@/services/estacaoServices';
import { ApiException } from '@/config/apiException';

export interface UseEstacoesReturn {
  estacoes: Estacao[];
  loading: boolean;
  error: string | null;
  createEstacao: (data: Estacao) => Promise<void>;
  updateEstacao: (pk: number, data: Estacao) => Promise<void>;
  deleteEstacao: (pk: number) => Promise<void>;
  refreshEstacoes: () => Promise<void>;
}

export function useEstacoes(): UseEstacoesReturn {
  const [estacoes, setEstacoes] = useState<Estacao[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEstacoes = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await estacaoServices.getAllEstacoes();
      
      if (result instanceof ApiException) {
        setError(result.message);
        console.error('Erro ao buscar estações:', result.message);
      } else {
        console.log(' Estações carregadas do backend:', result);
        
        // Buscar parâmetros para cada estação
        const estacoesComParametros = await Promise.all(
          result.map(async (estacao) => {
            try {
              const parametros = await estacaoServices.getParametrosByEstacao(estacao.pk);
              if (parametros instanceof ApiException) {
                console.warn(` Erro ao buscar parâmetros da estação ${estacao.pk}:`, parametros.message);
                return { ...estacao, parametros: [] };
              }
              
              // Converter para array de nomes
              const nomesParametros = parametros.map(p => p.nome).filter(Boolean);
              console.log(`Parâmetros da estação ${estacao.pk}:`, nomesParametros);
              
              return { ...estacao, parametros: nomesParametros };
            } catch (err) {
              console.warn(`Erro ao buscar parâmetros da estação ${estacao.pk}:`, err);
              return { ...estacao, parametros: [] };
            }
          })
        );
        
        console.log('Estações com parâmetros processadas:', estacoesComParametros);
        setEstacoes(estacoesComParametros);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar estações';
      setError(errorMessage);
      console.error('Erro ao buscar estações:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const createEstacao = useCallback(async (data: Estacao) => {
    setLoading(true);
    setError(null);
    
    try {
      // Separar parâmetros dos dados da estação
      const { parametros, ...estacaoData } = data;
      
      console.log('Criando estação com dados:', estacaoData);
      console.log('Parâmetros para associar:', parametros);
      
      const result = await estacaoServices.createEstacao(estacaoData);
      
      if (result instanceof ApiException) {
        setError(result.message);
        console.error('Erro ao criar estação:', result.message);
        throw new Error(result.message);
      } else {
        console.log('Estação criada com sucesso:', result);
        
        // Se há parâmetros, associar à estação
        if (parametros && parametros.length > 0) {
          console.log('Associando parâmetros à estação...');
          
          // Buscar os IDs dos parâmetros pelo nome
          const { parametroServices } = await import('@/services/parametroServices');
          const todosParametros = await parametroServices.getAllParametros();
          
          if (!(todosParametros instanceof ApiException)) {
            for (const nomeParametro of parametros) {
              const parametro = todosParametros.find(p => p.nome === nomeParametro);
              if (parametro) {
                console.log(`Associando parâmetro ${nomeParametro} (ID: ${parametro.pk}) à estação ${result.pk}`);
                await estacaoServices.addParametroToEstacao(result.pk, parametro.pk);
              }
            }
          }
        }
        
        // Atualizar a lista de estações para mostrar os parâmetros
        await fetchEstacoes();
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar estação';
      setError(errorMessage);
      console.error('Erro ao criar estação:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchEstacoes]);

  const updateEstacao = useCallback(async (pk: number, data: Estacao) => {
    setLoading(true);
    setError(null);
    
    try {
      // Separar parâmetros dos dados da estação
      const { parametros, ...estacaoData } = data;
      
      console.log('Atualizando estação com dados:', estacaoData);
      console.log('Parâmetros para associar:', parametros);
      
      const result = await estacaoServices.updateEstacao(pk, estacaoData);
      
      if (result instanceof ApiException) {
        setError(result.message);
        console.error('Erro ao atualizar estação:', result.message);
        throw new Error(result.message);
      } else {
        console.log('Estação atualizada com sucesso:', result);
        
        // Se há parâmetros, atualizar as associações
        if (parametros && parametros.length >= 0) {
          console.log('Atualizando parâmetros da estação...');
          
          // Buscar os IDs dos parâmetros pelo nome
          const { parametroServices } = await import('@/services/parametroServices');
          const todosParametros = await parametroServices.getAllParametros();
          
          if (!(todosParametros instanceof ApiException)) {
            // Primeiro, remover todos os parâmetros existentes
            const parametrosExistentes = await estacaoServices.getParametrosByEstacao(pk);
            if (!(parametrosExistentes instanceof ApiException)) {
              for (const parametroExistente of parametrosExistentes) {
                await estacaoServices.removeParametroFromEstacao(pk, parametroExistente.pk);
              }
            }
            
            // Depois, adicionar os novos parâmetros
            for (const nomeParametro of parametros) {
              const parametro = todosParametros.find(p => p.nome === nomeParametro);
              if (parametro) {
                console.log(`Associando parâmetro ${nomeParametro} (ID: ${parametro.pk}) à estação ${pk}`);
                await estacaoServices.addParametroToEstacao(pk, parametro.pk);
              }
            }
          }
        }
        
        // Atualizar a lista de estações para mostrar os parâmetros atualizados
        await fetchEstacoes();
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar estação';
      setError(errorMessage);
      console.error('Erro ao atualizar estação:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchEstacoes]);

  const deleteEstacao = useCallback(async (pk: number) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await estacaoServices.deleteEstacao(pk);
      
      if (result instanceof ApiException) {
        setError(result.message);
        console.error('Erro ao deletar estação:', result.message);
        throw new Error(result.message);
      } else {
        setEstacoes(prev => prev.filter(estacao => estacao.pk !== pk));
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao deletar estação';
      setError(errorMessage);
      console.error('Erro ao deletar estação:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshEstacoes = useCallback(async () => {
    await fetchEstacoes();
  }, [fetchEstacoes]);

  // Carregar estações na inicialização
  useEffect(() => {
    fetchEstacoes();
  }, [fetchEstacoes]);

  return {
    estacoes,
    loading,
    error,
    createEstacao,
    updateEstacao,
    deleteEstacao,
    refreshEstacoes,
  };
}