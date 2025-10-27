import React, { useEffect, useMemo, useState } from 'react';
import LatestDataCard from '@/components/LatestDataCard/LatestDataCard';
import styles from './LatestDataCardsContainer.module.css';
import { dashboardServices } from '@/services/dashboardServices';
import { estacaoServices } from '@/services/estacaoServices';
import { ParametroUltimoValor } from '@/interfaces/ParametroUltimoValor';
import { Estacao } from '@/interfaces/Estacoes';

type LatestComputed = {
  tipo_parametro: string;
  ultimo_valor: number | string | null;
  tendencia: 'up' | 'down' | 'stable';
};

type Props = {
  // If the page already fetched cards data it can pass it here; otherwise the component will fetch by itself
  cardsData?: ParametroUltimoValor[] | null;
  // station selected in the global filter (pk as string)
  selectedStationPk?: string | null;
  // multiple stations selected in the global filter (array of pks as strings)
  selectedStations?: string[] | null;
  // human readable station name (used to look up datetimes inside chartData)
  selectedStationName?: string | null;
  // optional chart data to compute the "updated at" timestamp for that station
  chartData?: { tipo_parametro: string; estacoes: string[]; dados: Array<{ [key: string]: any }> }[] | null;
  // optional controls to render to the right of the title (e.g. filters)
  rightControls?: React.ReactNode;
};

