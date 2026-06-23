import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { GoogleGenAI } from "@google/genai";

export const dynamic = "force-dynamic";

export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ analysis: "Analiz için giriş yapmanız gerekiyor." }, { status: 401 });
  }

  const userId = (session.user as any).id;

  try {
    let exams = await prisma.mockExam.findMany({
      where: { userId },
      include: { sections: true },
      orderBy: { date: 'desc' },
      take: 5
    });
    
    // Reverse to chronological order
    exams = exams.reverse();

    if (exams.length === 0) {
      return NextResponse.json({ analysis: "Henüz deneme verisi girmemişsiniz. Yapay zeka analiz yapabilmek için en az 1 deneme sonucuna ihtiyaç duyar." });
    }

    let promptData = "Öğrencinin son deneme sonuçları:\n\n";
    exams.forEach((exam, idx) => {
      promptData += `${idx + 1}. Deneme: ${exam.examName} (${new Date(exam.date).toLocaleDateString('tr-TR')})\n`;
      exam.sections.forEach(sec => {
        promptData += `  - ${sec.sectionName}: ${sec.net.toFixed(2)} Net\n`;
      });
      promptData += "\n";
    });

    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey || apiKey === "your_gemini_api_key_here") {
      return NextResponse.json({ 
        analysis: "Mükemmel gidiyorsun! Son denemelerinde belirgin bir yükseliş trendi var. Eksik olduğun konuları tespit edip 'Yanlış Defteri'ne eklemeyi unutma. (Not: Bu örnek bir metindir. Gerçek yapay zeka analizleri için GEMINI_API_KEY eklenmelidir.)" 
      });
    }

    const ai = new GoogleGenAI({ apiKey });
    
    const prompt = `Sen samimi, destekleyici ve motive edici bir eğitim koçusun.
Öğrencinin son deneme sınavı netlerini incele. 
Gelişimini değerlendir, eksik olduğu noktalara nazikçe dikkat çek ve ona 3-4 cümlelik kısa, etkili bir eylem planı öner. 
Metni okurken samimi ol (sen diye hitap et) ve karmaşık jargondan kaçın. Öğrencinin adı belirtilmemişse "Sevgili öğrenci" diye başlayabilirsin veya direkt konuya girebilirsin.

${promptData}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return NextResponse.json({ analysis: response.text });
  } catch (error: any) {
    console.error("AI Analysis Error:", error);
    return NextResponse.json({ 
      analysis: "Yapay zeka şu an meşgul, lütfen birkaç saniye sonra tekrar deneyin. (Hata: " + (error?.message || "Bilinmeyen") + ")" 
    });
  }
}

