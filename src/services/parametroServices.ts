import { Api } from "@/config/api";
import { ApiException } from "@/config/apiException";
import { Parametro } from "@/interfaces/Parametros";

const getAllParametros = async (): Promise<Parametro[] | ApiException> => {
    try{
        const { data } = await Api.get("/tipo-parametro")
        return data as Parametro[]
    } catch (error) {
        if (error instanceof Error) {
            return new ApiException(error.message || "Erro ao consultar parametros.");
        }
        return new ApiException("Erro desconhecido.");
    }
};

const getParametroById = async (param_id: number) => {
    return
};

const createParametro = async (parametro: Parametro): Promise<Parametro[] | ApiException> => {
    try{
        const { data } = await Api.post("/tipo-parametro", parametro)
        return data as Parametro[]
    } catch (error) {
        if (error instanceof Error) {
            return new ApiException(error.message || "Erro ao criar parametro");
        }
        return new ApiException("Erro desconhecido.");
    }
};

const updateParametro = async (parametro: Parametro) => {
    return
};

const deleteParametro = async (param_id: number): Promise<any | ApiException> => {
    try{
        const { data } = await Api.delete(`/tipo-parametro/${param_id}`)
        return data
    } catch (error) {
        if (error instanceof Error) {
            return new ApiException(error.message || "Erro ao deletar parametro.");
        }
        return new ApiException("Erro desconhecido.");
    }
};

export const parametroServices = {
    getAllParametros,
    getParametroById,
    createParametro,
    updateParametro,
    deleteParametro
};

