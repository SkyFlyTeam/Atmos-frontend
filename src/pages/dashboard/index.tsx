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
    ],
    dados: [
      // 🌅 Estação Aurora
      { datetime: "2025-10-15 13:05", "Estação Aurora": 21.1 },
      { datetime: "2025-10-15 13:20", "Estação Aurora": 21.5 },
      { datetime: "2025-10-15 13:35", "Estação Aurora": 21.9 },
      { datetime: "2025-10-15 13:50", "Estação Aurora": 22.2 },

      { datetime: "2025-10-15 14:10", "Estação Aurora": 22.5 },
      { datetime: "2025-10-15 14:25", "Estação Aurora": 22.8 },
      { datetime: "2025-10-15 14:40", "Estação Aurora": 23.1 },
      { datetime: "2025-10-15 14:55", "Estação Aurora": 23.3 },

      { datetime: "2025-10-15 15:05", "Estação Aurora": 23.6 },
      { datetime: "2025-10-15 15:20", "Estação Aurora": 23.9 },
      { datetime: "2025-10-15 15:35", "Estação Aurora": 24.1 },
      { datetime: "2025-10-15 15:50", "Estação Aurora": 24.3 },

      { datetime: "2025-10-15 16:10", "Estação Aurora": 24.1 },
      { datetime: "2025-10-15 16:25", "Estação Aurora": 23.8 },
      { datetime: "2025-10-15 16:40", "Estação Aurora": 23.4 },
      { datetime: "2025-10-15 16:55", "Estação Aurora": 23.0 },

      { datetime: "2025-10-15 17:05", "Estação Aurora": 22.7 },
      { datetime: "2025-10-15 17:20", "Estação Aurora": 22.3 },
      { datetime: "2025-10-15 17:35", "Estação Aurora": 21.9 },
      { datetime: "2025-10-15 17:50", "Estação Aurora": 21.6 },

      // 🌄 Estação Boreal
      { datetime: "2025-10-15 13:08", "Estação Boreal": 20.3 },
      { datetime: "2025-10-15 13:22", "Estação Boreal": 20.6 },
      { datetime: "2025-10-15 13:38", "Estação Boreal": 20.9 },
      { datetime: "2025-10-15 13:53", "Estação Boreal": 21.1 },

      { datetime: "2025-10-15 14:05", "Estação Boreal": 21.4 },
      { datetime: "2025-10-15 14:20", "Estação Boreal": 21.7 },
      { datetime: "2025-10-15 14:35", "Estação Boreal": 22.0 },
      { datetime: "2025-10-15 14:50", "Estação Boreal": 22.3 },

      { datetime: "2025-10-15 15:05", "Estação Boreal": 22.7 },
      { datetime: "2025-10-15 15:20", "Estação Boreal": 23.0 },
      { datetime: "2025-10-15 15:35", "Estação Boreal": 23.3 },
      { datetime: "2025-10-15 15:50", "Estação Boreal": 23.5 },

      { datetime: "2025-10-15 16:05", "Estação Boreal": 23.4 },
      { datetime: "2025-10-15 16:20", "Estação Boreal": 23.1 },
      { datetime: "2025-10-15 16:35", "Estação Boreal": 22.8 },
      { datetime: "2025-10-15 16:50", "Estação Boreal": 22.4 },

      { datetime: "2025-10-15 17:05", "Estação Boreal": 22.0 },
      { datetime: "2025-10-15 17:20", "Estação Boreal": 21.6 },
      { datetime: "2025-10-15 17:35", "Estação Boreal": 21.2 },
      { datetime: "2025-10-15 17:50", "Estação Boreal": 20.9 },

      // 🪨 Estação Cobalto
      { datetime: "2025-10-15 13:10", "Estação Cobalto": 22.1 },
      { datetime: "2025-10-15 13:25", "Estação Cobalto": 22.4 },
      { datetime: "2025-10-15 13:40", "Estação Cobalto": 22.7 },
      { datetime: "2025-10-15 13:55", "Estação Cobalto": 22.9 },

      { datetime: "2025-10-15 14:10", "Estação Cobalto": 23.3 },
      { datetime: "2025-10-15 14:25", "Estação Cobalto": 23.6 },
      { datetime: "2025-10-15 14:40", "Estação Cobalto": 23.8 },
      { datetime: "2025-10-15 14:55", "Estação Cobalto": 24.0 },

      { datetime: "2025-10-15 15:10", "Estação Cobalto": 24.3 },
      { datetime: "2025-10-15 15:25", "Estação Cobalto": 24.6 },
      { datetime: "2025-10-15 15:40", "Estação Cobalto": 24.8 },
      { datetime: "2025-10-15 15:55", "Estação Cobalto": 25.0 },

      { datetime: "2025-10-15 16:10", "Estação Cobalto": 24.7 },
      { datetime: "2025-10-15 16:25", "Estação Cobalto": 24.3 },
      { datetime: "2025-10-15 16:40", "Estação Cobalto": 23.9 },
      { datetime: "2025-10-15 16:55", "Estação Cobalto": 23.5 },

      { datetime: "2025-10-15 17:10", "Estação Cobalto": 23.1 },
      { datetime: "2025-10-15 17:25", "Estação Cobalto": 22.8 },
      { datetime: "2025-10-15 17:40", "Estação Cobalto": 22.5 },
      { datetime: "2025-10-15 17:55", "Estação Cobalto": 22.2 },

      // 🌵 Estação Duna
      { datetime: "2025-10-15 13:02", "Estação Duna": 19.8 },
      { datetime: "2025-10-15 13:17", "Estação Duna": 20.1 },
      { datetime: "2025-10-15 13:32", "Estação Duna": 20.3 },
      { datetime: "2025-10-15 13:47", "Estação Duna": 20.5 },

      { datetime: "2025-10-15 14:05", "Estação Duna": 20.8 },
      { datetime: "2025-10-15 14:20", "Estação Duna": 21.0 },
      { datetime: "2025-10-15 14:35", "Estação Duna": 21.3 },
      { datetime: "2025-10-15 14:50", "Estação Duna": 21.5 },

      { datetime: "2025-10-15 15:10", "Estação Duna": 21.8 },
      { datetime: "2025-10-15 15:25", "Estação Duna": 22.0 },
      { datetime: "2025-10-15 15:40", "Estação Duna": 22.3 },
      { datetime: "2025-10-15 15:55", "Estação Duna": 22.4 },

      { datetime: "2025-10-15 16:10", "Estação Duna": 22.3 },
      { datetime: "2025-10-15 16:25", "Estação Duna": 22.0 },
      { datetime: "2025-10-15 16:40", "Estação Duna": 21.8 },
      { datetime: "2025-10-15 16:55", "Estação Duna": 21.4 },

      { datetime: "2025-10-15 17:05", "Estação Duna": 21.1 },
      { datetime: "2025-10-15 17:20", "Estação Duna": 20.9 },
      { datetime: "2025-10-15 17:35", "Estação Duna": 20.6 },
      { datetime: "2025-10-15 17:50", "Estação Duna": 20.3 },

      // ⚡ Estação Éter
      { datetime: "2025-10-15 13:06", "Estação Éter": 21.0 },
      { datetime: "2025-10-15 13:21", "Estação Éter": 21.3 },
      { datetime: "2025-10-15 13:36", "Estação Éter": 21.6 },
      { datetime: "2025-10-15 13:51", "Estação Éter": 21.9 },

      { datetime: "2025-10-15 14:08", "Estação Éter": 22.3 },
      { datetime: "2025-10-15 14:23", "Estação Éter": 22.7 },
      { datetime: "2025-10-15 14:38", "Estação Éter": 23.1 },
      { datetime: "2025-10-15 14:53", "Estação Éter": 23.5 },

      { datetime: "2025-10-15 15:08", "Estação Éter": 23.8 },
      { datetime: "2025-10-15 15:23", "Estação Éter": 24.1 },
      { datetime: "2025-10-15 15:38", "Estação Éter": 24.3 },
      { datetime: "2025-10-15 15:53", "Estação Éter": 24.2 },

      { datetime: "2025-10-15 16:10", "Estação Éter": 24.0 },
      { datetime: "2025-10-15 16:25", "Estação Éter": 23.7 },
      { datetime: "2025-10-15 16:40", "Estação Éter": 23.4 },
      { datetime: "2025-10-15 16:55", "Estação Éter": 23.0 },

      { datetime: "2025-10-15 17:05", "Estação Éter": 22.6 },
      { datetime: "2025-10-15 17:20", "Estação Éter": 22.3 },
      { datetime: "2025-10-15 17:35", "Estação Éter": 21.9 },
      { datetime: "2025-10-15 17:50", "Estação Éter": 21.5 },

      // 🔥 Estação Fênix
      { datetime: "2025-10-15 13:03", "Estação Fênix": 22.0 },
      { datetime: "2025-10-15 13:18", "Estação Fênix": 22.4 },
      { datetime: "2025-10-15 13:33", "Estação Fênix": 22.7 },
      { datetime: "2025-10-15 13:48", "Estação Fênix": 23.0 },

      { datetime: "2025-10-15 14:10", "Estação Fênix": 23.4 },
      { datetime: "2025-10-15 14:25", "Estação Fênix": 23.7 },
      { datetime: "2025-10-15 14:40", "Estação Fênix": 24.0 },
      { datetime: "2025-10-15 14:55", "Estação Fênix": 24.3 },

      { datetime: "2025-10-15 15:05", "Estação Fênix": 24.5 },
      { datetime: "2025-10-15 15:20", "Estação Fênix": 24.7 },
      { datetime: "2025-10-15 15:35", "Estação Fênix": 24.9 },
      { datetime: "2025-10-15 15:50", "Estação Fênix": 25.0 },

      { datetime: "2025-10-15 16:10", "Estação Fênix": 24.7 },
      { datetime: "2025-10-15 16:25", "Estação Fênix": 24.4 },
      { datetime: "2025-10-15 16:40", "Estação Fênix": 24.0 },
      { datetime: "2025-10-15 16:55", "Estação Fênix": 23.7 },

      { datetime: "2025-10-15 17:05", "Estação Fênix": 23.3 },
      { datetime: "2025-10-15 17:20", "Estação Fênix": 22.9 },
      { datetime: "2025-10-15 17:35", "Estação Fênix": 22.5 },
      { datetime: "2025-10-15 17:50", "Estação Fênix": 22.2 },

      // ❄️ Estação Gelo
      { datetime: "2025-10-15 13:07", "Estação Gelo": 18.3 },
      { datetime: "2025-10-15 13:22", "Estação Gelo": 18.5 },
      { datetime: "2025-10-15 13:37", "Estação Gelo": 18.8 },
      { datetime: "2025-10-15 13:52", "Estação Gelo": 19.0 },

      { datetime: "2025-10-15 14:08", "Estação Gelo": 19.3 },
      { datetime: "2025-10-15 14:23", "Estação Gelo": 19.6 },
      { datetime: "2025-10-15 14:38", "Estação Gelo": 19.8 },
      { datetime: "2025-10-15 14:53", "Estação Gelo": 20.0 },

      { datetime: "2025-10-15 15:08", "Estação Gelo": 20.2 },
      { datetime: "2025-10-15 15:23", "Estação Gelo": 20.4 },
      { datetime: "2025-10-15 15:38", "Estação Gelo": 20.6 },
      { datetime: "2025-10-15 15:53", "Estação Gelo": 20.8 },

      { datetime: "2025-10-15 16:08", "Estação Gelo": 20.6 },
      { datetime: "2025-10-15 16:23", "Estação Gelo": 20.3 },
      { datetime: "2025-10-15 16:38", "Estação Gelo": 20.0 },
      { datetime: "2025-10-15 16:53", "Estação Gelo": 19.6 },

      { datetime: "2025-10-15 17:05", "Estação Gelo": 19.3 },
      { datetime: "2025-10-15 17:20", "Estação Gelo": 19.0 },
      { datetime: "2025-10-15 17:35", "Estação Gelo": 18.8 },
      { datetime: "2025-10-15 17:50", "Estação Gelo": 18.5 },
    ],
  },
];


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
