import { Api } from "@/config/api";
import { Usuario } from "@/interfaces/Usuarios";

// Função para testar conectividade da API
export const testApiConnection = async () => {
    try {
        // Testa o endpoint correto baseado no Swagger
        await Api.get('/usuario', { timeout: 3000 });
        return { connected: true, message: 'API conectada' };
    } catch (error: unknown) {
        console.error('Teste de conectividade falhou:', error);
        
        const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
        const errorCode = (error as { code?: string })?.code;
        
        if (errorCode === 'ECONNREFUSED' || errorMessage?.includes('Network Error')) {
            return { 
                connected: false, 
                message: 'Backend não encontrado em http://localhost:5000. Verifique se o servidor backend está rodando.' 
            };
        } else if (errorCode === 'ENOTFOUND') {
            return { 
                connected: false, 
                message: 'Problema de conexão de rede ou URL incorreta' 
            };
        } else if (errorCode === 'ECONNABORTED') {
            return { 
                connected: false, 
                message: 'Timeout na conexão. Servidor pode estar sobrecarregado' 
            };
        } else {
            return { 
                connected: false, 
                message: `Erro de conectividade: ${errorMessage}` 
            };
        }
    }
};

const getAllUsuarios = async () => {
    try {
        // Usa o endpoint correto baseado no Swagger
        const response = await Api.get('/usuario');
        
        console.log('Response data:', response.data); // Debug log
        
        // Se a resposta for um array, retorna diretamente
        if (Array.isArray(response.data)) {
            return response.data;
        }
        
        // Se a resposta tiver uma propriedade que contém o array (ex: data.usuarios)
        if (response.data && Array.isArray(response.data.usuarios)) {
            return response.data.usuarios;
        }
        
        // Se a resposta tiver outras estruturas comuns
        if (response.data && Array.isArray(response.data.data)) {
            return response.data.data;
        }
        
        // Se for um objeto único, coloca em array
        if (response.data && typeof response.data === 'object') {
            return [response.data];
        }
        
        // Se nenhuma estrutura conhecida, log de erro e retorna array vazio
        console.error('Formato de resposta inesperado:', response.data);
        return [];
    } catch (error) {
        console.error('Erro ao buscar usuários:', error);
        throw error;
    }
};

const getUsuarioById = async (pk: number) => {
    try {
        const response = await Api.get(`/usuario/${pk}`);
        return response.data;
    } catch (error) {
        console.error(`Erro ao buscar usuário ${pk}:`, error);
        throw error;
    }
};

const createUsuario = async (usuario: Omit<Usuario, 'pk'>) => {
    try {
        const response = await Api.post('/usuario', usuario);
        return response.data;
    } catch (error) {
        console.error('Erro ao criar usuário:', error);
        throw error;
    }
};

const updateUsuario = async (usuario: Usuario) => {
    try {
        const response = await Api.put(`/usuario/${usuario.pk}`, usuario);
        return response.data;
    } catch (error) {
        console.error(`Erro ao atualizar usuário ${usuario.pk}:`, error);
        throw error;
    }
};

const deleteUsuario = async (pk: number) => {
    try {
        const response = await Api.delete(`/usuario/${pk}`);
        return response.data;
    } catch (error) {
        console.error(`Erro ao deletar usuário ${pk}:`, error);
        throw error;
    }
};

export const usuarioServices = {
    getAllUsuarios,
    getUsuarioById,
    createUsuario,
    updateUsuario,
    deleteUsuario
};