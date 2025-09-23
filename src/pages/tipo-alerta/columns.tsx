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
    header: "Valor de referência",
    cell: ({ getValue, row }) => {
      const rawValue = getValue();
      const tipoAlarme = row.original.tipo_alarme;
      
      // Se for "Intervalo entre", mostrar p1 à p2
      if (tipoAlarme === 1) {
        const p1 = row.original.p1;
        const p2 = row.original.p2;
        
        if (p1 !== null && p1 !== undefined && p2 !== null && p2 !== undefined) {
          // Formatar números (inteiros sem decimais, decimais com vírgula)
          const formatNumber = (num: any) => {
            const numberValue = Number(num);
            if (isNaN(numberValue)) return '-';
            if (numberValue % 1 === 0) return numberValue.toString();
            return numberValue.toFixed(2).replace('.', ',');
          }
          
          return `${formatNumber(p1)} à ${formatNumber(p2)}`;
        }
      }
      
      // Comportamento padrão para outros critérios
      if (rawValue === null || rawValue === undefined) return '-';

      const value = Number(rawValue);
      if (isNaN(value)) return '-';

      // Se é um número inteiro, mostra sem casas decimais
      if (value % 1 === 0) return value.toString();
      // Se tem casas decimais, mostra com 2 casas e troca ponto por vírgula
      return value.toFixed(2).replace('.', ',');
    },
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