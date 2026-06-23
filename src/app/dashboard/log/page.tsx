"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LogPage() {
  const [minutes, setMinutes] = useState("");
  const [questions, setQuestions] = useState("");
  const [note, setNote] = useState("");
  const [status, setStatus] = useState("");

  const router = useRouter();

  const submitLog = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("Kaydediliyor...");
    const res = await fetch('/api/log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ minutes, questions, note })
    });
    if (res.ok) {
      setStatus("Başarıyla kaydedildi! Liderlik tablosuna eklendi.");
      setMinutes("");
      setQuestions("");
      setNote("");
      setTimeout(() => setStatus(""), 3000);
      router.refresh();
    } else {
      setStatus("Bir hata oluştu.");
    }
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '8px' }}>Çalışma Gir</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>
        Bugün kaç soru çözdün, ne kadar çalıştın? Rakiplerini geride bırak!
      </p>

      <form onSubmit={submitLog} className="glass-panel" style={{ padding: '40px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Çalışma Süresi (Dakika)</label>
          <input 
            type="number" 
            min="0"
            required
            value={minutes}
            onChange={(e) => setMinutes(e.target.value)}
            style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', outline: 'none' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Çözülen Soru Sayısı</label>
          <input 
            type="number" 
            min="0"
            required
            value={questions}
            onChange={(e) => setQuestions(e.target.value)}
            style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', outline: 'none' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Bugün Neler Yaptın? (İsteğe bağlı)</label>
          <textarea 
            rows={3}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', outline: 'none', resize: 'vertical' }}
          />
        </div>

        <button type="submit" className="btn btn-primary" style={{ marginTop: '16px' }}>Kaydet ve Puan Kazan</button>
        {status && <div style={{ marginTop: '16px', color: status.includes('hata') ? 'var(--accent)' : 'var(--secondary)', fontWeight: 600 }}>{status}</div>}
      </form>
    </div>
  );
}
