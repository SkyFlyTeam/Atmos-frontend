// Mock data shaped to match the Sequelize `Alerta` model and relations
export interface NotificationData {
  pk: number
  data: string // ISO date or formatted string
  tipo_alerta_pk: number
  valor_capturado_pk: number
  tipoAlerta: {
    pk: number
    nome: string
    descricao: string
  }
  valorCapturado: {
    pk: number
    descricao: string
    valor: number
    unidade: string
    estacao: string
  }
  isRead: boolean
}

// Note: color generation moved to component so mocks can be removed without affecting UI behavior.

export const mockNotifications: NotificationData[] = [
  {
    pk: 1,
    data: "2025-11-02T18:53:00",
    tipo_alerta_pk: 1,
    valor_capturado_pk: 1,
    tipoAlerta: {
      pk: 1,
      nome: "Chuva intensa",
      descricao: "Chuva intensa detectada",
    },
    valorCapturado: {
      pk: 1,
      descricao: "50 mm/h",
      valor: 50,
      unidade: "mm/h",
      estacao: "Estação Central - São Paulo",
    },
    isRead: false,
  },
  {
    pk: 2,
    data: "2025-11-02T18:53:00",
    tipo_alerta_pk: 2,
    valor_capturado_pk: 2,
    tipoAlerta: {
      pk: 2,
      nome: "Vento forte",
      descricao: "Vento forte detectado",
    },
    valorCapturado: {
      pk: 2,
      descricao: "72 km/h",
      valor: 72,
      unidade: "km/h",
      estacao: "Estação Aeroporto",
    },
    isRead: false,
  },
  {
    pk: 3,
    data: "2025-11-02T18:53:00",
    tipo_alerta_pk: 3,
    valor_capturado_pk: 3,
    tipoAlerta: {
      pk: 3,
      nome: "Temperatura baixa",
      descricao: "Temperatura baixa detectada",
    },
    valorCapturado: {
      pk: 3,
      descricao: "-8°C",
      valor: -8,
      unidade: "°C",
      estacao: "Estação Bairro Alto",
    },
    isRead: true,
  },
  {
    pk: 4,
    data: "2025-11-02T18:53:00",
    tipo_alerta_pk: 1,
    valor_capturado_pk: 4,
    tipoAlerta: {
      pk: 1,
      nome: "Chuva intensa",
      descricao: "Chuva intensa detectada",
    },
    valorCapturado: {
      pk: 4,
      descricao: "44 mm/h",
      valor: 44,
      unidade: "mm/h",
      estacao: "Estação Costeira",
    },
    isRead: true,
  },
  {
    pk: 5,
    data: "2025-11-02T18:53:00",
    tipo_alerta_pk: 2,
    valor_capturado_pk: 5,
    tipoAlerta: {
      pk: 2,
      nome: "Vento forte",
      descricao: "Vento forte detectado",
    },
    valorCapturado: {
      pk: 5,
      descricao: "72 km/h",
      valor: 72,
      unidade: "km/h",
      estacao: "Estação Costeira",
    },
    isRead: true,
  },
  {
    pk: 6,
    data: "2025-11-02T18:53:00",
    tipo_alerta_pk: 2,
    valor_capturado_pk: 2,
    tipoAlerta: {
      pk: 2,
      nome: "Vento forte",
      descricao: "Vento forte detectado",
    },
    valorCapturado: {
      pk: 2,
      descricao: "72 km/h",
      valor: 72,
      unidade: "km/h",
      estacao: "Estação Aeroporto",
    },
    isRead: false,
  },
]
