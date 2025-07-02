import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import {prisma} from "@/lib/prismaClient"
import { Prisma } from "@prisma/client";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, phone, role, password } = body;

  if (!name || !phone || !role || !password) {
    return NextResponse.json({ error: "Всі поля обов'язкові" }, { status: 400 });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        phone,
        role,
        password: hashedPassword,
      },
    });

    const { password: _, ...userWithoutPass } = user;

    return NextResponse.json({
      message: "Успішно додано",
      user: { id: user.id, name: user.name },
    });
  } catch (error) {
    console.error("❌ Помилка створення користувача:", error);
    return NextResponse.json({ error: "Помилка при створенні" }, { status: 500 });
  }
}
