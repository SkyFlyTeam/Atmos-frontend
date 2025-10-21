import { useMemo, useState } from "react"
import ChartLineDots from "./components/ChartLineDots"
import Pagination from "@/components/Pagination"
import LatestDataCardsContainer from "@/components/LatestDataCardsContainer/LatestDataCardsContainer"
import mockParametros from "./dadosMockados"

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
      {/* Cards de últimos dados enviados */}
      <LatestDataCardsContainer />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {pageItems.map((param, idx) => (
          <ChartLineDots
            key={`${param.tipo_parametro}-${idx}`}
            title={param.tipo_parametro}
            yLabel={param.tipo_parametro}
            xLabel="Horário"
            stations={param.estacoes}
            data={param.dados.map(d => ({ ...d, time: d.datetime } as any))}
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
