import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"
import { useEffect, useRef, useState } from "react"
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

export default function ChartLineDots({ title, xLabel = "Horário", yLabel, stations, data }: Props) {
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
  const [chartHeight, setChartHeight] = useState<number | undefined>(undefined) // guarda a altura calculada do gráfico

  // Cálculo da altura responsiva (O Recharts não consegue ajustar automaticamente a altura do gráfico)
  useEffect(() => {
    const el = chartWrapperRef.current
    if (!el) return
    const aspect = 16 / 9
    const reservedPx = 28
    const ro = new ResizeObserver(() => {
      const w = el.offsetWidth
      if (w) setChartHeight(Math.max(120, Math.round(w / aspect) - reservedPx))
    })
    ro.observe(el)
    const w = el.offsetWidth
    if (w) setChartHeight(Math.max(120, Math.round(w / aspect) - reservedPx))
    return () => ro.disconnect()
  }, [])

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
                data={data}
                margin={{ left: 12, right: 12, top: 10, bottom: 12 }}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="time"
                  tickLine={false}
                  axisLine={true}
                  tickMargin={12}
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
            <div className="w-full text-center text-sm text-muted-foreground mt-1">
              {xLabel}
            </div>
          </div>
        </>
      }
    />
  )


}
