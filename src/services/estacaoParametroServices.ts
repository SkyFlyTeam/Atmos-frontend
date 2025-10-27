import { Api } from "@/config/api";
import { ApiException } from "@/config/apiException";
import { Cidade } from "@/interfaces/Cidade";
import { EstacaoParametro } from "@/interfaces/EstacaoParametro";
import { Estacao } from "@/interfaces/Estacoes";
import { Parametro } from "@/interfaces/Parametros";

const getAllEstacoesParametrosByCidade = async (cidadeId: number): Promise<{ tipoParametros: Parametro[]; estacoes: Estacao[] } | ApiException> => {
    try {
        const { data } = await Api.get(`estacao-tipo-parametro/cidade/${cidadeId}`);

        // Retorna a lista de estações e parâmetros
        const tipoParametros: Parametro[] = [];
        const estacoes: Estacao[] = [];
        for (const estacaoParametro of data as EstacaoParametro[]) {
            if (!estacoes.find(e => e.pk === estacaoParametro.estacao_est_pk)) {
                estacoes.push(estacaoParametro.estacao);
            } 
            if (!tipoParametros.find(p => p.pk === estacaoParametro.tipo_parametro_pk)) {
                tipoParametros.push(estacaoParametro.tipoParametro);
            }
        }
        return { tipoParametros, estacoes };
    } catch (error: any) {
        if (error.response?.status === 404) return { tipoParametros: [], estacoes: [] };
        if (error instanceof Error)
        return new ApiException(error.message || "Erro ao consultar estações e parâmetros.");
        return new ApiException("Erro desconhecido.");
    }
};

export const estacaoParametroServices = {
    getAllEstacoesParametrosByCidade
};