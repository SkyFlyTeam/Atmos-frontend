import { Usuario } from "@/interfaces/Usuarios";
import { loginServices } from "@/services/loginServices";
import { useCallback, useEffect, useState } from "react";





export interface UseAuthReturn {
    auth: Usuario;
    loading: boolean;
    verifyAuth?: () => Promise<void>;
}

export function useAuth(): UseAuthReturn {
    const [auth, setAuth] = useState<any>({});
    const [loading, setLoading] = useState(false);


    const fetchAuth = useCallback(async () => {
        setLoading(true);

        const data = await loginServices.getAuth();

        setAuth(data);

        setLoading(false);
    }, [])


    const verifyAuth = useCallback(async () => {
        await fetchAuth();
    }, [fetchAuth()]);


    useEffect(() => {
        fetchAuth()
    }, [fetchAuth()]);

    return {
        auth,
        loading
    };
}
