"use client";

import {
   ColumnDef,
   ColumnFiltersState,
   flexRender,
   getCoreRowModel,
   getFilteredRowModel,
   getPaginationRowModel,
   getSortedRowModel,
   SortingState,
   useReactTable,
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
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuRadioGroup,
   DropdownMenuRadioItem,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { DataTablePagination } from "./data-table-pagination";
import { DataTableViewOptions } from "./toggle-column-visibility";
import { DatePickerWithRange } from "../date-range-picker";
import { DateRange } from "react-day-picker";

interface DataTableProps<TData, TValue> {
   columns: ColumnDef<TData, TValue>[];
   data: TData[];
}

export function DataTable<TData, TValue>({
   columns,
   data,
}: DataTableProps<TData, TValue>) {
   // sorting state
   const [sorting, setSorting] = useState<SortingState>([]);
   // search filtering state
   const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
   // which column is being searched
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
   // column visibility state
   const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
      {}
   );
   // row selection state
   //? const [rowSelection, setRowSelection] = useState({})
   // date range state
   const [date, setDate] = useState<DateRange | undefined>(undefined);

   const table = useReactTable({
      data,
      columns,
      getCoreRowModel: getCoreRowModel(),
      onSortingChange: setSorting, // sorting setter
      onColumnFiltersChange: setColumnFilters, // filtering setter
      onColumnVisibilityChange: setColumnVisibility, // column visibility setter
      //? onRowSelectionChange: setRowSelection, // row selection setter
      getPaginationRowModel: getPaginationRowModel(), // pagination
      getSortedRowModel: getSortedRowModel(), // sorting
      getFilteredRowModel: getFilteredRowModel(), // filtering
      state: {
         sorting, // sorting state
         columnFilters, // filtering state
         columnVisibility, // column visibility state
         //? rowSelection, // row selection state
      },
      initialState: {
         pagination: {
            pageSize: 15, // Başlangıçta sayfa başına 15 satır göster
         },
      },
   });

   // when changing the column to filter by, clear all existing filters
   const handleFilterChange = (value: string) => {
      setColumnFilters([]); // Clear all existing filters
      setSearching(value); // Set the new column to filter by
   };

   //  Tarih değiştiğinde filtreyi güncelleyen useEffect
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
         {/* filtering box */}
         <div className="flex items-center py-4 gap-2">
            {/* search box */}
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
               {/* Select */}
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
            {/* Date Range Selector*/}
            <DatePickerWithRange date={date} setDate={setDate} />
            {/* Column Visibility */}
            <DataTableViewOptions table={table} />
         </div>
         {/* table box */}
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
