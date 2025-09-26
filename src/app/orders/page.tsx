import { DataTable } from "@/components/custom/table/dataTable";
import { columns } from "./columns";
import { prisma } from "../../../prisma/prismaConfig";

export default async function DemoPage() {
   const data = await prisma.order.findMany();

   return (
      <div className="container mx-auto py-10">
         <DataTable columns={columns} data={data} />
      </div>
   );
}
