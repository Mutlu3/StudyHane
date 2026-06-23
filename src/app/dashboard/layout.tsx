"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  if (status === "loading") {
    return (
      <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-gradient)', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            width: '40px', height: '40px', border: '3px solid var(--border)', 
            borderTop: '3px solid var(--primary)', borderRadius: '50%', 
            animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' 
          }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

  if (!session) return null;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-gradient)' }}>
      {/* Mobile Topbar */}
      <div className="hidden-desktop" style={{ 
        position: 'fixed', top: 0, left: 0, right: 0, height: '60px', 
        background: 'var(--surface-solid)', borderBottom: '1px solid var(--border)', 
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', zIndex: 30 
      }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0 }}>Study<span className="gradient-text">Hane</span></h2>
        <button 
          onClick={() => setIsMobileMenuOpen(true)}
          style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: 'var(--text-main)' }}
        >
          ☰
        </button>
      </div>

      <style jsx>{`
        @media (min-width: 769px) {
          .hidden-desktop { display: none !important; }
        }
        @media (max-width: 768px) {
          .sidebar-container {
            position: fixed !important;
            top: 0; left: 0; bottom: 0;
            transform: translateX(${isMobileMenuOpen ? '0' : '-100%'});
            transition: transform 0.3s ease;
            z-index: 50;
          }
          .main-content {
            padding-top: 80px !important;
            padding-left: 16px !important;
            padding-right: 16px !important;
          }
        }
      `}</style>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div className="mobile-overlay" onClick={() => setIsMobileMenuOpen(false)}></div>
      )}

      {/* Sidebar */}
      <aside className="sidebar-container" style={{ width: '280px', background: 'var(--surface-solid)', borderRight: '1px solid var(--border)', padding: '24px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0 }}>Study<span className="gradient-text">Hane</span></h2>
          <button className="hidden-desktop" onClick={() => setIsMobileMenuOpen(false)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>✕</button>
        </div>
        
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1, overflowY: 'auto' }}>
          <Link href="/dashboard" style={{ padding: '12px 16px', borderRadius: 'var(--radius-sm)', background: pathname === '/dashboard' ? 'var(--bg-primary)' : 'transparent', fontWeight: pathname === '/dashboard' ? 600 : 400 }}>📊 İstatistikler</Link>
          <Link href="/dashboard/log" style={{ padding: '12px 16px', borderRadius: 'var(--radius-sm)', background: pathname === '/dashboard/log' ? 'var(--bg-primary)' : 'transparent' }}>✏️ Çalışma Gir</Link>
          <Link href="/dashboard/group" style={{ padding: '12px 16px', borderRadius: 'var(--radius-sm)', background: pathname === '/dashboard/group' ? 'var(--bg-primary)' : 'transparent' }}>🏆 Grubum</Link>
          <Link href="/dashboard/pomodoro" style={{ padding: '12px 16px', borderRadius: 'var(--radius-sm)', background: pathname === '/dashboard/pomodoro' ? 'var(--bg-primary)' : 'transparent' }}>⏱️ Pomodoro</Link>
          <Link href="/dashboard/tasks" style={{ padding: '12px 16px', borderRadius: 'var(--radius-sm)', background: pathname === '/dashboard/tasks' ? 'var(--bg-primary)' : 'transparent', fontWeight: pathname === '/dashboard/tasks' ? 600 : 400 }}>✅ Görevler</Link>
          <Link href="/dashboard/subjects" style={{ padding: '12px 16px', borderRadius: 'var(--radius-sm)', background: pathname === '/dashboard/subjects' ? 'var(--bg-primary)' : 'transparent' }}>📚 Konu Takibi</Link>
          <Link href="/dashboard/exams" style={{ padding: '12px 16px', borderRadius: 'var(--radius-sm)', background: pathname === '/dashboard/exams' ? 'var(--bg-primary)' : 'transparent' }}>📝 Deneme Analizi</Link>
          <Link href="/dashboard/wrong-book" style={{ padding: '12px 16px', borderRadius: 'var(--radius-sm)', background: pathname === '/dashboard/wrong-book' ? 'var(--bg-primary)' : 'transparent' }}>📕 Yanlış Defteri</Link>
          <Link href="/dashboard/settings" style={{ padding: '12px 16px', borderRadius: 'var(--radius-sm)', background: pathname === '/dashboard/settings' ? 'var(--bg-primary)' : 'transparent' }}>⚙️ Ayarlar</Link>
        </nav>

        <div style={{ marginTop: 'auto', paddingTop: '24px', borderTop: '1px solid var(--border)' }}>
          <div style={{ marginBottom: '16px', fontWeight: 500, color: 'var(--text-main)', fontSize: '0.9rem', wordBreak: 'break-all' }}>{session.user?.name}</div>
          <button onClick={() => signOut()} className="btn btn-outline" style={{ width: '100%', padding: '8px' }}>Çıkış Yap</button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content" style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>
        {children}
      </main>
    </div>
  );
}
