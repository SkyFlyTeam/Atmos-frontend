const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export interface ApiEstacao {
  pk: number;
  uuid: string;
  nome: string;
  descricao: string;
  status: boolean;
  lat: string | null;
  long: string | null;
  endereco: string | null;
  tipoParametros?: ApiTipoParametro[];
}

export interface ApiTipoParametro {
  pk: number;
  nome: string;
  unidade: string;
  descricao: string | null;
}

export interface CreateEstacaoData {
  uuid: string;
  nome: string;
  descricao: string;
  status: boolean;
  lat?: string | null;
  long?: string | null;
  endereco?: string | null;
}

export interface UpdateEstacaoData extends Partial<CreateEstacaoData> {}

class ApiService {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      // Para DELETE que retorna 204, não tentamos fazer parse do JSON
      if (response.status === 204) {
        return {} as T;
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Estações
  async getEstacoes(): Promise<ApiEstacao[]> {
    return this.request<ApiEstacao[]>('/estacao');
  }

  async getEstacaoById(pk: number): Promise<ApiEstacao> {
    return this.request<ApiEstacao>(`/estacao/${pk}`);
  }

  async createEstacao(data: CreateEstacaoData): Promise<ApiEstacao> {
    return this.request<ApiEstacao>('/estacao', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateEstacao(pk: number, data: UpdateEstacaoData): Promise<ApiEstacao> {
    return this.request<ApiEstacao>(`/estacao/${pk}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteEstacao(pk: number): Promise<void> {
    return this.request<void>(`/estacao/${pk}`, {
      method: 'DELETE',
    });
  }

  // Tipos de Parâmetros
  async getTipoParametros(): Promise<ApiTipoParametro[]> {
    try {
      return await this.request<ApiTipoParametro[]>('/tipo-parametro');
    } catch (error) {
      // Se não há parâmetros cadastrados, retorna array vazio
      if (error instanceof Error && error.message.includes('Registros não encontrados')) {
        return [];
      }
      throw error;
    }
  }

  // Estação-TipoParametro (relacionamentos)
  async getEstacaoParametros(estacaoPk: number): Promise<ApiTipoParametro[]> {
    const response = await this.request<any[]>(`/estacao-tipo-parametro/estacao/${estacaoPk}`);
    return response.map(item => item.tipoParametro);
  }

  async addParametroToEstacao(estacaoPk: number, tipoParametroPk: number): Promise<void> {
    return this.request<void>('/estacao-tipo-parametro', {
      method: 'POST',
      body: JSON.stringify({
        estacao_est_pk: estacaoPk,
        tipo_parametro_pk: tipoParametroPk,
      }),
    });
  }

  async removeParametroFromEstacao(estacaoPk: number, tipoParametroPk: number): Promise<void> {
    return this.request<void>(`/estacao-tipo-parametro/estacao/${estacaoPk}/tipo-parametro/${tipoParametroPk}`, {
      method: 'DELETE',
    });
  }
}

export const apiService = new ApiService(API_BASE_URL);
