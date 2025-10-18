export interface ParametroGrafico {
    tipo_parametro: string;
    estacoes: string[];
    dados: Array<{ [key: string]: number | string }>;
}