import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"
import { useEffect, useMemo, useRef, useState } from "react"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

import CardChart from "../../../components/CardChart/CardChart"

// Formata os nomes das estações para usar como chave e nome de variável CSS. Exemplo: "Estação Boreal" → "estacao-boreal"
const slugify = (str: string) =>
  str
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")

// Gera uma cor HSL automaticamente (quantas cores forem necessárias)
const colorForIndex = (i: number, s = 65, l = 50) => {
  const hue = Math.round((360 / 12) * i * 1.3) % 360
  return `hsl(${hue} ${s}% ${l}%)`
}

// --- Hook interno ---
function useElementSize<T extends HTMLElement>(
  ref: React.RefObject<T | null>,
  defaultSize = { width: 0, height: 0 }
) {
  const [size, setSize] = useState(defaultSize)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const updateSize = () => {
      setSize({
        width: el.offsetWidth,
        height: el.offsetHeight,
      })
    }

    updateSize() // inicial

    const observer = new ResizeObserver(() => updateSize())
    observer.observe(el)

    return () => observer.disconnect()
  }, [ref])

  return size
}

type StationName = string

export type TimePoint = {
  time: string
  // cada estação vira uma key com valor numérico ou null
  [station: StationName]: number | string | null
}

type Props = {
  title: string
  xLabel?: string
  yLabel?: string
  stations: StationName[]
  data: TimePoint[]
}

// Função para mapear o horário para a data, considerando todos os pontos
function buildTimeToDateMap(data: TimePoint[]): Map<string, string> {
  const map = new Map<string, string>()
  data.forEach((point) => {
    if (point.time && (point as any).date) {
      map.set(String(point.time), String((point as any).date))
    } else if (point.time) {
      // Se não houver campo date, tenta extrair da string time
      const match = String(point.time).match(/(\d{4}-\d{2}-\d{2})/)
      if (match) {
        const [year, month, day] = match[1].split('-')
        map.set(String(point.time), `${day}/${month}/${year}`)
      }
    }
  })
  return map
}

// Componente customizado para o tick do eixo X (horário + data)
const createCustomXAxisTick = (timeToDateMap: Map<string, string>) => {
  return (props: any) => {
    const { x, y, payload } = props

    const timeValue = payload?.value || ''
    const date = timeToDateMap.get(timeValue) || ''
    
    // Extrai a hora do formato "2025-10-15 13:00" -> "13h"
    let hourLabel = ''
    if (timeValue.includes(' ')) {
      const timePart = timeValue.split(' ')[1]
      const hour = timePart.split(':')[0]
      hourLabel = `${hour}h`
    } else {
      hourLabel = timeValue
    }

    return (
      <g transform={`translate(${x},${y})`}>
        {/* Horário */}
        <text
          x={0}
          y={0}
          dy={8}
          textAnchor="middle"
          fill="hsl(var(--foreground))"
          fontSize="12"
          fontWeight="500"
        >
          {hourLabel}
        </text>

        {/* Data */}
        <text
          x={0}
          y={0}
          dy={24}
          textAnchor="middle"
          fill="hsl(var(--muted-foreground))"
          fontSize="10"
        >
          {date}
        </text>
      </g>
    )
  }
}


// Função para gerar uma lista completa de horas cheias entre o menor e maior horário
function getFullHourTicks(times: string[]): string[] {
  if (times.length === 0) return [];
  const datetimes = times.map(t => new Date(t.replace(' ', 'T')));
  const min = new Date(Math.min(...datetimes.map(d => d.getTime())));
  const max = new Date(Math.max(...datetimes.map(d => d.getTime())));
  min.setMinutes(0, 0, 0);
  max.setMinutes(0, 0, 0);
  const ticks: string[] = [];
  for (let d = new Date(min); d <= max; d.setHours(d.getHours() + 1)) {
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const hh = String(d.getHours()).padStart(2, '0');
    ticks.push(`${yyyy}-${mm}-${dd} ${hh}:00`);
  }
  return ticks;
}

// Função para consolidar e preencher os dados para todas as estações e horários
function fillDataForStations(data: any[], stations: StationName[]): TimePoint[] {
  // Primeiro, consolida todos os dados por horário
  const consolidatedMap = new Map<string, TimePoint>();
  data.forEach(item => {
    const time = item.datetime || item.time;
    if (!time) return;
    if (!consolidatedMap.has(time)) {
      consolidatedMap.set(time, { time });
    }
    const entry = consolidatedMap.get(time)!;
    stations.forEach(station => {
      if (item[station] !== undefined) {
        entry[station] = item[station];
      }
    });
  });
  // Gera todos os ticks de horas cheias e adiciona ao mapa se não existirem
  const allTimes = Array.from(consolidatedMap.keys());
  if (allTimes.length > 0) {
    const hourTicks = getFullHourTicks(allTimes);
    hourTicks.forEach(tick => {
      if (!consolidatedMap.has(tick)) {
        const entry: TimePoint = { time: tick };
        stations.forEach(station => {
          entry[station] = null;
        });
        consolidatedMap.set(tick, entry);
      }
    });
  }
  // Converte o mapa para array e ordena
  const result = Array.from(consolidatedMap.values()).sort((a, b) => a.time.localeCompare(b.time));
  // Adiciona a data formatada a cada entrada
  result.forEach(entry => {
    entry.date = entry.time.split(' ')[0].split('-').reverse().join('/');
    stations.forEach(station => {
      if (entry[station] === undefined) {
        entry[station] = null;
      }
    });
  });
  return result;
}

