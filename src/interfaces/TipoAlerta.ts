export enum criteriosEnum {
    "Menor que" = 0,
    "Intervalo entre" = 1,
    "Maior que" = 2,
    "Diferente de" = 3,
    "Igual a" = 4
}

export interface TipoAlerta {
    pk?: number,
    tipo: string,
    descricao: string,
    publica: boolean,
    tipo_alarme: number,
    p1: number,
    p2?: number | null
}