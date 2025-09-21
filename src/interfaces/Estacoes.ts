export interface Estacao {
    pk: number,
    uuid: string,
    nome: string,
    descricao: string,
    status: boolean,
    lat?: string | null,
    long?: string | null,
    endereco?: string | null,
    parametros?: string[]
}
