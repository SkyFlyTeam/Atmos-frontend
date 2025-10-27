import { Api } from "@/config/api";
import { ApiException } from "@/config/apiException";
import { CapturaValor, LatestCapturaValor } from "@/interfaces/CapturaValor";

/**
 * Busca todos os dados de captura_valor
 */
const getAllCapturaValores = async (): Promise<CapturaValor[] | ApiException> => {
    try {
        const { data } = await Api.get("/captura-valor");
        return data as CapturaValor[];
    } catch (error) {
        if (error instanceof Error) {
            return new ApiException(error.message || "Erro ao consultar captura de valores.");
        }
        return new ApiException("Erro desconhecido.");
    }
};

/**
 * Busca os últimos dados enviados por tipo_parametro
 * Retorna o valor mais recente e compara com o valor anterior para determinar tendência
 */
const getLatestCapturaValores = async (): Promise<LatestCapturaValor[] | ApiException> => {
    try {
        const { data } = await Api.get("/captura-valor/latest");
        return data as LatestCapturaValor[];
    } catch (error) {
        if (error instanceof Error) {
            return new ApiException(error.message || "Erro ao consultar últimos valores.");
        }
        return new ApiException("Erro desconhecido.");
    }
};

/**
 * Busca dados de captura_valor por tipo_parametro
 */
const getCapturaValoresByTipoParametro = async (tipo_parametro: string): Promise<CapturaValor[] | ApiException> => {
    try {
        const { data } = await Api.get(`/captura-valor/tipo-parametro/${tipo_parametro}`);
        return data as CapturaValor[];
    } catch (error) {
        if (error instanceof Error) {
            return new ApiException(error.message || "Erro ao consultar valores por tipo de parâmetro.");
        }
        return new ApiException("Erro desconhecido.");
    }
};

export const capturaValorServices = {
    getAllCapturaValores,
    getLatestCapturaValores,
    getCapturaValoresByTipoParametro,
};
