import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user || !(session.user as any).id) {
    return new NextResponse("Yetkisiz", { status: 401 });
  }

  const userId = (session.user as any).id;
  const { inviteCode } = await req.json();

  if (!inviteCode) {
    return new NextResponse("Davet kodu gerekli", { status: 400 });
  }

  const group = await prisma.group.findUnique({
    where: { inviteCode }
  });

  if (!group) {
    return new NextResponse("Geçersiz davet kodu", { status: 404 });
  }

  await prisma.user.update({
    where: { id: userId },
    data: { groupId: group.id }
  });

  return NextResponse.json({ success: true });
}
