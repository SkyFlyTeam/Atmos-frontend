import { Relatorio } from "@/interfaces/Relatorio";
import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<Relatorio>[] = [
    {
        accessorKey: "param",
        header: "Parâmetro",
    },
    {
        accessorKey: "media",
        header: "Média",
        cell: (props)=> {
            const key = Number(props.row.original.media).toFixed(2) + " " + props.row.original.unidade;
            return (
                <>{key}</>
            )
        },
    },
    {
        accessorKey: "minimo",
        header: "Mínimo",
        cell: (props)=> {
            const key = Number(props.row.original.minimo).toFixed(2) + " " + props.row.original.unidade;
            return (
                <>{key}</>
            )
        },
    },
    {
        accessorKey: "maximo",
        header: "Máximo",
        cell: (props)=> {
            const key = Number(props.row.original.maximo).toFixed(2) + " " + props.row.original.unidade;
            return (
                <>{key}</>
            )
        },
    },
]