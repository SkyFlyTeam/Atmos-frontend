import { ComboBox, ComboBoxOption } from "@/components/Combobox/Combobox";
import { MultipleCombobox } from "@/components/MultipleCombobox/MultipleCombobox";
import SearchInput from "@/components/SearchInput";
import { Input } from "@/components/ui/input";
import { CidadeAPI } from "@/interfaces/CidadeAPI";
import { Estacao } from "@/interfaces/Estacoes";
import { cidadeAPIServices } from "@/services/cidadeAPIServices";
import { estacaoServices } from "@/services/estacaoServices";
import { parametroServices } from "@/services/parametroServices";
import { formatCidadeToOptions } from "@/utils/formatters/cidadeToOptions";
import { useEffect, useState } from "react";
import { th } from "zod/v4/locales";

interface Parametro {
  pk: number
  nome: string
  unidade?: string
}

const GeneralFilter = () => {
    const [cidade, setCidade] = useState<string>("");
    const [cidadeOptions, setCidadeOptions] = useState<ComboBoxOption[]>([]);

    const [estacao, setEstacao] = useState<string>("");
    const [estacaoOptions, setEstacaoOptions] = useState<ComboBoxOption[]>([]);

    const [parametros, setParametros] = useState<string[]>([]);
    const [parametrosOptions, setParametrosOptions] = useState<ComboBoxOption[]>([]);

    const [isLoading, setIsLoading] = useState(true);

    const fetchCidades = async () => {
        try{
            let dataCidades: string[];
            const cidadesLocalStorage = localStorage.getItem("cidades");
            if(cidadesLocalStorage){
                dataCidades = JSON.parse(cidadesLocalStorage);
            } else{
                dataCidades = await cidadeAPIServices.getAllCidades() as string[];
                localStorage.setItem("cidades", JSON.stringify(dataCidades))
            }
            if(dataCidades instanceof Array){
                setCidadeOptions(formatCidadeToOptions(dataCidades));
            }
        } catch (error) {
            console.error("Erro ao buscar cidades", error);
        }
    }

    const fetchEstacoes = async () => {
        try{
            const dataEstacoes = await estacaoServices.getAllEstacoes();
            console.log(dataEstacoes) ;
            if(!Array.isArray(dataEstacoes)) return ;
            const estacaoOptions = dataEstacoes.map((estacao) => ({
                value: estacao.pk!.toString(),
                label: estacao.nome,
            }));
            console.log("Estação Options:", estacaoOptions);
            setEstacaoOptions(estacaoOptions);
        } catch (error) {
            console.error("Erro ao buscar estações", error);
        }
    }

    const fetchParametros = async () => {
        try{
            const dataParametros = await parametroServices.getAllParametros();
            if(!Array.isArray(dataParametros)) return;
            const parametrosOptions = dataParametros.map((parametro) => ({
                value: parametro.pk!.toString(),
                label: parametro.nome,
            }));
            setParametrosOptions(parametrosOptions);
        } catch (error) {
            console.error("Erro ao buscar parâmetros", error);
        }
    }

    useEffect(() => {
        fetchCidades();
        fetchEstacoes();
        fetchParametros();
        setIsLoading(false);
    }, [])

    return (
        <div className="flex gap-4">
            {isLoading ? (
                <span>Carregando</span>
            ) : (
                <>
                    <ComboBox
                        options={cidadeOptions}
                        value={cidade}
                        onSelect={setCidade}
                        placeholder="Selecionar"
                        searchPlaceholder="Buscar"
                    />

                    <ComboBox
                        options={estacaoOptions}
                        value={estacao}
                        onSelect={setEstacao}
                        placeholder="Selecionar"
                        searchPlaceholder="Buscar"
                        disabled={!cidade}
                    />

                    <MultipleCombobox
                        options={parametrosOptions}
                        value={parametros}
                        onSelect={setParametros}
                        placeholder="Selecionar"
                        searchPlaceholder="Buscar"
                        disabled={!cidade}
                    />
                </>
            )}
        </div>
    )
}

export default GeneralFilter; 
