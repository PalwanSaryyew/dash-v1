
import { columns } from "./columns"
import { DataTable } from "@/components/custom/table/data-table"
import { Order } from "../../../generated/prisma"
import { prisma } from "../../../prisma/prismaConfig";



async function getData(): Promise<Order[]> {
  // Fetch data from your API here.
  return prisma.order.findMany({
      orderBy: {
         createdAt: "desc",
      },
   });
}

export default async function DemoPage() {
  const data = await getData()

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} />
    </div>
  )
}