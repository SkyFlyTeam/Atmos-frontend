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

    const [activeParent, setActiveParent] = React.useState<string>("");
    
    const checkSubItemActive = (item: NavigationItems) => {
        if(item.subSections) {
            return item.subSections.some(subItem => subItem.index === selectedIndex);
        }
        return false;
    }

    const getActiveParentTitle = () => {
        const activeParent = items.find(parentItem => 
            parentItem.subSections?.some(subItem => subItem.index === selectedIndex)
        );
        return activeParent?.title || items[0].title;
    }

    React.useEffect(() => {
        setActiveParent(getActiveParentTitle());
    }, [selectedIndex]);

    return (
        <Accordion
            type="single"
            collapsible
            className={styles.accordion}
            value={activeParent}
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
                                <span>{subItem.title}</span>
                            </div>
                        ))}
                    </AccordionContent>
                </AccordionItem>
            ))}
        </Accordion>
    );
}

export default NavigationMenu;