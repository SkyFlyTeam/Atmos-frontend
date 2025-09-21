export interface Estacao {
  pk: number;
  uuid: string;
  nome: string;
  endereco: string | null;
  descricao: string;
  status: boolean;
  lat: string | null;
  long: string | null;
  parametros?: string[];
  imagem?: string;
  isNova?: boolean;
}

export interface Paginacao {
  paginaAtual: number;
  totalPaginas: number;
  totalItens: number;
}

// Tipos extras usados no formulário/gerenciamento da estação


export interface EstacaoFormData {
  uuid: string;
  nome: string;
  descricao: string;
  status: boolean;
  lat?: string | null;
  long?: string | null;
  endereco?: string | null;
  imagemUrl?: string | null;
  parametros: string[];
}
