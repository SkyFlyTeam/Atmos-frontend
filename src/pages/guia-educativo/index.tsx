import React, { useState } from "react";
import { RiBaseStationFill } from "react-icons/ri";
import { PiTargetBold } from "react-icons/pi";
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
                { index: 0, title: "O que é", icon: <PiTargetBold size={24} />},
                { index: 1, title: "Hege", icon: <PiTargetBold size={24} />},
            ]
        },
        {
            title: "Estação",
            icon: <RiBaseStationFill size={24} />,
            subSections: [
                { index: 2, title: "O que é", icon: <PiTargetBold size={24} />},
                { index: 3, title: "Finalidade", icon: <PiTargetBold size={24} />},
            ]
        },
        {
            title: "Er",
            icon: <RiBaseStationFill size={24} />,
            subSections: [
                { index: 4, title: "O que é", icon: <PiTargetBold size={24} />},
                { index: 5, title: "Finalidade", icon: <PiTargetBold size={24} />},
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
                    {selectedIndex === 0 && (
                        <GuideContent
                            title="O que é o Guia Educativo?"
                            description="O Guia Educativo é uma ferramenta interativa desenvolvida para auxiliar os usuários a compreenderem melhor o funcionamento e a finalidade das estações Atmos. Através de uma série de seções informativas, o guia oferece explicações detalhadas, imagens ilustrativas e navegação intuitiva para facilitar o aprendizado."
                            imgUrl="/images/guide-1.png"
                            onNextClick={() => handleChangeItem(selectedIndex + 1)}
                        />
                    )}
                    {selectedIndex === 1 && (
                        <GuideContent
                            title="Hege?"
                            description="O Guia Educativo é uma ferramenta interativa desenvolvida para auxiliar os usuários a compreenderem melhor o funcionamento e a finalidade das estações Atmos. Através de uma série de seções informativas, o guia oferece explicações detalhadas, imagens ilustrativas e navegação intuitiva para facilitar o aprendizado."
                            imgUrl="/images/guide-1.png"
                            onBackClick={() => handleChangeItem(selectedIndex - 1)}
                            onNextClick={() => handleChangeItem(selectedIndex + 1)}
                        />
                    )}
                    {selectedIndex === 2 && (
                       <GuideContent
                            title="EERERE?"
                            description="O Guia Educativo é uma ferramenta interativa desenvolvida para auxiliar os usuários a compreenderem melhor o funcionamento e a finalidade das estações Atmos. Através de uma série de seções informativas, o guia oferece explicações detalhadas, imagens ilustrativas e navegação intuitiva para facilitar o aprendizado."
                            imgUrl="/images/guide-1.png"
                            onBackClick={() => handleChangeItem(selectedIndex - 1)}
                            onNextClick={() => handleChangeItem(selectedIndex + 1)}
                        />
                    )}
                </div>
            </Card>
        </>
    )
}

export default GuiaEducativoPage; 