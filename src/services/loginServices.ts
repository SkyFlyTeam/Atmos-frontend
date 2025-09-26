import { Api } from "@/config/api";
import { ApiException } from "@/config/apiException";
import { Login } from "@/interfaces/Login";

const setLogin = async (login: Login): Promise<any | ApiException> => {
    try {
        const { data } = await Api.post("/usuario/login", login)
        return data as Login
    } catch (error) {
        if (error instanceof Error)
            return new ApiException(error.message || "Erro ao realizar login.");
        return new ApiException("Erro desconhecido.");
    }
};

export const loginServices = {
  setLogin
};