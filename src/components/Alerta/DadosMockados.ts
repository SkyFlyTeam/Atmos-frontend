// Mock data based on Alerta class structure
export interface NotificationData {
  pk: number
  data: string // Date formatted as string
  tipoAlerta: {
    pk: number
    nome: string
    descricao: string
    icone: string // Color identifier: 'yellow', 'orange', 'red', etc
  }
  valorCapturado: {
    descricao: string
    valor: number
    unidade: string
    estacao: string
  }
  isRead: boolean
}

export const mockNotifications: NotificationData[] = [
  {
    pk: 1,
    data: "02/11/2025 - 18h53",
    tipoAlerta: {
      pk: 1,
      nome: "Chuva intensa",
      descricao: "Chuva intensa detectada",
      icone: "yellow",
    },
    valorCapturado: {
      descricao: "50 mm/h",
      valor: 50,
      unidade: "mm/h",
      estacao: "Estação Central - São Paulo",
    },
    isRead: false,
  },
  {
    pk: 2,
    data: "02/11/2025 - 18h53",
    tipoAlerta: {
      pk: 2,
      nome: "Vento forte",
      descricao: "Vento forte detectado",
      icone: "orange",
    },
    valorCapturado: {
      descricao: "72 km/h",
      valor: 72,
      unidade: "km/h",
      estacao: "Estação Aeroporto",
    },
    isRead: false,
  },
  {
    pk: 3,
    data: "02/11/2025 - 18h53",
    tipoAlerta: {
      pk: 3,
      nome: "Temperatura baixa",
      descricao: "Temperatura baixa detectada",
      icone: "red",
    },
    valorCapturado: {
      descricao: "-8°C",
      valor: -8,
      unidade: "°C",
      estacao: "Estação Bairro Alto",
    },
    isRead: true,
  },
  {
    pk: 4,
    data: "02/11/2025 - 18h53",
    tipoAlerta: {
      pk: 1,
      nome: "Chuva intensa",
      descricao: "Chuva intensa detectada",
      icone: "orange",
    },
    valorCapturado: {
      descricao: "44 mm/h",
      valor: 44,
      unidade: "mm/h",
      estacao: "Estação Costeira",
    },
    isRead: true,
  },
  {
    pk: 5,
    data: "02/11/2025 - 18h53",
    tipoAlerta: {
      pk: 2,
      nome: "Vento forte",
      descricao: "Vento forte detectado",
      icone: "orange",
    },
    valorCapturado: {
      descricao: "72 km/h",
      valor: 72,
      unidade: "km/h",
      estacao: "Estação Costeira",
    },
    isRead: true,
  },
  {
    pk: 6,
    data: "02/11/2025 - 18h53",
    tipoAlerta: {
      pk: 2,
      nome: "Vento forte",
      descricao: "Vento forte detectado",
      icone: "orange",
    },
    valorCapturado: {
      descricao: "72 km/h",
      valor: 72,
      unidade: "km/h",
      estacao: "Estação Aeroporto",
    },
    isRead: false,
  },
]
