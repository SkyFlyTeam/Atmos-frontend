export interface CidadeAPI {
    id: number;
    nome: string;
    microrregiao: {
        id: number;
        nome: string;
        mesorregiao: {
            id: number;
            nome: string;
            UF: {
                id: number;
                sigla: string;
                nome: string;
                regiao: { id: number; sigla: string; nome: string };
            };
        };
    };
}

export interface Cidade {
    nome: string
}

