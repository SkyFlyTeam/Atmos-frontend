import { Api } from "@/config/api";
import { ApiException } from "@/config/apiException";
import { Login } from "@/interfaces/Login";
import { AxiosError } from "axios";

const setLogin = async (login: Login): Promise<any | ApiException> => {
    try {
        const { data } = await Api.post("/usuario/login", login)
        return data as Login
    } catch (error) {
        if (error instanceof AxiosError)
            switch (error.status) {
                case 404:
                case 401:
                    return new ApiException("ERRO: credenciais inválidas. Verifique email e senha, e tente novamente.\n");
                default:
                    return new ApiException("ERRO: resposta sem tratamento, HTTP " + error.status);
            }

        if (error instanceof Error)
            return new ApiException(error.message || "Erro ao realizar login.");
        return new ApiException("Erro desconhecido.");
    }
};

export const loginServices = {
    setLogin
};