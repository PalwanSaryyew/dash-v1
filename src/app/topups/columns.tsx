"use client";

import { ColumnDef } from "@tanstack/react-table";
import { SummUpdate } from "../../../generated/prisma";
import { ArrowUpDown } from "lucide-react";
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
import { DataTableColumnHeader } from "./data-table-column-header";

export const columns: ColumnDef<SummUpdate>[] = [
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
      accessorKey: "sum",
      header: ({ column }) => (
         <DataTableColumnHeader column={column} title="Sum" />
      ),
      filterFn: "equalsString",
   },
   {
      accessorKey: "currency",
      header: ({ column }) => (
         <DataTableColumnHeader column={column} title="Currency" />
      ),
   },
   {
      accessorKey: "cashierid",
      header: ({ column }) =>(
         <DataTableColumnHeader column={column} title="Cashier ID" />
      ),
   },
   {
      accessorKey: "clientid",

      header: ({ column }) => {
      return (
        <div
         className="flex items-center cursor-pointer select-none"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Client ID
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </div>
      )
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
                           navigator.clipboard.writeText(payment.clientid)
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
