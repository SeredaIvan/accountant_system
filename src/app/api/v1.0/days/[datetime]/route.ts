import { prisma } from "@/lib/prismaClient";
import { DayWithDishes } from "@/types/DayWithDishes";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { datetime: string } }
) {
  const { datetime } = await params;

  const [day, month, year] = datetime.split("-").map(Number);
  
  const date = new Date(year, month - 1, day); 

  if (!day || !month || !year) {
    return NextResponse.json({ error: "Невірна дата"  }, { status: 400 });
  }

  try {
    const dayData:DayWithDishes = await prisma.day.findFirst({
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
    }) as DayWithDishes;

    if (!dayData) {
      return NextResponse.json({ error: "Дня не знайдено",day: date }, { status: 404 });
    }

    return NextResponse.json({ dayData  }, { status: 200 });
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : error,
    }, { status: 500 });
  }
}