export default function ChartLineDots({ title, xLabel = "Horário", yLabel, stations, data }: Props) {
  // Preenche os dados para todas as estações e horários
  const processedData = useMemo(() => fillDataForStations(data, stations), [data, stations]);
  // Gera os ticks de hora cheia para o eixo X
  const hourTicks = useMemo(() => {
    // Sempre gera ticks entre 13h e 17h para os dados mockados
    if (processedData.length > 0) {
      const times = processedData.map(d => d.time);
      return getFullHourTicks(times);
    }
    return [];
  }, [processedData]);
  // Cria um mapa de hora -> data para usar no CustomXAxisTick
  const timeToDateMap = useMemo(() => {
    const map = new Map<string, string>();
    processedData.forEach((point) => {
      if (point.time && point.date) {
        map.set(String(point.time), String(point.date));
      }
    });
    // Adiciona também as entradas para as horas cheias (ticks)
    hourTicks.forEach(tick => {
      if (!map.has(tick)) {
        const date = tick.split(' ')[0].split('-').reverse().join('/');
        map.set(tick, date);
      }
    });
    return map;
  }, [processedData, hourTicks])

  // Monta config dinamicamente para o ChartContainer (cores + labels por estação)
  const chartConfig: ChartConfig = stations.reduce((acc, station, idx) => {
    const key = slugify(station)
    acc[key] = {
      label: station,
      color: colorForIndex(idx),
    }
    return acc
  }, {} as ChartConfig)

  const chartWrapperRef = useRef<HTMLDivElement | null>(null) // referencia a <div> que contém o gráfico
  const legendRef = useRef<HTMLDivElement | null>(null) // referencia a legenda
  const { width } = useElementSize(chartWrapperRef)

  // Altura proporcional 16:9
  const aspect = 16 / 9
  const reservedPx = 28
  const chartHeight = width
    ? Math.max(120, Math.round(width / aspect) - reservedPx)
    : undefined

  // ChartContainer com largura fixa para scroll horizontal e espaçamento igual entre horas
  const tickWidth = 120; // px por hora
  const chartWidth = hourTicks.length * tickWidth;

  return (
    <CardChart
      title={title}
      chart={
        <>
          {/* Legenda (fora do ChartContainer para não impactar a altura do SVG) */}
          <div ref={legendRef} className="flex flex-wrap items-center gap-4 px-2 pb-2">
            {stations.map((station) => {
              const key = slugify(station)
              const itemConfig = chartConfig[key as keyof typeof chartConfig]
              const bulletColor =
                (itemConfig && (itemConfig as any).color) || `var(--color-${key})`
              return (
                <div key={key} className="flex items-center gap-2">
                  <span
                    className="inline-block h-3 w-3 rounded-full border"
                    style={{ backgroundColor: bulletColor, borderColor: bulletColor }}
                    aria-hidden
                  />
                  <span className="text-sm">{station}</span>
                </div>
              )
            })}
          </div>

          {/* ChartContainer com largura fixa e scroll horizontal */}
          <div ref={chartWrapperRef} className="w-full overflow-x-auto">
            <div style={{ minWidth: chartWidth }}>
              <ChartContainer
                config={chartConfig}
                className="w-full"
                style={{ height: chartHeight, minWidth: chartWidth }}
              >
                <LineChart
                  accessibilityLayer
                  data={processedData}
                  margin={{ left: 12, right: 40, top: 10, bottom: 35 }}
                  width={chartWidth}
                  height={chartHeight}
                >
                  <CartesianGrid vertical={true} />
                  <XAxis
                    dataKey="time"
                    tickLine={false}
                    axisLine={true}
                    tickMargin={12}
                    tick={createCustomXAxisTick(timeToDateMap)}
                    height={60}
                    ticks={hourTicks}
                    type="category"
                    allowDuplicatedCategory={false}
                    interval={0}
                    // Força espaçamento igual entre ticks
                    minTickGap={0}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    width={48}
                    label={{
                      value: yLabel ?? title,
                      angle: -90,
                      position: "insideLeft",
                      style: { textAnchor: "middle" },
                    }}
                  />

                  <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />

                  {stations.map((station) => {
                    const key = slugify(station)
                    const stroke = `var(--color-${key})`
                    return (
                      <Line
                        key={key}
                        type="monotone"
                        dataKey={station}
                        name={station}
                        stroke={stroke}
                        strokeWidth={2}
                        dot={{ r: 3, strokeWidth: 0, fill: stroke }}
                        activeDot={{ r: 5 }}
                        connectNulls={true}
                      />
                    )
                  })}
                </LineChart>
              </ChartContainer>
            </div>
            <div className="w-full text-center text-sm text-muted-foreground -mt-5">
              {xLabel}
            </div>
          </div>
        </>
      }
    />
  )
}
