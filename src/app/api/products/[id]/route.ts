import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../prisma/prismaConfig";
import { Product } from "../../../../../generated/prisma";

export async function PATCH(
   request: NextRequest,
   { params }: { params: { id: string } },
) {
   try {
      const body: Partial<Product> = await request.json();
      const { id } = await params;

      // Ensure numeric fields are correctly typed
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const data: any = {
      ...body,
      priceBuy: body.priceBuy ? parseFloat(body.priceBuy as never) : undefined,
      priceTMT: body.priceTMT ? parseFloat(body.priceTMT as never) : undefined,
      priceUSDT: body.priceUSDT ? parseFloat(body.priceUSDT as never) : undefined,
      amount: body.amount ? parseInt(body.amount as never) : undefined,
    };

    if (data.requirementsId) {
      data.Requirements = {
        connect: {
          id: data.requirementsId,
        },
      };
      delete data.requirementsId;
    }

    delete data.id;
    delete data.createdAt;
    delete data.updatedAt;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (data as any).isEditing;

      const updatedProduct = await prisma.product.update({
         where: { id: parseInt(id) },
         data,
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
