import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(
  request: Request
) {
  try {
    const body = await request.json();
    const { email, name, password } = body;

    if (!email || !name || !password) {
      return new NextResponse("Eksik bilgi", { status: 400 });
    }

    const exist = await prisma.user.findUnique({
      where: {
        email: email
      }
    });

    if (exist) {
      return new NextResponse("Email zaten kullanımda", { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
      }
    });

    return NextResponse.json(user);
  } catch (error) {
    return new NextResponse("İç sunucu hatası", { status: 500 });
  }
}
