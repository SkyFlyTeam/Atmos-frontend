import axios from "axios";
import { ApiException } from "@/config/apiException";
import { Cidade, CidadeAPI } from "@/interfaces/CidadeAPI";

export type CidadeItem = {
  id: number;     // IBGE
  nome: string;
  uf: string;     // UF (sigla)
  label: string;  // "Cidade - UF"
};

const getAllCidades = async (): Promise<CidadeItem[]> => {
  const { data } = await axios.get<CidadeAPI[]>(
    "https://servicodados.ibge.gov.br/api/v1/localidades/municipios"
  );

  return data.map((cid) => {
    // caminho correto no payload do IBGE
    const uf = cid.microrregiao?.mesorregiao?.UF?.sigla ?? "";
    return {
      id: cid.id,
      nome: cid.nome,
      uf,
      label: `${cid.nome} - ${uf}`,
    };
  });
};

export const cidadeAPIServices = {
  getAllCidades,
};