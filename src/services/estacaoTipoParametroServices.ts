import { Api } from "@/config/api";
import { ApiException } from "@/config/apiException";
import type { EstacaoTipoParametroRel } from "@/interfaces/EstacaoTipoParametro";

const getByEstacao = async (
  estacaoPk: number
): Promise<EstacaoTipoParametroRel[] | ApiException> => {
  try {
    const { data } = await Api.get(`/estacao-tipo-parametro/estacao/${estacaoPk}`);
    return data as EstacaoTipoParametroRel[];
  } catch (error) {
    if (error instanceof Error) {
      return new ApiException(error.message || "Erro ao consultar parâmetros da estação.");
    }
    return new ApiException("Erro desconhecido.");
  }
};

export const estacaoTipoParametroServices = {
  getByEstacao,
};

