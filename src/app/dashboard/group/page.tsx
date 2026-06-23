"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function GroupPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Forms
  const [groupName, setGroupName] = useState("");
  const [inviteCode, setInviteCode] = useState("");

  const router = useRouter();

  const fetchGroup = async () => {
    setLoading(true);
    const res = await fetch('/api/group');
    if (res.ok) {
      const json = await res.json();
      setData(json);
    } else {
      setData(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchGroup();
  }, []);

  const createGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/group', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: groupName })
    });
    if (res.ok) fetchGroup();
  };

  const joinGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/group/join', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ inviteCode })
    });
    if (res.ok) fetchGroup();
    else alert("Geçersiz davet kodu veya hata!");
  };

  if (loading) return <div>Yükleniyor...</div>;

  if (!data) {
    return (
      <div className="animate-fade-in grid-2" style={{ gap: '40px' }}>
        <div className="glass-panel" style={{ padding: '32px' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '16px' }}>Yeni Grup Kur</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>Kendi çalışma ligini başlat ve arkadaşlarını davet et.</p>
          <form onSubmit={createGroup} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <input 
              type="text" 
              placeholder="Grup Adı" 
              required
              value={groupName}
              onChange={e => setGroupName(e.target.value)}
              style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', outline: 'none' }}
            />
            <button type="submit" className="btn btn-primary">Grup Kur</button>
          </form>
        </div>

        <div className="glass-panel" style={{ padding: '40px' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '16px' }}>Gruba Katıl</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>Arkadaşının sana gönderdiği 6 haneli davet kodunu gir.</p>
          <form onSubmit={joinGroup} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <input 
              type="text" 
              placeholder="Davet Kodu (örn: X8Y9Z0)" 
              required
              value={inviteCode}
              onChange={e => setInviteCode(e.target.value.toUpperCase())}
              style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', outline: 'none', textTransform: 'uppercase' }}
            />
            <button type="submit" className="btn btn-outline">Katıl</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: 'clamp(1.5rem, 5vw, 2.5rem)', marginBottom: '4px' }}>{data.group.name}</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Liderlik Tablosu (Soru x2 + Süre)</p>
        </div>
        <div className="glass-panel" style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px', whiteSpace: 'nowrap' }}>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Davet Kodu:</span>
          <span style={{ fontSize: '1rem', fontWeight: 800, letterSpacing: '2px', color: 'var(--primary)' }}>{data.group.inviteCode}</span>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: 0, overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
        <table style={{ width: '100%', minWidth: '600px', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'var(--bg-primary)', borderBottom: '1px solid var(--border)' }}>
              <th style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--text-muted)', fontSize: '0.9rem' }}>Sıra</th>
              <th style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--text-muted)', fontSize: '0.9rem' }}>Öğrenci</th>
              <th style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--text-muted)', fontSize: '0.9rem' }}>Soru</th>
              <th style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--text-muted)', fontSize: '0.9rem' }}>Süre</th>
              <th style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--text-muted)', fontSize: '0.9rem' }}>Seri</th>
              <th style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--primary)', fontSize: '0.9rem' }}>Skor</th>
            </tr>
          </thead>
          <tbody>
            {data.leaderboard.map((user: any, index: number) => (
              <tr key={user.id} style={{ borderBottom: '1px solid var(--border)', background: index === 0 ? 'rgba(255, 215, 0, 0.05)' : 'transparent' }}>
                <td style={{ padding: '12px 16px', fontWeight: 700 }}>
                  {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`}
                </td>
                <td style={{ padding: '12px 16px', fontWeight: 600 }}>{user.name}</td>
                <td style={{ padding: '12px 16px' }}>{user.todayQuestions}</td>
                <td style={{ padding: '12px 16px' }}>{user.todayMinutes} Dk</td>
                <td style={{ padding: '12px 16px', color: 'var(--accent)', fontWeight: 600 }}>{user.streak > 0 ? `🔥 ${user.streak}` : '-'}</td>
                <td style={{ padding: '12px 16px', fontWeight: 800, color: 'var(--primary)' }}>{user.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
