import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prismaClient";
import { User } from "@/generated/prisma";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
import { serialize } from "cookie";
dotenv.config();

export async function POST(req: NextRequest) {
  const { phone, password } = await req.json();

  if (!phone || !password) {
    return NextResponse.json({ error: "Пароль і телефон обов'язкові" }, { status: 400 });
  }

  try {
    const user: User | null = await prisma.user.findFirst({
      where: { phone },
    });

    if (!user) {
      return NextResponse.json({ error: "Користувача за цим телефоном не знайдено" }, { status: 404 });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return NextResponse.json({ error: "Невірний пароль" }, { status: 400 });
    }

    const { password: _, ...userWithoutPass } = user;
    const secret = process.env.JWT_SECRET;

    if (typeof secret !== "string") {
      return NextResponse.json({ error: "Проблема з JWT" }, { status: 500 });
    }

    const token = jwt.sign({ ...userWithoutPass }, secret, { expiresIn: "1d" });

    const response = NextResponse.json({ message: "Успішний вхід" });

    response.headers.set(
      "Set-Cookie",
      serialize("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 60 * 24, 
      })
    );

return response;
  } catch (error) {
    console.error("Помилка при логіні:", error);
    return NextResponse.json({ error: "Внутрішня помилка сервера" }, { status: 500 });
  }
}
