"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect } from "react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return <div style={{ padding: '40px', textAlign: 'center' }}>Yükleniyor...</div>;
  }

  if (!session) return null;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-gradient)' }}>
      {/* Sidebar */}
      <aside style={{ width: '280px', background: 'var(--surface-solid)', borderRight: '1px solid var(--border)', padding: '24px', display: 'flex', flexDirection: 'column' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '40px' }}>Study<span className="gradient-text">Hane</span></h2>
        
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
          <Link href="/dashboard" style={{ padding: '12px 16px', borderRadius: 'var(--radius-sm)', background: 'var(--bg-primary)', fontWeight: 600 }}>📊 İstatistikler</Link>
          <Link href="/dashboard/log" style={{ padding: '12px 16px', borderRadius: 'var(--radius-sm)' }}>✏️ Çalışma Gir</Link>
          <Link href="/dashboard/group" style={{ padding: '12px 16px', borderRadius: 'var(--radius-sm)' }}>🏆 Grubum</Link>
          <Link href="/dashboard/pomodoro" style={{ padding: '12px 16px', borderRadius: 'var(--radius-sm)' }}>⏱️ Pomodoro</Link>
          <Link href="/dashboard/subjects" style={{ padding: '12px 16px', borderRadius: 'var(--radius-sm)' }}>📚 Konu Takibi</Link>
          <Link href="/dashboard/exams" style={{ padding: '12px 16px', borderRadius: 'var(--radius-sm)' }}>📝 Deneme Analizi</Link>
          <Link href="/dashboard/wrong-book" style={{ padding: '12px 16px', borderRadius: 'var(--radius-sm)' }}>📕 Yanlış Defteri</Link>
          <Link href="/dashboard/settings" style={{ padding: '12px 16px', borderRadius: 'var(--radius-sm)' }}>⚙️ Ayarlar</Link>
        </nav>

        <div style={{ marginTop: 'auto', paddingTop: '24px', borderTop: '1px solid var(--border)' }}>
          <div style={{ marginBottom: '16px', fontWeight: 500, color: 'var(--text-main)' }}>{session.user?.name}</div>
          <button onClick={() => signOut()} className="btn btn-outline" style={{ width: '100%', padding: '8px' }}>Çıkış Yap</button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>
        {children}
      </main>
    </div>
  );
}
