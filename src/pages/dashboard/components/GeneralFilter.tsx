import { ComboBox, ComboBoxOption } from "@/components/Combobox/Combobox";
import SearchInput from "@/components/SearchInput";
import { Input } from "@/components/ui/input";
import { CidadeAPI } from "@/interfaces/CidadeAPI";
import { cidadeAPIServices } from "@/services/cidadeAPIServices";
import { formatCidadeToOptions } from "@/utils/formatters/cidadeToOptions";
import { useEffect, useState } from "react";

interface Parametro {
  pk: number
  nome: string
  unidade?: string
}

const GeneralFilter = () => {
    const [cidade, setCidade] = useState<string>("");
    const [cidadeOptions, setCidadeOptions] = useState<ComboBoxOption[]>([]);

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

    useEffect(() => {
        fetchCidades();
        setIsLoading(false);
    }, [])

    return (
        <div>
            {isLoading ? (
                <span>Carregando</span>
            ) : (
                <>
                    <SearchInput />

                    <ComboBox
                        options={cidadeOptions}
                        value={cidade}
                        onSelect={setCidade}
                        placeholder="Selecionar cidade..."
                        searchPlaceholder="Buscar cidade..."
                    />
                </>
            )}
        </div>
    )
}

export default GeneralFilter; 
