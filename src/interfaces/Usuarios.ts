export interface Usuario {
    pk: number,
    nome: string,
    email: string,
    senha?: string
    token?: string
}