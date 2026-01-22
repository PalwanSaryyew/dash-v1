"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Product, ProductType } from "../../../generated/prisma";
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

export const columns: ColumnDef<Product>[] = [
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
      accessorKey: "name",
      header: ({ column }) => (
         <DataTableColumnHeader column={column} title="Name" />
      ),
      cell: ({ row }) => {
         const name: ProductType = row.getValue("name");
         return (
            <Badge
               className={cn(
                  name === "jtn"
                     ? "bg-blue-500"
                     : name === "star"
                     ? "bg-yellow-500"
                     : "bg-gray-500",
                  " text-accent-foreground"
               )}
            >
               {name}
            </Badge>
         );
      },
      filterFn: "equalsString",
   },
   {
      accessorKey: "priceTMT",
      header: ({ column }) => (
         <DataTableColumnHeader column={column} title="Price (TMT)" />
      ),
      cell: ({ row }) => {
         const priceTMT = parseFloat(row.getValue("priceTMT"));
         return <div className="font-medium">{priceTMT}</div>;
      },
      filterFn: "equalsString",
   },
   {
      accessorKey: "priceUSDT",
      header: ({ column }) => (
         <DataTableColumnHeader column={column} title="Price (USDT)" />
      ),
      cell: ({ row }) => {
         const priceUSDT = parseFloat(row.getValue("priceUSDT"));
         return <div className="font-medium">{priceUSDT}</div>;
      },
      filterFn: "equalsString",
   },
   {
      accessorKey: "amount",
      header: ({ column }) => (
         <DataTableColumnHeader column={column} title="Amount" />
      ),
      filterFn: "equalsString",
   },
   {
      accessorKey: "duration",
      header: ({ column }) => (
         <DataTableColumnHeader column={column} title="Duration" />
      ),
      filterFn: "equalsString",
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
      filterFn: (row, columnId, filterValue) => {
         if (!Array.isArray(filterValue) || filterValue.length !== 2) {
            return true;
         }
         const [from, to] = filterValue as [Date, Date];
         const rowDate = new Date(row.getValue(columnId));
         if (from && to) {
            const toEndDate = new Date(to);
            toEndDate.setHours(23, 59, 59, 999);
            return rowDate >= from && rowDate <= toEndDate;
         }
         return true;
      },
   },
   {
      id: "actions",
      header: () => <div className="text-right">Actions</div>,
      cell: ({ row }) => {
         const product = row.original;

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
                           navigator.clipboard.writeText(product.id.toString())
                        }
                     >
                        Copy Product ID
                     </DropdownMenuItem>
                     <DropdownMenuSeparator />
                     <DropdownMenuItem>View product details</DropdownMenuItem>
                     <DropdownMenuItem>Edit product</DropdownMenuItem>
                  </DropdownMenuContent>
               </DropdownMenu>
            </div>
         );
      },
   },
];
