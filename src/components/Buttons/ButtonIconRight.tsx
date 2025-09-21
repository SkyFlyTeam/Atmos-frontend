import { ReactNode } from "react";
import { Button } from "../ui/button";

type ButtonIconRightProps = {
    label: string, 
    icon: ReactNode,
    onClick: () => void
}

const ButtonIconRight = ({label, icon, onClick} : ButtonIconRightProps) => {
    return(
        <>
            <Button 
                variant="default" 
                onClick={onClick} 
                className="flex items-center gap-2"
            >
                {icon}
                {label}
            </Button>
        </>
    )
}

export default ButtonIconRight;