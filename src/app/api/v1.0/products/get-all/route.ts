import { NextResponse } from "next/server";
import { prisma } from "@/lib/prismaClient";

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { name: "asc" },
    });

    return NextResponse.json({ products });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json({ error: "Помилка сервера" }, { status: 500 });
  }
}
