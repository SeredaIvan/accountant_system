import { prisma } from "@/lib/prismaClient";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { datetime: string } }
) {
  const { datetime } = await params;

  const [day, month, year] = datetime.split("-").map(Number);
  const date = new Date(year, month - 1, day); 
  console.log(date)

  if (!day || !month || !year) {
    return NextResponse.json({ error: "Невірна дата" }, { status: 400 });
  }

  try {
    const dayData = await prisma.day.findFirst({
      where: { date },
      include: {
        dayDishes: {
          include: {
            dish: {
              include: {
                products: {
                  include: {
                    product: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!dayData) {
      return NextResponse.json({ error: "Дня не знайдено" }, { status: 404 });
    }
    console.log(dayData)
    return NextResponse.json({ dayData }, { status: 200 });
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : error,
    }, { status: 500 });
  }
}
