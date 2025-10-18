import { Api } from "@/config/api";
import { ApiException } from "@/config/apiException";
import { ParametroGrafico } from "@/interfaces/ParametroGrafico";
import { ParametroUltimoValor } from "@/interfaces/ParametroUltimoValor";

const getValoresCapturadosPorParametro = async (cidade: number, estacoes: number[], parametros: number[], dataInicio: Date, dataFim: Date): Promise<ParametroGrafico[] | ApiException> => {
    try {
        const { data } = await Api.post("/dashboard/parametros-graficos", {
                cidade,
                estacoes,
                parametros,
                dataInicio,
                dataFim
        });
        return data as ParametroGrafico[];
    } catch (error: any) {
        if (error.response?.status === 404) return [];
        if (error instanceof Error)
        return new ApiException(error.message || "Erro ao consultar valores de parâmetros.");
        return new ApiException("Erro desconhecido.");
    }
};

const getUltimosValoresCapturadosPorParametro = async({ cidade, estacoes, parametros }: { cidade: number, estacoes: number[], parametros: number[] }): Promise<ParametroUltimoValor[] | ApiException> => {
    try {
        const { data } = await Api.post("/dashboard/parametros-card", {
            cidade,
            estacoes,
            parametros
        });
        return data as ParametroUltimoValor[];
    } catch (error: any) {
        if (error.response?.status === 404) return [];
        if (error instanceof Error)
        return new ApiException(error.message || "Erro ao consultar últimos valores de parâmetros.");
        return new ApiException("Erro desconhecido.");
    }
};

export const dashboardServices = {
    getValoresCapturadosPorParametro,
    getUltimosValoresCapturadosPorParametro
};
