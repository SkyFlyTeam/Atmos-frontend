import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

import styles from "./NavigationMenu.module.css";

export interface NavigationItems {
    index?: number;
    title: string;
    icon: React.ReactNode;
    subSections?: NavigationItems[];
}

const NavigationMenu = ( 
    { items, handleChangeItem }: 
    { 
        items: NavigationItems[], 
        handleChangeItem: (index: number) => void 
    }
) => {
    return (
        <Accordion
            type="single"
            collapsible
            className={styles.accordion}
            defaultValue="item-1"
        >
            {items.map((item) => (
                <AccordionItem 
                    key={item.index}
                    value={item.title} 
                    className={styles.accordionItem} 
                    onClick={() => handleChangeItem(item.subSections ? item.subSections[0].index! : 1)}
                >
                    <AccordionTrigger className={styles.accordionTrigger}>
                        {item.icon}
                        {item.title}
                    </AccordionTrigger>
                    <AccordionContent className={styles.accordionContent}>
                        {item.subSections && item.subSections.map((subItem) => (
                            <div 
                                key={subItem.index} 
                                className={styles.subSectionItem} 
                                onClick={() => handleChangeItem(subItem.index!)} 
                            >
                                {subItem.icon}
                                <h3 className="text-lg font-semibold flex items-center gap-2">{subItem.title}</h3>
                            </div>
                        ))}
                    </AccordionContent>
                </AccordionItem>
            ))}
        </Accordion>
    );
}

export default NavigationMenu;