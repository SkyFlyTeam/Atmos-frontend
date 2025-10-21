import { LatestCapturaValor } from "@/interfaces/CapturaValor";

/**
 * Dados mockados para teste do componente LatestDataCardsContainer
 * Use este arquivo temporariamente caso o endpoint da API ainda não esteja disponível
 * 
 * Para usar:
 * 1. Importe este arquivo no componente LatestDataCardsContainer
 * 2. Substitua a chamada da API por: setLatestData(mockLatestCapturaValores)
 * 3. Comente a chamada: capturaValorServices.getLatestCapturaValores()
 */

export const mockLatestCapturaValores: LatestCapturaValor[] = [
  {
    tipo_parametro: "Temperatura (°C)",
    ultimo_valor: 25.5,
    valor_anterior: 24.8,
    datetime: "2025-10-20T14:30:00",
    tendencia: "up"
  },
  {
    tipo_parametro: "Umidade (%)",
    ultimo_valor: 62.3,
    valor_anterior: 65.1,
    datetime: "2025-10-20T14:28:00",
    tendencia: "down"
  },
  {
    tipo_parametro: "Pressão (hPa)",
    ultimo_valor: 1013.2,
    valor_anterior: 1012.8,
    datetime: "2025-10-20T14:25:00",
    tendencia: "up"
  },
  {
    tipo_parametro: "Velocidade do Vento (km/h)",
    ultimo_valor: 15.8,
    valor_anterior: 18.2,
    datetime: "2025-10-20T14:32:00",
    tendencia: "down"
  },
  {
    tipo_parametro: "Precipitação (mm)",
    ultimo_valor: 2.4,
    valor_anterior: 0.8,
    datetime: "2025-10-20T14:29:00",
    tendencia: "up"
  },
  {
    tipo_parametro: "Radiação Solar (W/m²)",
    ultimo_valor: 450.5,
    valor_anterior: 430.2,
    datetime: "2025-10-20T14:31:00",
    tendencia: "up"
  },
  {
    tipo_parametro: "CO2 (ppm)",
    ultimo_valor: 405.2,
    valor_anterior: 408.6,
    datetime: "2025-10-20T14:27:00",
    tendencia: "down"
  },
  {
    tipo_parametro: "PM2.5 (µg/m³)",
    ultimo_valor: 18.5,
    valor_anterior: 18.5,
    datetime: "2025-10-20T14:26:00",
    tendencia: "stable"
  }
];
