"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Order } from "../../../generated/prisma";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuLabel,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { DataTableColumnHeader } from "@/components/custom/table/data-table-column-header";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

export const columns: ColumnDef<Order>[] = [
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
      filterFn: "equalsString",
   },
   {
      accessorKey: "status",
      header: ({ column }) => (
         <DataTableColumnHeader column={column} title="Status" />
      ),
      cell: ({ row }) => {
         const status = row.original.status;
         return (
            <Badge
               className={cn(
                  status === "pending"
                     ? "bg-ring"
                     : status === "accepted"
                     ? "bg-chart-1"
                     : status === "paid"
                     ? "bg-chart-4"
                     : status === "delivering"
                     ? "bg-chart-3"
                     : status === "completed"
                     ? "bg-chart-2"
                     : status === "cancelled"
                     ? "bg-chart-5"
                     : "bg-secondary",
                  " text-accent-foreground"
               )}
            >
               {status}
            </Badge>
         );
      },
   },
   {
      accessorKey: "receiver",
      header: ({ column }) => (
         <DataTableColumnHeader column={column} title="Receiver" />
      ),
   },
   {
      accessorKey: "userId",
      header: ({ column }) => (
         <DataTableColumnHeader column={column} title="User ID" />
      ),
   },
   {
      accessorKey: "productId",
      header: ({ column }) => (
         <DataTableColumnHeader column={column} title="Product ID" />
      ),
      filterFn: "equalsString",
   },
   {
      accessorKey: "courierid",
      header: ({ column }) => (
         <DataTableColumnHeader column={column} title="Courier ID" />
      ),
   },
   {
      accessorKey: "quantity",
      header: ({ column }) => (
         <DataTableColumnHeader column={column} title="Quantity" />
      ),
      filterFn: "equalsString",
   },
   {
      accessorKey: "total",
      header: ({ column }) => (
         <div
            className="text-right flex items-center justify-end cursor-pointer select-none"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
         >
            <ArrowUpDown className="mr-1 h-4 w-4" />
            Total
         </div>
      ),
      cell: ({ row }) => {
         const total = parseFloat(row.getValue("total"));
         /* const formatted = new Intl.NumberFormat("en-US", {
            style: "decimal",
            currency: row.original.payment,
         }).format(total); */

         return <div className="text-right font-medium">{total}</div>;
      },
      filterFn: "equalsString",
   },
   {
      accessorKey: "payment",
      header: ({ column }) => (
         <DataTableColumnHeader
            column={column}
            title="Payment"
            className="text-left"
         />
      ),
      cell: ({ row }) => {
         const currency = row.original.payment;
         return (
            <div
               className={cn(
                  currency === "TMT"
                     ? "text-tmt"
                     : currency === "TON"
                     ? "text-ton"
                     : "text-usdt",
                  "text-left font-medium"
               )}
            >
               {currency}
            </div>
         );
      },
   },
   {
      accessorKey: "createdAt",
      header: ({ column }) => (
         <div className="text-right">
            <Button
               variant="secondary"
               onClick={() =>
                  column.toggleSorting(column.getIsSorted() === "asc")
               }
            >
               Date
            </Button>
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
                           navigator.clipboard.writeText(payment.userId)
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
