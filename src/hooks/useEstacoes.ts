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
        // Buscar parâmetros para cada estação
        const estacoesComParametros = await Promise.all(
          result.map(async (estacao) => {
            try {
              const parametros = await estacaoServices.getParametrosByEstacao(estacao.pk);
              if (parametros instanceof ApiException) {
                console.warn(
                  `Erro ao buscar parâmetros da estação ${estacao.pk}:`,
                  parametros.message
                );
                return { ...estacao, parametros: [] };
              }

              // Converter para array de nomes
              const nomesParametros = parametros.map((p) => p.nome).filter(Boolean);

              return { ...estacao, parametros: nomesParametros };
            } catch (err) {
              console.warn(`Erro ao buscar parâmetros da estação ${estacao.pk}:`, err);
              return { ...estacao, parametros: [] };
            }
          })
        );

        setEstacoes(estacoesComParametros);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Erro ao carregar estações';
      setError(errorMessage);
      console.error('Erro ao buscar estações:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const createEstacao = useCallback(
    async (estacao: Estacao) => {
      setLoading(true);
      setError(null);

      try {
        const result = await estacaoServices.createEstacao(estacao);

        if (result instanceof ApiException) {
          setError(result.message);
          throw new Error(result.message);
        } else {
          // Processar parâmetros se enviados
          if (estacao.parametros && estacao.parametros.length > 0) {
            try {
              const { parametroServices } = await import('@/services/parametroServices');
              const todosParametros = await parametroServices.getAllParametros();

              if (!(todosParametros instanceof ApiException)) {
                for (const nomeParametro of estacao.parametros) {
                  const parametro = todosParametros.find((p) => p.nome === nomeParametro);
                  if (parametro) {
                    await estacaoServices.addParametroToEstacao(result.pk, parametro.pk);
                  }
                }
              }
            } catch (e) {
              console.warn('Erro ao processar parâmetros:', e);
            }
          }

          await fetchEstacoes();
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Erro ao criar estação';
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchEstacoes]
  );

  const updateEstacao = useCallback(
    async (pk: number, estacao: Estacao) => {
      setLoading(true);
      setError(null);

      try {
        const result = await estacaoServices.updateEstacao(pk, estacao);

        if (result instanceof ApiException) {
          setError(result.message);
          throw new Error(result.message);
        } else {
          // Processar parâmetros se enviados
          if (estacao.parametros) {
            try {
              const { parametroServices } = await import('@/services/parametroServices');
              const todosParametros = await parametroServices.getAllParametros();

              if (!(todosParametros instanceof ApiException)) {
                // Remover parâmetros existentes
                const parametrosExistentes = await estacaoServices.getParametrosByEstacao(pk);
                if (!(parametrosExistentes instanceof ApiException)) {
                  for (const parametroExistente of parametrosExistentes) {
                    await estacaoServices.removeParametroFromEstacao(pk, parametroExistente.pk);
                  }
                }

                // Adicionar novos parâmetros
                for (const nomeParametro of estacao.parametros) {
                  const parametro = todosParametros.find((p) => p.nome === nomeParametro);
                  if (parametro) {
                    await estacaoServices.addParametroToEstacao(pk, parametro.pk);
                  }
                }
              }
            } catch (e) {
              console.warn('Erro ao processar parâmetros:', e);
            }
          }

          await fetchEstacoes();
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Erro ao atualizar estação';
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchEstacoes]
  );

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
        setEstacoes((prev) => prev.filter((estacao) => estacao.pk !== pk));
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Erro ao deletar estação';
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
