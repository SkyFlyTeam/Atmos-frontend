import React, { useEffect, useMemo, useState } from 'react';
import LatestDataCard from '@/components/LatestDataCard/LatestDataCard';
import styles from './LatestDataCardsContainer.module.css';
import { dashboardServices } from '@/services/dashboardServices';
import { estacaoServices } from '@/services/estacaoServices';
import { ParametroUltimoValor } from '@/interfaces/ParametroUltimoValor';
import { Estacao } from '@/interfaces/Estacoes';

type LatestComputed = {
  tipo_parametro: string;
  ultimo_valor: number;
  tendencia: 'up' | 'down' | 'stable';
};

type Props = {
  // If the page already fetched cards data it can pass it here; otherwise the component will fetch by itself
  cardsData?: ParametroUltimoValor[] | null;
};

const LatestDataCardsContainer: React.FC<Props> = ({ cardsData = null }) => {
  const [selectedStation, setSelectedStation] = useState<string>('');
  const [latestData, setLatestData] = useState<LatestComputed[]>([]);
  const [stations, setStations] = useState<Estacao[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // If parent passed cardsData, use it directly (mapped). Otherwise fetch per station when selected.
  useEffect(() => {
    if (cardsData && cardsData.length > 0) {
      const mapped = (cardsData as ParametroUltimoValor[]).map((c) => {
        const raw = (c as any).valor_atual;
        const n = typeof raw === 'number' ? raw : (raw ? Number(raw) : NaN);
        return ({
          tipo_parametro: c.tipo_parametro,
          ultimo_valor: (!isNaN(n) ? n : (raw ?? null)) as number | string | null,
          tendencia: c.aumento === undefined || c.aumento === null ? 'stable' : (c.aumento ? 'up' : 'down'),
        } as LatestComputed)
      });
      mapped.sort((a, b) => a.tipo_parametro.localeCompare(b.tipo_parametro));
      setLatestData(mapped);
      return;
    }

    // load stations for selector
    let mounted = true;
    (async () => {
      try {
        const res = await estacaoServices.getAllEstacoes();
        if (mounted && Array.isArray(res)) {
          setStations(res as Estacao[]);
        }
      } catch (err) {
        // ignore: estacoes list is optional
      }
    })();

    return () => { mounted = false };
  }, [cardsData]);

  useEffect(() => {
    // If parent provided data we already set it; if not, fetch when station selected
    if (cardsData && cardsData.length > 0) return;
    if (!selectedStation) {
      setLatestData([]);
      return;
    }

    setIsLoading(true);
    let mounted = true;
    (async () => {
      try {
        const estPk = parseInt(selectedStation, 10);
        const res = await dashboardServices.getUltimosValoresCapturadosPorParametro({
          cidade: 1,
          estacoes: isNaN(estPk) ? [] : [estPk],
          parametros: [],
        });
        if (!mounted) return;
        if (Array.isArray(res)) {
          const mapped = res.map((c: ParametroUltimoValor) => {
            const raw = (c as any).valor_atual;
            const n = typeof raw === 'number' ? raw : (raw ? Number(raw) : NaN);
            return ({
              tipo_parametro: c.tipo_parametro,
              ultimo_valor: (!isNaN(n) ? n : (raw ?? null)) as number | string | null,
              tendencia: (c as any).aumento === undefined || (c as any).aumento === null ? 'stable' : ((c as any).aumento ? 'up' : 'down'),
            } as LatestComputed)
          });
          mapped.sort((a, b) => a.tipo_parametro.localeCompare(b.tipo_parametro));
          setLatestData(mapped);
        } else {
          setLatestData([]);
        }
      } catch (error) {
        setLatestData([]);
      } finally {
        if (mounted) setIsLoading(false);
      }
    })();

    return () => { mounted = false };
  }, [selectedStation, cardsData]);

  return (
    <div className="w-full py-4">
      {/* If parent did not provide cards data, render station selector */}
      {!cardsData && (
        <div className="flex items-center gap-2 mb-3">
          <label htmlFor="station" className="text-sm text-[#00312D]">Estação:</label>
          <select
            id="station"
            value={selectedStation}
            onChange={(e) => setSelectedStation(e.target.value)}
            className="border rounded-md px-3 py-2 text-sm"
          >
            <option value="">Selecione uma estação</option>
            {stations.map(s => (
              <option key={s.pk} value={String(s.pk)}>{s.nome}</option>
            ))}
          </select>
        </div>
      )}

      <div className="mb-3">
        <h2 className="font-londrina text-2xl md:text-[35px] leading-tight text-[#00312D]">Últimos dados</h2>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-6">
          <p className="text-sm text-gray-600">Carregando...</p>
        </div>
      ) : latestData.length === 0 ? (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          Nenhum dado disponível.
        </div>
      ) : (
        <div className={`flex gap-4 overflow-x-auto pb-2 ${styles['scrollbar-thin']}`}>
          {latestData.map((data, index) => (
            <LatestDataCard
              key={`${data.tipo_parametro}-${index}`}
              tipo_parametro={data.tipo_parametro}
              ultimo_valor={data.ultimo_valor}
              tendencia={data.tendencia}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default LatestDataCardsContainer;
