import React, { useEffect, useMemo, useState } from 'react';
import LatestDataCard from '@/components/LatestDataCard/LatestDataCard';
import styles from './LatestDataCardsContainer.module.css';
import mockParametros from '@/pages/dashboard/dadosMockados';
import { format, parse } from 'date-fns';

type LatestComputed = {
  tipo_parametro: string;
  ultimo_valor: number;
  tendencia: 'up' | 'down' | 'stable';
  datetime: string; // ISO-like in mock format
};

const LatestDataCardsContainer: React.FC = () => {
  const [selectedStation, setSelectedStation] = useState<string>('');
  const [latestData, setLatestData] = useState<LatestComputed[]>([]);

  // Lista única de estações a partir dos dados mockados
  const stations = useMemo(() => {
    const set = new Set<string>();
    (mockParametros as any[]).forEach((p: any) => {
      (p.estacoes || []).forEach((s: string) => set.add(s));
    });
    return Array.from(set).sort();
  }, []);

  // Os dados mockados estão no formato 'yyyy-MM-dd HH:mm'
  const parseDt = (s: string) => parse(s, 'yyyy-MM-dd HH:mm', new Date());

  useEffect(() => {
    if (!selectedStation) {
      setLatestData([]);
      return;
    }

    // Para cada tipo_parametro, encontrar o último dado (por datetime) da estação selecionada
    const computed: LatestComputed[] = (mockParametros as any[]).map((p: any) => {
      const serie = (p.dados || []).filter((d: any) => typeof d[selectedStation] === 'number');
      if (serie.length === 0) return null;

      // Ordena por datetime asc e pega o último
      const ordered = [...serie].sort((a, b) => +parseDt(a.datetime) - +parseDt(b.datetime));
      const last = ordered[ordered.length - 1];
      const lastVal: number = last[selectedStation];

      // Encontra o último valor diferente (variação)
      let tendencia: 'up' | 'down' | 'stable' = 'stable';
      for (let i = ordered.length - 2; i >= 0; i--) {
        const prevVal = ordered[i][selectedStation];
        if (prevVal !== lastVal) {
          tendencia = lastVal > prevVal ? 'up' : 'down';
          break;
        }
      }

      return {
        tipo_parametro: p.tipo_parametro as string,
        ultimo_valor: lastVal,
        tendencia,
        datetime: last.datetime as string,
      } satisfies LatestComputed;
    }).filter(Boolean) as LatestComputed[];

    // Ordena por nome de parâmetro para consistência
    computed.sort((a, b) => a.tipo_parametro.localeCompare(b.tipo_parametro));
    setLatestData(computed);
  }, [selectedStation]);

  // Calcula o timestamp "Atualizado em" como o mais recente entre os exibidos
  const updatedAt: Date | null = latestData.length
    ? latestData.map(d => parseDt(d.datetime)).reduce((max, dt) => (dt > max ? dt : max))
    : null;

  return (
    <div className="w-full py-4">
      {/* Filtro de estação (sempre visível) */}
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
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {/* Título, atualizado em e cards só aparecem após escolher a estação */}
      {selectedStation && (
        <>
          <div className="mb-3">
            <h2 className="font-londrina text-[40px] leading-tight text-[#00312D]">Últimos dados</h2>
            {updatedAt && (
              <p className="text-sm mt-1" style={{ color: '#ADADAD' }}>
                {`Atualizado em ${format(updatedAt, "dd/MM/yyyy 'às' HH'h'mm")}`}
              </p>
            )}
          </div>

          {latestData.length === 0 ? (
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
              Nenhum dado disponível para a estação selecionada.
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
        </>
      )}
    </div>
  );
};

export default LatestDataCardsContainer;
