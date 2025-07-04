import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prismaClient";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name } = body;

    if (!name || typeof name !== "string") {
      return NextResponse.json(
        { error: "Поле 'name' обов'язкове і має бути рядком" },
        { status: 400 }
      );
    }

    const product = await prisma.product.create({
      data: {
        name,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("Помилка додавання продукту:", error);
    return NextResponse.json(
      { error: "Помилка сервера при додаванні продукту" },
      { status: 500 }
    );
  }
}
