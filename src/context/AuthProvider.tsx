import { createContext, PropsWithChildren, useContext, useEffect, useState } from "react"
import { usuarioServices } from "../services/usuarioServices"
import { ApiException } from "../config/apiException"
import { Usuario } from "@/interfaces/Usuarios"
import { loginServices } from "@/services/loginServices"

type AuthContext = {
    currentUser?: Usuario | null
    handleLogin: (email: string, senha: string) => Promise<void>
    handleLogout: () => Promise<void>
    userLoading: boolean 
}

const AuthContext = createContext<AuthContext | undefined>(undefined)

type AuthProviderProps = PropsWithChildren

export default async function AuthProvider({children}: AuthProviderProps) {
    const [currentUser, setCurrentUser] = useState<Usuario | null>(null)
    const [userLoading, setUserLoading] = useState(true) 

    async function handleLogin(email: string, senha: string) {
        setUserLoading(true);
        const credenciais = {
            email, 
            senha
        }

        const response = await usuarioServices.checkLogin(credenciais);
        
        if (response instanceof ApiException) {
            setAuthToken(null)
            setCurrentUser(null)
            setIsLoading(false);
            throw new Error(response.message)
        } else {
            const { usuarioLogin, authToken } = response
            setAuthToken(authToken)
            setCurrentUser(usuarioLogin)
            localStorage.setItem('authToken', authToken);
            localStorage.setItem('currentUser', JSON.stringify(usuarioLogin))
            setIsLoading(false); 
        }
    }

    async function handleLogout() {
        setCurrentUser(null)
        setUserLoading(false);
        localStorage.removeItem('token')
        localStorage.removeItem('currentUser')
    }

    useEffect(() => {
        const auth = await loginServices.getAuth()
        if(auth)
            setCurrentUser(JSON.parse(auth));
        setIsLoading(false); 
    }, [])
    
    return(
        <AuthContext.Provider value={{ currentUser, handleLogin, handleLogout, userLoading}}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth(){
    const context = useContext(AuthContext)

    if (context === undefined){
        throw new Error('useAuth deve estar dentro de um AuthProvider')
    }

    return context
}