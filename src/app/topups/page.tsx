import { columns } from "./columns";
import { SummUpdate } from "../../../generated/prisma";
import { prisma } from "../../../prisma/prismaConfig";
import { DataTable } from "@/components/custom/table/data-table";


async function getData(): Promise<SummUpdate[]> {
   // Fetch data from your API here.
   return prisma.summUpdate.findMany({
      orderBy: {
         createdAt: "desc",
      },
   });
}

const Page = async () => {
   const data = await getData();
   return (
      <div className="container mx-auto py-10">
         <DataTable columns={columns} data={data} />
      </div>
   );
};

export default Page;
