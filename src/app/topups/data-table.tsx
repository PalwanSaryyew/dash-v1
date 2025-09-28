"use client";

import {
   ColumnDef,
   flexRender,
   getCoreRowModel,
   useReactTable,
   getPaginationRowModel,
   getSortedRowModel,
   SortingState,
   getFilteredRowModel,
   ColumnFiltersState,
   VisibilityState,
} from "@tanstack/react-table";

import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuRadioGroup,
   DropdownMenuRadioItem,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTablePagination } from "./data-table-pagination";
import { DataTableViewOptions } from "./toggle-column-visibility";
import { DateRange } from "react-day-picker";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";

interface DataTableProps<TData, TValue> {
   columns: ColumnDef<TData, TValue>[];
   data: TData[];
}

export function DataTable<TData, TValue>({
   columns,
   data,
}: DataTableProps<TData, TValue>) {
   const [searching, setSearching] = useState(() => {
      const firstFilterableColumn = columns.find(
         (column) => "accessorKey" in column || "accessorFn" in column
      );
      if (firstFilterableColumn) {
         if (firstFilterableColumn.id) {
            return firstFilterableColumn.id;
         }
         if (
            "accessorKey" in firstFilterableColumn &&
            typeof firstFilterableColumn.accessorKey === "string"
         ) {
            return firstFilterableColumn.accessorKey;
         }
      }
      // Fallback if no suitable column is found, though one is expected.
      return "id";
   });
   // YENİ: Tarih aralığı state'i
   const [date, setDate] = useState<DateRange | undefined>(undefined);
   const [sorting, setSorting] = useState<SortingState>([]);
   const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
   const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
      {}
   );
   const [rowSelection, setRowSelection] = useState({});
   const table = useReactTable({
      data,
      columns,
      getCoreRowModel: getCoreRowModel(),
      getPaginationRowModel: getPaginationRowModel(),
      onSortingChange: setSorting,
      getSortedRowModel: getSortedRowModel(),
      onColumnFiltersChange: setColumnFilters,
      getFilteredRowModel: getFilteredRowModel(),
      onColumnVisibilityChange: setColumnVisibility,
      onRowSelectionChange: setRowSelection,
      state: {
         sorting,
         columnFilters,
         columnVisibility,
         rowSelection,
      },
      initialState: {
         pagination: {
            pageSize: 15, // Başlangıçta sayfa başına 15 satır göster
         },
      },
   });

   const handleFilterChange = (value: string) => {
      setColumnFilters([]); // Clear all existing filters
      setSearching(value); // Set the new column to filter by
   };
   // YENİ: Tarih değiştiğinde filtreyi güncelleyen useEffect
   useEffect(() => {
      // Filtrelemek istediğimiz sütunu alıyoruz (columns.ts dosyasındaki accessorKey ile aynı olmalı)
      const createdAtColumn = table.getColumn("createdAt");

      if (date?.from && date?.to) {
         // Sütuna filtre değerini [from, to] olarak ayarlıyoruz
         createdAtColumn?.setFilterValue([date.from, date.to]);
      } else {
         // Eğer tarih aralığı seçili değilse filtreyi temizliyoruz
         createdAtColumn?.setFilterValue(undefined);
      }
   }, [date, table]); // date veya table nesnesi değiştiğinde bu effect çalışır

   return (
      <div>
         {/* Filtering elements */}
         <div className="flex items-center py-4 gap-4">
            
            {/* search */}
            <div className="flex items-center flex-grow">
               {/* Input */}
               <Input
                  placeholder={"Filter " + searching}
                  value={
                     (table.getColumn(searching)?.getFilterValue() as string) ??
                     ""
                  }
                  onChange={(event) =>
                     table
                        .getColumn(searching)
                        ?.setFilterValue(event.target.value)
                  }
                  className="max-w-sm mr-1.5"
               />
               {/* Radio */}
               <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                     <Button variant="outline">{searching}</Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                     <DropdownMenuRadioGroup
                        value={searching}
                        onValueChange={handleFilterChange}
                     >
                        {" "}
                        {table
                           .getAllColumns()
                           .filter(
                              (column) =>
                                 typeof column.accessorFn !== "undefined" &&
                                 column.getCanFilter()
                           )
                           .map((column) => {
                              return column.id === "createdAt" ? null : (
                                 <DropdownMenuRadioItem
                                    key={column.id}
                                    value={column.id}
                                 >
                                    {column.id}
                                 </DropdownMenuRadioItem>
                              );
                           })}{" "}
                     </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
               </DropdownMenu>
            </div>
            {/* YENİ: Tarih Aralığı Seçici */}
            <DatePickerWithRange date={date} setDate={setDate} />
            {/* Column Visibility */}
            <DataTableViewOptions table={table} />
         </div>
         {/* Table */}
         <div className="overflow-hidden rounded-md border mb-1.5">
            <Table>
               <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                     <TableRow key={headerGroup.id}>
                        {headerGroup.headers.map((header) => {
                           return (
                              <TableHead key={header.id}>
                                 {header.isPlaceholder
                                    ? null
                                    : flexRender(
                                         header.column.columnDef.header,
                                         header.getContext()
                                      )}
                              </TableHead>
                           );
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
                              <TableCell key={cell.id}>
                                 {flexRender(
                                    cell.column.columnDef.cell,
                                    cell.getContext()
                                 )}
                              </TableCell>
                           ))}
                        </TableRow>
                     ))
                  ) : (
                     <TableRow>
                        <TableCell
                           colSpan={columns.length}
                           className="h-24 text-center"
                        >
                           No results.
                        </TableCell>
                     </TableRow>
                  )}
               </TableBody>
            </Table>
         </div>

         {/* Pagination */}
         <DataTablePagination table={table} />
      </div>
   );
}
