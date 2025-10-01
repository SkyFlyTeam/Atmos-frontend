import { Api } from "@/config/api";
import { ApiException } from "@/config/apiException";
import { Login } from "@/interfaces/Login";
import { Usuario } from "@/interfaces/Usuarios";
import { AxiosError } from "axios";

const setLogin = async (login: Login): Promise<Usuario | ApiException> => {
    try {
        const { data } = await Api.post("/usuario/login", login);
        localStorage.setItem('token', data.token);

        // Remove token do objeto user e garante JSON válido no localStorage
        const user: any = { ...data };
        delete user['token'];

        // Garante que exista um identificador (pk/id) no objeto user
        try {
            const token: string = data.token || localStorage.getItem('token') || '';
            if (token && (!user.pk && !user.id)) {
                const raw = token.startsWith('Bearer ') ? token.split(' ')[1] : token;
                const payloadPart = raw.split('.')[1];
                if (payloadPart) {
                    let base = payloadPart.replace(/-/g, '+').replace(/_/g, '/');
                    while (base.length % 4 !== 0) base += '=';
                    const payload = JSON.parse(atob(base));
                    const resolvedId = payload?.pk ?? payload?.id ?? payload?.sub ?? null;
                    if (resolvedId) user.pk = resolvedId;
                    if (!user.email && payload?.email) user.email = payload.email;
                }
            }
        } catch (e) {
            console.warn('Aviso: não foi possível extrair ID do token no login.', e);
        }

        localStorage.setItem('user', JSON.stringify(user));
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
        const token = localStorage.getItem('token');
        if (!token) return undefined;

        const authHeader = token.startsWith('Bearer ') || token.startsWith('JWT ') ? token : `Bearer ${token}`;
        const res = await Api.get("/usuario/auth", { headers: { Authorization: authHeader } });
        const auth = res.data;

        if (auth?.token) {
            localStorage.setItem('token', auth.token);
        }

        if (auth) {
            delete auth['token'];
            delete auth['message'];
        }

        localStorage.setItem('user', JSON.stringify(auth));
        return auth;
    } catch (error) {
        if (localStorage.getItem('token')) localStorage.removeItem('token');
        if (localStorage.getItem('user')) localStorage.removeItem('user');
        return undefined;
    }
};

export const loginServices = {
    setLogin,
    getAuth
};