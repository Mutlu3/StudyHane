"use client";

import { useSession } from "next-auth/react";

export default function DashboardPage() {
  const { data: session } = useSession();

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '16px' }}>
      <h1 style={{ fontSize: '1.5rem', marginBottom: '4px' }}>Merhaba, {session?.user?.name} 👋</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '16px', fontSize: '0.85rem' }}>İşte bugünkü çalışma özetin.</p>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '12px', marginBottom: '16px' }}>
        <div className="glass-panel delay-100 animate-fade-in" style={{ padding: '16px 12px', textAlign: 'center' }}>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: '4px', fontWeight: 600 }}>Soru</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary)', lineHeight: 1 }}>0</div>
        </div>
        <div className="glass-panel delay-200 animate-fade-in" style={{ padding: '16px 12px', textAlign: 'center' }}>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: '4px', fontWeight: 600 }}>Süre (Dk)</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--secondary)', lineHeight: 1 }}>0</div>
        </div>
        <div className="glass-panel delay-300 animate-fade-in" style={{ padding: '16px 12px', textAlign: 'center' }}>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: '4px', fontWeight: 600 }}>Seri 🔥</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent)', lineHeight: 1 }}>0</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px' }}>
        {/* Recent Activity */}
        <div className="glass-panel delay-200 animate-fade-in" style={{ padding: '16px' }}>
          <h2 style={{ fontSize: '1rem', marginBottom: '8px' }}>Son Çalışmaların</h2>
          <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '16px 0', fontSize: '0.85rem' }}>
            Henüz hiç çalışma girmedin. Sol menüden 'Çalışma Gir' diyerek başlayabilirsin.
          </div>
        </div>

        {/* Mini Leaderboard / Group status */}
        <div className="glass-panel delay-300 animate-fade-in" style={{ padding: '16px' }}>
          <h2 style={{ fontSize: '1rem', marginBottom: '8px' }}>Grubum</h2>
          <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '16px 0', fontSize: '0.85rem' }}>
            Henüz bir gruba katılmadın. Rekabet etmek için bir grup kur veya katıl!
          </div>
        </div>
      </div>
    </div>
  );
}
