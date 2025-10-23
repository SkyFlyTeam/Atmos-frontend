import { useMemo, useState, useEffect } from "react"
import { useRouter } from "next/router"
import ChartLineDots from "./components/ChartLineDots"
import Pagination from "@/components/Pagination"
import LatestDataCardsContainer from "@/components/LatestDataCardsContainer/LatestDataCardsContainer"
import mockParametros from "./dadosMockados"
import GeneralFilter from "./components/GeneralFilter";
import { DateRange } from "react-day-picker";

import { ParametroGrafico } from "@/interfaces/ParametroGrafico";
import { ParametroUltimoValor } from "@/interfaces/ParametroUltimoValor";
import { dashboardServices } from "@/services/dashboardServices";
import { toast } from "react-toastify";
import DateInput from "@/components/Inputs/DateInput/DateInput";
import { Label } from "@/components/ui/label";
import ReportTable from "./components/ReportTable"

const ITEMS_PER_PAGE = 2


const Dashboard = () => {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  
  const [chartData, setChartData] = useState<ParametroGrafico[] | null>(null);
  const [cardsData, setCardsData] = useState<ParametroUltimoValor[] | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  // Filtros gerais
  const [cidade, setCidade] = useState<string>("");
  const [estacoes, setEstacoes] = useState<string[]>([]);
  const [parametros, setParametros] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<DateRange>({
      from: new Date(),
      to: new Date()
  } as DateRange);

  // Verifica se o usuário está logado
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token')
      if (!token) {
        router.push('/login')
      } else {
        setIsAuthenticated(true)
      }
    }
  }, [])

  const fetchChartData = async () => {
    try {
        const chartData = await dashboardServices.getValoresCapturadosPorParametro(
            cidade ? parseInt(cidade) : 1,
            estacoes.map(e => parseInt(e)),
            parametros.map(p => parseInt(p)),
            dateRange.from ?  new Date(new Date(dateRange.from).setHours(0, 0, 0, 0)) : new Date(),
            dateRange.to ? new Date(new Date(dateRange.to).setHours(23, 59, 59, 999)) : new Date()
        );
        
        setChartData(chartData as ParametroGrafico[]);
    } catch (error) {
        toast.error("Nenhum dado encontrado para os filtros selecionados. Tente ajustar os filtros.");
        console.error("Erro ao buscar dados do gráfico", error);
    } 
  }

  const fetchCardsData = async () => {
      try {
          const cardsData = await dashboardServices.getUltimosValoresCapturadosPorParametro({
              cidade: cidade ? parseInt(cidade) : 1,
              estacoes: estacoes.map(e => parseInt(e)),
              parametros: parametros.map(p => parseInt(p))
          });

          setCardsData(cardsData as ParametroUltimoValor[]);
          if((cardsData as ParametroUltimoValor[]).length === 0) {
              toast.warning("Nenhum dado encontrado para os filtros selecionados");
          }
      } catch (error) {
          toast.error("Nenhum dado encontrado para os filtros selecionados. Tente ajustar os filtros.");
          console.error("Erro ao buscar dados dos cards", error);
      }
  }

    const handleApplyFilters = async () => {
        if(!cidade && estacoes.length === 0 && parametros.length === 0 && !dateRange.from && !dateRange.to) {
            toast.warning("Por favor, selecione ao menos um filtro para aplicar.");
            return;
        }
        await Promise.all([
            fetchChartData(),
            fetchCardsData()
        ]);
    }

    useEffect(() => {
        let isMounted = true;
        const load = async () => {
            try {
                await handleApplyFilters();
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };
        load();
    }, [cidade, estacoes, parametros, dateRange]);

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

      <GeneralFilter 
          cidade={cidade}
          setCidade={setCidade}
          estacoes={estacoes}
          setEstacoes={setEstacoes}
          parametros={parametros}
          setParametros={setParametros}
      />
      <div className="flex flex-col gap-2">
          <Label htmlFor="data-input">Data Período</Label>
          <DateInput
              mode="range"
              date={dateRange}
              setDate={setDateRange}
              disabledDates={{ after: new Date() }}
          />
      </div>

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


      {/* Card de Relatorio */}
      <ReportTable />
    </div>
  )
}

export default Dashboard