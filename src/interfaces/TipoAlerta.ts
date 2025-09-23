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
<<<<<<< HEAD
    publica: boolean,
    tipo_alarme: number,
    p1: number,
    p2?: number
=======
    criterios: criteriosEnum,
    valor_referencia: number,
    segunda_referencia?: number | null,
    publica?: boolean,
    tipo_alarme?: number,
    p1?: number,
    p2?: number | null
>>>>>>> cd44923 (AT-25 feat: adicionar cadastro e edição de tipo-alerta)
}