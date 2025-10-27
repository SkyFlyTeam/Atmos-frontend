import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface LatestDataCardProps {
  tipo_parametro: string;
  // backend may sometimes return numeric strings; accept number | string and handle gracefully
  ultimo_valor: number | string | null | undefined;
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

  return (
    <div
      className="min-w-[280px] rounded-lg shadow-md p-4 flex flex-col justify-between"
      style={{ backgroundColor: '#DEFFD9' }}
    >
      {/* Título do parâmetro */}
      <div className="mb-3">
        <h3 className="text-base font-semibold truncate" style={{ color: '#3A7817' }}>
          {tipo_parametro}
        </h3>
      </div>

      {/* Valor e ícone de tendência */}
      <div className="flex items-center justify-between">
        <div className="flex-1">
            <p className="text-2xl font-bold" style={{ color: '#3A7817' }}>
              {(() => {
                // normalize to number when possible
                const n = typeof ultimo_valor === 'number' ? ultimo_valor : (ultimo_valor ? Number(ultimo_valor) : NaN);
                if (typeof n === 'number' && !isNaN(n)) return n.toFixed(2);
                // fallback: show raw value or a dash
                return ultimo_valor ?? '-';
              })()}
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
