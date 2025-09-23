export interface TipoAlerta {
    pk: number,
    tipo: string,
    descricao: string,
    publica: boolean,
    tipo_alarme: number,
    p1: number,
    p2?: number
}