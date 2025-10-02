"use client";

import { User } from "../../../generated/prisma";
import DataTable from "@/components/custom/table/data-table"; // DataTable'ı buraya alıyoruz
import { columns } from "./columns";

// Sadece 'data' prop'unu alan yeni bir interface tanımlıyoruz
interface UsersTableProps {
   data: User[];
}

// Bu bileşen, istemci tarafında çalışacak ve tabloyu oluşturacak
export function UsersTable({ data }: UsersTableProps) {
   return (
      <div className="container mx-auto py-10">
         <DataTable columns={columns} data={data} />
      </div>
   );
}
