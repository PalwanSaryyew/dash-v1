"use client";

import { SummUpdate } from "../../../generated/prisma";
import { columns } from "./columns"; // columns tanımını buraya alıyoruz
import DataTable from "@/components/custom/table/data-table"; // DataTable'ı buraya alıyoruz

// Sadece 'data' prop'unu alan yeni bir interface tanımlıyoruz
interface TopupsTableProps {
   data: SummUpdate[];
}

// Bu bileşen, istemci tarafında çalışacak ve tabloyu oluşturacak
export function TopupsTable({ data }: TopupsTableProps) {
   return (
      <div className="container mx-auto py-10">
         <DataTable columns={columns} data={data} />
      </div>
   );
}
