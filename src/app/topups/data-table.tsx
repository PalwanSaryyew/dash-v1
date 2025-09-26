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
import { useState } from "react";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuRadioGroup,
   DropdownMenuRadioItem,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DataTableProps<TData, TValue> {
   columns: ColumnDef<TData, TValue>[];
   data: TData[];
}

export function DataTable<TData, TValue>({
   columns,
   data,
}: DataTableProps<TData, TValue>) {
   const [searching, setSearching] = useState("clientid");

   const [sorting, setSorting] = useState<SortingState>([]);
   const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
   const table = useReactTable({
      data,
      columns,
      getCoreRowModel: getCoreRowModel(),
      getPaginationRowModel: getPaginationRowModel(),
      onSortingChange: setSorting,
      getSortedRowModel: getSortedRowModel(),
      onColumnFiltersChange: setColumnFilters,
      getFilteredRowModel: getFilteredRowModel(),
      state: {
         sorting,
         columnFilters,
      },
   });

   const handleFilterChange = (value: string) => {
      setColumnFilters([]); // Clear all existing filters
      setSearching(value); // Set the new column to filter by
   };

   return (
      <div>
         <div className="flex items-center py-4">
            <DropdownMenu>
               <DropdownMenuTrigger asChild>
                  <Button variant="outline">{searching}</Button>
               </DropdownMenuTrigger>
               <DropdownMenuContent className="w-56">
                  <DropdownMenuRadioGroup
                     value={searching}
                     onValueChange={handleFilterChange}
                  >
                     {table
                        .getAllColumns()
                        .filter(
                           (column) =>
                              typeof column.accessorFn !== "undefined" &&
                              column.getCanFilter()
                        )
                        .map((column) => {
                           return (
                              <DropdownMenuRadioItem
                                 key={column.id}
                                 value={column.id}
                              >
                                 {column.id}
                              </DropdownMenuRadioItem>
                           );
                        })}
                  </DropdownMenuRadioGroup>
               </DropdownMenuContent>
            </DropdownMenu>

            <Input
               placeholder={"Filter " + searching}
               value={
                  (table.getColumn(searching)?.getFilterValue() as string) ?? ""
               }
               onChange={(event) =>
                  table
                     .getColumn(searching)
                     ?.setFilterValue(event.target.value)
               }
               className="max-w-sm"
            />
         </div>
         <div className="overflow-hidden rounded-md border">
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
         <div className="flex items-center justify-end space-x-2 py-4">
            <Button
               variant="outline"
               size="sm"
               onClick={() => table.previousPage()}
               disabled={!table.getCanPreviousPage()}
            >
               Previous
            </Button>
            <Button
               variant="outline"
               size="sm"
               onClick={() => table.nextPage()}
               disabled={!table.getCanNextPage()}
            >
               Next
            </Button>
         </div>
      </div>
   );
}
