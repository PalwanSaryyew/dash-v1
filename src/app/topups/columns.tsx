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

export const columns: ColumnDef<SummUpdate>[] = [
   {
      accessorKey: "id",
      header: ({ column }) => {
         return (
            <Button
               variant="secondary"
               className="pl-0"
               onClick={() =>
                  column.toggleSorting(column.getIsSorted() === "asc")
               }
            >
               ID
               <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
         );
      },
   },
   {
      accessorKey: "sum",
      header: ({ column }) => {
         return (
            <Button
               variant="secondary"
               onClick={() =>
                  column.toggleSorting(column.getIsSorted() === "asc")
               }
            >
               Sum
            </Button>
         );
      },
   },
   {
      accessorKey: "currency",
      header: ({ column }) => {
         return (
            <Button
               variant="secondary"
               onClick={() =>
                  column.toggleSorting(column.getIsSorted() === "asc")
               }
            >
               Currency
            </Button>
         );
      },
   },
   {
      accessorKey: "cashierid",
      header: ({ column }) => {
         return (
            <Button
               variant="secondary"
               onClick={() =>
                  column.toggleSorting(column.getIsSorted() === "asc")
               }
            >
               Cashier ID
            </Button>
         );
      },
   },
   {
      accessorKey: "clientid",

      header: ({ column }) => {
         return (
            <Button
               variant="secondary"
               onClick={() =>
                  column.toggleSorting(column.getIsSorted() === "asc")
               }
            >
               Client ID
            </Button>
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
      header: () => <span className="sr-only">Actions</span>,
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
         );
      },
   },
];
