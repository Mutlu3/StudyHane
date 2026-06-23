"use client";

import { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function MockExamsPage() {
  const [exams, setExams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  
  const [examName, setExamName] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [sections, setSections] = useState([
    { sectionName: "Türkçe", correct: 0, wrong: 0, empty: 0 },
    { sectionName: "Matematik", correct: 0, wrong: 0, empty: 0 },
    { sectionName: "Fen Bilimleri", correct: 0, wrong: 0, empty: 0 },
    { sectionName: "Sosyal Bilimler", correct: 0, wrong: 0, empty: 0 },
  ]);

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    try {
      const res = await fetch("/api/mock-exams");
      if (res.ok) {
        const data = await res.json();
        setExams(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAIAnalysis = async () => {
    if (exams.length === 0) {
      alert("Analiz için en az bir deneme girmiş olmalısınız.");
      return;
    }
    setAnalyzing(true);
    setAiAnalysis(null);
    try {
      const res = await fetch("/api/mock-exams/ai-analysis", { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        setAiAnalysis(data.analysis);
      } else {
        alert("Yapay zeka analizine ulaşılamadı.");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleAddSection = () => {
    setSections([...sections, { sectionName: "", correct: 0, wrong: 0, empty: 0 }]);
  };

  const handleSectionChange = (index: number, field: string, value: string | number) => {
    const newSections = [...sections];
    (newSections[index] as any)[field] = value;
    setSections(newSections);
  };

  const handleRemoveSection = (index: number) => {
    const newSections = sections.filter((_, i) => i !== index);
    setSections(newSections);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/mock-exams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ examName, date, sections }),
      });
      if (res.ok) {
        setExamName("");
        setSections([
          { sectionName: "Türkçe", correct: 0, wrong: 0, empty: 0 },
          { sectionName: "Matematik", correct: 0, wrong: 0, empty: 0 },
          { sectionName: "Fen Bilimleri", correct: 0, wrong: 0, empty: 0 },
          { sectionName: "Sosyal Bilimler", correct: 0, wrong: 0, empty: 0 },
        ]);
        fetchExams();
      } else {
        alert("Hata oluştu.");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Emin misiniz?")) return;
    try {
      const res = await fetch(`/api/mock-exams/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchExams();
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Chart Data Preparation
  const chartLabels = exams.map(e => e.examName);
  
  // Get unique section names across all exams
  const allSectionNames = Array.from(new Set(exams.flatMap(e => e.sections.map((s:any) => s.sectionName))));
  
  const colors = ["#6366f1", "#10b981", "#f43f5e", "#f59e0b", "#8b5cf6", "#ec4899", "#14b8a6"];
  
  const datasets = allSectionNames.map((name, i) => {
    return {
      label: name,
      data: exams.map(exam => {
        const section = exam.sections.find((s:any) => s.sectionName === name);
        return section ? section.net : null;
      }),
      borderColor: colors[i % colors.length],
      backgroundColor: colors[i % colors.length],
      tension: 0.4,
    };
  });

  datasets.push({
    label: "Toplam Net",
    data: exams.map(exam => {
      return exam.sections.reduce((sum:number, s:any) => sum + s.net, 0);
    }),
    borderColor: "var(--text-main)",
    backgroundColor: "var(--text-main)",
    tension: 0.4,
  });

  const chartData = {
    labels: chartLabels,
    datasets,
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: { color: 'var(--text-main)' }
      },
      title: {
        display: false,
      },
    },
    scales: {
      x: { ticks: { color: 'var(--text-muted)' }, grid: { color: 'var(--border)' } },
      y: { ticks: { color: 'var(--text-muted)' }, grid: { color: 'var(--border)' } }
    }
  };

  if (loading) return <div>Yükleniyor...</div>;

  return (
    <div className="animate-fade-in" style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '8px' }}>Deneme Analizi</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>
        Deneme sınavı sonuçlarını gir ve netlerindeki gelişimi grafiklerle takip et.
      </p>

      {/* Form */}
      <form onSubmit={handleSubmit} className="glass-panel" style={{ padding: '24px', marginBottom: '40px' }}>
        <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '200px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Deneme Adı</label>
            <input 
              type="text" 
              required
              value={examName}
              onChange={e => setExamName(e.target.value)}
              placeholder="Örn: TYT Deneme 3"
              style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', background: 'var(--bg-primary)', color: 'var(--text-main)' }}
            />
          </div>
          <div style={{ flex: 1, minWidth: '200px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Tarih</label>
            <input 
              type="date" 
              required
              value={date}
              onChange={e => setDate(e.target.value)}
              style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', background: 'var(--bg-primary)', color: 'var(--text-main)' }}
            />
          </div>
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', marginBottom: '12px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Bölümler ve Netler</label>
          {sections.map((section, idx) => (
            <div key={idx} style={{ display: 'flex', gap: '12px', marginBottom: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
              <input 
                type="text" 
                required
                value={section.sectionName}
                onChange={e => handleSectionChange(idx, 'sectionName', e.target.value)}
                placeholder="Ders/Bölüm Adı"
                style={{ flex: 2, minWidth: '150px', padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', background: 'var(--bg-primary)', color: 'var(--text-main)' }}
              />
              <input 
                type="number" 
                required
                min="0"
                value={section.correct}
                onChange={e => handleSectionChange(idx, 'correct', e.target.value)}
                placeholder="Doğru"
                style={{ flex: 1, minWidth: '80px', padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', background: 'var(--bg-primary)', color: 'var(--text-main)' }}
              />
              <input 
                type="number" 
                required
                min="0"
                value={section.wrong}
                onChange={e => handleSectionChange(idx, 'wrong', e.target.value)}
                placeholder="Yanlış"
                style={{ flex: 1, minWidth: '80px', padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', background: 'var(--bg-primary)', color: 'var(--text-main)' }}
              />
              <input 
                type="number" 
                required
                min="0"
                value={section.empty}
                onChange={e => handleSectionChange(idx, 'empty', e.target.value)}
                placeholder="Boş"
                style={{ flex: 1, minWidth: '80px', padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', background: 'var(--bg-primary)', color: 'var(--text-main)' }}
              />
              <button type="button" onClick={() => handleRemoveSection(idx)} style={{ color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer', padding: '10px' }}>
                X
              </button>
            </div>
          ))}
          <button type="button" onClick={handleAddSection} className="btn btn-outline" style={{ padding: '8px 16px', fontSize: '0.85rem', marginTop: '8px' }}>
            + Bölüm Ekle
          </button>
        </div>

        <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px' }}>
          Deneme Kaydet
        </button>
      </form>

      {/* Chart & AI */}
      <div className="glass-panel" style={{ padding: '24px', marginBottom: '40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
          <h2 style={{ fontSize: '1.2rem', margin: 0 }}>Net Gelişimi ve Analiz</h2>
          <button 
            onClick={handleAIAnalysis} 
            disabled={analyzing || exams.length === 0} 
            className="btn btn-outline" 
            style={{ 
              display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', 
              background: 'var(--bg-primary)', border: '1px solid var(--accent)', 
              color: 'var(--accent)', 
              cursor: (analyzing || exams.length === 0) ? 'not-allowed' : 'pointer',
              opacity: exams.length === 0 ? 0.5 : 1
            }}
          >
            {analyzing ? "Yapay Zeka Düşünüyor..." : "✨ Yapay Zeka Analizi Al"}
          </button>
        </div>

        {exams.length === 0 && (
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', textAlign: 'center', padding: '20px 0' }}>
            Yapay zeka analizini ve gelişim grafiğinizi görebilmek için yukarıdan en az bir deneme sonucu kaydetmelisiniz.
          </p>
        )}

        {aiAnalysis && (
          <div className="animate-fade-in" style={{ padding: '20px', marginBottom: '24px', background: 'rgba(99, 102, 241, 0.1)', border: '1px solid var(--primary)', borderRadius: 'var(--radius-sm)' }}>
            <h3 style={{ fontSize: '1.1rem', color: 'var(--primary)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>🤖</span> Eğitim Koçunun Tavsiyesi
            </h3>
            <p style={{ color: 'var(--text-main)', fontSize: '0.95rem', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
              {aiAnalysis}
            </p>
          </div>
        )}

        {exams.length > 0 && <Line data={chartData} options={chartOptions} />}
      </div>

      {/* Exam List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {exams.map(exam => (
          <div key={exam.id} className="glass-panel" style={{ padding: '24px', position: 'relative' }}>
            <button onClick={() => handleDelete(exam.id)} style={{ position: 'absolute', top: '24px', right: '24px', color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer' }}>Sil</button>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '4px', color: 'var(--primary)' }}>{exam.examName}</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '16px' }}>
              {new Date(exam.date).toLocaleDateString('tr-TR')}
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px' }}>
              {exam.sections.map((sec: any) => (
                <div key={sec.id} style={{ background: 'var(--bg-primary)', padding: '12px', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ fontWeight: 600, marginBottom: '8px', fontSize: '0.9rem' }}>{sec.sectionName}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between' }}>
                    <span>{sec.correct}D {sec.wrong}Y</span>
                    <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>{sec.net.toFixed(2)} Net</span>
                  </div>
                </div>
              ))}
              <div style={{ background: 'var(--bg-primary)', padding: '12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--primary)' }}>
                <div style={{ fontWeight: 600, marginBottom: '8px', fontSize: '0.9rem', color: 'var(--primary)' }}>Toplam</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  {exam.sections.reduce((sum:number, s:any) => sum + s.net, 0).toFixed(2)} Net
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
