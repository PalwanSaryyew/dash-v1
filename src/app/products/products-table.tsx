"use client";
import { Product } from "../../../generated/prisma";
import { columns } from "./columns";
import DataTable from "@/components/custom/table/data-table";
import { useState } from "react";

interface ProductsTableProps {
  data: Product[];
}

export function ProductsTable({ data: initialData }: ProductsTableProps) {
   const [data, setData] = useState(initialData);
   const [editedRow, setEditedRow] = useState<number | null>(null);

   const updateProduct = (
      rowIndex: number,
      columnId: string,
      value: unknown
   ) => {
      setData((prev) =>
         prev.map((row, index) => {
            if (index === rowIndex) {
               return {
                  ...prev[rowIndex],
                  [columnId]: value,
               };
            }
            return row;
         })
      );
   };

   return (
      <div className="container mx-auto py-10">
         <DataTable
            columns={columns}
            data={data.map((d, index) => ({ ...d, isEditing: editedRow === index }))}
            meta={{
               updateProduct,
               editedRow,
               setEditedRow,
               cancelEdit: () => setData(initialData),
               initialData,
            }}
         />
      </div>
   );
}