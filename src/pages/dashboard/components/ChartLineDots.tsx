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
  // cada estação vira uma key com valor numérico
  [station: StationName]: number | string
}

type Props = {
  title: string
  xLabel?: string
  yLabel?: string
  stations: StationName[]
  data: TimePoint[]
}

// Função para processar dados e pegar apenas o último registro de cada hora
function processHourlyData(data: TimePoint[], stations: StationName[]): TimePoint[] {
  // Agrupa os dados por hora e estação
  const hourlyMap = new Map<string, Map<string, { datetime: string; value: number }>>()

  data.forEach((point) => {
    // Extrai a data/hora do campo time ou datetime
    const dateTimeStr = point.time || (point as any).datetime
    if (!dateTimeStr) return

    // Extrai a hora (formato: "2025-10-15 13:05" -> "13")
    const match = dateTimeStr.match(/(\d{4}-\d{2}-\d{2} \d{2})/)
    if (!match) return

    const hourKey = match[1] // "2025-10-15 13"

    if (!hourlyMap.has(hourKey)) {
      hourlyMap.set(hourKey, new Map())
    }

    const hourData = hourlyMap.get(hourKey)!

    // Para cada estação, guarda o último valor encontrado
    stations.forEach((station) => {
      const value = point[station]
      if (typeof value === 'number') {
        hourData.set(station, { datetime: dateTimeStr, value })
      }
    })
  })

  // Converte o mapa de volta para array de TimePoint
  const result: TimePoint[] = []

  // Ordena as horas
  const sortedHours = Array.from(hourlyMap.keys()).sort()

  sortedHours.forEach((hourKey) => {
    const hourData = hourlyMap.get(hourKey)!

    // Extrai data e hora separadamente
    const [datePart, hourPart] = hourKey.split(' ')
    const [year, month, day] = datePart.split('-')

    const timePoint: TimePoint = {
      time: `${hourPart}h`, // "13h", "14h", etc.
      date: `${day}/${month}/${year}`, // "15/10/2025"
      fullDateTime: hourKey, // mantém o datetime completo para referência
    }

    stations.forEach((station) => {
      const stationData = hourData.get(station)
      if (stationData) {
        timePoint[station] = stationData.value
      }
    })

    result.push(timePoint)
  })

  return result
}

// Componente customizado para o tick do eixo X (horário + data)
const createCustomXAxisTick = (timeToDateMap: Map<string, string>) => {
  return (props: any) => {
    const { x, y, payload } = props

    const timeValue = payload?.value || ''
    const date = timeToDateMap.get(timeValue) || ''

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
          {timeValue}
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

export default function ChartLineDots({ title, xLabel = "Horário", yLabel, stations, data }: Props) {
  // Processa os dados para pegar apenas o último registro de cada hora
  const processedData = useMemo(() => processHourlyData(data, stations), [data, stations])

  // Cria um mapa de hora -> data para usar no CustomXAxisTick
  const timeToDateMap = useMemo(() => {
    const map = new Map<string, string>()
    processedData.forEach((point) => {
      if (point.time && point.date) {
        map.set(String(point.time), String(point.date))
      }
    })
    return map
  }, [processedData])

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

          {/* ChartContainer com altura explícita (calculada) para o ResponsiveContainer */}
          <div ref={chartWrapperRef} className="w-full">
            <ChartContainer
              config={chartConfig}
              className="w-full"
              style={chartHeight ? { height: chartHeight } : undefined}
            >
              <LineChart
                accessibilityLayer
                data={processedData}
                margin={{ left: 12, right: 40, top: 10, bottom: 35 }}
              >
                <CartesianGrid vertical={true} />
                <XAxis
                  dataKey="time"
                  tickLine={false}
                  axisLine={true}
                  tickMargin={12}
                  tick={createCustomXAxisTick(timeToDateMap)}
                  height={60}
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
                    />
                  )
                })}
              </LineChart>
            </ChartContainer>
            <div className="w-full text-center text-sm text-muted-foreground -mt-5">
              {xLabel}
            </div>
          </div>
        </>
      }
    />
  )


}
