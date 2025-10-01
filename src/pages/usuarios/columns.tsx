"use client"

import { ColumnDef } from "@tanstack/react-table";
import { Usuario } from "@/interfaces/Usuarios";
import ActionButtons from "@/components/Buttons/ActionButtons";

export const columns: ColumnDef<Usuario>[] = [
  {
    accessorKey: "nome",
    header: "Nome",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    id: "Ações",
    header: "Ações",
    cell: ({ row, table }) => {
      const meta = table.options.meta as {
        actions: { onEdit: (u: Usuario) => void; onDelete: (u: Usuario) => void };
      };
      const usuario = row.original as Usuario;
      return (
        <div className="flex gap-2">
          <ActionButtons
            onEdit={() => meta.actions.onEdit(usuario)}
            onDelete={() => meta.actions.onDelete(usuario)}
          />
        </div>
      );
    },
  },
];
