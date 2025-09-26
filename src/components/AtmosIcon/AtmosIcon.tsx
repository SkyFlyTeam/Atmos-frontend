import { ReactNode } from "react";

type AtmosIconProps = {
    className?: string,
    onClick?: () => void
}

const AtmosIcon = ({ className: className }: AtmosIconProps) => {
    return (
        <>
            <img className={`${className ? className : ""}`} src="/atmos-icon.svg" />
        </>
    )
}

export default AtmosIcon;