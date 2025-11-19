import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

import styles from "./NavigationMenu.module.css";
import { cn } from "@/lib/utils";

export interface NavigationItems {
    index?: number;
    title: string;
    icon: React.ReactNode;
    subSections?: NavigationItems[];
}

const NavigationMenu = ( 
    { items, handleChangeItem, selectedIndex }: 
    { 
        items: NavigationItems[], 
        handleChangeItem: (index: number) => void,
        selectedIndex: number;
    }
) => {
    
    const checkSubItemActive = (item: NavigationItems) => {
        if(item.subSections) {
            return item.subSections.some(subItem => subItem.index === selectedIndex);
        }
        return false;
    }

    return (
        <Accordion
            type="single"
            collapsible
            className={styles.accordion}
            defaultValue={items.find(item => item.index === selectedIndex)?.title}
        >
            {items.map((item, index) => (
                <AccordionItem 
                    key={index}
                    value={item.title} 
                    className={styles.accordionItem} 
                >
                    <AccordionTrigger 
                        className={cn(styles.accordionTrigger, checkSubItemActive(item) ? styles.activeItem : "")} 
                        onClick={() => handleChangeItem(item.subSections ? item.subSections[0].index! : 0)}
                    >
                        {item.icon}
                        {item.title}
                    </AccordionTrigger>
                    <AccordionContent className={styles.accordionContent}>
                        {item.subSections && item.subSections.map((subItem) => (
                            <div 
                                key={subItem.index} 
                                className={cn(styles.subSectionItem, selectedIndex === subItem.index ? styles.activeSubItem : "")} 
                                onClick={() => handleChangeItem(subItem.index!)} 
                            >
                                {subItem.icon}
                                <span className="text-base font-[500] flex items-center gap-2">{subItem.title}</span>
                            </div>
                        ))}
                    </AccordionContent>
                </AccordionItem>
            ))}
        </Accordion>
    );
}

export default NavigationMenu;