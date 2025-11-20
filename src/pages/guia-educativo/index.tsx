import React, { useState } from "react";
import { RiBaseStationFill } from "react-icons/ri";
import { PiQuestionMarkBold, PiSealQuestionFill, PiShieldWarningBold, PiSirenBold, PiSquaresFourBold, PiTargetBold, PiWifiHighBold } from "react-icons/pi";
import { Card } from "@/components/ui/card";
import NavigationMenu, { NavigationItems } from "@/components/NavigationMenu/NavigationMenu";
import GuideContent from "@/components/GuideContent/GuideContent";


const GuiaEducativoPage = () => {
    const [selectedIndex, setSelectedIndex] = useState<number>(0);
    const guia_data: NavigationItems[] = [
        {
            title: "Sobre o Guia",
            icon: <img src="/atmos-frog.svg" alt="Atmos Frog" width={28} height={28} />,
            subSections: [
                { index: 0, title: "O que é?", icon: <PiQuestionMarkBold size={24} />},
            ]
        },
        {
            title: "Estação",
            icon: <RiBaseStationFill size={24} />,
            subSections: [
                { index: 1, title: "Objetivo", icon: <PiTargetBold size={24} />},
                { index: 2, title: "Como funciona?", icon: <PiSealQuestionFill size={24} />},
            ]
        },
        {
            title: "Parâmetro",
            icon: <PiSquaresFourBold size={24} />,
            subSections: [
                { index: 3, title: "Objetivo", icon: <PiTargetBold size={24} />},
                { index: 4, title: "Como funciona?", icon: <PiSealQuestionFill size={24} />},
                { index: 5, title: "Como é coletado?", icon: <PiWifiHighBold size={24} />},
            ]
        },
        {
            title: "Alertas",
            icon: <PiSirenBold size={24} />,
            subSections: [
                { index: 6, title: "Objetivo", icon: <PiTargetBold size={24} />},
                { index: 7, title: "Como é funciona?", icon: <PiSealQuestionFill size={24} />},
                { index: 8, title: "Como identificar perigos?", icon: <PiShieldWarningBold size={24} />},
            ]
        },
    ];

    const handleChangeItem = (index: number) => {
        setSelectedIndex(index);
    }

    return (
        <>
            <Card className="flex md:flex-row flex-col gap-3 md:shadow-[0px_4px_35px_0px_rgba(0,0,0,0.12)] md:bg-white bg-white-bg shadow-none min-h-full">
                <div className="border-inherit bg-green md:rounded-l-lg md:rounded-r-none rounded-md md:px-12 md:py-18 p-2 min-w-fit w-full flex-2">
                    <NavigationMenu items={guia_data} handleChangeItem={handleChangeItem} selectedIndex={selectedIndex} />
                </div>
                <div className="md:py-18 md:px-12 p-2 flex-6">

                   {/* SOBRE O GUIA */} 
                    {selectedIndex === 0 && (
                        <GuideContent
                            title="O que é o Guia Educativo?"
                            description="O Guia Educativo é uma ferramenta interativa desenvolvida para auxiliar os usuários a compreenderem melhor o funcionamento e a finalidade das estações. Através de uma série de seções informativas, o guia oferece explicações, imagens ilustrativas e navegação intuitiva para facilitar o aprendizado. Navegue pelo Menu e aproveite todo o conteúdo 😉"
                            imgUrl="/images/sobreGuia.png"
                            onNextClick={() => handleChangeItem(selectedIndex + 1)}
                        />
                    )}

                    {/* ESTAÇÃO */}
                    {selectedIndex === 1 && (
                        <GuideContent
                            title="Objetivo"
                            description="Uma Estação é uma unidade física instalada em um ponto estratégico da cidade, como em áreas de risco, e serve como nosso ponto de coleta de dados essenciais sobre o ambiente; seu principal objetivo é monitorar continuamente o clima e as condições do solo em tempo real para fornecer informações cruciais que alimentam o sistema Atmos."
                            imgUrl="/images/objetivoEstacao.png"
                            onBackClick={() => handleChangeItem(selectedIndex - 1)}
                            onNextClick={() => handleChangeItem(selectedIndex + 1)}
                        />
                    )}
                    {selectedIndex === 2 && (
                       <GuideContent
                            title="Como funciona?"
                            description="Cada Estação possui diversos sensores eletrônicos que capturam diferentes medições ambientais, como o índice de chuva ou o nível de umidade do solo, e envia esses dados periodicamente, via rede de comunicação, para a plataforma Atmos; esse processo de coleta e transmissão de dados é automatizado e contínuo, garantindo que o monitoramento seja sempre atualizado e confiável."
                            imgUrl="/images/comoFuncionaEstacao.png"
                            onBackClick={() => handleChangeItem(selectedIndex - 1)}
                            onNextClick={() => handleChangeItem(selectedIndex + 1)}
                        />
                    )}

                    {/* PARAMETRO */}
                    {selectedIndex === 3 && (
                       <GuideContent
                            title="Objetivo"
                            description="O funcionamento de um Parâmetro no sistema Atmos envolve a sua definição e associação a uma Estação, permitindo que o software organize, armazene e processe a vasta quantidade de dados coletados, transformando números brutos em informações compreensíveis exibidas nos gráficos do Dashboard."
                            imgUrl="/images/objetivoParametro.png"
                            onBackClick={() => handleChangeItem(selectedIndex - 1)}
                            onNextClick={() => handleChangeItem(selectedIndex + 1)}
                        />
                    )}
                    {selectedIndex === 4 && (
                       <GuideContent
                            title="Como funciona?"
                            description="O funcionamento de um Parâmetro no sistema Atmos envolve a sua definição e associação a uma Estação, permitindo que o software organize, armazene e processe a vasta quantidade de dados coletados, transformando números brutos em informações compreensíveis exibidas nos gráficos do Dashboard."
                            imgUrl="/images/comoFuncionaParametro.png"
                            onBackClick={() => handleChangeItem(selectedIndex - 1)}
                            onNextClick={() => handleChangeItem(selectedIndex + 1)}
                        />
                    )}
                    {selectedIndex === 5 && (
                       <GuideContent
                            title="Como é coletado?"
                            description="A coleta de um Parâmetro é realizada por sensores especializados (como pluviômetros para chuva ou higrômetros para umidade) que estão instalados na Estação, convertendo a grandeza ambiental (como a precipitação) em um sinal eletrônico que, após ser digitalizado, é enviado para a aplicação Atmos em intervalos de tempo pré-determinados."
                            imgUrl="/images/comoEColetado.png"
                            onBackClick={() => handleChangeItem(selectedIndex - 1)}
                            onNextClick={() => handleChangeItem(selectedIndex + 1)}
                        />
                    )}

                    {/* ALERTA */}
                    {selectedIndex === 6 && (
                       <GuideContent
                            title="Objetivo"
                            description="Um Alerta é um aviso imediato gerado pelo sistema Atmos sempre que um valor capturado de um Parâmetro excede ou fica abaixo de um limite de segurança predefinido, com o objetivo crucial de notificar rapidamente as autoridades ou a população sobre uma situação de risco iminente, como um grande volume de chuva que possa causar um deslizamento."
                            imgUrl="/images/objetivoAlerta.png"
                            onBackClick={() => handleChangeItem(selectedIndex - 1)}
                            onNextClick={() => handleChangeItem(selectedIndex + 1)}
                        />
                    )}
                    {selectedIndex === 7 && (
                       <GuideContent
                            title="Como funciona?"
                            description="O sistema Atmos monitora continuamente cada novo dado que chega das Estações, comparando-o automaticamente com os valores configurados para os Alertas; se o valor capturado ultrapassar o limite de risco estabelecido, o sistema dispara uma notificação instantânea e registrando a ocorrência no sistema"
                            imgUrl="/images/comoFuncionaAlerta.png"
                            onBackClick={() => handleChangeItem(selectedIndex - 1)}
                            onNextClick={() => handleChangeItem(selectedIndex + 1)}
                        />
                    )}
                    {selectedIndex === 8 && (
                       <GuideContent
                            title="Como identificar perigos?"
                            description="Você identifica um perigo ao observar as notificações de Alerta no sistema ou ao visualizar nos gráficos do Dashboard que os valores de um Parâmetro estão se aproximando ou já ultrapassaram a linha vermelha de segurança estabelecida, indicando uma condição ambiental que exige ação ou atenção imediata."
                            imgUrl="/images/identificarPerigosAlerta.png"
                            onBackClick={() => handleChangeItem(selectedIndex - 1)}
                        />
                    )}
                </div>
            </Card>
        </>
    )
}

export default GuiaEducativoPage; 