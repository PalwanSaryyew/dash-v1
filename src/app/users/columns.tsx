"use client";

import { ColumnDef } from "@tanstack/react-table";
import { User } from "../../../generated/prisma";
import { MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuLabel,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";

import { DataTableColumnHeader } from "@/components/custom/table/data-table-column-header";

export const columns: ColumnDef<User>[] = [
   {
      id: "select",
      header: ({ table }) => (
         <Checkbox
            checked={
               table.getIsAllPageRowsSelected() ||
               (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) =>
               table.toggleAllPageRowsSelected(!!value)
            }
            aria-label="Select all"
         />
      ),
      cell: ({ row }) => (
         <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
         />
      ),
      enableSorting: false,
      enableHiding: false,
   },
   {
      accessorKey: "id",
      header: ({ column }) => (
         <DataTableColumnHeader column={column} title="ID" />
      ),
   },
   {
      accessorKey: "walNum",
      header: ({ column }) => (
         <DataTableColumnHeader column={column} title="Balans ID" />
      ),
   },
   {
      accessorKey: "sumTmt",
      header: ({ column }) => (
         <DataTableColumnHeader column={column} title="TMT Bal." />
      ),
      filterFn: "equalsString",
   },
   {
      accessorKey: "sumUsdt",
      header: ({ column }) => (
         <DataTableColumnHeader column={column} title="USDT Bal." />
      ),
      filterFn: "equalsString",
   },
   {
      accessorKey: "createdAt",
      header: ({ column }) => (
         <div className="flex justify-end">
            <DataTableColumnHeader column={column} title="Goşuldy" />
         </div>
      ),
      filterFn: (row, columnId, filterValue) => {
         // filterValue'nun bir dizi ve içinde iki tarih olduğundan emin oluyoruz
         if (!Array.isArray(filterValue) || filterValue.length !== 2) {
            return true; // Eğer filtre değeri geçersizse, satırı göstermeye devam et
         }

         const [from, to] = filterValue as [Date, Date];
         const rowDate = new Date(row.getValue(columnId));

         // Satırın tarihinin, seçilen aralıkta olup olmadığını kontrol et
         // Bitiş tarihini de kapsama dahil etmek için saatini 23:59:59 yapıyoruz
         if (from && to) {
            const toEndDate = new Date(to);
            toEndDate.setHours(23, 59, 59, 999);
            return rowDate >= from && rowDate <= toEndDate;
         }

         return true; // Eğer from veya to tanımsız ise filtreleme yapma
      },
      cell: ({ row }) => {
         const date = row.getValue("createdAt") as string;
         const formatted = new Date(date).toLocaleDateString("tr-TR", {
            year: "numeric",
            month: "numeric",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
         });

         return <div className="text-right font-medium">{formatted}</div>;
      },
   },
   {
      accessorKey: "Üýtgedildi",
      header: ({ column }) => (
         <div className="flex justify-end">
            <DataTableColumnHeader column={column} title="Üýtgedildi" />
         </div>
      ),
      filterFn: (row, columnId, filterValue) => {
         // filterValue'nun bir dizi ve içinde iki tarih olduğundan emin oluyoruz
         if (!Array.isArray(filterValue) || filterValue.length !== 2) {
            return true; // Eğer filtre değeri geçersizse, satırı göstermeye devam et
         }

         const [from, to] = filterValue as [Date, Date];
         const rowDate = new Date(row.getValue(columnId));

         // Satırın tarihinin, seçilen aralıkta olup olmadığını kontrol et
         // Bitiş tarihini de kapsama dahil etmek için saatini 23:59:59 yapıyoruz
         if (from && to) {
            const toEndDate = new Date(to);
            toEndDate.setHours(23, 59, 59, 999);
            return rowDate >= from && rowDate <= toEndDate;
         }

         return true; // Eğer from veya to tanımsız ise filtreleme yapma
      },
      cell: ({ row }) => {
         const date = row.getValue("createdAt") as string;
         const formatted = new Date(date).toLocaleDateString("tr-TR", {
            year: "numeric",
            month: "numeric",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
         });

         return <div className="text-right font-medium">{formatted}</div>;
      },
   },
   {
      id: "actions",
      header: () => <div className="text-right">Actions</div>,
      cell: ({ row }) => {
         const payment = row.original;

         return (
            <div className="text-right">
               <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                     <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                     </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                     <DropdownMenuLabel>Actions</DropdownMenuLabel>
                     <DropdownMenuItem
                        onClick={() =>
                           navigator.clipboard.writeText(payment.id)
                        }
                     >
                        Copy Client ID
                     </DropdownMenuItem>
                     <DropdownMenuSeparator />
                     <DropdownMenuItem>View customer</DropdownMenuItem>
                     <DropdownMenuItem>View payment details</DropdownMenuItem>
                  </DropdownMenuContent>
               </DropdownMenu>
            </div>
         );
      },
   },
];
