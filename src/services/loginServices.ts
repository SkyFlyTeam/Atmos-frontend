import { Api } from "@/config/api";
import { ApiException } from "@/config/apiException";
import { Login } from "@/interfaces/Login";
import { Usuario } from "@/interfaces/Usuarios";
import { AxiosError } from "axios";

const setLogin = async (login: Login): Promise<Usuario | ApiException> => {
    try {
        const { data } = await Api.post("/usuario/login", login);
        localStorage.setItem('token', data.token);
        let user = {...data};
        delete user['token'];
        localStorage.setItem('user', JSON.stringify(user))
        return data as Usuario
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

const getAuth = async (): Promise<any | ApiException> => {
    try {
        const token = localStorage.getItem('token')
        const res = await Api.get("/usuario/auth", { 'headers': { 'Authorization': token } })
        const auth = res.data;
        if (auth.token)
            localStorage.setItem('token', auth.token);
        delete auth['token'];
        delete auth['message'];
        localStorage.setItem('user', auth);
        return auth;
    } catch (error) {
        if (localStorage.getItem('token'))
            localStorage.removeItem('token');

        if (localStorage.getItem('user'))
            localStorage.removeItem('user');

        return undefined;
    }
};

export const loginServices = {
    setLogin,
    getAuth
};