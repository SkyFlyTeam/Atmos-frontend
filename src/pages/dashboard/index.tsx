import { useMemo, useState } from "react"
import ChartLineDots from "./components/ChartLineDots"
import Pagination from "@/components/Pagination"

const mockParametros = [
  {
    tipo_parametro: "Temperatura (°C)",
    estacoes: [
      "Estação Aurora",
      "Estação Boreal",
      "Estação Cobalto",
      "Estação Duna",
      "Estação Éter",
      "Estação Fênix",
      "Estação Gelo",
      "Estação Horizonte",
      "Estação Ícaro",
      "Estação Júpiter",
      "Estação Kronos",
      "Estação Lótus",
      "Estação Miragem",
      "Estação Nimbus",
      "Estação Orion",
    ],
    dados: [
      { time: "00:00", "Estação Aurora": 21.3, "Estação Boreal": 20.8, "Estação Cobalto": 22.1, "Estação Duna": 19.9, "Estação Éter": 21.0, "Estação Fênix": 21.8, "Estação Gelo": 18.7, "Estação Horizonte": 20.4, "Estação Ícaro": 21.1, "Estação Júpiter": 20.3, "Estação Kronos": 19.5, "Estação Lótus": 21.4, "Estação Miragem": 22.0, "Estação Nimbus": 20.1, "Estação Orion": 21.7 },
      { time: "01:00", "Estação Aurora": 20.9, "Estação Boreal": 20.3, "Estação Cobalto": 21.6, "Estação Duna": 19.6, "Estação Éter": 20.7, "Estação Fênix": 21.3, "Estação Gelo": 18.3, "Estação Horizonte": 20.0, "Estação Ícaro": 20.8, "Estação Júpiter": 19.9, "Estação Kronos": 19.2, "Estação Lótus": 21.0, "Estação Miragem": 21.6, "Estação Nimbus": 19.8, "Estação Orion": 21.3 },
      { time: "02:00", "Estação Aurora": 20.5, "Estação Boreal": 19.9, "Estação Cobalto": 21.2, "Estação Duna": 19.2, "Estação Éter": 20.3, "Estação Fênix": 20.9, "Estação Gelo": 17.9, "Estação Horizonte": 19.7, "Estação Ícaro": 20.4, "Estação Júpiter": 19.5, "Estação Kronos": 18.8, "Estação Lótus": 20.6, "Estação Miragem": 21.3, "Estação Nimbus": 19.4, "Estação Orion": 21.0 },
      { time: "03:00", "Estação Aurora": 20.2, "Estação Boreal": 19.5, "Estação Cobalto": 20.8, "Estação Duna": 18.9, "Estação Éter": 20.0, "Estação Fênix": 20.5, "Estação Gelo": 17.5, "Estação Horizonte": 19.3, "Estação Ícaro": 20.0, "Estação Júpiter": 19.2, "Estação Kronos": 18.5, "Estação Lótus": 20.2, "Estação Miragem": 20.9, "Estação Nimbus": 19.1, "Estação Orion": 20.6 },
      { time: "04:00", "Estação Aurora": 20.0, "Estação Boreal": 19.3, "Estação Cobalto": 20.5, "Estação Duna": 18.7, "Estação Éter": 19.8, "Estação Fênix": 20.3, "Estação Gelo": 17.3, "Estação Horizonte": 19.0, "Estação Ícaro": 19.7, "Estação Júpiter": 19.0, "Estação Kronos": 18.3, "Estação Lótus": 19.9, "Estação Miragem": 20.6, "Estação Nimbus": 18.9, "Estação Orion": 20.3 },
      { time: "05:00", "Estação Aurora": 19.8, "Estação Boreal": 19.1, "Estação Cobalto": 20.3, "Estação Duna": 18.6, "Estação Éter": 19.6, "Estação Fênix": 20.0, "Estação Gelo": 17.2, "Estação Horizonte": 18.9, "Estação Ícaro": 19.5, "Estação Júpiter": 18.8, "Estação Kronos": 18.1, "Estação Lótus": 19.7, "Estação Miragem": 20.3, "Estação Nimbus": 18.8, "Estação Orion": 20.1 },
      { time: "06:00", "Estação Aurora": 20.4, "Estação Boreal": 19.7, "Estação Cobalto": 20.9, "Estação Duna": 19.0, "Estação Éter": 20.1, "Estação Fênix": 20.6, "Estação Gelo": 17.7, "Estação Horizonte": 19.4, "Estação Ícaro": 20.0, "Estação Júpiter": 19.3, "Estação Kronos": 18.7, "Estação Lótus": 20.2, "Estação Miragem": 20.8, "Estação Nimbus": 19.3, "Estação Orion": 20.7 },
      { time: "07:00", "Estação Aurora": 21.1, "Estação Boreal": 20.5, "Estação Cobalto": 21.6, "Estação Duna": 19.7, "Estação Éter": 20.9, "Estação Fênix": 21.3, "Estação Gelo": 18.5, "Estação Horizonte": 20.1, "Estação Ícaro": 20.7, "Estação Júpiter": 19.9, "Estação Kronos": 19.3, "Estação Lótus": 20.9, "Estação Miragem": 21.5, "Estação Nimbus": 19.9, "Estação Orion": 21.4 },
    ],
  },
  {
    tipo_parametro: "Radiação UV (índice)",
    estacoes: [
      "Estação Aurora",
      "Estação Boreal",
      "Estação Cobalto",
      "Estação Duna",
      "Estação Éter",
      "Estação Fênix",
      "Estação Gelo",
      "Estação Horizonte",
      "Estação Ícaro",
      "Estação Júpiter",
      "Estação Kronos",
      "Estação Lótus",
      "Estação Miragem",
      "Estação Nimbus",
      "Estação Orion",
    ],
    dados: [
      { time: "00:00", "Estação Aurora": 0.0, "Estação Boreal": 0.0, "Estação Cobalto": 0.0, "Estação Duna": 0.0, "Estação Éter": 0.0, "Estação Fênix": 0.0, "Estação Gelo": 0.0, "Estação Horizonte": 0.0, "Estação Ícaro": 0.0, "Estação Júpiter": 0.0, "Estação Kronos": 0.0, "Estação Lótus": 0.0, "Estação Miragem": 0.0, "Estação Nimbus": 0.0, "Estação Orion": 0.0 },
      { time: "01:00", "Estação Aurora": 0.0, "Estação Boreal": 0.0, "Estação Cobalto": 0.0, "Estação Duna": 0.0, "Estação Éter": 0.0, "Estação Fênix": 0.0, "Estação Gelo": 0.0, "Estação Horizonte": 0.0, "Estação Ícaro": 0.0, "Estação Júpiter": 0.0, "Estação Kronos": 0.0, "Estação Lótus": 0.0, "Estação Miragem": 0.0, "Estação Nimbus": 0.0, "Estação Orion": 0.0 },
      { time: "05:00", "Estação Aurora": 0.1, "Estação Boreal": 0.1, "Estação Cobalto": 0.1, "Estação Duna": 0.1, "Estação Éter": 0.1, "Estação Fênix": 0.1, "Estação Gelo": 0.1, "Estação Horizonte": 0.1, "Estação Ícaro": 0.1, "Estação Júpiter": 0.1, "Estação Kronos": 0.1, "Estação Lótus": 0.1, "Estação Miragem": 0.1, "Estação Nimbus": 0.1, "Estação Orion": 0.1 },
      { time: "06:00", "Estação Aurora": 0.6, "Estação Boreal": 0.5, "Estação Cobalto": 0.7, "Estação Duna": 0.6, "Estação Éter": 0.6, "Estação Fênix": 0.6, "Estação Gelo": 0.4, "Estação Horizonte": 0.6, "Estação Ícaro": 0.5, "Estação Júpiter": 0.5, "Estação Kronos": 0.4, "Estação Lótus": 0.6, "Estação Miragem": 0.6, "Estação Nimbus": 0.5, "Estação Orion": 0.6 },
      { time: "07:00", "Estação Aurora": 1.8, "Estação Boreal": 1.6, "Estação Cobalto": 2.0, "Estação Duna": 1.7, "Estação Éter": 1.9, "Estação Fênix": 2.1, "Estação Gelo": 1.4, "Estação Horizonte": 1.8, "Estação Ícaro": 1.7, "Estação Júpiter": 1.5, "Estação Kronos": 1.6, "Estação Lótus": 1.9, "Estação Miragem": 2.0, "Estação Nimbus": 1.8, "Estação Orion": 2.1 },
    ],
  },
  {
    tipo_parametro: "Umidade do ar (%)",
    estacoes: [
      "Estação Aurora",
      "Estação Boreal",
      "Estação Cobalto",
      "Estação Duna",
      "Estação Éter",
      "Estação Fênix",
      "Estação Gelo",
      "Estação Horizonte",
      "Estação Ícaro",
      "Estação Júpiter",
      "Estação Kronos",
      "Estação Lótus",
      "Estação Miragem",
      "Estação Nimbus",
      "Estação Orion",
    ],
    dados: [
      { time: "00:00", "Estação Aurora": 84, "Estação Boreal": 81, "Estação Cobalto": 79, "Estação Duna": 88, "Estação Éter": 83, "Estação Fênix": 80, "Estação Gelo": 91, "Estação Horizonte": 82, "Estação Ícaro": 84, "Estação Júpiter": 89, "Estação Kronos": 87, "Estação Lótus": 81, "Estação Miragem": 78, "Estação Nimbus": 85, "Estação Orion": 83 },
      { time: "01:00", "Estação Aurora": 85, "Estação Boreal": 82, "Estação Cobalto": 80, "Estação Duna": 89, "Estação Éter": 84, "Estação Fênix": 81, "Estação Gelo": 92, "Estação Horizonte": 83, "Estação Ícaro": 85, "Estação Júpiter": 90, "Estação Kronos": 88, "Estação Lótus": 82, "Estação Miragem": 79, "Estação Nimbus": 86, "Estação Orion": 84 },
      { time: "02:00", "Estação Aurora": 86, "Estação Boreal": 83, "Estação Cobalto": 81, "Estação Duna": 90, "Estação Éter": 85, "Estação Fênix": 82, "Estação Gelo": 93, "Estação Horizonte": 84, "Estação Ícaro": 86, "Estação Júpiter": 91, "Estação Kronos": 89, "Estação Lótus": 83, "Estação Miragem": 80, "Estação Nimbus": 87, "Estação Orion": 85 },
      { time: "03:00", "Estação Aurora": 86, "Estação Boreal": 83, "Estação Cobalto": 82, "Estação Duna": 90, "Estação Éter": 85, "Estação Fênix": 83, "Estação Gelo": 93, "Estação Horizonte": 84, "Estação Ícaro": 86, "Estação Júpiter": 91, "Estação Kronos": 89, "Estação Lótus": 83, "Estação Miragem": 81, "Estação Nimbus": 87, "Estação Orion": 85 },
      { time: "04:00", "Estação Aurora": 87, "Estação Boreal": 84, "Estação Cobalto": 82, "Estação Duna": 91, "Estação Éter": 86, "Estação Fênix": 84, "Estação Gelo": 94, "Estação Horizonte": 85, "Estação Ícaro": 87, "Estação Júpiter": 92, "Estação Kronos": 90, "Estação Lótus": 84, "Estação Miragem": 82, "Estação Nimbus": 88, "Estação Orion": 86 },
      { time: "05:00", "Estação Aurora": 86, "Estação Boreal": 84, "Estação Cobalto": 81, "Estação Duna": 90, "Estação Éter": 85, "Estação Fênix": 83, "Estação Gelo": 93, "Estação Horizonte": 84, "Estação Ícaro": 86, "Estação Júpiter": 91, "Estação Kronos": 89, "Estação Lótus": 83, "Estação Miragem": 80, "Estação Nimbus": 87, "Estação Orion": 85 },
      { time: "06:00", "Estação Aurora": 84, "Estação Boreal": 82, "Estação Cobalto": 79, "Estação Duna": 88, "Estação Éter": 83, "Estação Fênix": 80, "Estação Gelo": 91, "Estação Horizonte": 82, "Estação Ícaro": 84, "Estação Júpiter": 89, "Estação Kronos": 87, "Estação Lótus": 81, "Estação Miragem": 78, "Estação Nimbus": 85, "Estação Orion": 83 },
      { time: "07:00", "Estação Aurora": 81, "Estação Boreal": 79, "Estação Cobalto": 76, "Estação Duna": 85, "Estação Éter": 80, "Estação Fênix": 77, "Estação Gelo": 88, "Estação Horizonte": 79, "Estação Ícaro": 81, "Estação Júpiter": 86, "Estação Kronos": 84, "Estação Lótus": 78, "Estação Miragem": 75, "Estação Nimbus": 82, "Estação Orion": 80 },
    ],
  },
]

const ITEMS_PER_PAGE = 2

const Dashboard = () => {
  // Estado que guarda o número da página atual
  const [currentPage, setCurrentPage] = useState(1)

  // Calcula o total de páginas disponíveis
  const totalPages = Math.ceil(mockParametros.length / ITEMS_PER_PAGE)

  // Cria um subconjunto (slice) dos itens da página atual
  const pageItems = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE
    const end = start + ITEMS_PER_PAGE
    return mockParametros.slice(start, end)
  }, [currentPage])

  // Função que atualiza a página
  const handlePageChange = (page: number) => {
    const clamped = Math.max(1, Math.min(totalPages, page))
    setCurrentPage(clamped)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {pageItems.map((param, idx) => (
          <ChartLineDots
            key={`${param.tipo_parametro}-${idx}`}
            title={param.tipo_parametro} 
            yLabel={param.tipo_parametro} 
            xLabel="Horário"
            stations={param.estacoes}
            data={param.dados}
          />
        ))}
      </div>

      <Pagination
        className="mt-2 mx-auto"
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  )
}

export default Dashboard
