import React, { useState } from "react";
import { RiBaseStationFill } from "react-icons/ri";
import { PiTargetBold } from "react-icons/pi";
import { Card } from "@/components/ui/card";
import NavigationMenu, { NavigationItems } from "@/components/NavigationMenu/NavigationMenu";


const GuiaEducativoPage = () => {
    const [selectedIndex, setSelectedIndex] = useState<number>(0);
    const guia_data: NavigationItems[] = [
        {
            title: "Sobre o Guia",
            icon: <img src="/atmos-frog.svg" alt="Atmos Frog" width={28} height={28} />,
            subSections: [
                { index: 0, title: "O que é", icon: <PiTargetBold size={24} />},
            ]
        },
        {
            title: "Estação",
            icon: <RiBaseStationFill size={24} />,
            subSections: [
                { index: 1, title: "O que é", icon: <PiTargetBold size={24} />},
            ]
        },
    ];

    const handleChangeItem = (index: number) => {
        console.log("Item selecionado:", index);
    }

    return (
        <>
            <Card className="flex gap-3 md:shadow-[0px_4px_35px_0px_rgba(0,0,0,0.12)] md:bg-white bg-white-bg shadow-none">
                <div className="border-inherit bg-green rounded-l-md">
                    <NavigationMenu items={guia_data} handleChangeItem={handleChangeItem}/>
                </div>
                <div>
                    {selectedIndex === 0 && (
                        <div>
                            <h2 className="text-2xl font-bold mb-4">O que é o Guia Educativo?</h2>
                        </div>
                    )}
                </div>
            </Card>
        </>
    )
}

export default GuiaEducativoPage; 