import AtmosIcon from "@/components/AtmosIcon/AtmosIcon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ApiException } from "@/config/apiException";
import { Login } from "@/interfaces/Login";
import { Usuario } from "@/interfaces/Usuarios";
import { londrina } from "@/lib/fonts";
import { loginServices } from "@/services/loginServices"
import { useRouter } from "next/router";
import { ChangeEvent, useEffect, useState } from "react";
import { toast } from "react-toastify";

const LoginPage = () => {
    const [needLogin, setNeedLogin] = useState<boolean>(false);

    const router = useRouter();
    const blankLogin: Login = {
        email: "",
        senha: "",
    }

    const [loginData, setLoginData] = useState<Login>(blankLogin);
    const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);


    useEffect(() => {
        const verifyAuth = async () => {
            setNeedLogin(false)
            let done = false;
            try {
                const auth = await loginServices.getAuth();
                done = auth;
            }
            catch (error) {}
            finally {
                if(done)
                    router.push("/");
                if(done === undefined)
                    setNeedLogin(true)
            }
        }

        verifyAuth();
    }, [])

    const delayLogin = (ms: number) => new Promise(res => setTimeout(res, ms));

    const resetFormLogin = () => {
        setLoginData(blankLogin);
    }
    const fetchLogin = async () => {
        const login = await loginServices.setLogin(loginData);

        return login;
    }

<<<<<<< HEAD
    const saveLogin = async (token: string) => {
        localStorage.setItem('token', token);
        resetFormLogin();
        toast.success("Sucesso.");
        // Dispara evento customizado para Navbar atualizar estado
        if (typeof window !== 'undefined') {
            window.dispatchEvent(new Event('usuarioLogado'));
        }
=======
    const successLogin = async () => {
        resetFormLogin();

        setNeedLogin(false);

        router.push("/");
         if (typeof window !== 'undefined') {
            window.dispatchEvent(new Event('usuarioLogado'));
        }
>>>>>>> 7c9a5ad (AT-20 feat: verificador de credencial)
    }

    const loginLogoAtmos = (sizeRem: number, className?: string) => {
        return (
            <div className={`${className ? className : ""}`}>
                <AtmosIcon className={`mx-auto w-[${sizeRem}rem]`} />
                <p className={`text-center text-[${sizeRem / 10}rem] text-nowrap`}>Bem vindo a <span className={`text-green ${londrina}`}>Atmos</span>!</p>
            </div>
        )
    }

    const handleLoginEmail = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setLoginData((prev) => ({ ...prev, ["email"]: value === null ? "" : value }));
    }
    const handleLoginSenha = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setLoginData((prev) => ({ ...prev, ["senha"]: value === null ? "" : value }));
    }


    const handleSubmitLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        setIsLoggingIn(true);

        const login = await fetchLogin(); 

        if ((login as Usuario).email && (login as Usuario).token)
            successLogin()
        else
            toast.error((login as ApiException).message)


        setIsLoggingIn(false);

    }


    return (
        <>
            {needLogin &&
                <form onSubmit={handleSubmitLogin}>
                    <div className="absolute text-[#00312D] w-screen min-h-full top-0 left-0 flex flex-row gap-0 z-[-1]">
                        <div className="text-wrap flex flex-col justify-center content-center invisible w-0 md:visible md:w-[50%]" >
                            {loginLogoAtmos(28)}
                        </div>
                        <div className="bg-[#DEFFD9] align-bottom w-full md:w-[50%] flex flex-col justify-center">
                            <div className="mx-auto mt-32 mb-10 bg-white rounded-[18] px-8 py-20 md:py-30 min-w-[320px] w-[67%] min-h-[690px] md:min-h-[540px] shadow-[0px_4px_35px_0px_rgba(0,_0,_0,_0.12)] flex flex-col justify-center">

                                {loginLogoAtmos(20, "visible  mb-12 md:invisible md:w-0 md:h-0 md:mb-0")}

                                <div className="flex flex-col justify-center gap-12">
                                    <p className={`text-4xl md:text-5xl ${londrina}`}>Entrar</p>

                                    <div>
                                        <Label htmlFor="loginEmail">Email</Label>
                                        <Input
                                            className="mt-2 placeholder:text-[#ADADAD]"
                                            type="text"
                                            name="loginEmail"
                                            onChange={handleLoginEmail}
                                            value={loginData.email}
                                            placeholder="Email"
                                            disabled={isLoggingIn}
                                        ></Input>
                                    </div>

                                    <div>
                                        <Label htmlFor="loginSenha">Senha</Label>
                                        <Input
                                            className="mt-2 placeholder:text-[#ADADAD]"
                                            type="password"
                                            name="loginSenha"
                                            onChange={handleLoginSenha}
                                            value={loginData.senha}
                                            placeholder="Senha"
                                            disabled={isLoggingIn}
                                        ></Input>
                                    </div>


                                    <Button
                                        className="rounded-[12]"
                                        type="submit"
                                        disabled={isLoggingIn}
                                    >Entrar</Button>
                                    {/* <Button
                                        className="rounded-[12]"
                                        type="button"
                                        onClick={async () => alert(JSON.stringify(await loginServices.getAuth()))}
                                        disabled={isLoggingIn}
                                    >TOKEN</Button> */}
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            }
        </>
    )
}

export default LoginPage; 