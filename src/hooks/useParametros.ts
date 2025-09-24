import { useState, useEffect, useCallback } from 'react';
import { Parametro } from '@/interfaces/Parametros';
import { parametroServices } from '@/services/parametroServices';
import { ApiException } from '@/config/apiException';

export interface UseParametrosReturn {
  parametros: Parametro[];
  loading: boolean;
  error: string | null;
  refreshParametros: () => Promise<void>;
}

export function useParametros(): UseParametrosReturn {
  const [parametros, setParametros] = useState<Parametro[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchParametros = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await parametroServices.getAllParametros();
      
      if (result instanceof ApiException) {
        // Se não há parâmetros cadastrados, não é um erro - apenas não há dados
        if (result.message.includes('Registros não encontrados')) {
          console.log('Nenhum parâmetro cadastrado no sistema');
          setParametros([]);
        } else {
          setError(result.message);
          console.error('Erro ao buscar parâmetros:', result.message);
        }
      } else {
        setParametros(result);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar parâmetros';
      setError(errorMessage);
      console.error('Erro ao buscar parâmetros:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshParametros = useCallback(async () => {
    await fetchParametros();
  }, [fetchParametros]);

  // Carregar parâmetros na inicialização
  useEffect(() => {
    fetchParametros();
  }, [fetchParametros]);

  return {
    parametros,
    loading,
    error,
    refreshParametros,
  };
}