import { ComboBox, ComboBoxOption } from "@/components/Combobox/Combobox";
import { MultipleCombobox } from "@/components/MultipleCombobox/MultipleCombobox";
import { DateRange } from "react-day-picker";
import DateInput from "@/components/Inputs/DateInput/DateInput";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";
import { cidadeServices } from "@/services/cidadeServices";
import { sortCidadesByUFAndNome } from "@/utils/sorts/sortCidades";
import { Cidade } from "@/interfaces/Cidade";
import { estacaoServices } from "@/services/estacaoServices";
import { parametroServices } from "@/services/parametroServices";
import { Button } from "@/components/ui/button";
import { estacaoParametroServices } from "@/services/estacaoParametroServices";
import { ApiException } from "@/config/apiException";
import { toast } from "react-toastify";
import { Label } from "@/components/ui/label";


type GeneralFilterProps = {
    cidade: string;
    setCidade: (cidade: string) => void;
    estacoes: string[];
    setEstacoes: (estacoes: string[]) => void;
    parametros: string[];
    setParametros: (parametros: string[]) => void;
}   

const GeneralFilter = ({
        cidade, 
        setCidade, 
        estacoes, 
        setEstacoes, 
        parametros, 
        setParametros, 
    }: GeneralFilterProps) => {

    const [cidadeOptions, setCidadeOptions] = useState<ComboBoxOption[]>([]);
    const [estacaoOptions, setEstacaoOptions] = useState<ComboBoxOption[]>([]);
    const [parametrosOptions, setParametrosOptions] = useState<ComboBoxOption[]>([]);

    const [isLoading, setIsLoading] = useState(true);

    const fetchCidades = async () => {
        try{
            const dataCidades = await cidadeServices.getAllCidades() as Cidade[];

            const cidadeOptions = sortCidadesByUFAndNome(dataCidades)
                .map((cidade) => ({
                    value: cidade.pk.toString(),
                    label: `${cidade.nome} - ${cidade.uf}`,
                }))
            
            if(cidadeOptions.length > 0) {
                setCidade(cidadeOptions[0].value)
            } else {
                toast.warning("Nenhuma cidade encontrada. Cadastre estações com suas respectivas cidades para começar.")
            }
            setCidadeOptions(cidadeOptions);
            
        } catch (error) {
            console.error("Erro ao buscar cidades", error);
        }
    }

    const fetchEstacoesParametros = async () => {
        try {
            const data = await estacaoParametroServices.getAllEstacoesParametrosByCidade(Number(cidade) || 1);
            if (data instanceof ApiException) throw new Error(data.message);
            
            const { tipoParametros, estacoes } = data;

            setEstacaoOptions(estacoes.map(estacao => ({
                value: estacao.pk!.toString(),
                label: estacao.nome,
            })));

            setParametrosOptions(tipoParametros.map(parametro => ({
                value: parametro.pk!.toString(),
                label: parametro.nome,
            })));

        } catch (error) {
            console.error("Erro ao buscar estações e parâmetros", error);
        }
    }

    useEffect(() => {
        fetchCidades();
        setIsLoading(false);
    }, [])

    useEffect(() => {
        if(cidade) {
            fetchEstacoesParametros();
        }
    }, [cidade]);

    const cleanFilters = () => {
        setCidade(cidadeOptions[0]?.value || "");
        setEstacoes([]);
        setParametros([]);
    }

    return (
        <div className="flex gap-4 flex-wrap items-end">
            {isLoading ? (
                <>
                    <Skeleton className="w-52 h-10 rounded-md" />
                    <Skeleton className="w-52 h-10 rounded-md" />
                    <Skeleton className="w-52 h-10 rounded-md" />
                </>
            ) : (
                <>
                    {(cidade || estacoes.length > 0 || parametros.length > 0 )&& (
                        <Button 
                            variant="outline" 
                            className="border-green text-green hover:bg-light-green hover:text-active-green hover:border-active-green"
                            onClick={() => cleanFilters()}
                        >
                            Limpar Filtros
                        </Button>
                    )}
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="cidade-combobox">Cidade</Label>
                        <ComboBox
                            options={cidadeOptions}
                            value={cidade}
                            onSelect={setCidade}
                            placeholder="Selecionar"
                            searchPlaceholder="Buscar"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label htmlFor="estacao-combobox">Estação</Label>
                        <MultipleCombobox
                            options={estacaoOptions}
                            value={estacoes}
                            onSelect={setEstacoes}
                            placeholder="Selecionar"
                            searchPlaceholder="Buscar"
                            disabled={!cidade}
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label htmlFor="parametro-combobox">Parâmetro</Label>
                        <MultipleCombobox
                            options={parametrosOptions}
                            value={parametros}
                            onSelect={setParametros}
                            placeholder="Selecionar"
                            searchPlaceholder="Buscar"
                            disabled={!cidade}
                        />
                    </div>
                </>
            )}
        </div>
    )
}

export default GeneralFilter; 