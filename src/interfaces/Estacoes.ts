export interface Estacao {
    pk?: number,
    uuid: string,
    nome: string,
    descricao: string,
    status: boolean,
    lat?: string | null,
    long?: string | null,
    endereco?: string | null,
    parametros?: string[],
    imagemBase64?: string | null
    cidadePk?: number | null;       // foreign key
    cidadeIbgeId?: number | null;   // vindo do dropdown IBGE
    cidadeNome?: string | null;     // para exibir
    cidadeUf?: string | null;       // para exibir
}
