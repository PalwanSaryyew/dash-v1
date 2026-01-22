import { Product } from "../../../generated/prisma";
import { prisma } from "../../../prisma/prismaConfig";
import { ProductsTable } from "./products-table";

export const dynamic = 'force-dynamic';

async function getData(): Promise<Product[]> {
  // Server-side data fetching
  return prisma.product.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
}

export default async function ProductsPage() {
  const data = await getData();

  // Passing data as a prop to the client component
  return <ProductsTable data={data} />;
}
