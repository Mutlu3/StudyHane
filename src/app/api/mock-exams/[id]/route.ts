import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const userId = (session.user as any).id;
  const examId = params.id;

  try {
    const exam = await prisma.mockExam.findUnique({ where: { id: examId } });
    if (!exam || exam.userId !== userId) {
      return new NextResponse("Not Found or Unauthorized", { status: 404 });
    }

    await prisma.mockExam.delete({ where: { id: examId } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
