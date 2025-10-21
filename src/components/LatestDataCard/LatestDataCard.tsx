import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface LatestDataCardProps {
  tipo_parametro: string;
  ultimo_valor: number;
  tendencia: 'up' | 'down' | 'stable';
}

const LatestDataCard: React.FC<LatestDataCardProps> = ({
  tipo_parametro,
  ultimo_valor,
  tendencia,
}) => {
  const getTrendIcon = () => {
    if (tendencia === 'up') {
      return <TrendingUp className="w-6 h-6" style={{ color: '#3A7817' }} />;
    } else if (tendencia === 'down') {
      return <TrendingDown className="w-6 h-6" style={{ color: '#BF2A01' }} />;
    }
    return null;
  };

  const getTrendColor = () => {
    if (tendencia === 'up') return '#3A7817';
    if (tendencia === 'down') return '#BF2A01';
    return '#666666'; // cor neutra para stable
  };

  return (
    <div
      className="min-w-[280px] rounded-lg shadow-md p-4 flex flex-col justify-between"
      style={{ backgroundColor: '#DEFFD9' }}
    >
      {/* Título do parâmetro */}
      <div className="mb-3">
        <h3 className="text-base font-semibold text-gray-800 truncate">
          {tipo_parametro}
        </h3>
      </div>

      {/* Valor e ícone de tendência */}
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p
            className="text-2xl font-bold"
            style={{ color: getTrendColor() }}
          >
            {ultimo_valor.toFixed(2)}
          </p>
        </div>
        
        {/* Ícone de tendência */}
        <div className="flex items-center justify-center ml-3">
          {getTrendIcon()}
        </div>
      </div>
    </div>
  );
};

export default LatestDataCard;
