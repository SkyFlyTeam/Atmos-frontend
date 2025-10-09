"use client"

import { Button } from "@/components/ui/button";
import { Parametro } from "@/interfaces/Parametros"
import { ColumnDef } from "@tanstack/react-table"

import { IoMdTrash } from "react-icons/io";
import { BiSolidEditAlt } from "react-icons/bi";

export const columns: ColumnDef<Parametro>[] = [
  {
    accessorKey: "nome",
    header: "Nome",
  },
  {
    accessorKey: "tipo",
    header: "Tipo",
  },
  {
    accessorKey: "unidade",
    header: "Unidade ",
  },
  {
    id: "Ações",
    header: ({column, table }) => { 
      const meta = table.options.meta as { 
          actions: { onEdit: Function, onDelete: Function },
          perms: { canEdit: boolean, canDelete: boolean }
      };
      if (!meta.perms.canEdit && !meta.perms.canDelete) {
          return null;
        }
      return "Ações" 
    },  
    cell: ({ row, table }) => {
        const meta = table.options.meta as { 
            actions: { onEdit: Function, onDelete: Function },
            perms: { canEdit: boolean, canDelete: boolean }
        };

        if (!meta.perms.canEdit && !meta.perms.canDelete) {
          return null;
        }

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