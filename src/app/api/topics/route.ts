import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const userId = (session.user as any).id;

  try {
    const { courseId, name } = await req.json();
    if (!courseId || !name) return new NextResponse("Missing fields", { status: 400 });

    const course = await prisma.course.findUnique({ where: { id: courseId } });
    if (!course || course.userId !== userId) {
      return new NextResponse("Not Found or Unauthorized", { status: 404 });
    }

    const topic = await prisma.topic.create({
      data: {
        courseId,
        name
      }
    });

    return NextResponse.json(topic);
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
