export interface Parametro {
    pk: number,
    json_id: string,
    nome: string,
    tipo: string,
    offset: number,
    fator: number,
    poliminio?: string, 
    unidade: string,
    alarme?: number
}