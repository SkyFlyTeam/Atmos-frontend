import { Api } from "@/config/api";
import { ApiException } from "@/config/apiException";
import type { Estacao } from "@/interfaces/Estacao";

const getAllEstacoes = async (): Promise<Estacao[] | ApiException> => {
  try {
    const { data } = await Api.get("/estacao");
    return data as Estacao[];
  } catch (error) {
    if (error instanceof Error) {
      return new ApiException(error.message || "Erro ao consultar estações.");
    }
    return new ApiException("Erro desconhecido.");
  }
};

export const estacaoServices = {
  getAllEstacoes,
};

