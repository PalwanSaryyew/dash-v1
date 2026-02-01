import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../prisma/prismaConfig";
import { Prisma } from "../../../../../generated/prisma";
import type {
   Product,
   
} from "../../../../../generated/prisma";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: NextRequest, { params }: Params) {
   try {
      const { id: idParam } = (await params) as { id: string };
      const id = parseInt(idParam, 10);
      if (Number.isNaN(id)) {
         return NextResponse.json(
            { error: "Invalid product id" },
            { status: 400 },
         );
      }

      const body: Partial<Product> = await request.json();

      // Create a shallow copy and remove read-only or server-managed fields
      const dataToUpdate = { ...body } as Record<string, unknown>;
      delete dataToUpdate.id;
      delete dataToUpdate.createdAt;
      delete dataToUpdate.updatedAt;
      delete dataToUpdate.isEditing;

      if (Object.keys(dataToUpdate).length === 0) {
         return NextResponse.json(
            { error: "No update fields provided" },
            { status: 400 },
         );
      }

      const updatedProduct = await prisma.product.update({
         where: { id },
         data: dataToUpdate as Prisma.ProductUpdateInput,
      });

      return NextResponse.json(updatedProduct, { status: 200 });
   } catch (error) {
      console.error("Error updating product:", error);
      return NextResponse.json(
         { error: "Failed to update product" },
         { status: 500 },
      );
   }
}
