import type { Parametro } from "@/interfaces/Parametros";

export interface EstacaoTipoParametroRel {
  pk: number;
  estacao_est_pk: number;
  tipo_parametro_pk: number;
  tipoParametro?: Parametro;
}

