import { Estacao } from "./Estacoes";
import { Parametro } from "./Parametros";

export interface EstacaoParametro {
    pk: number;
    estacao_est_pk: number;
    tipo_parametro_pk: number;
    estacao: Estacao;
    tipoParametro: Parametro;
  }