const LatestDataCardsContainer: React.FC<Props> = ({ cardsData = null, selectedStationPk = null, selectedStations = null, selectedStationName = null, chartData = null, rightControls = null }) => {
  const [selectedStation, setSelectedStation] = useState<string>('');
  const [latestData, setLatestData] = useState<LatestComputed[]>([]);
  const [stations, setStations] = useState<Estacao[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);

  // If parent passed cardsData, use it directly (mapped). Otherwise fetch per station when selected.
  useEffect(() => {
    // If parent passed cardsData, always use it instead of fetching locally.
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

    // load stations for selector (only used if component rendered standalone)
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

  const propsSelectedStationProvided = () => Boolean((selectedStationPk && String(selectedStationPk).length > 0) || (selectedStations && selectedStations.length > 0));

  const derivedSelectedStations = (() => {
    if (selectedStationPk) return [String(selectedStationPk)];
    if (selectedStations && selectedStations.length > 0) return selectedStations.map(String);
    if (selectedStation) return [String(selectedStation)];
    return [] as string[];
  })();

  const formatDateForCard = (d: Date) => {
    const pad = (n: number) => n.toString().padStart(2, '0');
    const day = pad(d.getDate());
    const month = pad(d.getMonth() + 1);
    const year = d.getFullYear();
    const hours = pad(d.getHours());
    const minutes = pad(d.getMinutes());
    return `Atualizado em ${day}/${month}/${year} às ${hours}h${minutes}`;
  }

  // Try to derive an "updatedAt" timestamp from chartData for the selected stations
  useEffect(() => {
    // We'll try to find the most recent timestamp among all chartData entries
    // that match the selected stations. If none found, we will try to extract
    // timestamps from cardsData as a fallback.
    let latest: Date | null = null;

    if (chartData && Array.isArray(chartData) && chartData.length > 0 && derivedSelectedStations.length > 0) {
      const stationNames = derivedSelectedStations.map(s => {
        const foundStation = stations.find(st => String(st.pk) === String(s));
        return foundStation ? foundStation.nome : s;
      });

      const tryParse = (v: any): Date | null => {
        if (v === undefined || v === null) return null;
        // numbers: unix seconds or ms
        if (typeof v === 'number') {
          if (v > 1e9 && v < 1e12) return new Date(v * 1000);
          if (v >= 1e12) return new Date(v);
          return null;
        }
        if (typeof v === 'string') {
          const s = v.trim();
          // ISO-like
          const iso = new Date(s);
          if (!isNaN(iso.getTime())) return iso;

          // Try common DD/MM/YYYY[ HH:mm[:ss]] formats
          const dm = s.match(/^(\d{2})\/(\d{2})\/(\d{4})(?:[ T](\d{2}):(\d{2})(?::(\d{2}))?)?/);
          if (dm) {
            const day = parseInt(dm[1], 10);
            const month = parseInt(dm[2], 10) - 1;
            const year = parseInt(dm[3], 10);
            const hour = dm[4] ? parseInt(dm[4], 10) : 0;
            const minute = dm[5] ? parseInt(dm[5], 10) : 0;
            const second = dm[6] ? parseInt(dm[6], 10) : 0;
            const dt = new Date(year, month, day, hour, minute, second);
            if (!isNaN(dt.getTime())) return dt;
          }

          // Try replacing space with T for variants like '2025-10-24 07:40:00'
          const tReplace = new Date(s.replace(' ', 'T'));
          if (!isNaN(tReplace.getTime())) return tReplace;
        }
        return null;
      };

      for (const entry of chartData) {
        const estacoesArr = entry.estacoes || [];
        const matches = derivedSelectedStations.some(ds => estacoesArr.includes(ds)) || stationNames.some(sn => estacoesArr.includes(sn));
        if (!matches) continue;
        const dados = entry.dados || [];
        if (!Array.isArray(dados) || dados.length === 0) continue;

        // iterate all dados and try to extract any timestamp we can
        for (const d of dados) {
          if (!d) continue;
          // common fields
          const candidates = [(d as any).time, (d as any).datetime, (d as any).date, (d as any).timestamp];
          for (const c of candidates) {
            const dt = tryParse(c);
            if (dt && (!latest || dt.getTime() > latest.getTime())) latest = dt;
          }

          // check nested objects and keys
          if (typeof d === 'object') {
            const keys = Object.keys(d);
            for (const k of keys) {
              const maybeKeyDate = tryParse(k);
              if (maybeKeyDate && (!latest || maybeKeyDate.getTime() > latest.getTime())) latest = maybeKeyDate;
              const v = (d as any)[k];
              const dt2 = tryParse(v);
              if (dt2 && (!latest || dt2.getTime() > latest.getTime())) latest = dt2;
            }
          }
        }
      }

      // If nothing matched for the selected stations, as a fallback scan all chartData
      if (!latest) {
        for (const entry of chartData) {
          const dados = entry.dados || [];
          if (!Array.isArray(dados) || dados.length === 0) continue;
          for (const d of dados) {
            if (!d) continue;
            const candidates = [(d as any).time, (d as any).datetime, (d as any).date, (d as any).timestamp];
            for (const c of candidates) {
              const dt = tryParse(c);
              if (dt && (!latest || dt.getTime() > latest.getTime())) latest = dt;
            }
            if (typeof d === 'object') {
              for (const k of Object.keys(d)) {
                const maybeKeyDate = tryParse(k);
                if (maybeKeyDate && (!latest || maybeKeyDate.getTime() > latest.getTime())) latest = maybeKeyDate;
                const v = (d as any)[k];
                const dt2 = tryParse(v);
                if (dt2 && (!latest || dt2.getTime() > latest.getTime())) latest = dt2;
              }
            }
          }
        }
      }
    }

    if (latest) setUpdatedAt(formatDateForCard(latest));
    else setUpdatedAt(null);
  }, [chartData, derivedSelectedStations, selectedStationName, stations]);

  useEffect(() => {
    // If parent provided data we already set it; if not, fetch when station selected
    if (cardsData && cardsData.length > 0) return;
    if (derivedSelectedStations.length === 0) {
      setLatestData([]);
      return;
    }

    setIsLoading(true);
    let mounted = true;
    (async () => {
      try {
        const estPkArray = derivedSelectedStations.map(s => parseInt(String(s), 10)).filter(n => !isNaN(n));
        const res = await dashboardServices.getUltimosValoresCapturadosPorParametro({
          cidade: 1,
          estacoes: estPkArray,
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
  }, [derivedSelectedStations, cardsData]);

  return (
    <div className="w-full py-4">
      {/* If parent did not provide cards data, render station selector */}
      {!cardsData && !propsSelectedStationProvided() && (
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

      {/* Title and updatedAt only when a station is selected (either via parent prop or local selector) */}
      {/* Header: sempre mostrar título e controles à direita */}
      <div className="mb-3 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <div>
          <h2 className="font-londrina text-2xl md:text-[35px] leading-tight text-[#00312D]">Últimos dados</h2>
          {/* Mostrar updatedAt sempre que disponível (data/hora do último dado recebido) */}
          {updatedAt && <p className="text-sm text-gray-500 mt-1">{updatedAt}</p>}
          {/* Quando não há estação selecionada, mostramos uma breve orientação abaixo do título (em telas pequenas ficará abaixo) */}
          {derivedSelectedStations.length === 0 && (
            <p className="text-sm text-gray-600 mt-1 md:mt-0">Selecione uma estação nos filtros para ver os últimos dados.</p>
          )}
        </div>

        {/* right side controls (filters) - sempre renderiza se fornecido */}
        {rightControls && (
          <div className="ml-0 md:ml-4">
            {rightControls}
          </div>
        )}
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
