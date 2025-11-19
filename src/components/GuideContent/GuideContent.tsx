import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "../ui/button";

export type GuideContentProps = {
    title: string;
    description: string;
    imgUrl: string;
    onBackClick?: () => void;
    onNextClick: () => void;
};

const GuideContent = ({ title, description, imgUrl, onBackClick, onNextClick }: GuideContentProps) => {
    return (
        <div className="flex flex-col gap-8">
            <h1 className="!text-5xl font-bold mb-4">{title}</h1>
            <p>{description}</p>
            <img src={imgUrl} alt={title} className="w-full rounded-lg" />
            <div className="flex w-full justify-between">
                {onBackClick && (
                    <Button variant="ghost" onClick={onBackClick}>
                        <ArrowLeft />
                        Voltar
                    </Button>
                )}
                <Button 
                    className="bg-dark-cyan hover:bg-cyan-900"
                    onClick={onNextClick}
                >
                    Continuar
                    <ArrowRight />
                </Button>
            </div>
        </div>
    );
}

export default GuideContent;