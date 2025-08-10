import { prisma } from "@/lib/prismaClient";
import { NextRequest, NextResponse } from "next/server";
import z from "zod"

type ProductWeight = {
  productId: string;
  weight: number;
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, products } = body as { 
      name: string; 
      products: ProductWeight[];
    };

    if (!name || !products || !Array.isArray(products) || products.length === 0) {
      return NextResponse.json({ error: "Поля всі мають бути заповнені" }, { status: 400 });
    }

    for (const p of products) {
      const result = z.number().min(0,"Всі продукти повинні мати вагу більше 0")
      
      if (!p.productId || typeof p.weight !== "number" || p.weight <= 0) {
        return NextResponse.json({ error:""  }, { status: 400 });
      }
    }

    // Перевірка, чи існує страва з таким ім'ям
    const existingDish = await prisma.dish.findUnique({
      where: { name },
    });

    if (existingDish) {
      return NextResponse.json({ error: "Страва з такою назвою вже існує" }, { status: 400 });
    }

    const dish = await prisma.dish.create({
      data: {
        name,
        products: {
          create: products.map(p => ({
            product: { connect: { id: p.productId } },
            weight: p.weight,
          })),
        },
      },
      include: {
        products: {
          include: {
            product: true,
          },
        },
      },
    });

    return NextResponse.json(dish, { status: 201 });
  } catch (error) {
    console.error("DB error:", error);
    return NextResponse.json({ error: "Помилка додавання страви" }, { status: 500 });
  }
}
