import { useEffect, useState } from "react";
import Image from "next/image";
import { toast } from "react-toastify";

import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Search as SearchIcon, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import ButtonIconRight from "@/components/Buttons/ButtonIconRight";
import { FaPlus } from "react-icons/fa";

import type { Estacao } from "@/interfaces/Estacao";
import { estacaoServices } from "@/services/estacaoServices";

export default function EstacoesPage() {
  const [allEstacoes, setAllEstacoes] = useState<Estacao[]>([]);
  const [estacoes, setEstacoes] = useState<Estacao[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize] = useState(8); // 4 colunas x 2 linhas
  const onAddStation = () => {
    // Placeholder para ação de criar estação
    // Pode ser substituído por navegação ou abertura de modal
    console.log("Adicionar nova estação");
  };

  useEffect(() => {
    const fetchAll = async () => {
      setIsLoading(true);
      const res = await estacaoServices.getAllEstacoes();
      if (res instanceof Error) {
        toast.error("Erro ao buscar estações");
        setAllEstacoes([]);
        setEstacoes([]);
      } else {
        setAllEstacoes(res);
        setEstacoes(res);
      }
      setIsLoading(false);
    };
    fetchAll();
  }, []);

  // Filtro por qualquer atributo (texto livre)
  useEffect(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      setEstacoes(allEstacoes);
      return;
    }
    const filtered = allEstacoes.filter((e) => {
      const values = [
        e.pk?.toString(),
        e.uuid,
        e.nome,
        e.descricao,
        e.link ?? undefined,
        e.status ? "ativa" : "inativa",
        e.lat ?? undefined,
        e.long ?? undefined,
        e.endereco ?? undefined,
      ].filter(Boolean) as string[];
      return values.some((v) => v.toLowerCase().includes(q));
    });
    setEstacoes(filtered);
  }, [query, allEstacoes]);

  // Reajusta pageIndex quando a lista muda
  useEffect(() => {
    const pc = Math.max(1, Math.ceil(estacoes.length / pageSize));
    if (pageIndex > pc - 1) setPageIndex(0);
  }, [estacoes, pageIndex, pageSize]);

  // Cálculo de paginação
  const pageCount = Math.max(1, Math.ceil(estacoes.length / pageSize));
  const startIdx = pageIndex * pageSize;
  const currentItems = estacoes.slice(startIdx, startIdx + pageSize);

  const pagesToShow = 4;
  const getPageNumbers = () => {
    const pages: (string | number)[] = [];
    const start = Math.max(0, pageIndex - Math.floor(pagesToShow / 2));
    const end = Math.min(pageCount - 1, start + pagesToShow - 1);
    if (start > 0) {
      pages.push(0);
      if (start > 1) pages.push("...");
    }
    for (let i = start; i <= end; i++) pages.push(i);
    if (end < pageCount - 1) {
      if (end < pageCount - 2) pages.push("...");
      pages.push(pageCount - 1);
    }
    return pages;
  };


  if (isLoading) {
    return (
      <div className="flex flex-col gap-3">
        <div className="w-full max-w-[1264px] mx-auto">
          {/* Mobile header (md and below): title + button constrained to 304px, search below aligned with cards */}
          <div className="flex flex-col gap-2 mb-2 md:hidden">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 justify-items-center">
              <div className="w-[304px] flex items-center justify-between">
                <h1>Estações</h1>
                <ButtonIconRight
                  label="Criar Estação"
                  onClick={onAddStation}
                  icon={<FaPlus className="!w-3 !h-3" />}
                  className="w-[154px] h-[47px]"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 justify-items-center">
              <div className="relative w-[304px] bg-white">
                <SearchIcon className="absolute left-2 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar"
                  aria-label="Buscar"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="pl-8 h-[45px]"
                />
              </div>
            </div>
          </div>
          {/* Desktop/Tablet header (md and up): title left, search + button on the right in the same row */}
          <div className="hidden md:flex items-center justify-between mb-2">
            <h1>Estações</h1>
            <div className="flex items-center gap-2">
              <div className="relative w-[304px] bg-white">
                <SearchIcon className="absolute left-2 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar"
                  aria-label="Buscar"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="pl-8 h-[45px]"
                />
              </div>
              <ButtonIconRight
                label="Criar Estação"
                onClick={onAddStation}
                icon={<FaPlus className="!w-3 !h-3" />}
                className="w-[154px] h-[47px]"
              />
            </div>
          </div>
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 justify-items-center mt-4">
            {Array.from({ length: pageSize }).map((_, i) => (
              <Card key={i} className="p-4 w-[304px] h-[421px] flex flex-col">
                <Skeleton className="h-6 w-1/2" />
                <div className="mt-3 w-[274px] h-[202px] bg-primary/10 rounded-md mx-auto" />
                <Skeleton className="h-4 w-2/3 mt-4" />
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="w-full max-w-[1264px] mx-auto">
        {/* Mobile header (md and below): title + button constrained to 304px, search below aligned with cards */}
        <div className="flex flex-col gap-2 mb-2 md:hidden">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 justify-items-center">
            <div className="w-[304px] flex items-center justify-between">
              <h1>Estações</h1>
              <ButtonIconRight
                label="Criar Estação"
                onClick={onAddStation}
                icon={<FaPlus className="!w-3 !h-3" />}
                className="w-[154px] h-[47px]"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 justify-items-center">
            <div className="relative w-[304px] bg-white">
              <SearchIcon className="absolute left-2 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar"
                aria-label="Buscar"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-8 h-[45px]"
              />
            </div>
          </div>
        </div>
        {/* Desktop/Tablet header (md and up): title left, search + button on the right in the same row */}
        <div className="hidden md:flex items-center justify-between mb-2">
          <h1>Estações</h1>
          <div className="flex items-center gap-2">
            <div className="relative w-[304px] bg-white">
              <SearchIcon className="absolute left-2 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar"
                aria-label="Buscar"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-8 h-[45px]"
              />
            </div>
            <ButtonIconRight
              label="Criar Estação"
              onClick={onAddStation}
              icon={<FaPlus className="!w-3 !h-3" />}
              className="w-[154px] h-[47px]"
            />
          </div>
        </div>

        {estacoes.length === 0 ? (
          <Card className="p-6 w-[304px]">
            <div className="text-muted-foreground">Nenhuma estação encontrada.</div>
          </Card>
        ) : (
          <>
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 justify-items-center mt-4">
            {currentItems.map((est, idx) => (
            <Card key={est.pk} className="p-4 w-[304px] h-[421px] flex flex-col">
              <CardContent className="p-0 pt-3 text-sm">
                {/* Área da foto 274x202 */}
                <div className="relative w-[274px] h-[202px] rounded-md overflow-hidden bg-muted mx-auto">
                  {idx === 0 && (
                    <Button
                      className="absolute top-2 right-2 w-[69px] h-[27px] !rounded-[10px] text-[10px] font-bold uppercase tracking-wide px-0 py-0"
                      onClick={(e) => e.preventDefault()}
                    >
                      Novo
                    </Button>
                  )}
                  {est.fotoUrl ? (
                    <Image
                      src={est.fotoUrl}
                      alt={`Foto da estação ${est.nome}`}
                      width={274}
                      height={202}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-primary/10" />
                  )}
                </div>

                {/* Título e status abaixo da imagem */}
                <div className="mt-3 flex items-center justify-between">
                  <CardTitle className="text-[32px] font-bold truncate flex-1 min-w-0 text-[--color-dark-cyan]" title={est.nome}>
                    {est.nome}
                  </CardTitle>
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${est.status ? "bg-[--color-green]" : "bg-[--color-gray]"}`}
                    title={est.status ? "Ativa" : "Inativa"}
                  />
                </div>

                {/* ID (UUID) abaixo do título */}
                <p className="text-[16px] text-[--color-dark-cyan] mt-1 break-all">
                  <span className="font-semibold">ID:</span> {est.uuid}
                </p>

                {est.endereco && (
                  <p className="text-[16px] text-[--color-dark-cyan] mt-2 line-clamp-2" title={est.endereco}>
                    <span className="font-semibold">Endereço:</span> {est.endereco}
                  </p>
                )}
                {/* Somente ID e Endereço neste card */}
              </CardContent>

              <CardFooter className="p-0 pt-4 mt-auto">
                {est.link ? (
                  <a
                    href={est.link}
                    target="_blank"
                    rel="noreferrer"
                    className="text-green visited:text-green hover:text-active-green hover:underline text-[16px]"
                  >
                    <span className="inline-flex items-center gap-1">
                      Definir parâmetros
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </a>
                ) : (
                  <span className="text-muted-foreground">Sem link</span>
                )}
              </CardFooter>
            </Card>
          ))}
          </div>
          <div className="w-full flex items-center justify-between flex-wrap gap-y-2 mt-4">
            <span className="text-gray">{estacoes.length} registros</span>
            <div className="flex items-center p-2 w-full md:w-fit justify-center rounded-[18px] space-x-2 bg-white shadow-[0px_4px_35px_0px_rgba(0,_0,_0,_0.12)]">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setPageIndex((p) => Math.max(0, p - 1))}
                disabled={pageIndex === 0}
                className="text-dark-green"
              >
                <ChevronLeft className="w-5 h-5" strokeWidth={3} />
              </Button>
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  {getPageNumbers().map((p, i) =>
                    p === "..." ? (
                      <span key={i} className="text-base">...</span>
                    ) : (
                      <Button
                        key={i}
                        variant="ghost"
                        size="sm"
                        onClick={() => setPageIndex(p as number)}
                        className={`text-base rounded-3xl ${pageIndex === p ? 'bg-green text-white' : ''}`}
                      >
                        {(p as number) + 1}
                      </Button>
                    )
                  )}
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setPageIndex((p) => Math.min(pageCount - 1, p + 1))}
                disabled={pageIndex >= pageCount - 1}
                className="text-dark-green hover:bg-dark-green hover:text-white"
              >
                <ChevronRight className="w-5 h-5" strokeWidth={3} />
              </Button>
            </div>
          </div>
          </>
        )}
      </div>
    </div>
  );
}
