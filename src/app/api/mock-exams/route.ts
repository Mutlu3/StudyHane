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
    const exams = await prisma.mockExam.findMany({
      where: { userId },
      include: { sections: true },
      orderBy: { date: 'asc' }
    });
    return NextResponse.json(exams);
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
    const body = await req.json();
    const { examName, date, sections } = body;

    if (!examName || !date || !sections || !Array.isArray(sections)) {
      return new NextResponse("Missing fields", { status: 400 });
    }

    const mockExam = await prisma.mockExam.create({
      data: {
        userId,
        examName,
        date: new Date(date),
        sections: {
          create: sections.map((s: any) => ({
            sectionName: s.sectionName,
            correct: Number(s.correct),
            wrong: Number(s.wrong),
            empty: Number(s.empty),
            net: Number(s.correct) - (Number(s.wrong) / 4)
          }))
        }
      },
      include: { sections: true }
    });

    return NextResponse.json(mockExam);
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
