import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { unlink } from "fs/promises";
import path from "path";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user || !(session.user as any).id) {
    return new NextResponse("Yetkisiz", { status: 401 });
  }

  const userId = (session.user as any).id;

  const wrongAnswer = await prisma.wrongAnswer.findUnique({
    where: { id: params.id },
  });

  if (!wrongAnswer) {
    return NextResponse.json(
      { error: "Kayıt bulunamadı." },
      { status: 404 }
    );
  }

  if (wrongAnswer.userId !== userId) {
    return NextResponse.json(
      { error: "Bu kaydı silme yetkiniz yok." },
      { status: 403 }
    );
  }

  // Try to delete the image file from disk
  try {
    const filePath = path.join(process.cwd(), "public", wrongAnswer.imagePath);
    await unlink(filePath);
  } catch {
    // File may already be deleted, ignore error
  }

  await prisma.wrongAnswer.delete({
    where: { id: params.id },
  });

  return NextResponse.json({ success: true });
}
