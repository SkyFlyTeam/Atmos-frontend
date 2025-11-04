import { Api } from "@/config/api";
import { ApiException } from "@/config/apiException";

const getAllAlertas = async (): Promise<any | ApiException> => {
  try {
    const { data } = await Api.get("/alerta");
    return data;
  } catch (error) {
    if (error instanceof Error) {
      return new ApiException(error.message || "Erro ao consultar alertas.");
    }
    return new ApiException("Erro desconhecido.");
  }
};

const deleteAlerta = async (alertaId: number): Promise<any | ApiException> => {
  try {
    const { data } = await Api.delete(`/alerta/${alertaId}`);
    return data;
  } catch (error) {
    if (error instanceof Error) {
      return new ApiException(error.message || "Erro ao excluir alerta.");
    }
    return new ApiException("Erro desconhecido.");
  }
};

export const alertaService = {
  getAllAlertas,
  deleteAlerta,
};
