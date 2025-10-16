import { useState, useMemo, useEffect } from 'react';
import { Estacao } from '@/interfaces/Estacoes';
import { Search, Plus, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import EstacaoSidebar from '@/components/EstacaoSidebar/EstacaoSidebar';
import { useEstacoes } from '@/hooks/useEstacoes';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';
import Image from 'next/image';
import { loginServices } from '@/services/loginServices';


export default function Estacoes() {
  const { estacoes, loading, error, createEstacao, updateEstacao, deleteEstacao } = useEstacoes();
  const [termoBusca, setTermoBusca] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarMode, setSidebarMode] = useState<'create' | 'edit'>('create');
  const [selecionada, setSelecionada] = useState<Estacao | null>(null);
  const [userRole, setUserRole] = useState<'admin' | 'user'>('user');
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize] = useState(8);
  // const [authRole, setAuthRole] = useState<'admin' | 'user'>('user'); // apagar depois
  // const [roleOverride, setRoleOverride] = useState<'admin' | 'user' | null>(null); //apagar depois
  // const userRole = roleOverride ?? authRole;

  useEffect(() => {
    const verifyAuth = async () => {
      let done = false;
      try {
        const auth = await loginServices.getAuth();
        done = auth;
      }
      catch (error) { }
      finally {
        if (done) {
          setUserRole('admin')
        }
        else {
          setUserRole('user')
        }
      }
    }
    verifyAuth();
  }, [])

  // useEffect(() => {
  //   const verifyAuth = async () => {
  //     try {
  //       const ok = await loginServices.getAuth();
  //       setAuthRole(ok ? 'admin' : 'user');
  //     } catch {
  //       setAuthRole('user');
  //     }
  //   };
  //   verifyAuth();
  // }, []);


  // Filtrar estações baseado na busca
  const estacoesFilteredBySearch = useMemo(() => {
    const searchTerm = termoBusca.toLowerCase().trim();
    if (!searchTerm) return estacoes;

    return estacoes.filter((estacao) => {
      // Campos principais para busca
      const mainFields = [
        estacao.nome,
        estacao.uuid,
        estacao.descricao,
        estacao.endereco,
      ].filter(Boolean);

      // Campos adicionais específicos
      const statusText = estacao.status ? "ativa" : "inativa";
      const parametrosText = estacao.parametros?.join(" ");

      // Combinar todos os campos de busca
      const searchableText = [
        ...mainFields,
        statusText,
        parametrosText
      ].filter(Boolean).join(" ").toLowerCase();

      return searchableText.includes(searchTerm);
    });
  }, [estacoes, termoBusca]);

  // Cálculo de paginação
  const pageCount = Math.max(1, Math.ceil(estacoesFilteredBySearch.length / pageSize));
  const startIndex = pageIndex * pageSize;
  const currentItems = estacoesFilteredBySearch.slice(startIndex, startIndex + pageSize);

  const handleNovaEstacao = () => {
    setSelecionada(null);
    setSidebarMode('create');
    setSidebarOpen(true);
  };

  const handleAbrirDetalhes = (estacaoPk: number | undefined) => {
    if (!estacaoPk) return;
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
    //apagar depois o simulador de user/admin
    <>
      {/* {process.env.NODE_ENV !== 'production' && (
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">Simulando como:</span>
          <strong className="text-gray-800">{userRole}</strong>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setRoleOverride((prev) => prev === 'admin' ? 'user' : 'admin')}
            title="Alterna entre admin/user sem depender da autenticação"
          >
            {roleOverride === 'admin' ? 'Simular USER' : 'Simular ADMIN'}
          </Button>
          {roleOverride && (
            <button
              className="text-xs underline text-gray-500"
              onClick={() => setRoleOverride(null)}
              title="Voltar a usar o papel real da autenticação"
            >
              limpar simulação
            </button>
          )}
        </div>
      )} */}


      <div className="flex justify-between items-center py-4"> 
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold text-gray-900">Estações</h1>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative">
            <Input
              type="text"
              placeholder="Buscar estação..."
              value={termoBusca}
              onChange={(e) => {
                setTermoBusca(e.target.value);
                setPageIndex(0); // Reset para primeira página ao buscar
              }}
              className="w-64 bg-white-pure"
            />
          </div>
        </div>
      </div>

      {/* Loading e Error States */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="h-48 w-full">
                <Skeleton className="h-full w-full" />
              </div>
              <div className="p-4 py-8">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-2" />
                <Skeleton className="h-4 w-2/3 mb-2" />
                <Skeleton className="h-4 w-3/4 mb-2 " />
                <Skeleton className="h-4 w-1/2 mb-2" />
              </div>
            </div>
          ))}
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="text-red-800">Erro ao carregar estações: {error}</div>
        </div>
      )}

      {/* Grid de estações */}
      {currentItems.length > 0 ? (
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
          {currentItems.map((estacao, index) => (
            <Card key={estacao.pk} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
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
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{estacao.nome}</h3>
                  {userRole === 'admin' && (
                    <span
                      className={`inline-block w-2 h-2 rounded-full ${estacao.status ? 'bg-green-500' : 'bg-gray-400'
                        }`}
                      title={estacao.status ? 'Ativo' : 'Inativo'}
                    />
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-2">UUID: {estacao.uuid}</p>
                <p className="text-sm text-gray-600 mb-3">{estacao.endereco}</p>

                {estacao.parametros && estacao.parametros.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-500 mb-1">Parâmetros:</p>
                    <p className="text-sm text-gray-700">{estacao.parametros.join(', ')}</p>
                  </div>
                )}

                <button
                  onClick={() => handleAbrirDetalhes(estacao.pk)}
                  className="flex items-center text-green-600 hover:text-green-700 text-sm font-medium cursor-pointer"
                >
                  {userRole === 'admin' ? 'Ver detalhes' : 'Ver detalhes'}
                  <ArrowRight className="w-4 h-4 ml-1" />
                </button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        termoBusca ? (
          <div className="flex flex-col gap-3 justify-center items-center h-[32rem]">
            <Image
              src="/sem-dados.svg"
              alt="Imagem sem dados"
              width={400}
              height={300}
            />
            <span style={{ fontFamily: "Londrina Solid" }} className="text-2xl">Oops! Parece que não tem dados aqui!</span>
          </div>
        ) : (
          userRole === 'admin' ? (
            <div
              className="bg-white border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center w-72 min-h-[300px] hover:border-green-500 hover:bg-green-50 transition-colors cursor-pointer"
              onClick={handleNovaEstacao}
            >
              <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                <Plus className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Nova Estação</h3>
              <p className="text-gray-500 text-center">Clique para adicionar uma nova estação de monitoramento</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3 justify-center items-center h-[32rem]">
              <Image
                src="/sem-dados.svg"
                alt="Imagem sem dados"
                width={400}
                height={300}
              />
              <span style={{ fontFamily: "Londrina Solid" }} className="text-2xl">Oops! Parece que não tem dados aqui!</span>
            </div>
          )
        )
      )}


      {/* Paginação */}
      {!loading && estacoesFilteredBySearch.length > 0 && (
        <div className="mt-6 flex justify-center">
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPageIndex(pageIndex - 1)}
              disabled={pageIndex === 0}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            {Array.from({ length: pageCount }).map((_, i) => (
              <Button
                key={i}
                variant={pageIndex === i ? "default" : "outline"}
                size="sm"
                onClick={() => setPageIndex(i)}
              >
                {i + 1}
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPageIndex(pageIndex + 1)}
              disabled={pageIndex === pageCount - 1}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      <EstacaoSidebar
        open={sidebarOpen}
        onOpenChange={setSidebarOpen}
        estacao={selecionada}
        mode={sidebarMode}
        userRole={userRole} // Passa o papel do usuário para o sidebar
        onSave={handleSalvarEstacao}
      />
    </>
  );
}