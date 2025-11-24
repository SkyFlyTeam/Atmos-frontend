import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "../ui/button";

export type GuideContentProps = {
    title: string;
    description: string;
    imgUrl: string;
    onBackClick?: () => void;
    onNextClick?: () => void;
};

const GuideContent = ({ title, description, imgUrl, onBackClick, onNextClick }: GuideContentProps) => {
    return (
        <div className="flex flex-col gap-8 items-center">
            <h1 className="!text-5xl font-bold mr-auto">{title}</h1>
            <p>{description}</p>
            <img src={imgUrl} alt={title} className="w-[80%] rounded-lg" />
            <div className={`flex w-full ${onBackClick && onNextClick ? "justify-between" : onBackClick ? "justify-start" : "justify-end"} `}>
                {onBackClick && (
                    <Button variant="ghost" onClick={onBackClick}>
                        <ArrowLeft />
                        Voltar
                    </Button>
                )}
                {onNextClick && (
                    <Button 
                        className="bg-dark-cyan hover:bg-cyan-900"
                        onClick={onNextClick}
                    >
                        Continuar
                        <ArrowRight />
                    </Button>
                )}
            </div>
        </div>
    );
}

export default GuideContent;