import { ReactNode } from "react";
import { Button } from "../ui/button";

type ButtonIconRightProps = {
    label: string, 
    icon: ReactNode,
    onClick: () => void,
    className?: string
}

const ButtonIconRight = ({label, icon, onClick, className} : ButtonIconRightProps) => {
    return(
        <>
            <Button 
                variant="default" 
                onClick={onClick} 
                className={`flex items-center gap-2 ${className}`}
            >
                {icon}
                {label}
            </Button>
        </>
    )
}

export default ButtonIconRight;