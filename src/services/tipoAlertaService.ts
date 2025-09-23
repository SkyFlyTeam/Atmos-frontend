import { Api } from "@/config/api";
import { ApiException } from "@/config/apiException";
import { TipoAlerta } from "@/interfaces/TipoAlerta";

const getAllTipoAlertas = async (): Promise<TipoAlerta[] | ApiException> => {
    try{
        const { data } = await Api.get("/tipo-alerta")
        return data as TipoAlerta[]
    } catch (error) {
        if (error instanceof Error) {
            return new ApiException(error.message || "Erro ao consultar tipos de alertas.");
        }
        return new ApiException("Erro desconhecido.");
    }
};

const getTipoAlertaById = async (param_id: number) => {
    return
};

const createTipoAlerta = async (parametro: TipoAlerta): Promise<TipoAlerta[] | ApiException> => {
    try{
        const { data } = await Api.post("/tipo-alerta", parametro)
        return data as TipoAlerta[]
    } catch (error) {
        if (error instanceof Error) {
            return new ApiException(error.message || "Erro ao criar tipo de alerta");
        }
        return new ApiException("Erro desconhecido.");
    }
};

const updateTipoAlerta = async (tipoAlerta: TipoAlerta): Promise<TipoAlerta | ApiException> => {
    try{
        const { data } = await Api.put(`/tipo-alerta/${tipoAlerta.pk}`, tipoAlerta)
        return data as TipoAlerta
    } catch (error) {
        if (error instanceof Error) {
            return new ApiException(error.message || "Erro ao atualizar tipo de alerta");
        }
        return new ApiException("Erro desconhecido.");
    }
};

const deleteTipoAlerta = async (param_id: number): Promise<any | ApiException> => {
    try{
        const { data } = await Api.delete(`/tipo-alerta/${param_id}`)
        return data
    } catch (error) {
        if (error instanceof Error) {
            return new ApiException(error.message || "Erro ao deletar tipo de alerta.");
        }
        return new ApiException("Erro desconhecido.");
    }
};

export const tipoAlertaServices = {
    getAllTipoAlertas,
    getTipoAlertaById,
    createTipoAlerta,
    updateTipoAlerta,
    deleteTipoAlerta
};
  