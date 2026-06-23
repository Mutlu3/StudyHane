import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

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

  // Ensure uploads directory exists
  const uploadsDir = path.join(process.cwd(), "public/uploads");
  await mkdir(uploadsDir, { recursive: true });

  // Generate unique filename
  const ext = path.extname(image.name) || ".png";
  const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}${ext}`;
  const filePath = path.join(uploadsDir, uniqueName);

  // Write file to disk
  const bytes = await image.arrayBuffer();
  await writeFile(filePath, Buffer.from(bytes));

  const imagePath = `/uploads/${uniqueName}`;

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
}
