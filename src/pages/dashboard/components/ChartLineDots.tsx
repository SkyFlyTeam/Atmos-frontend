import { CartesianGrid, Line, LineChart, XAxis, YAxis, ReferenceArea } from "recharts"
import { useEffect, useMemo, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { ZoomIn, ZoomOut, RotateCcw } from "lucide-react"
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
        // Converte string para número se necessário
        const value = typeof item[station] === 'string' ? parseFloat(item[station]) : item[station];
        entry[station] = isNaN(value) ? null : value;
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
  
  // Calcula dados agrupados por hora (média) - usado quando não está com zoom
  const hourlyAverageData = useMemo(() => {
    const hourMap = new Map<string, { time: string; date: string; values: { [key: string]: number[] } }>();
    processedData.forEach((point) => {
      const hour = point.time.slice(0, 13) + ':00';
      if (!hourMap.has(hour)) {
        hourMap.set(hour, { 
          time: hour, 
          date: hour.split(' ')[0].split('-').reverse().join('/'),
          values: {}
        });
      }
      const entry = hourMap.get(hour)!;
      stations.forEach(station => {
        if (typeof point[station] === 'number') {
          if (!entry.values[station]) {
            entry.values[station] = [];
          }
          entry.values[station].push(point[station] as number);
        }
      });
    });
    
    const result: TimePoint[] = [];
    hourMap.forEach((entry) => {
      const dataPoint: TimePoint = { 
        time: entry.time,
        date: entry.date
      };
      stations.forEach(station => {
        const arr = entry.values[station] || [];
        dataPoint[station] = arr.length ? (arr.reduce((a, b) => a + b, 0) / arr.length) : null;
      });
      result.push(dataPoint);
    });
    
    return result.sort((a, b) => a.time.localeCompare(b.time));
  }, [processedData, stations]);

  // Estados para zoom via seleção de área
  const [visibleData, setVisibleData] = useState<TimePoint[]>([]);
  const [isZoomed, setIsZoomed] = useState(false);
  const [xDomainLeft, setXDomainLeft] = useState<string>("");
  const [xDomainRight, setXDomainRight] = useState<string>("");
  const [yDomainBottom, setYDomainBottom] = useState<number | null>(null);
  const [yDomainTop, setYDomainTop] = useState<number | null>(null);
  
  // Atualiza visibleData quando hourlyAverageData muda e não está com zoom
  useEffect(() => {
    if (!isZoomed && hourlyAverageData.length > 0) {
      setVisibleData(hourlyAverageData);
    }
  }, [hourlyAverageData, isZoomed]);
  
  // Gera os ticks de hora cheia para o eixo X
  const hourTicks = useMemo(() => {
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

  const chartWrapperRef = useRef<HTMLDivElement | null>(null)
  const legendRef = useRef<HTMLDivElement | null>(null)
  const { width } = useElementSize(chartWrapperRef)
  const isDraggingRef = useRef(false)
  const lastClientXRef = useRef<number>(0)
  const autoScrollDirRef = useRef<-1 | 0 | 1>(0)
  const rafRef = useRef<number | null>(null)
  const moveListenerRef = useRef<((ev: MouseEvent) => void) | null>(null)
  const upListenerRef = useRef<((ev: MouseEvent) => void) | null>(null)

  // Altura proporcional 16:9
  const aspect = 16 / 9
  const reservedPx = 28
  const chartHeight = width
    ? Math.max(120, Math.round(width / aspect) - reservedPx)
    : undefined

  // ChartContainer com largura fixa para scroll horizontal e espaçamento igual entre horas
  const BASE_TICK_WIDTH = 120;
  const CHART_MARGIN = { left: 12, right: 40, top: 10, bottom: 35 } as const
  const Y_AXIS_WIDTH = 48
  const AUTO_SCROLL_THRESHOLD = 24; // px próximos à borda para autoscroll durante seleção
  const AUTO_SCROLL_SPEED = 24;     // px por evento de movimento


  const stopAutoScroll = () => {
    autoScrollDirRef.current = 0
    if (rafRef.current != null) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
  }

  const autoScrollLoop = () => {
    const wrapper = chartWrapperRef.current
    if (!wrapper || !isDraggingRef.current) {
      rafRef.current = null
      return
    }
    // Calcula direção com base na posição atual do cursor
    const rect = wrapper.getBoundingClientRect()
    const clientX = lastClientXRef.current
    const nearRight = clientX > rect.right - AUTO_SCROLL_THRESHOLD
    const nearLeft = clientX < rect.left + AUTO_SCROLL_THRESHOLD
    const maxScroll = wrapper.scrollWidth - wrapper.clientWidth
    let performedScroll = false
    if (nearRight && wrapper.scrollLeft < maxScroll) {
      wrapper.scrollLeft = Math.min(wrapper.scrollLeft + AUTO_SCROLL_SPEED, maxScroll)
      performedScroll = true
    } else if (nearLeft && wrapper.scrollLeft > 0) {
      wrapper.scrollLeft = Math.max(wrapper.scrollLeft - AUTO_SCROLL_SPEED, 0)
      performedScroll = true
    }

    // Atualiza xDomainRight mesmo sem novo mousemove, usando a posição atual do cursor
    const mapped = hourFromClientX(lastClientXRef.current)
    if (mapped) setXDomainRight(mapped)

    // Continua o loop enquanto estiver arrastando
    rafRef.current = requestAnimationFrame(autoScrollLoop)
  }

  const attachWindowDragListeners = () => {
    if (moveListenerRef.current || upListenerRef.current) return
    moveListenerRef.current = (ev: MouseEvent) => {
      if (isDraggingRef.current) {
        lastClientXRef.current = ev.clientX
      }
    }
    upListenerRef.current = (ev: MouseEvent) => {
      if (!isDraggingRef.current) return
      handleMouseUp()
    }
    window.addEventListener('mousemove', moveListenerRef.current)
    window.addEventListener('mouseup', upListenerRef.current as EventListener)
  }

  const detachWindowDragListeners = () => {
    if (moveListenerRef.current) {
      window.removeEventListener('mousemove', moveListenerRef.current)
      moveListenerRef.current = null
    }
    if (upListenerRef.current) {
      window.removeEventListener('mouseup', upListenerRef.current as EventListener)
      upListenerRef.current = null
    }
  }
  
  // Contagem de horas distintas no recorte (para dimensionar largura no zoom)
  const zoomHourCount = useMemo(() => {
    if (!isZoomed || visibleData.length === 0) return 0
    const hours = new Set<string>()
    visibleData.forEach(d => {
      if (d.time) {
        hours.add(d.time.slice(0, 13)) // yyyy-mm-dd hh
      }
    })
    return hours.size
  }, [isZoomed, visibleData])
  
  // Largura do gráfico baseada nos dados visíveis
  const chartWidth = useMemo(() => {
    if (isZoomed) {
      // No zoom, baseia na quantidade de HORAS selecionadas
      const hours = Math.max(zoomHourCount || 1, 1)
      const perHour = 110
      const desired = Math.max(hours * perHour, 320)
      const container = width || desired
      // Regra pedida: com seleção até 2h, não ativar scroll (encaixa no contêiner).
      // A partir de 3h, permitir scroll (não limitar ao contêiner).
      if (hours <= 2) return container
      return desired
    }
    const dataLength = hourTicks.length
    return Math.max(dataLength * BASE_TICK_WIDTH, 600) // mínimo de 600px fora do zoom
  }, [isZoomed, zoomHourCount, hourTicks.length, width])

  // Mapeia a posição do cursor para o tick de hora correspondente (modo sem zoom)
  const hourFromClientX = (clientX: number): string | null => {
    const wrapper = chartWrapperRef.current
    if (!wrapper || hourTicks.length === 0) return null
    const rect = wrapper.getBoundingClientRect()
    const xClient = Math.max(0, Math.min(clientX - rect.left, rect.width))
    // Converte para coordenada do conteúdo total (incluindo scroll)
    let xContent = wrapper.scrollLeft + xClient
    // Remove offset de margens e eixo Y para aproximar a área útil do gráfico
    const xPlot = Math.max(0, xContent - (CHART_MARGIN.left + Y_AXIS_WIDTH))
    const plotWidth = Math.max(1, chartWidth - CHART_MARGIN.left - CHART_MARGIN.right)
    const step = plotWidth / Math.max(1, hourTicks.length)
    const idx = Math.max(0, Math.min(Math.floor(xPlot / step), hourTicks.length - 1))
    return hourTicks[idx] || null
  }

  // Handlers de seleção de área para zoom (baseado no exemplo do CodeSandbox)
  const handleMouseDown = (e: any) => {
    isDraggingRef.current = true
    if (e?.nativeEvent) {
      lastClientXRef.current = (e.nativeEvent as MouseEvent).clientX
    }
    const start = e?.activeLabel || hourFromClientX(lastClientXRef.current)
    if (start) setXDomainLeft(start)
    attachWindowDragListeners()
    if (rafRef.current == null) {
      rafRef.current = requestAnimationFrame(autoScrollLoop)
    }
  };
  
  const handleMouseMove = (e: any) => {
    if (!e) return
    if (e.nativeEvent) {
      lastClientXRef.current = (e.nativeEvent as MouseEvent).clientX
    }
    if (xDomainLeft) {
      // Atualiza o limite direito pela label ativa ou pelo mapeamento por pixel
      const next = e.activeLabel || hourFromClientX(lastClientXRef.current)
      if (next) setXDomainRight(next)
    }

    // Autoscroll quando estiver selecionando e encostar nas bordas do contêiner
    if (xDomainLeft && chartWrapperRef.current && e?.nativeEvent) {
      const wrapper = chartWrapperRef.current
      const rect = wrapper.getBoundingClientRect()
      const clientX = (e.nativeEvent as MouseEvent).clientX
      const nearRight = clientX > rect.right - AUTO_SCROLL_THRESHOLD
      const nearLeft = clientX < rect.left + AUTO_SCROLL_THRESHOLD
      const maxScroll = wrapper.scrollWidth - wrapper.clientWidth

      // Define direção de autoscroll
      if (nearRight && wrapper.scrollLeft < maxScroll) {
        autoScrollDirRef.current = 1
      } else if (nearLeft && wrapper.scrollLeft > 0) {
        autoScrollDirRef.current = -1
      } else {
        autoScrollDirRef.current = 0
      }

      // Inicia loop se necessário
      if (autoScrollDirRef.current !== 0 && rafRef.current == null) {
        rafRef.current = requestAnimationFrame(autoScrollLoop)
      }
      // Se não precisar mais, para o loop
      if (autoScrollDirRef.current === 0 && rafRef.current != null) {
        stopAutoScroll()
      }
    }
  };
  
  const handleMouseUp = () => {
    isDraggingRef.current = false
    stopAutoScroll()
    detachWindowDragListeners()
    if (xDomainLeft === xDomainRight || xDomainRight === "") {
      setXDomainLeft("");
      setXDomainRight("");
      return;
    }

    if (xDomainLeft && xDomainRight) {
      // Aplica zoom: filtra dados por intervalo selecionado
      const [start, end] = [xDomainLeft, xDomainRight].sort();
      const filtered = processedData.filter(d => d.time >= start && d.time <= end);
      
      if (filtered.length > 0) {
        setVisibleData(filtered);
        
        // Calcula min/max Y
        let minY = Infinity, maxY = -Infinity;
        filtered.forEach(d => {
          stations.forEach(station => {
            const val = typeof d[station] === 'number' ? d[station] as number : null;
            if (val !== null) {
              minY = Math.min(minY, val);
              maxY = Math.max(maxY, val);
            }
          });
        });
        
        setYDomainBottom(minY === Infinity ? 0 : minY);
        setYDomainTop(maxY === -Infinity ? 10 : maxY);
        setIsZoomed(true);
      }
      
      setXDomainLeft("");
      setXDomainRight("");
    }
  };

  // Reset do zoom
  const handleZoomOut = () => {
    setIsZoomed(false);
    setVisibleData(hourlyAverageData);
    setXDomainLeft("");
    setXDomainRight("");
    setYDomainBottom(null);
    setYDomainTop(null);
  };

  return (
    <CardChart
      title={title}
      chart={
        <>
          {/* Legenda customizada e botão de reset do zoom */}
          <div className="px-2 pb-2 select-none">
            <div ref={legendRef} className="flex flex-wrap items-center justify-center gap-4">
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
            {isZoomed && (
              <div className="mt-4 flex items-center justify-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleZoomOut}
                  aria-label="Resetar zoom"
                  title="Resetar zoom"
                >
                  <RotateCcw className="h-4 w-4" />
                  <span className="ml-2">Resetar zoom</span>
                </Button>
              </div>
            )}
          </div>

          {/* ChartContainer com largura fixa e scroll horizontal */}
          <div ref={chartWrapperRef} className="w-full overflow-x-auto select-none">
            <div style={{ minWidth: chartWidth }}>
              <ChartContainer
                config={chartConfig}
                className="w-full"
                style={{ height: chartHeight, minWidth: chartWidth }}
              >
                <LineChart
                  data={visibleData}
                  margin={{ left: CHART_MARGIN.left, right: CHART_MARGIN.right, top: CHART_MARGIN.top, bottom: CHART_MARGIN.bottom }}
                  width={chartWidth}
                  height={chartHeight}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  style={{ cursor: "crosshair" }}
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
                    minTickGap={0}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    width={Y_AXIS_WIDTH}
                    label={{
                      value: yLabel ?? title,
                      angle: -90,
                      position: "insideLeft",
                      style: { textAnchor: "middle" },
                    }}
                  />

                  {/* ReferenceArea para seleção de zoom */}
                  {xDomainLeft && xDomainRight && (
                    <ReferenceArea 
                      x1={xDomainLeft} 
                      x2={xDomainRight} 
                      strokeOpacity={0.3}
                      fill="hsl(var(--primary))"
                      opacity={0.2}
                    />
                  )}

                  <ChartTooltip
                    cursor={false}
                    content={
                      <ChartTooltipContent
                        hideLabel={false}
                        labelFormatter={(rawLabel, payload) => {
                          const labelStr = String(rawLabel)
                          const [datePart, timePart] = labelStr.split(" ")
                          const [yyyy, mm, dd] = (datePart || "").split("-")
                          const prettyDate = dd && mm && yyyy ? `${dd}/${mm}/${yyyy}` : ""
                          const prettyTime = (timePart || "").slice(0,5)
                          return `${prettyDate} ${prettyTime}`.trim()
                        }}
                      />
                    }
                  />

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
