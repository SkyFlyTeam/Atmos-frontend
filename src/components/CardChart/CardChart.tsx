import { Card } from "../ui/card"
import { ReactNode } from "react"

type CardChartProps = {
    title: string,
    chart?: ReactNode
}

const CardChart = ({title, chart} : CardChartProps) => {
    return (
        <Card className="w-full flex flex-col items-center px-2 py-4 gap-4">
            <h2 className="text-4xl font-londrina text-dark-cyan">{title}</h2>
            {chart}
        </Card>
    )
}

export default CardChart;