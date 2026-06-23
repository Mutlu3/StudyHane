import Link from "next/link";

export default function Home() {
  return (
    <main>
      {/* Navbar */}
      <header style={{ padding: '24px 0', borderBottom: '1px solid var(--border)' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Study<span className="gradient-text">Hane</span></h2>
          <div style={{ display: 'flex', gap: '16px' }}>
            <Link href="/login" style={{ fontWeight: 600, padding: '8px 16px', display: 'flex', alignItems: 'center' }}>Giriş Yap</Link>
            <Link href="/register" className="btn btn-primary">Hemen Başla</Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section style={{ padding: '80px 0', textAlign: 'center', minHeight: '80vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div className="container animate-fade-in">
          <h1 style={{ fontSize: '4rem', marginBottom: '24px' }}>
            Rakiplerin Çalışıyor, <br />
            <span className="gradient-text">Sen Neredesin?</span>
          </h1>
          <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto 40px', lineHeight: 1.8 }}>
            YKS, KPSS, LGS veya hangi sınava hazırlanıyorsan — çalışma grubunu kur, çözdüğün soruları gir ve arkadaşlarınla rekabet et!
          </p>
          
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/register" className="btn btn-primary" style={{ fontSize: '1.1rem', padding: '16px 32px' }}>
              Ücretsiz Başla
            </Link>
            <Link href="/login" className="btn btn-outline" style={{ fontSize: '1.1rem', padding: '16px 32px' }}>
              Giriş Yap
            </Link>
          </div>

          <div className="glass-panel delay-200 animate-fade-in mobile-p-4" style={{ marginTop: '80px', padding: '40px', maxWidth: '900px', margin: '80px auto 0' }}>
            <div className="grid-3">
              <div>
                <h3 style={{ fontSize: '2rem', marginBottom: '8px' }}>🚀</h3>
                <h4 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>Rekabet Et</h4>
                <p style={{ color: 'var(--text-muted)' }}>Arkadaşlarınla gruplar kur, liderlik tablosunda yüksel.</p>
              </div>
              <div>
                <h3 style={{ fontSize: '2rem', marginBottom: '8px' }}>🔥</h3>
                <h4 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>Ateş Serisi</h4>
                <p style={{ color: 'var(--text-muted)' }}>Her gün çalışarak serini koru, özel rozetler kazan.</p>
              </div>
              <div>
                <h3 style={{ fontSize: '2rem', marginBottom: '8px' }}>📈</h3>
                <h4 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>Gelişimini İzle</h4>
                <p style={{ color: 'var(--text-muted)' }}>Pomodoro sayacı ile odaklan, netlerini grafiklerle takip et.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: '24px 0', borderTop: '1px solid var(--border)', textAlign: 'center' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'center', gap: '24px', flexWrap: 'wrap', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          <Link href="/privacy" style={{ color: 'var(--text-muted)' }}>Gizlilik Politikası</Link>
          <Link href="/terms" style={{ color: 'var(--text-muted)' }}>Kullanım Şartları</Link>
          <span>© 2026 StudyHane</span>
        </div>
      </footer>
    </main>
  );
}
