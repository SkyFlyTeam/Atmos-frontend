import { Api } from "@/config/api";
import { ApiException } from "@/config/apiException";
import { Estacao } from "@/interfaces/Estacoes";

const getAllEstacoes = async (): Promise<Estacao[] | ApiException> => {
    try{
        const { data } = await Api.get("/estacao")
        return data as Estacao[]
    } catch (error) {
        if (error instanceof Error) {
            return new ApiException(error.message || "Erro ao consultar estações.");
        }
        return new ApiException("Erro desconhecido.");
    }
};

const getEstacaoById = async (estacao_id: number): Promise<Estacao | ApiException> => {
    try{
        const { data } = await Api.get(`/estacao/${estacao_id}`)
        return data as Estacao
    } catch (error) {
        if (error instanceof Error) {
            return new ApiException(error.message || "Erro ao consultar estação.");
        }
        return new ApiException("Erro desconhecido.");
    }
};

const createEstacao = async (estacao: Estacao): Promise<Estacao | ApiException> => {
    try{
        const { data } = await Api.post("/estacao", estacao)
        return data as Estacao
    } catch (error) {
        if (error instanceof Error) {
            return new ApiException(error.message || "Erro ao criar estação");
        }
        return new ApiException("Erro desconhecido.");
    }
};

const updateEstacao = async (estacao_id: number, estacao: Estacao): Promise<Estacao | ApiException> => {
    try{
        const { data } = await Api.put(`/estacao/${estacao_id}`, estacao)
        return data as Estacao
    } catch (error) {
        if (error instanceof Error) {
            return new ApiException(error.message || "Erro ao atualizar estação");
        }
        return new ApiException("Erro desconhecido.");
    }
};

const deleteEstacao = async (estacao_id: number): Promise<any | ApiException> => {
    try{
        const { data } = await Api.delete(`/estacao/${estacao_id}`)
        return data
    } catch (error) {
        if (error instanceof Error) {
            return new ApiException(error.message || "Erro ao deletar estação.");
        }
        return new ApiException("Erro desconhecido.");
    }
};

export const estacaoServices = {
    getAllEstacoes,
    getEstacaoById,
    createEstacao,
    updateEstacao,
    deleteEstacao
};
