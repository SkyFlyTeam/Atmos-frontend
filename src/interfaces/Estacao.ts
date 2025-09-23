export interface Estacao {
  pk: number
  uuid: string
  nome: string
  descricao: string
  link?: string | null
  status: boolean
  lat?: string | null
  long?: string | null
  endereco?: string | null
  // Campo opcional para exibir foto na listagem
  fotoUrl?: string | null
}
