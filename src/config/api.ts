import axios from "axios";

// Retorna uma instância do Axios
export const Api = axios.create({
  baseURL: `http://${process.env.NEXT_PUBLIC_API_HOST}:${process.env.NEXT_PUBLIC_API_PORT}`,
  timeout: 10000, // 10 segundos de timeout
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Interceptor para logs de request
Api.interceptors.request.use(
  (config) => {
    // Anexa token ao header Authorization se existir e não estiver definido
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token && !(config.headers && 'Authorization' in config.headers)) {
        const authHeader = token.startsWith('Bearer ') || token.startsWith('JWT ')
          ? token
          : `Bearer ${token}`;
        config.headers = {
          ...(config.headers || {}),
          Authorization: authHeader,
        };
      }
    }

    console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ API Request Error:', error);
    return Promise.reject(error);
  }
);

// Interceptor para logs de response
Api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
      console.error('🔌 Servidor backend não está rodando ou inacessível');
    } else if (error.code === 'ENOTFOUND') {
      console.error('🌐 Problema de DNS ou URL incorreta');
    } else {
      console.error('❌ API Response Error:', error.message);
    }
    return Promise.reject(error);
  }
);
