export interface CidadeAPI {
    id: number,
    nome: string,
    microrregiao: {
        id: number,
        nome: string,
        mesorregiao: {
            UF: {
                id: number,
                sigla: string,
                nome: string,
                regiao: {
                    id: number,
                    sigla: string,
                    nome: string
                }
            }
        }
    }
}