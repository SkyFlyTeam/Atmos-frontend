import { Api } from "@/config/api";
import { ApiException } from "@/config/apiException";
import { Cidade } from "@/interfaces/Cidade";

const getAllCidades = async (): Promise<Cidade[] | ApiException> => {
    try {
        const { data } = await Api.get("/cidade");
        return data as Cidade[];
    } catch (error: any) {
        if (error.response?.status === 404) return [];
        if (error instanceof Error)
        return new ApiException(error.message || "Erro ao consultar cidades.");
        return new ApiException("Erro desconhecido.");
    }
};

export const cidadeServices = {
    getAllCidades
};
