import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const userId = (session.user as any).id;

  try {
    const courses = await prisma.course.findMany({
      where: { userId },
      include: { topics: true },
      orderBy: { createdAt: 'asc' }
    });
    return NextResponse.json(courses);
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const userId = (session.user as any).id;

  try {
    const { name } = await req.json();
    if (!name) return new NextResponse("Missing fields", { status: 400 });

    const course = await prisma.course.create({
      data: {
        userId,
        name
      },
      include: { topics: true }
    });

    return NextResponse.json(course);
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
