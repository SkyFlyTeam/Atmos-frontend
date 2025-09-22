import { Api } from "@/config/api";
import { ApiException } from "@/config/apiException";
import { Estacao } from "@/interfaces/Estacoes";
import { Parametro } from "@/interfaces/Parametros";

const getAllEstacoes = async (): Promise<Estacao[] | ApiException> => {
    try{
        const { data } = await Api.get("/estacao")
        return data as Estacao[]
    } catch (error: any) {
        // Se não há estações cadastradas (404), retorna array vazio - não é um erro
        if (error.response?.status === 404) {
            console.log('Nenhuma estação cadastrada - retornando array vazio');
            return [];
        }
        
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

  const deleteEstacao = async (
    estacao_id: number
  ): Promise<any | ApiException> => {
    try {
      const { data } = await Api.delete(`/estacao/${estacao_id}`);
      return data;
    } catch (error) {
      if (error instanceof Error) {
        return new ApiException(error.message || "Erro ao deletar estação.");
      }
      return new ApiException("Erro desconhecido.");
    }
  };

const getParametrosByEstacao = async (estacaoPk: number): Promise<Parametro[] | ApiException> => {
    try {
        const { data } = await Api.get(`/estacao-tipo-parametro/estacao/${estacaoPk}`);
        // A API retorna um array de objetos com 'tipoParametro' aninhado
        return data.map((item: any) => item.tipoParametro) as Parametro[];
    } catch (error) {
        if (error instanceof Error) {
            // Se não há parâmetros associados, retorna array vazio
            if (error.message.includes('Nenhuma relação encontrada para esta estação')) {
                console.log('Nenhum parâmetro associado à estação - continuando normalmente');
                return [];
            }
            return new ApiException(error.message || "Erro ao buscar parâmetros da estação.");
        }
        return new ApiException("Erro desconhecido.");
    }
};

const addParametroToEstacao = async (estacaoPk: number, tipoParametroPk: number): Promise<void | ApiException> => {
    try {
        await Api.post('/estacao-tipo-parametro', {
            estacao_est_pk: estacaoPk,
            tipo_parametro_pk: tipoParametroPk,
        });
        return;
    } catch (error) {
        if (error instanceof Error) {
            return new ApiException(error.message || "Erro ao adicionar parâmetro à estação.");
        }
        return new ApiException("Erro desconhecido.");
    }
};

const removeParametroFromEstacao = async (estacaoPk: number, tipoParametroPk: number): Promise<void | ApiException> => {
    try {
        await Api.delete(`/estacao-tipo-parametro/estacao/${estacaoPk}/tipo-parametro/${tipoParametroPk}`);
        return;
    } catch (error) {
        if (error instanceof Error) {
            return new ApiException(error.message || "Erro ao remover parâmetro da estação.");
        }
        return new ApiException("Erro desconhecido.");
    }
};

export const estacaoServices = {
    getAllEstacoes,
    getEstacaoById,
    createEstacao,
    updateEstacao,
    deleteEstacao,
    getParametrosByEstacao,
    addParametroToEstacao,
    removeParametroFromEstacao,
};
