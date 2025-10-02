import {  User } from "../../../generated/prisma";
import { prisma } from "../../../prisma/prismaConfig";
import { UsersTable } from "./users-table";



async function getData(): Promise<User[]> {
   // Fetch data from your API here.
   return prisma.user.findMany({
      orderBy: {
         createdAt: "desc",
      },
   });
}

export default async function TopUpsPage() {
   const data = await getData();
   return <UsersTable data={data} />;
}
