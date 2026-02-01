"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Product } from "../../../generated/prisma";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuLabel,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { DataTableColumnHeader } from "@/components/custom/table/data-table-column-header";
import { Checkbox } from "@/components/ui/checkbox";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Row, Column, Table } from "@tanstack/react-table";

declare module "@tanstack/react-table" {
   // eslint-disable-next-line @typescript-eslint/no-unused-vars
   interface TableMeta<TData> {
      editedRow?: number | null;
      updateProduct: (
         rowIndex: number,
         columnId: string,
         value: string | number,
      ) => void;
      setEditedRow: (rowIndex: number | null) => void;
      cancelEdit: () => void;
   }
}

const EditableCell = ({
   getValue,
   row,
   column,
   table,
}: {
   getValue: () => unknown;
   row: Row<Product>;
   column: Column<Product, unknown>;
   table: Table<Product>;
}) => {
   const initialValue = getValue();
   const [value, setValue] = useState<string | number>(
      (initialValue as string | number) ?? "",
   );
   const isEditing = table.options.meta?.editedRow === row.index;

   const onBlur = () => {
      const isNumeric = typeof initialValue === "number";
      const updatedValue = isNumeric ? parseFloat(value.toString()) : value;
      table.options.meta?.updateProduct(row.index, column.id, updatedValue);
   };

   React.useEffect(() => {
      setValue((initialValue as string | number) ?? "");
   }, [initialValue]);

   if (isEditing) {
      return (
         <Input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onBlur={onBlur}
         />
      );
   }

   return <>{value}</>;
};

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
         <DataTableColumnHeader column={column} title="Part" />
      ),
      cell: (props) => <EditableCell {...props} />,
      filterFn: "equalsString",
   },
   {
      accessorKey: "title",
      header: ({ column }) => (
         <DataTableColumnHeader column={column} title="Title" />
      ),
      cell: (props) => <EditableCell {...props} />,
   },
   {
      accessorKey: "amount",
      header: ({ column }) => (
         <DataTableColumnHeader column={column} title="Amount" />
      ),
      cell: (props) => <EditableCell {...props} />,
      filterFn: "equalsString",
   },
   {
      accessorKey: "duration",
      header: ({ column }) => (
         <DataTableColumnHeader column={column} title="Duration" />
      ),
      cell: (props) => <EditableCell {...props} />,
      filterFn: "equalsString",
   },
   {
      accessorKey: "priceBuy",
      header: ({ column }) => (
         <DataTableColumnHeader column={column} title="Price (Buy)" />
      ),
      cell: (props) => <EditableCell {...props} />,
      filterFn: "equalsString",
   },
   {
      accessorKey: "priceTMT",
      header: ({ column }) => (
         <DataTableColumnHeader column={column} title="Price (TMT)" />
      ),
      cell: (props) => <EditableCell {...props} />,
      filterFn: "equalsString",
   },
   {
      accessorKey: "priceUSDT",
      header: ({ column }) => (
         <DataTableColumnHeader column={column} title="Price (USDT)" />
      ),
      cell: (props) => <EditableCell {...props} />,
      filterFn: "equalsString",
   },
   {
      accessorKey: "description",
      header: ({ column }) => (
         <DataTableColumnHeader column={column} title="Description" />
      ),
      cell: (props) => <EditableCell {...props} />,
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
      cell: ({ row, table }) => {
         const isEditing = table.options.meta?.editedRow === row.index;

         const handleEdit = () => {
            table.options.meta?.setEditedRow(row.index);
         };

         const handleCancel = () => {
            table.options.meta?.cancelEdit();
            table.options.meta?.setEditedRow(null);
         };

         const handleSave = async () => {
            const product = row.original as Product;
            try {
               await fetch(`/api/products/${product.id}`, {
                  method: "PATCH",
                  headers: {
                     "Content-Type": "application/json",
                  },
                  body: JSON.stringify(product),
               });
               table.options.meta?.setEditedRow(null);
            } catch (error) {
               console.error("Failed to update product:", error);
               // Optionally, revert changes here
            }
         };

         if (isEditing) {
            return (
               <div className="text-right">
                  <Button onClick={handleSave} size="sm" className="mr-2">
                     Save
                  </Button>
                  <Button onClick={handleCancel} size="sm" variant="outline">
                     Cancel
                  </Button>
               </div>
            );
         }
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
                           navigator.clipboard.writeText(
                              (row.original as Product).id.toString(),
                           )
                        }
                     >
                        Copy Product ID
                     </DropdownMenuItem>
                     <DropdownMenuSeparator />
                     <DropdownMenuItem>View product details</DropdownMenuItem>
                     <DropdownMenuItem onClick={handleEdit}>
                        Edit product
                     </DropdownMenuItem>
                  </DropdownMenuContent>
               </DropdownMenu>
            </div>
         );
      },
   },
];
