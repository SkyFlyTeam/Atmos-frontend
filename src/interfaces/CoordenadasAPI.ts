export interface CoordenadasAPI {
    type: "Feature";
    properties: {
        osm_type: string;
        osm_id: number;
        osm_key: string;
        osm_value: string;
        type: string;
        postcode?: string;
        countrycode: string;
        name: string;
        country: string;
        city: string;
        district?: string;
        locality?: string;
        state: string;
        county?: string;
        extent: number[];
    };
    geometry: {
        type: "Point";
        coordinates: number[];
    };
}

export interface CoordenadasResponse {
    type: "FeatureCollection";
    features: CoordenadasAPI[];
}

export interface EnderecoCompleto {
    cidade: string;
    estado: string;
    endereco: string;
    cep?: string;
    bairro?: string;
    rua?: string;
}