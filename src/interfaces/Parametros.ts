export interface Parametro {
    pk: number,
    json_id: string,
    nome: string,
    tipo: string,
    offset: number,
    fator: number,
    polinomio?: string, 
    unidade: string,
    alarme?: number
}