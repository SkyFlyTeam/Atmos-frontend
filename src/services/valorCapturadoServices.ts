import { EstacaoParametroRelacao } from "@/interfaces/ParametroEstacao";
import { Api } from "@/config/api";
import { ApiException } from "@/config/apiException";
import { Login } from "@/interfaces/Login";
import { Relatorio } from "@/interfaces/Relatorio";
import { Usuario } from "@/interfaces/Usuarios";
import { AxiosError } from "axios";
import { RelatParam } from "@/interfaces/RelatParam";
import { Estacao } from "@/interfaces/Estacoes";


interface relatData {
    estacao_id: number,
    Parametros_pk: number,
    media: number,
    maximo: number,
    minimo: number,
    mes: number,
    ano: number,
    parametro: EstacaoParametroRelacao,
    estacao: Estacao
}

const getRelatorio = async (param?: RelatParam): Promise<Relatorio | ApiException> => {
    try {
        const { data } = await Api.get("/valor-capturado/relatorio", {
            params: param
        });
        data.forEach((cell: any) => {
            cell.param = (cell as relatData).parametro.tipoParametro.nome;
            cell.unidade = (cell as relatData).parametro.tipoParametro.unidade;
            cell.Parametros_pk = (cell as relatData).parametro.tipoParametro.pk;
            cell.cidadePk = (cell as relatData).estacao.cidadePk;
            delete cell['parametro'];
            delete cell['estacao'];
        });
        return data as Relatorio
    } catch (error) {
        if (error instanceof AxiosError)
            switch (error.status) {
                default:
                    return new ApiException("ERRO: resposta sem tratamento, HTTP " + error.status);
            }

        if (error instanceof Error)
            return new ApiException(error.message || "Erro ao realizar login.");
        return new ApiException("Erro desconhecido.");
    }
};

export const ValorCapturadoServices = {
    getRelatorio
};