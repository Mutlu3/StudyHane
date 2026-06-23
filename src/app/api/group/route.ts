import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user || !(session.user as any).id) {
    return new NextResponse("Yetkisiz", { status: 401 });
  }

  const userId = (session.user as any).id;

  const date = new Date();
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);
  const startOfWeek = new Date(date.setDate(diff));
  startOfWeek.setHours(0, 0, 0, 0);

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      group: {
        include: {
          users: {
            select: {
              id: true,
              name: true,
              streak: true,
              image: true,
              studyLogs: {
                where: {
                  date: {
                    gte: startOfWeek
                  }
                }
              }
            }
          }
        }
      }
    }
  });

  if (!user?.group) {
    return new NextResponse("Grup bulunamadı", { status: 404 });
  }

  const usersWithStats = user.group.users.map(u => {
    const todayQuestions = u.studyLogs.reduce((acc, log) => acc + log.questions, 0);
    const todayMinutes = u.studyLogs.reduce((acc, log) => acc + log.minutes, 0);
    return {
      id: u.id,
      name: u.name,
      streak: u.streak,
      todayQuestions,
      todayMinutes,
      score: todayQuestions * 2 + todayMinutes
    };
  }).sort((a, b) => b.score - a.score);

  return NextResponse.json({
    group: {
      id: user.group.id,
      name: user.group.name,
      inviteCode: user.group.inviteCode,
    },
    leaderboard: usersWithStats
  });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user || !(session.user as any).id) {
    return new NextResponse("Yetkisiz", { status: 401 });
  }

  const userId = (session.user as any).id;
  const { name } = await req.json();

  if (!name) {
    return new NextResponse("Grup adı gerekli", { status: 400 });
  }

  // Generate random 6 character code
  const inviteCode = Math.random().toString(36).substring(2, 8).toUpperCase();

  const group = await prisma.group.create({
    data: {
      name,
      inviteCode,
      users: {
        connect: { id: userId }
      }
    }
  });

  return NextResponse.json(group);
}
