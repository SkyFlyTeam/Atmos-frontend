import { useState, useEffect, useCallback } from 'react';
import { Estacao } from '@/interfaces/Estacoes';
import { estacaoServices } from '@/services/estacaoServices';
import { ApiException } from '@/config/apiException';
import { EstacaoParametroRelacao } from '@/interfaces/ParametroEstacao';

export interface UseEstacoesReturn {
  estacoes: Estacao[];
  loading: boolean;
  error: string | null;
  createEstacao: (data: Omit<Estacao, 'pk'>) => Promise<void>;
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
      } else {
        // carregar parâmetros de cada estação
        const estacoesComParametros = await Promise.all(
          result.map(async (estacao) => {
            if (!estacao.pk) {
              return { ...estacao, parametros: [] };
            }

            const relacoes = await estacaoServices.getEstacaoParametros(estacao.pk);

            if (relacoes instanceof ApiException) {
              return { ...estacao, parametros: [] };
            }

            const nomesParametros = relacoes.map(
              (rel: EstacaoParametroRelacao) => rel.tipoParametro.nome
            );
            return { ...estacao, parametros: nomesParametros };
          })
        );

        setEstacoes(estacoesComParametros);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Erro ao carregar estações';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const createEstacao = useCallback(
    async (data: Omit<Estacao, 'pk'>) => {
      setLoading(true);
      setError(null);

      try {
        const { parametros, ...estacaoData } = data;

        const result = await estacaoServices.createEstacao(estacaoData);
        if (result instanceof ApiException) {
          throw new Error(result.message);
        }

        // criar relações se houver parâmetros selecionados
        if (parametros && parametros.length > 0) {
          const { parametroServices } = await import('@/services/parametroServices');
          const todosParametros = await parametroServices.getAllParametros();

          if (!(todosParametros instanceof ApiException)) {
            const parametrosIds = todosParametros
              .filter((p) => parametros.includes(p.nome))
              .map((p) => p.pk);

            if (parametrosIds.length > 0 && result.pk) {
              await estacaoServices.createEstacaoParametros(result.pk, parametrosIds);
            }
          }
        }

        await fetchEstacoes();
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
    async (pk: number, data: Estacao) => {
      setLoading(true);
      setError(null);

      try {
        const { parametros, ...estacaoData } = data;

        const result = await estacaoServices.updateEstacao(pk, estacaoData);
        if (result instanceof ApiException) {
          throw new Error(result.message);
        }

        // atualizar parâmetros
        if (parametros && pk > 0) {
          const relacoesAtuais = await estacaoServices.getEstacaoParametros(pk);
          if (!(relacoesAtuais instanceof ApiException)) {
            const atuaisIds = relacoesAtuais.map((r) => r.tipo_parametro_pk);

            const { parametroServices } = await import('@/services/parametroServices');
            const todosParametros = await parametroServices.getAllParametros();

            if (!(todosParametros instanceof ApiException)) {
              const novosIds = parametros
                .map((nome) => todosParametros.find((p) => p.nome === nome)?.pk)
                .filter((id): id is number => !!id);

              // remover os que não estão mais
              for (const id of atuaisIds) {
                if (!novosIds.includes(id)) {
                  await estacaoServices.removeParametroFromEstacao(pk, id);
                }
              }

              // adicionar novos
              const idsParaCriar = novosIds.filter((id) => !atuaisIds.includes(id));
              if (idsParaCriar.length > 0) {
                await estacaoServices.createEstacaoParametros(pk, idsParaCriar);
              }
            }
          }
        }

        await fetchEstacoes();
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
        throw new Error(result.message);
      }

      setEstacoes((prev) => prev.filter((estacao) => estacao.pk !== pk));
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Erro ao deletar estação';
      setError(errorMessage);
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
