import { useState } from 'react';
import { Estacao } from '@/interfaces/Estacoes';
import { Search, Plus, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import EstacaoSidebar from '@/components/EstacaoSidebar';
import { useEstacoes } from '@/hooks/useEstacoes';

// Dados mockados para paginação (será substituído pela API)
const paginacaoMockada = {
  paginaAtual: 1,
  totalPaginas: 8,
  totalItens: 64
};

export default function Estacoes() {
  const { estacoes, loading, error, createEstacao, updateEstacao, deleteEstacao } = useEstacoes();
  const [paginacao] = useState(paginacaoMockada);
  const [termoBusca, setTermoBusca] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarMode, setSidebarMode] = useState<'create' | 'edit'>('create');
  const [selecionada, setSelecionada] = useState<Estacao | null>(null);
  const [userRole, setUserRole] = useState<'admin' | 'user'>('admin'); // Simula o papel do usuário

  const handleNovaEstacao = () => {
    setSelecionada(null);
    setSidebarMode('create');
    setSidebarOpen(true);
  };

  const handleAbrirDetalhes = (estacaoPk: number) => {
    const est = estacoes.find((e) => e.pk === estacaoPk) || null;
    setSelecionada(est);
    setSidebarMode('edit'); // Para admin, ver é editar. Para user, será read-only.
    setSidebarOpen(true);
  };

  const handleMudarPagina = (novaPagina: number) => {
    // TODO: Implementar lógica de mudança de página
    console.log('Mudar para página:', novaPagina);
  };

  const handleSalvarEstacao = async (dados: Omit<Estacao, 'pk'>) => {
    try {
      if (sidebarMode === 'create') {
        await createEstacao(dados);
      } else if (selecionada && selecionada.pk && selecionada.pk > 0) {
        await updateEstacao(selecionada.pk, { ...dados, pk: selecionada.pk });
      }
      setSidebarOpen(false);
    } catch (error) {
      console.error('Erro ao salvar estação:', error);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <div className="flex items-center">
              <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white font-bold text-xl">A</span>
              </div>
              <span className="text-2xl font-bold text-green-600">Atmos</span>
            </div>

            {/* Navegação */}
            <nav className="hidden md:flex space-x-8">
              <a href="#" className="text-green-600 font-medium">Início</a>
              <a href="#" className="text-gray-600 hover:text-green-600 transition-colors">Guia Educativo</a>
              <a href="#" className="text-gray-600 hover:text-green-600 transition-colors">Dashboard</a>
              <a href="#" className="text-gray-600 hover:text-green-600 transition-colors">Estações</a>
              <a href="#" className="text-gray-600 hover:text-green-600 transition-colors">Alertas</a>
            </nav>

            {/* Controles de Simulação e Login */}
            <div className="flex items-center gap-4">
              <div className='text-center'>
                <span className="text-xs font-medium text-gray-500">
                  Simulando como:
                </span>
                <p className='font-semibold text-gray-800'>{userRole === 'admin' ? 'Administrador' : 'Usuário'}</p>
              </div>
              <button
                onClick={() => setUserRole(current => current === 'admin' ? 'user' : 'admin')}
                className="bg-gray-200 text-gray-800 px-3 py-2 rounded-lg text-sm hover:bg-gray-300 transition-colors"
              >
                Trocar Papel
              </button>
              <button className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors">
                Login
              </button>
            </div>
          </div>

          {/* Barra de busca */}
          <div className="pb-4">
            <div className="relative max-w-md ml-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar..."
                value={termoBusca}
                onChange={(e) => setTermoBusca(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Conteúdo principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Título */}
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Estações</h1>

        {/* Loading e Error States */}
        {loading && (
          <div className="flex justify-center items-center py-8">
            <div className="text-gray-600">Carregando estações...</div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="text-red-800">Erro ao carregar estações: {error}</div>
          </div>
        )}

        {/* Grid de estações */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Card para nova estação (somente admin) */}
          {userRole === 'admin' && (
            <div
              className="bg-white border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center min-h-[300px] hover:border-green-500 hover:bg-green-50 transition-colors cursor-pointer"
              onClick={handleNovaEstacao}
            >
              <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                <Plus className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Nova Estação</h3>
              <p className="text-gray-500 text-center">Clique para adicionar uma nova estação de monitoramento</p>
            </div>
          )}

          {/* Cards das estações existentes */}
          {estacoes.map((estacao, index) => (
            <div key={index} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
              {/* Imagem da estação */}
              <div className="relative h-48 bg-gray-100">
                {estacao.imagemBase64 ? (
                  <img
                    src={estacao.imagemBase64}
                    alt={estacao.nome}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100">
                    <span className="text-gray-400 font-medium">SEM IMAGEM</span>
                  </div>
                )}
              </div>

              {/* Conteúdo do card */}
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{estacao.nome}</h3>
                <p className="text-sm text-gray-600 mb-2">UUID: {estacao.uuid}</p>
                <p className="text-sm text-gray-600 mb-2">Status: {estacao.status ? 'Ativo' : 'Inativo'}</p>
                <p className="text-sm text-gray-600 mb-3">{estacao.endereco}</p>
                {estacao.parametros && estacao.parametros.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-500 mb-1">Parâmetros:</p>
                    <p className="text-sm text-gray-700">{estacao.parametros.join(', ')}</p>
                  </div>
                )}

                <button
                  onClick={() => handleAbrirDetalhes(estacao.pk)}
                  className="flex items-center text-green-600 hover:text-green-700 text-sm font-medium"
                >
                  {userRole === 'admin' ? 'Ver detalhes' : 'Ver detalhes'}
                  <ArrowRight className="w-4 h-4 ml-1" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Paginação */}
        <div className="flex justify-center items-center space-x-2">
          <button
            onClick={() => handleMudarPagina(paginacao.paginaAtual - 1)}
            disabled={paginacao.paginaAtual === 1}
            className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {Array.from({ length: paginacao.totalPaginas }, (_, i) => i + 1).map((pagina) => (
            <button
              key={pagina}
              onClick={() => handleMudarPagina(pagina)}
              className={`w-10 h-10 rounded-lg font-medium transition-colors ${pagina === paginacao.paginaAtual
                  ? 'bg-green-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
                }`}
            >
              {pagina}
            </button>
          ))}

          <button
            onClick={() => handleMudarPagina(paginacao.paginaAtual + 1)}
            disabled={paginacao.paginaAtual === paginacao.totalPaginas}
            className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </main>
      <EstacaoSidebar
        open={sidebarOpen}
        onOpenChange={setSidebarOpen}
        estacao={selecionada}
        mode={sidebarMode} 
        userRole={userRole} // Passa o papel do usuário para o sidebar
        onSave={handleSalvarEstacao}
      />
    </div>
  );
}