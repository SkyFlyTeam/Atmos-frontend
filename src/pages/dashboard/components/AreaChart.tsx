"use client"

import { Line, LineChart, CartesianGrid, XAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";
import CardChart from "@/components/CardChart/CardChart";  // Certifique-se de que o caminho está correto

// Tipo para os dados do gráfico
interface ChartData {
  time: string;
  [key: string]: number | string;
}

interface AreaChartProps {
  title: string;
  data: ChartData[];
  stations: string[];
}

const AreaChartComponent = ({ title, data, stations }: AreaChartProps) => {
  // Cores dinâmicas para cada estação
  const chartConfig = stations.reduce((acc, station, index) => {
    acc[station] = {
      label: station,
      color: `hsl(${index * 90}, 70%, 50%)`, // Cores distintas para cada estação
    };
    return acc;
  }, {} as Record<string, { label: string; color: string }>);

  const chart = (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis dataKey="time" />
        <Tooltip />
        <Legend verticalAlign="bottom" align="center" />
        {stations.map((station) => (
          <Line
            key={station}
            type="monotone"
            dataKey={station} // Usando a estação como o 'dataKey'
            stroke={chartConfig[station].color}
            strokeWidth={2}
            dot={{
              fill: chartConfig[station].color,
              r: 4, // Ajuste do tamanho do ponto
            }}
            activeDot={{
              r: 6, // Tamanho do ponto ativo
            }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );

  return (
    <CardChart title={title} chart={chart} />
  );
};

export default AreaChartComponent;
