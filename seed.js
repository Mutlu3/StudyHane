const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  let user = await prisma.user.findFirst();
  if (!user) {
    console.log("Sistemde hic kullanici yok. Lutfen once Google ile giris yapin.");
    return;
  }

  let group = await prisma.group.findFirst();
  if (!group) {
    group = await prisma.group.create({
      data: {
        name: "Şampiyonlar Ligi",
        inviteCode: "WINNER"
      }
    });
  }

  // Assign current user to this group
  await prisma.user.update({ where: { id: user.id }, data: { groupId: group.id } });

  const dummyUsers = [
    { name: "Ahmet Yılmaz", email: "ahmet@example.com", streak: 5 },
    { name: "Ayşe Demir", email: "ayse@example.com", streak: 12 },
    { name: "Can Korkmaz", email: "can@example.com", streak: 2 }
  ];

  for (const du of dummyUsers) {
    let dUser = await prisma.user.findUnique({ where: { email: du.email } });
    if (!dUser) {
      dUser = await prisma.user.create({ data: { name: du.name, email: du.email, groupId: group.id, streak: du.streak } });
    } else {
      dUser = await prisma.user.update({ where: { email: du.email }, data: { groupId: group.id } });
    }

    // Bugunun verisi
    await prisma.studyLog.create({
      data: {
        userId: dUser.id,
        minutes: Math.floor(Math.random() * 120) + 60,
        questions: Math.floor(Math.random() * 200) + 50,
      }
    });
  }

  // Add dummy log for the actual user so they have points
  await prisma.studyLog.create({
    data: {
      userId: user.id,
      minutes: 150,
      questions: 300,
    }
  });

  console.log("Kullanici gruba eklendi ve test verileri basariyla olusturuldu!");
}
main().catch(console.error).finally(() => prisma.$disconnect());
