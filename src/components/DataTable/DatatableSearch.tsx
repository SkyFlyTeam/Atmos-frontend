"use client";
import { useEffect, useState } from "react"; 
import type { Table } from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export function DataTableSearch<T>({
  table,
  placeholder = "Pesquisar...",
  debounceMs = 300,
  className,
}: {
  table: Table<T>;
  placeholder?: string;
  debounceMs?: number;
  className?: string;
}) {
  const gf = (table.getState().globalFilter as string) ?? "";
  const [value, setValue] = useState<string>(gf);

  useEffect(() => {
    setValue(gf);
  }, [gf]);

  useEffect(() => {
    const t = setTimeout(() => table.setGlobalFilter(value), debounceMs);
    return () => clearTimeout(t);
  }, [value, debounceMs, table]);

  return (
    <div className={`relative ${className} bg-white`}>
      <Search className="absolute left-2 top-3 h-4 w-4 text-gray-400" />
      <Input
        placeholder={placeholder}
        aria-label="Pesquisar na tabela"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="pl-8 w-full h-10"
      />
    </div>
  );
}