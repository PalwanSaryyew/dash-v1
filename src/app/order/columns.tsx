"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Order } from "../../../generated/prisma";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuLabel,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, MoreHorizontal, Trash } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "@/components/custom/tableOld/dataTableColumnHeader";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Payment = {
   id: string;
   amount: number;
   status: "pending" | "processing" | "success" | "failed";
   email: string;
};

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
      header: ({ column }) => {
         return (
            <div
               className="cursor-pointer hover:underline"
               onClick={() =>
                  column.toggleSorting(column.getIsSorted() === "asc")
               }
            >
               ID
               {/* <ArrowUpDown className="ml-2 h-4 w-4" /> */}
            </div>
         );
      },
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
      header: "Receiver",
   },
   {
      accessorKey: "userId",
      header: "User ID",
   },
   {
      accessorKey: "productId",
      header: "Product ID",
   },
   {
      accessorKey: "courierid",
      header: ({ column }) => {
         return (
            <Button
               variant="ghost"
               onClick={() =>
                  column.toggleSorting(column.getIsSorted() === "asc")
               }
            >
               courierid
               <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
         );
      },
   },

   {
      accessorKey: "quantity",
      header: "Quantity",
   },
   {
      accessorKey: "total",
      header: () => <div className="text-right">Total</div>,
      cell: ({ row }) => {
         const total = parseFloat(row.getValue("total"));
         /* const formatted = new Intl.NumberFormat("en-US", {
            style: "decimal",
            currency: row.original.payment,
         }).format(total); */

         return <div className="text-right font-medium">{total}</div>;
      },
   },
   {
      accessorKey: "currency",
      header: () => <div className="text-left">Currency</div>,
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
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
         const payment = row.original;

         return (
            <DropdownMenu>
               <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                     <span className="sr-only">Open menu</span>
                     <MoreHorizontal className="h-4 w-4" />
                  </Button>
               </DropdownMenuTrigger>
               <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                     onClick={() =>
                        navigator.clipboard.writeText(payment.userId)
                     }
                  >
                     Copy Client ID
                  </DropdownMenuItem>
                  <DropdownMenuItem>View customer</DropdownMenuItem>

                  <DropdownMenuItem className="text-destructive">
                     <Trash className="text-destructive" /> Delete
                  </DropdownMenuItem>
               </DropdownMenuContent>
            </DropdownMenu>
         );
      },
   },
];
