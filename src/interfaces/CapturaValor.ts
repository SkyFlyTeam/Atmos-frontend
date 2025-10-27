export interface CapturaValor {
    pk: number;
    tipo_parametro: string;
    valor: number;
    datetime: string;
    estacao_nome?: string;
}

export interface LatestCapturaValor {
    tipo_parametro: string;
    ultimo_valor: number;
    valor_anterior: number;
    datetime: string;
    tendencia: 'up' | 'down' | 'stable';
}
