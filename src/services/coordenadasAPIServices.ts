import axios from "axios";
import { CoordenadasResponse, EnderecoCompleto } from "@/interfaces/coordenadasAPI";

const getCoordenadas = async (lat: number, lon: number): Promise<EnderecoCompleto | null> => {
    if (isNaN(lat) || isNaN(lon)) {
        console.warn("Coordenadas inválidas:", { lat, lon });
        return null;
    }

    try {
        const response = await axios.get<CoordenadasResponse>(
            `/api/photon/reverse?lat=${lat}&lon=${lon}`,
            { validateStatus: () => true } // não joga exceção em erros HTTP
        );

        // Se a API retornou erro HTTP
        if (response.status !== 200) {
            console.warn("Erro HTTP do Photon:", response.status, response.statusText);
            return null;
        }

        // Se não há features, endereço não encontrado
        if (!response.data.features?.length) {
            return null;
        }

        const props = response.data.features[0].properties;

        return {
            cidade: props.city || props.locality || "",
            estado: props.state || "",
            endereco: [
                props.name,
                props.district,
                props.locality,
                props.postcode ? `CEP ${props.postcode}` : ""
            ]
                .filter(Boolean)
                .join(", "),
            cep: props.postcode,
            bairro: props.district,
            rua: props.name,
        };
    } catch (error) {
        console.error("Erro ao fazer reverse geocoding:", error);
        return null;
    }
};

export const coordenadasAPIServices = {
    getCoordenadas,
};
