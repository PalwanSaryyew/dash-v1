import { Order } from "../../../generated/prisma";
import { prisma } from "../../../prisma/prismaConfig";
import { OrdersTable } from "./orders-table";


async function getData(): Promise<Order[]> {
  // Sunucu tarafında veriyi çekmeye devam ediyoruz
  return prisma.order.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
}

export default async function OrdersPage() {
  const data = await getData();

  // Artık sadece veriyi prop olarak yeni istemci bileşenimize aktarıyoruz
  return <OrdersTable data={data} />;
}