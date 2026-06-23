import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user || !(session.user as any).id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const userId = (session.user as any).id;
  const body = await request.json();
  const { isCompleted } = body;
  
  const resolvedParams = await params;

  // Verify ownership
  const task = await prisma.task.findUnique({ where: { id: resolvedParams.id } });
  if (!task || task.userId !== userId) {
    return new NextResponse("Not Found", { status: 404 });
  }

  const updatedTask = await prisma.task.update({
    where: { id: resolvedParams.id },
    data: { isCompleted },
  });

  return NextResponse.json(updatedTask);
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user || !(session.user as any).id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const userId = (session.user as any).id;
  const resolvedParams = await params;

  const task = await prisma.task.findUnique({ where: { id: resolvedParams.id } });
  if (!task || task.userId !== userId) {
    return new NextResponse("Not Found", { status: 404 });
  }

  await prisma.task.delete({ where: { id: resolvedParams.id } });

  return new NextResponse(null, { status: 204 });
}
