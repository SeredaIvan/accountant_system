import { Day, Dish } from "@/generated/prisma"
import { prisma } from "@/lib/prismaClient";
import { NextRequest, NextResponse } from "next/server";

type DayPatchPayload = Omit<Day, "createdAt" | "updatedAt"> & { dishes: Omit<Dish, "createdAt" | "updatedAt">[] };

export async function PATCH(req: NextRequest) {
  const body = await req.json();
  const { id, date, countKids, dishes }: DayPatchPayload = body as DayPatchPayload;

  if (!id) {
    return NextResponse.json({ error: "Потрібно id" }, { status: 400 });
  }

  try {
    const dayData = await prisma.day.update({
      where: { id },
      data: {
        date: new Date(date),
        countKids
      },
    });

    return NextResponse.json({ dayData }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Помилка оновлення" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { date, countKids, dishes }: Omit<DayPatchPayload, "id"> = body;
  console.log(date)
  try {
    const dayData = await prisma.day.create({
      data: {
        date: new Date(date),
        countKids
      }
    });

    return NextResponse.json({ dayData }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Помилка створення" }, { status: 500 });
  }
}
