import { useMemo, useState, useEffect } from "react"
import { useRouter } from "next/router"
import ChartLineDots from "./components/ChartLineDots"
import Pagination from "@/components/Pagination"
import LatestDataCardsContainer from "@/components/LatestDataCardsContainer/LatestDataCardsContainer"
import mockParametros from "./dadosMockados"
import GeneralFilter from "./components/GeneralFilter";

const ITEMS_PER_PAGE = 2

const Dashboard = () => {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  // Verifica se o usuário está logado
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token')
      if (!token) {
        router.push('/login')
      } else {
        setIsAuthenticated(true)
      }
      setIsLoading(false)
    }
  }, [router])

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

  // Mostra loading enquanto verifica autenticação
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-gray-600">Carregando...</p>
      </div>
    )
  }

  // Não renderiza nada se não autenticado (redirect já foi feito)
  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Título da página */}
      <h1>Dashboard</h1>

      <GeneralFilter />

      {/* Cards de últimos dados enviados */}
      <LatestDataCardsContainer />

      {/* Título da seção de gráficos */}
      <h2 className="font-londrina text-2xl md:text-[35px] leading-tight text-[#00312D] mt-4">
        Variação dos parâmetros
      </h2>

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