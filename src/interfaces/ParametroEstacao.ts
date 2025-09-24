import { Parametro } from "./Parametros";

export interface EstacaoParametroRelacao {
  tipoParametro: Parametro;
  estacao_est_pk: number;
  tipo_parametro_pk: number;
}