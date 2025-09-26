import AtmosIcon from "@/components/AtmosIcon/AtmosIcon";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Login } from "@/interfaces/Login";
import { londrina } from "@/lib/fonts";
import { loginServices } from "@/services/loginServices"
import { useEffect, useState } from "react";

const LoginPage = () => {

    const [loginData, setLoginData] = useState<Login>({ email: "a@tester.com", senha: "0" } as Login);
    const [loginReturn, setLoginReturn] = useState<Login>({ email: "Hello" } as Login);

    const fetchLogin = async () => {
        const login = await loginServices.setLogin(loginData) as Login;
        if (login as Login)
            setLoginReturn(login)
        else
            alert(JSON.stringify(login))
    }

    useEffect(() => {
        fetchLogin();
    }, [])


    const loginLogoAtmos = (sizeRem: number, className?: string) => {
        return (
            <div className={`${className ? className : ""}`}>
                <AtmosIcon className={`mx-auto w-[${sizeRem}rem]`} />
                <p className={`text-center text-[${sizeRem / 10}rem] text-nowrap`}>Bem vindo a <span className={`text-green ${londrina}`}>Atmos</span>!</p>
            </div>
        )
    }


    return (
        <Form>
            <div className="absolute text-[#00312D] w-screen min-h-full top-0 left-0 flex flex-row gap-0 z-[-1]">
                <div className="text-wrap flex flex-col justify-center content-center invisible w-0 md:visible md:w-[50%]" >
                    {loginLogoAtmos(28)}
                </div>
                <div className="bg-[#DEFFD9] align-bottom w-full md:w-[50%] flex flex-col justify-center">
                    <div className="mx-auto mt-32 mb-10 bg-white rounded-[18] px-8 py-20 md:py-30 min-w-[400px] md:min-w-[350px] w-[67%] min-h-[690px] md:min-h-[540px] shadow-[0px_4px_35px_0px_rgba(0,_0,_0,_0.12)] flex flex-col justify-center">

                        {loginLogoAtmos(20, "visible  mb-12 md:invisible md:w-0 md:h-0 md:mb-0")}
                        

                        <div className="flex flex-col justify-center gap-12">
                            <p className={`text-4xl md:text-5xl ${londrina}`}>Entrar</p>

                            <div>
                                <Label>Email</Label>
                                <Input className="mt-2"></Input>
                            </div>

                            <div>
                                <Label>Senha</Label>
                                <Input className="mt-2"></Input>
                            </div>


                            <Button className="rounded-[12]">Entrar</Button>
                        </div>
                        {/* <span className="text-wrap">{JSON.stringify(loginReturn)}</span> */}
                    </div>
                </div>
            </div>
        </Form>
    )
}

export default LoginPage; 