import { DataTable } from "@/components/DataTable/Datatable";
import { Card } from "@/components/ui/card";
import { Relatorio } from "@/interfaces/Relatorio";
import { ValorCapturadoServices } from "@/services/valorCapturadoServices";
import { use, useEffect, useState } from "react";
import SkeletonTable from "@/components/DataTable/DatatableSkeleton";
import { Button } from "@/components/ui/button";
import { RelatParam } from "@/interfaces/RelatParam";
import { getMesEndDate, getMesNome, getMesNomesList } from "@/utils/datas";
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ChevronsUpDown } from "lucide-react";
import { columns } from "./columns";

interface RelatConfig {
    mesNome: string,
    mes: Number,
    ano: Number,
}

interface ReportTableProps {
    className?: string,
    relatParam?: RelatParam,
    estacoes: string[],
    parametros: string[],
    cidade: string,
}

const ReportTable: React.FC<ReportTableProps> = ({
    className = "",
    relatParam,
    estacoes,
    parametros,
    cidade
}) => {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [relatorio, setRelatorio] = useState<Relatorio[]>([]);

    const [anos, setAnos] = useState<number[]>([]);
    const [meses, setMeses] = useState<string[]>([]);

    const [localRelatorio, setLocalRelatorio] = useState<Relatorio[]>([]);

    const [relatConfig, setRelatConfig] = useState<RelatConfig>( // Usado para configurar os filtros de dados da tabela
    );
    const [localRelatParam, setLocalRelatParam] = useState<RelatParam>(   // Usado para configurar os parametros para fetch no backend 
    );



    const filterRelatorio = (param: Relatorio) => {
        if (!relatorio)
            return false;

        if (!relatConfig)
            return false;

        if (!localRelatParam)
            return param.mes == relatConfig.mes && param.ano == relatConfig.ano

        if (!(param.mes == relatConfig.mes && param.ano == relatConfig.ano))
            return false;

        if (cidade != (param.cidadePk + ""))
            return false;

        if (!estacoes.includes(param.estacao_id + "") && estacoes.length > 0)
            return false;

        if (!parametros.includes(param.Parametros_pk + "") && parametros.length > 0)
            return false;

        return true;
    }

    const changeMes = (mesNovo: number) => {
        if (!relatConfig)
            return;

        setRelatConfig({
            ...relatConfig,
            mes: mesNovo,
            mesNome: getMesNome(mesNovo)
        })
    }
    const changeAno = (anoNovo: number) => {
        if (!relatConfig)
            return;

        setRelatConfig({
            ...relatConfig,
            ano: anoNovo
        })
    }

    const fetchRelatorio = async (fetchParam?: RelatParam) => {
        setIsLoading(true)
        let done: any = false;
        try {
            const relat = await ValorCapturadoServices.getRelatorio(fetchParam);
            done = relat;
        }
        catch (error) { }
        finally {
            if (done && !done.message)
                setRelatorio(done)
            setIsLoading(false)
        }
        return done
    }

    useEffect(() => {
        setLocalRelatParam(relatParam);

        fetchRelatorio(localRelatParam);
    }, [])

    useEffect(() => {
        setLocalRelatParam(relatParam);

        fetchRelatorio(localRelatParam);
    }, [relatParam])





    const updateReportTable = () => {
        const filteredRelatorio = relatorio.filter((param: Relatorio) => filterRelatorio(param));
        const parametros = filteredRelatorio.filter((value, index, self) =>
            index === self.findIndex((param) => (
                param.Parametros_pk === value.Parametros_pk
            ))
        )

        // let contagem: number[] = []
        // parametros.forEach(() => contagem.push(1))

        let index;
        filteredRelatorio.forEach((relat) => {
            index = parametros.findIndex((param) => relat.Parametros_pk == param.Parametros_pk)
            
            if(relat.minimo < parametros[index].minimo)
                parametros[index].minimo = relat.minimo;
            
            if(relat.maximo > parametros[index].maximo)
                parametros[index].maximo = relat.maximo;

            parametros[index].media = (Number(parametros[index].media) + Number(relat.media)) / 2;
            // contagem[index] += 1;
        })

        
        // parametros.forEach((param, index) => {

        //     alert(param.media + " " + contagem[index])
        //     param.media = param.media / contagem[index];
        // })

        setLocalRelatorio(parametros);
        // setLocalRelatorio(filteredRelatorio);
    }



    useEffect(() => {
        if (!(relatorio.length > 0))
            return setLocalRelatorio([])

        const tempAnos: number[] = [];

        relatorio.forEach((param) => {
            if (!tempAnos.includes(param.ano))
                tempAnos.push(param.ano)
        })
        setAnos(tempAnos);

        setMeses(getMesNomesList());

        setRelatConfig({
            mes: relatorio[0].mes,
            mesNome: getMesNome(relatorio[0].mes),
            ano: relatorio[0].ano
        });


        updateReportTable();
    }, [relatorio])

    useEffect(() => {
        if (!(relatorio.length > 0))
            return setLocalRelatorio([])
        updateReportTable();
    }, [estacoes, parametros, relatConfig])




    return (
        <>
            <Card className={"flex flex-col gap-3 md:p-6 p-0 md:shadow-[0px_4px_35px_0px_rgba(0,_0,_0,_0.12)] md:bg-white bg-white-bg shadow-none " + className}>
                <h1>Relatório {
                    relatConfig ? "- " + (relatConfig.mesNome ? relatConfig.mesNome : "") + (" " + relatConfig?.ano) : ""
                }
                </h1>
                <div className="reports-table">
                    {isLoading ? (
                        <SkeletonTable />
                    ) : (
                        <DataTable
                            columns={columns}
                            data={localRelatorio}
                            actionButton={
                                <div className="flex flex-row gap-3 justify-between w-full md:justify-end md:w-xs mt-[1.2em] pb-[0.8em]">
                                    <div className="relative flex flex-col gap-2">
                                        <p className="md:absolute top-[-1.8em] left-[0.1em]">Mês</p>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    role="menu"
                                                    className="w-[200px] justify-between bg-white rounded-md"
                                                >
                                                    {relatConfig ? relatConfig.mesNome + "" : "-"}
                                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-[240px] p-0">
                                                <Command>
                                                    <CommandList>
                                                        <CommandEmpty>Nenhum mês encontrado.</CommandEmpty>
                                                        <CommandGroup>
                                                            {Object.entries(meses)
                                                                .map(([index, nome]) => (
                                                                    <CommandItem
                                                                        key={index}
                                                                        value={index}
                                                                        onSelect={() => (
                                                                            changeMes(Number(index) + 1)
                                                                        )}
                                                                    >
                                                                        {nome}
                                                                    </CommandItem>
                                                                ))}
                                                        </CommandGroup>
                                                    </CommandList>
                                                </Command>
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                    <div className="relative flex flex-col gap-2">
                                        <p className="md:absolute top-[-1.8em] left-[0.1em]">Ano</p>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    role="menu"
                                                    className="w-[200px] justify-between bg-white rounded-md"
                                                >
                                                    {relatConfig ? relatConfig.ano + "" : "-"}
                                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-[240px] p-0">
                                                <Command>
                                                    <CommandList>
                                                        <CommandEmpty>Nenhum ano encontrado.</CommandEmpty>
                                                        <CommandGroup>
                                                            {Object.entries(anos)
                                                                .map(([index, ano]) => (
                                                                    <CommandItem
                                                                        key={index}
                                                                        value={index}
                                                                        onSelect={() => (
                                                                            changeAno(ano)
                                                                        )}
                                                                    >
                                                                        {ano}
                                                                    </CommandItem>
                                                                ))}
                                                        </CommandGroup>
                                                    </CommandList>
                                                </Command>
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                </div>
                            }
                        />
                    )}

                    {/* Scoped styles: somente para a tabela de relatórios no Dashboard. 
                        Adiciona espaçamento acima da linha de paginação (desktop e mobile) sem tocar no componente DataTable. */}
                    <style jsx>{`
                        .reports-table :global(.overflow-hidden) {
                            margin-bottom: 0.75rem;
                        }
                        .reports-table :global(.overflow-x-auto) {
                            margin-bottom: 0.75rem;
                        }
                    `}</style>
                </div>
            </Card>
        </>
    )
}
export default ReportTable;