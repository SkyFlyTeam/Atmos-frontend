import { Api } from "@/config/api";
import { ApiException } from "@/config/apiException";
import { Estacao } from "@/interfaces/Estacoes";
import { EstacaoParametroRelacao } from "@/interfaces/ParametroEstacao";

const getAllEstacoes = async (): Promise<Estacao[] | ApiException> => {
  try {
    const { data } = await Api.get("/estacao");
    return data as Estacao[];
  } catch (error: any) {
    if (error.response?.status === 404) return [];
    if (error instanceof Error)
      return new ApiException(error.message || "Erro ao consultar estações.");
    return new ApiException("Erro desconhecido.");
  }
};

const getEstacaoById = async (
  estacao_id: number
): Promise<Estacao | ApiException> => {
  try {
    const { data } = await Api.get(`/estacao/${estacao_id}`);
    return data as Estacao;
  } catch (error) {
    if (error instanceof Error)
      return new ApiException(error.message || "Erro ao consultar estação.");
    return new ApiException("Erro desconhecido.");
  }
};

const createEstacao = async (
  estacao: Omit<Estacao, 'pk'>
): Promise<Estacao | ApiException> => {
  try {
    const { data } = await Api.post("/estacao", estacao);
    return data as Estacao;
  } catch (error) {
    if (error instanceof Error)
      return new ApiException(error.message || "Erro ao criar estação");
    return new ApiException("Erro desconhecido.");
  }
};

const updateEstacao = async (
  estacao_id: number,
  estacao: Estacao
): Promise<Estacao | ApiException> => {
  try {
    const { data } = await Api.put(`/estacao/${estacao_id}`, estacao);
    return data as Estacao;
  } catch (error) {
    if (error instanceof Error)
      return new ApiException(error.message || "Erro ao atualizar estação");
    return new ApiException("Erro desconhecido.");
  }
};

const deleteEstacao = async (
  estacao_id: number
): Promise<any | ApiException> => {
  try {
    const { data } = await Api.delete(`/estacao/${estacao_id}`);
    return data;
  } catch (error) {
    if (error instanceof Error)
      return new ApiException(error.message || "Erro ao deletar estação.");
    return new ApiException("Erro desconhecido.");
  }
};

const getEstacaoParametros = async (
  estacao_pk: number
): Promise<EstacaoParametroRelacao[] | ApiException> => {
  try {
    const { data } = await Api.get(
      `/estacao-tipo-parametro/estacao/${estacao_pk}`
    );
    return data;
  } catch (error) {
    if ((error as any).response?.status === 404) return [];
    if (error instanceof Error)
      return new ApiException(
        error.message || "Erro ao buscar parâmetros da estação"
      );
    return new ApiException("Erro desconhecido");
  }
};

const createEstacaoParametros = async (
  estacao_pk: number,
  parametros_pk: number[]
): Promise<EstacaoParametroRelacao[] | ApiException> => {
  try {
    const { data } = await Api.post("/estacao-tipo-parametro", {
      estacao_est_pk: [estacao_pk],
      tipo_parametro_pk: parametros_pk,
    });
    return data;
  } catch (error) {
    if (error instanceof Error)
      return new ApiException(
        error.message || "Erro ao criar relações de parâmetros"
      );
    return new ApiException("Erro desconhecido");
  }
};

const removeParametroFromEstacao = async (
  estacaoPk: number,
  tipoParametroPk: number
): Promise<void | ApiException> => {
  try {
    await Api.delete(`/estacao-tipo-parametro/${estacaoPk}/${tipoParametroPk}`);
    return;
  } catch (error) {
    if (error instanceof Error)
      return new ApiException(
        error.message || "Erro ao remover parâmetro da estação."
      );
    return new ApiException("Erro desconhecido.");
  }
};

export const estacaoServices = {
  getAllEstacoes,
  getEstacaoById,
  createEstacao,
  updateEstacao,
  deleteEstacao,
  getEstacaoParametros,
  createEstacaoParametros,
  removeParametroFromEstacao,
};
