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
        setEstacoes(result);
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
      const result = await estacaoServices.createEstacao(data);
      
      if (result instanceof ApiException) {
        setError(result.message);
        console.error('Erro ao criar estação:', result.message);
        throw new Error(result.message);
      } else {
        setEstacoes(prev => [...prev, result]);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar estação';
      setError(errorMessage);
      console.error('Erro ao criar estação:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateEstacao = useCallback(async (pk: number, data: Estacao) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await estacaoServices.updateEstacao(pk, data);
      
      if (result instanceof ApiException) {
        setError(result.message);
        console.error('Erro ao atualizar estação:', result.message);
        throw new Error(result.message);
      } else {
        setEstacoes(prev => 
          prev.map(estacao => 
            estacao.pk === pk ? result : estacao
          )
        );
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar estação';
      setError(errorMessage);
      console.error('Erro ao atualizar estação:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

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