"use client";

import { useSession } from "next-auth/react";

export default function DashboardPage() {
  const { data: session } = useSession();

  return (
    <div className="animate-fade-in">
      <h1 style={{ fontSize: '2.5rem', marginBottom: '8px' }}>Merhaba, {session?.user?.name} 👋</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>İşte bugünkü çalışma özetin.</p>

      {/* Stats Grid */}
      <div className="grid-3" style={{ marginBottom: '40px' }}>
        <div className="glass-panel delay-100 animate-fade-in" style={{ padding: '24px' }}>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '8px', fontWeight: 600 }}>Bugün Çözülen Soru</div>
          <div style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--primary)' }}>0</div>
        </div>
        <div className="glass-panel delay-200 animate-fade-in" style={{ padding: '24px' }}>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '8px', fontWeight: 600 }}>Bugün Çalışma (Dk)</div>
          <div style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--secondary)' }}>0</div>
        </div>
        <div className="glass-panel delay-300 animate-fade-in" style={{ padding: '24px' }}>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '8px', fontWeight: 600 }}>Ateş Serisi 🔥</div>
          <div style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--accent)' }}>0 Gün</div>
        </div>
      </div>

      <div className="grid-2-1">
        {/* Recent Activity */}
        <div className="glass-panel delay-200 animate-fade-in" style={{ padding: '24px' }}>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '16px' }}>Son Çalışmaların</h2>
          <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '40px 0' }}>
            Henüz hiç çalışma girmedin. Sol menüden 'Çalışma Gir' diyerek başlayabilirsin.
          </div>
        </div>

        {/* Mini Leaderboard / Group status */}
        <div className="glass-panel delay-300 animate-fade-in" style={{ padding: '24px' }}>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '16px' }}>Grubum</h2>
          <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '40px 0', fontSize: '0.9rem' }}>
            Henüz bir gruba katılmadın. Rekabet etmek için bir grup kur veya katıl!
          </div>
        </div>
      </div>
    </div>
  );
}
