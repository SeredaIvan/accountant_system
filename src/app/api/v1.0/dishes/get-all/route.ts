import { prisma } from "@/lib/prismaClient";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const dishes = await prisma.dish.findMany({
      include: {
        products: {
          include: {
            product: true, 
          },
        },
        days: true, 
      },
    });

    if (!dishes || dishes.length === 0) {
      return NextResponse.json({ error: "Немає страв" }, { status: 404 });
    }
    
    console.log(dishes[10] )
    return NextResponse.json({ dishes }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : error }, { status: 500 });
  }
}
