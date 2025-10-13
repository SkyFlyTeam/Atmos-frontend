import { useMemo, useState } from "react"
import ChartLineDots from "./components/ChartLineDots"
import Pagination from "@/components/Pagination"

const mockParametros = [
  {
    tipo_parametro: "Temperatura (°C)",
    estacoes: ["Estação Aurora", "Estação Boreal", "Estação Cobalto", "Estação Duna", "Estação Éter"],
    dados: [
      { time: "00:00", "Estação Aurora": 21.3, "Estação Boreal": 20.8, "Estação Cobalto": 22.1, "Estação Duna": 19.9, "Estação Éter": 21.0 },
      { time: "01:00", "Estação Aurora": 20.9, "Estação Boreal": 20.3, "Estação Cobalto": 21.6, "Estação Duna": 19.6, "Estação Éter": 20.7 },
      { time: "02:00", "Estação Aurora": 20.5, "Estação Boreal": 19.9, "Estação Cobalto": 21.2, "Estação Duna": 19.2, "Estação Éter": 20.3 },
      { time: "03:00", "Estação Aurora": 20.2, "Estação Boreal": 19.5, "Estação Cobalto": 20.8, "Estação Duna": 18.9, "Estação Éter": 20.0 },
      { time: "04:00", "Estação Aurora": 20.0, "Estação Boreal": 19.3, "Estação Cobalto": 20.5, "Estação Duna": 18.7, "Estação Éter": 19.8 },
      { time: "05:00", "Estação Aurora": 19.8, "Estação Boreal": 19.1, "Estação Cobalto": 20.3, "Estação Duna": 18.6, "Estação Éter": 19.6 },
      { time: "06:00", "Estação Aurora": 20.4, "Estação Boreal": 19.7, "Estação Cobalto": 20.9, "Estação Duna": 19.0, "Estação Éter": 20.1 },
      { time: "07:00", "Estação Aurora": 21.1, "Estação Boreal": 20.5, "Estação Cobalto": 21.6, "Estação Duna": 19.7, "Estação Éter": 20.9 },
    ],
  },
  {
    tipo_parametro: "Radiação UV (índice)",
    estacoes: ["Estação Aurora", "Estação Boreal", "Estação Cobalto", "Estação Duna", "Estação Éter"],
    dados: [
      { time: "00:00", "Estação Aurora": 0.0, "Estação Boreal": 0.0, "Estação Cobalto": 0.0, "Estação Duna": 0.0, "Estação Éter": 0.0 },
      { time: "01:00", "Estação Aurora": 0.0, "Estação Boreal": 0.0, "Estação Cobalto": 0.0, "Estação Duna": 0.0, "Estação Éter": 0.0 },
      { time: "02:00", "Estação Aurora": 0.0, "Estação Boreal": 0.0, "Estação Cobalto": 0.0, "Estação Duna": 0.0, "Estação Éter": 0.0 },
      { time: "03:00", "Estação Aurora": 0.0, "Estação Boreal": 0.0, "Estação Cobalto": 0.0, "Estação Duna": 0.0, "Estação Éter": 0.0 },
      { time: "04:00", "Estação Aurora": 0.0, "Estação Boreal": 0.0, "Estação Cobalto": 0.0, "Estação Duna": 0.0, "Estação Éter": 0.0 },
      { time: "05:00", "Estação Aurora": 0.1, "Estação Boreal": 0.1, "Estação Cobalto": 0.1, "Estação Duna": 0.1, "Estação Éter": 0.1 },
      { time: "06:00", "Estação Aurora": 0.6, "Estação Boreal": 0.5, "Estação Cobalto": 0.7, "Estação Duna": 0.6, "Estação Éter": 0.6 },
      { time: "07:00", "Estação Aurora": 1.8, "Estação Boreal": 1.6, "Estação Cobalto": 2.0, "Estação Duna": 1.7, "Estação Éter": 1.9 },
    ],
  },
  {
    tipo_parametro: "Umidade do ar (%)",
    estacoes: ["Estação Aurora", "Estação Boreal", "Estação Cobalto", "Estação Duna", "Estação Éter"],
    dados: [
      { time: "00:00", "Estação Aurora": 84, "Estação Boreal": 81, "Estação Cobalto": 79, "Estação Duna": 88, "Estação Éter": 83 },
      { time: "01:00", "Estação Aurora": 85, "Estação Boreal": 82, "Estação Cobalto": 80, "Estação Duna": 89, "Estação Éter": 84 },
      { time: "02:00", "Estação Aurora": 86, "Estação Boreal": 83, "Estação Cobalto": 81, "Estação Duna": 90, "Estação Éter": 85 },
      { time: "03:00", "Estação Aurora": 86, "Estação Boreal": 83, "Estação Cobalto": 82, "Estação Duna": 90, "Estação Éter": 85 },
      { time: "04:00", "Estação Aurora": 87, "Estação Boreal": 84, "Estação Cobalto": 82, "Estação Duna": 91, "Estação Éter": 86 },
      { time: "05:00", "Estação Aurora": 86, "Estação Boreal": 84, "Estação Cobalto": 81, "Estação Duna": 90, "Estação Éter": 85 },
      { time: "06:00", "Estação Aurora": 84, "Estação Boreal": 82, "Estação Cobalto": 79, "Estação Duna": 88, "Estação Éter": 83 },
      { time: "07:00", "Estação Aurora": 81, "Estação Boreal": 79, "Estação Cobalto": 76, "Estação Duna": 85, "Estação Éter": 80 },
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
