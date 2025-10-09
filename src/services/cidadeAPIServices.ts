import axios from "axios";
import { ApiException } from "@/config/apiException";
import { CidadeAPI } from "@/interfaces/CidadeAPI";

const getAllCidades = async (): Promise<string[] | ApiException> => {
    try{
        const { data } = await axios.get("https://servicodados.ibge.gov.br/api/v1/localidades/municipios");
        
        const cidades: string[] = (data as CidadeAPI[]).map((cid: CidadeAPI) => {
            if (cid.microrregiao && cid.microrregiao.mesorregiao && cid.microrregiao.mesorregiao.UF) {
                return `${cid.nome} - ${cid.microrregiao.mesorregiao.UF.sigla}`;
            } else {
                return `${cid.nome} - Microrregião não disponível`;
            }
            
        })
        return cidades
        
    } catch (error) {
        if (error instanceof Error) {
            return new ApiException(error.message || "Erro ao consultar cidades.");
        }
        return new ApiException("Erro desconhecido.");
    }
};

export const cidadeAPIServices = {
    getAllCidades
};