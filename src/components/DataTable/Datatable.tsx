"use client"

import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ReactNode, useState } from "react";
import Image from 'next/image';
import { DataTableSearch } from "./DatatableSearch";
import DatatablePagination from "./DatatablePagination";
import { Card } from "../ui/card";
import { Londrina_Solid } from "next/font/google";

type MetaPermissions<TData> = {
  actions: {
    onEdit: (row: TData) => void;    
    onDelete: (row: TData) => void;  
  };
};

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[],
  pageSize?: number;
  meta?: MetaPermissions<TData>;
  actionButton?: ReactNode;
}


export function DataTable<TData, TValue>({
  columns,
  data,
  pageSize = 10,
  meta,
  actionButton
}: DataTableProps<TData, TValue>) {
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
    []
  )
  const [globalFilter, setGlobalFilter] = useState<string>("");
    
  const table = useReactTable({
    data,
    columns,
    meta: meta,
    getCoreRowModel: getCoreRowModel(),
		onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
		state: {
      columnFilters, globalFilter 
    },
    initialState: { pagination: { pageSize } },
  })

  return (
    <>
      <div className="w-full flex justify-between md:items-center items-end flex-wrap gap-4 md:flex-row flex-col-reverse">
        <DataTableSearch table={table} placeholder="Buscar..." className="md:w-sm w-full" />
        {actionButton}
      </div>

      {/* Tabela normal */}
      <div className="overflow-hidden rounded-md border hidden md:block">
        <Table className="text-base">
          <TableHeader className="bg-white-bg">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="text-dark-cyan font-bold text-xl px-6 py-4">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="px-6 py-4 text-base">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="p-4 h-24 text-center">
                  <div className="flex flex-col gap-3 justify-center">
                    <Image
                      src="/sem-dados.svg"    
                      alt="Imagem sem dados"               
                      width={400}                         
                      height={300}   
                      style={{margin: "0 auto"}}                      
                    />
                    <span style={{fontFamily: "Londrina Solid"}} className="text-2xl">Oops! Parece que não tem dados aqui!</span>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Tabela como cards no mobile */}
      <div className="overflow-x-auto md:hidden flex flex-col gap-3" >
        {table.getRowModel().rows?.length ? (
          table.getRowModel().rows.map((row) => (
            <Card
              key={row.id}
              className="w-full p-3 shadow"
            >
              {row.getVisibleCells().map((cell, index) => (
                <div key={cell.id} className="flex justify-between text-sm py-2">
                  <strong className="text-gray-600"> {cell.column.columnDef.header?.toString()}:</strong>
                  <span>{flexRender(cell.column.columnDef.cell, cell.getContext())}</span>
                </div>
              ))}
            </Card>
          ))
        ) : (
          <div className="p-4">
              <div className="flex flex-col gap-3 justify-center">
                <Image
                  src="/sem-dados.svg"    
                  alt="Imagem sem dados"               
                  width={400}                         
                  height={300}   
                  style={{margin: "0 auto"}}                      
                />
                <span style={{fontFamily: "Londrina Solid"}} className="text-2xl">Oops! Parece que não tem dados aqui!</span>
              </div>
          </div>
        )}
      </div>
      <div className="w-full flex items-center justify-between flex-wrap gap-y-2">
        <span className="text-gray">{table.getFilteredRowModel().rows.length} registros</span>
        <DatatablePagination table={table} />
      </div>
    </>
  )
}