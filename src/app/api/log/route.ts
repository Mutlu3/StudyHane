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
  const { minutes, questions, note } = await req.json();

  const log = await prisma.studyLog.create({
    data: {
      userId,
      minutes: Number(minutes),
      questions: Number(questions),
      note
    }
  });

  // Update streak logic
  const user = await prisma.user.findUnique({ where: { id: userId }});
  if (user) {
    const today = new Date();
    const lastStudyDate = user.lastStudyDate ? new Date(user.lastStudyDate) : null;
    let newStreak = user.streak;
    
    if (lastStudyDate) {
      const diffTime = today.getTime() - lastStudyDate.getTime();
      const diffDays = diffTime / (1000 * 60 * 60 * 24); 
      if (diffDays >= 1 && diffDays < 2) { 
         newStreak += 1;
      } else if (diffDays >= 2) {
         newStreak = 1;
      }
    } else {
      newStreak = 1;
    }

    await prisma.user.update({
      where: { id: userId },
      data: {
        lastStudyDate: today,
        streak: newStreak
      }
    });
  }

  return NextResponse.json(log);
}
