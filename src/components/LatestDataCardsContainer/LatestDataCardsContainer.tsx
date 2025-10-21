import React, { useEffect, useState } from 'react';
import LatestDataCard from '@/components/LatestDataCard/LatestDataCard';
import { capturaValorServices } from '@/services/capturaValorServices';
import { LatestCapturaValor } from '@/interfaces/CapturaValor';
import { ApiException } from '@/config/apiException';
import styles from './LatestDataCardsContainer.module.css';
import { mockLatestCapturaValores } from './mockLatestData'; // Dados mockados para desenvolvimento

// CONFIGURAÇÃO: Altere para 'true' quando o endpoint estiver pronto
const USE_MOCK_DATA = true;

const LatestDataCardsContainer: React.FC = () => {
  const [latestData, setLatestData] = useState<LatestCapturaValor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLatestData = async () => {
      setLoading(true);
      setError(null);

      try {
        if (USE_MOCK_DATA) {
          // MODO DESENVOLVIMENTO: Usando dados mockados
          await new Promise(resolve => setTimeout(resolve, 1000)); // Simula delay da API
          setLatestData(mockLatestCapturaValores);
        } else {
          // MODO PRODUÇÃO: Usando API real
          const result = await capturaValorServices.getLatestCapturaValores();

          if (result instanceof ApiException) {
            setError(result.message);
            setLatestData([]);
          } else if (Array.isArray(result)) {
            setLatestData(result);
          } else {
            console.error('Resposta da API não é um array:', result);
            setError('Formato de dados inválido da API.');
            setLatestData([]);
          }
        }
      } catch (err) {
        console.error('Erro ao carregar dados:', err);
        setError('Erro ao carregar dados mais recentes.');
        setLatestData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestData();
  }, []);

  if (loading) {
    return (
      <div className="w-full py-4">
        <div className="flex gap-4 overflow-x-auto pb-2">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="min-w-[280px] h-32 rounded-lg animate-pulse"
              style={{ backgroundColor: '#E5E5E5' }}
            />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full py-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p className="font-medium">Erro ao carregar dados</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (latestData.length === 0) {
    return (
      <div className="w-full py-4">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          <p className="font-medium">Nenhum dado disponível</p>
          <p className="text-sm">Não há dados de captura recentes para exibir.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full py-4">
      <h2 className="text-xl font-bold mb-4 text-gray-800">
        Últimos Dados Enviados
      </h2>
      
      <div className={`flex gap-4 overflow-x-auto pb-2 ${styles['scrollbar-thin']}`}>
        {Array.isArray(latestData) && latestData.map((data, index) => (
          <LatestDataCard
            key={`${data.tipo_parametro}-${index}`}
            tipo_parametro={data.tipo_parametro}
            ultimo_valor={data.ultimo_valor}
            tendencia={data.tendencia}
          />
        ))}
      </div>
    </div>
  );
};

export default LatestDataCardsContainer;
