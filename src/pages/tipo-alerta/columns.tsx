"use client"

import { Button } from "@/components/ui/button";
import { TipoAlerta } from "@/interfaces/TipoAlerta";
import { ColumnDef } from "@tanstack/react-table"

import { IoMdTrash } from "react-icons/io";
import { BiSolidEditAlt } from "react-icons/bi";

enum criteriosEnum {
  "Menor que",
  "Intervalo entre",
  "Maior Que",
  "Diferente de",
  "Igual a"
}

export const columns: ColumnDef<TipoAlerta>[] = [
  {
    accessorKey: "tipo",
    header: "Tipo de Alerta",
  },
  {
    accessorKey: "tipo_alarme",
    header: "Critérios",
    cell: ({ getValue }) => {
      const value = getValue() as number
      return criteriosEnum[value] || "Valor desconhecido"
    },
  },
  {
    accessorKey: "p1",
    header: "Valor de referência ",
  },
  {
    id: "Ações",
    header: "Ações",  
    cell: ({ row, table }) => {
        const meta = table.options.meta as { 
            actions: { onEdit: Function, onDelete: Function }
        };
        return(
            <div className="flex justify-end gap-2 w-fit">
                <Button
                    variant="ghost"
                    size="sm"
                    className={`h-8 w-8 p-0`}
                    onClick={() => meta.actions.onEdit(row.original)}
                >
                    <BiSolidEditAlt className='w-5! h-5!' />
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    className={`h-8 w-8 p-0 `}
                    onClick={() => meta.actions.onDelete(row.original)}
                >
                    <IoMdTrash className='w-5! h-5! text-red' />
                </Button>
            </div>
        )
    },
  },
]