import { SummUpdate } from "../../../generated/prisma";
import { prisma } from "../../../prisma/prismaConfig";
import { TopupsTable } from "./topups-table";

async function getData(): Promise<SummUpdate[]> {
   // Fetch data from your API here.
   return prisma.summUpdate.findMany({
      orderBy: {
         createdAt: "desc",
      },
   });
}

export default async function TopUpsPage() {
   const data = await getData();
   return <TopupsTable data={data} />;
}
