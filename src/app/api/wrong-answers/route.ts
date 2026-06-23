import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user || !(session.user as any).id) {
    return new NextResponse("Yetkisiz", { status: 401 });
  }

  const userId = (session.user as any).id;

  const wrongAnswers = await prisma.wrongAnswer.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(wrongAnswers);
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user || !(session.user as any).id) {
    return new NextResponse("Yetkisiz", { status: 401 });
  }

  const userId = (session.user as any).id;

  const formData = await request.formData();
  const image = formData.get("image") as File | null;
  const courseName = formData.get("courseName") as string;
  const topicName = (formData.get("topicName") as string) || undefined;
  const note = (formData.get("note") as string) || undefined;

  if (!image || !courseName) {
    return NextResponse.json(
      { error: "Görsel ve ders adı zorunludur." },
      { status: 400 }
    );
  }

  try {
    // Convert image to Base64 data URI (Vercel has read-only filesystem)
    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString("base64");
    const mimeType = image.type || "image/png";
    const imagePath = `data:${mimeType};base64,${base64}`;

    const wrongAnswer = await prisma.wrongAnswer.create({
      data: {
        userId,
        imagePath,
        courseName,
        topicName,
        note,
      },
    });

    return NextResponse.json(wrongAnswer);
  } catch (error: any) {
    console.error("Wrong answer upload error:", error);
    return NextResponse.json(
      { error: "Yükleme sırasında bir hata oluştu: " + (error?.message || "Bilinmeyen") },
      { status: 500 }
    );
  }
}

