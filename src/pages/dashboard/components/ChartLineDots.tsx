import { CartesianGrid, Line, LineChart, XAxis, YAxis, Legend, ResponsiveContainer } from "recharts"
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

return (
  <CardChart
    title={title}
    chart={
      <ChartContainer config={chartConfig} className="w-full">
        <div className="w-full">
          {/* Legenda */}
          <div className="flex flex-wrap items-center gap-4 px-2 pb-2">
            {stations.map((station) => {
              const key = slugify(station)
              const colorVar = `var(--color-${key})`
              return (
                <div key={key} className="flex items-center gap-2">
                  <span
                    className="inline-block h-3 w-3 rounded-full border"
                    style={{ backgroundColor: colorVar, borderColor: colorVar }}
                    aria-hidden
                  />
                  <span className="text-sm">{station}</span>
                </div>
              )
            })}
          </div>

          {/* Gráfico */}
          <ResponsiveContainer width="100%" height={350}>
            <LineChart
              accessibilityLayer
              data={data}
              margin={{ left: 12, right: 12, top: 10, bottom: 20 }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="time"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                label={{ value: xLabel, position: "insideBottom", offset: -20 }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                width={48}
                label={{ value: yLabel ?? title, angle: -90, position: "insideLeft" }}
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
          </ResponsiveContainer>
        </div>
      </ChartContainer>
    }
  />
)


}
