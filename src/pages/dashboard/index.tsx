import { useMemo, useState, useEffect } from "react"
import { useRouter } from "next/router"
import Image from 'next/image'
import ChartLineDots from "../../components/PagesSpecifics/Dashboard/ChartLineDots"
import Pagination from "@/components/Pagination"
import LatestDataCardsContainer from "@/components/LatestDataCardsContainer/LatestDataCardsContainer"
import GeneralFilter from "../../components/PagesSpecifics/Dashboard/GeneralFilter";
import { DateRange } from "react-day-picker";

import { ParametroGrafico } from "@/interfaces/ParametroGrafico";
import { ParametroUltimoValor } from "@/interfaces/ParametroUltimoValor";
import { dashboardServices } from "@/services/dashboardServices";
import { toast } from "react-toastify";
import DateInput from "@/components/Inputs/DateInput/DateInput";
import { Label } from "@/components/ui/label";
import { isSameDay } from "date-fns";

import ReportTable from "../../components/PagesSpecifics/Dashboard/ReportTable"

const ITEMS_PER_PAGE = 2


const Dashboard = () => {
  
  
  const [chartData, setChartData] = useState<ParametroGrafico[] | null>(null);
  const [cardsData, setCardsData] = useState<ParametroUltimoValor[] | null>(null);

  const [datesWithData, setDatesWithData] = useState<Date[]>([]);

  const [isLoading, setIsLoading] = useState(true);

  // Filtros gerais
  const [cidade, setCidade] = useState<string>("");
  const [estacoes, setEstacoes] = useState<string[]>([]);
  const [parametros, setParametros] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<DateRange>({
      from: new Date(),
      to: new Date()
  } as DateRange);

  // Antes havia verificação de autenticação aqui; dashboard agora é público

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

  const handleSearchAvailableDays = async (firstDate: Date, endDate?: Date) => {
    console.log("Buscando dias disponíveis para o mês:", firstDate);
    try {
      let monthFirstDay: Date;
      let monthLastDay: Date;

      if(endDate && firstDate.getMonth() !== endDate.getMonth()){
        monthFirstDay = firstDate;
        monthLastDay = endDate;
      }else{
        monthFirstDay = new Date(firstDate.getFullYear(), firstDate.getMonth(), 1);
        monthLastDay = new Date(firstDate.getFullYear(), firstDate.getMonth() + 1, 0);
      }
      
      const chartData = await dashboardServices.getValoresCapturadosPorParametro(
          cidade ? parseInt(cidade) : 1,
          estacoes.map(e => parseInt(e)),
          parametros.map(p => parseInt(p)),
          dateRange.from ?  new Date(monthFirstDay.setHours(0, 0, 0, 0)) : new Date(),
          dateRange.to ? new Date(monthLastDay.setHours(23, 59, 59, 999)) : new Date()
      );

      const uniqueStrDates = new Set((chartData as ParametroGrafico[]).map(item => item.dados.map(d => new Date(d.datetime).toDateString())).flat());
      const uniqueDates = Array.from(uniqueStrDates);
      setDatesWithData(uniqueDates.map(dateStr => new Date(dateStr)));
    } catch (error) {
      console.error("Erro ao buscar dias disponíveis", error);
    }
  }

  useEffect(() => {
    console.log("Datas com dados disponíveis:", datesWithData);
  }, [datesWithData]);

    useEffect(() => {
        let isMounted = true;
        const load = async () => {
            try {
                await handleApplyFilters();
                await handleSearchAvailableDays(dateRange.from || new Date(), dateRange.to || undefined);
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
  // total pages based on backend chartData
  const totalPages = useMemo(() => {
    if (!chartData || chartData.length === 0) return 0
    return Math.ceil(chartData.length / ITEMS_PER_PAGE)
  }, [chartData])

  // Cria um subconjunto (slice) dos itens da página atual a partir de chartData
  const pageItems = useMemo(() => {
    if (!chartData) return []
    const start = (currentPage - 1) * ITEMS_PER_PAGE
    const end = start + ITEMS_PER_PAGE
    return chartData.slice(start, end)
  }, [currentPage, chartData])

  // Quando chartData muda, volta para página 1
  useEffect(() => {
    setCurrentPage(1)
  }, [chartData])

  // Função que atualiza a página
  const handlePageChange = (page: number) => {
    const clamped = Math.max(1, Math.min(totalPages, page))
    setCurrentPage(clamped)
  }

  // Mostra loading enquanto carrega os dados iniciais
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-gray-600">Carregando...</p>
      </div>
    )
  }
  

  const isDayDisabled = (day: Date) => {
    return !datesWithData.some(enabledDay => 
      isSameDay(day, enabledDay)
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Título da página */}
      <h1>Dashboard</h1>

  {/* Cards de últimos dados enviados (dados vindos do backend via cardsData) 
      Pass selectedStationPk only when a single station is selected in the global filters
      so the container can show title/cards only in that case and compute updatedAt from chartData. */}
      <div className="relative flex flex-col md:flex-row md:items-start gap-4 ">
        <div className="flex-1">
          {estacoes.length === 1 ? (
            <LatestDataCardsContainer
              cardsData={cardsData}
              selectedStationPk={estacoes[0]}
              selectedStations={estacoes}
              chartData={chartData}
            />
          ) : (
            null
          )}
        </div>

        <div className="static right-4 md:absolute md:-top-2 md:ml-4 w-auto z-30 ">
          <GeneralFilter 
              cidade={cidade}
              setCidade={setCidade}
              estacoes={estacoes}
              setEstacoes={setEstacoes}
              parametros={parametros}
              setParametros={setParametros}
              setDateRange={setDateRange}
          />
        </div>
      </div>

      {chartData && chartData.length > 0 ? (
        <>
          {/* Título da seção de gráficos */}
          <div className="mt-15 mb-2 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <h2 className="font-londrina text-2xl md:text-[35px] leading-tight text-[#00312D]">Variação dos parâmetros</h2>
            <div className="flex items-start md:items-center gap-2">
              <div className="flex flex-col gap-2">
                <Label htmlFor="data-input" className="text-sm">Data Período</Label>
                <DateInput
                  mode="range"
                  date={dateRange}
                  setDate={setDateRange}
                  disabledDates={isDayDisabled}
                  onMonthChange={handleSearchAvailableDays}
                />
              </div>
            </div>
          </div>

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
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 px-4">
          <div className="flex flex-col gap-3 justify-center items-center">
            <Image
              src="/sem-dados.svg"    
              alt="Imagem sem dados"               
              width={400}                         
              height={300}   
              style={{margin: "0 auto"}}                      
            />
            <span className="font-londrina text-2xl text-center text-gray-600">
              Oops! Parece que não tem dados aqui!
            </span>
            <p className="text-gray-500 text-center max-w-md">
              Selecione o filtro para exibir os dados.
            </p>
          </div>
        </div>
      )}


      {/* Card de Relatorio */}
      <ReportTable relatParam={{}} estacoes={estacoes} parametros={parametros} cidade={cidade}/>
      {/* Se for pra ter uma estação e parametro em específico, basta mandar seus valores aqui */}
      {/* Caso contrário, 0 para ambos (ou sem o campo 'relatParam') irá retornar todos os valores */}
    </div>
  )
}

export default Dashboard