import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const userId = (session.user as any).id;
  const topicId = params.id;

  try {
    const topic = await prisma.topic.findUnique({
      where: { id: topicId },
      include: { course: true }
    });

    if (!topic || topic.course.userId !== userId) {
      return new NextResponse("Not Found or Unauthorized", { status: 404 });
    }

    const { isCompleted } = await req.json();

    const updatedTopic = await prisma.topic.update({
      where: { id: topicId },
      data: {
        isCompleted,
        completedAt: isCompleted ? new Date() : null
      }
    });

    return NextResponse.json(updatedTopic);
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const userId = (session.user as any).id;
  const topicId = params.id;

  try {
    const topic = await prisma.topic.findUnique({
      where: { id: topicId },
      include: { course: true }
    });

    if (!topic || topic.course.userId !== userId) {
      return new NextResponse("Not Found or Unauthorized", { status: 404 });
    }

    await prisma.topic.delete({ where: { id: topicId } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
