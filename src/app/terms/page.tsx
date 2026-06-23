import Link from "next/link";

export default function TermsPage() {
  const sections = [
    {
      title: "1. Hizmet Tanımı",
      content:
        "StudyHane (YKS Lig), öğrencilerin çalışma sürelerini takip etmelerini, çözdükleri soru sayılarını kaydetmelerini ve arkadaşlarıyla rekabet etmelerini sağlayan ücretsiz bir web uygulamasıdır. Hizmet, olduğu gibi sunulmakta olup sürekli erişilebilirlik garantisi verilmemektedir.",
    },
    {
      title: "2. Kullanıcı Sorumlulukları",
      content:
        "Kullanıcılar; doğru ve güncel bilgiler vermekle, hesap bilgilerini gizli tutmakla, platformu yalnızca yasal amaçlarla kullanmakla, diğer kullanıcılara saygılı davranmakla ve sahte veya yanıltıcı veri girişi yapmamakla yükümlüdür.",
    },
    {
      title: "3. Hesap Güvenliği",
      content:
        "Hesabınızın güvenliğinden siz sorumlusunuz. Güçlü bir şifre kullanmanızı ve şifrenizi kimseyle paylaşmamanızı öneriyoruz. Hesabınızda yetkisiz bir erişim fark ederseniz derhal bizimle iletişime geçiniz.",
    },
    {
      title: "4. Fikri Mülkiyet",
      content:
        "StudyHane platformundaki tüm içerik, tasarım, logo ve yazılım kodları fikri mülkiyet haklarıyla korunmaktadır. Kullanıcılar, platformun herhangi bir bölümünü kopyalayamaz, çoğaltamaz veya ticari amaçlarla kullanamaz.",
    },
    {
      title: "5. Sorumluluk Sınırı",
      content:
        "StudyHane, platform kullanımından kaynaklanan doğrudan veya dolaylı zararlardan sorumlu tutulamaz. Uygulama eğitim amaçlı bir araç olup, sınav başarısını garanti etmez. Kullanıcıların girdiği verilerin doğruluğundan StudyHane sorumlu değildir.",
    },
    {
      title: "6. Değişiklikler",
      content:
        "Bu kullanım şartları önceden bildirimde bulunmaksızın güncellenebilir. Güncellemeler yayınlandığı andan itibaren geçerli olur. Platformu kullanmaya devam etmeniz, güncellenmiş şartları kabul ettiğiniz anlamına gelir. Önemli değişikliklerde kullanıcılar e-posta yoluyla bilgilendirilecektir.",
    },
  ];

  return (
    <main>
      <header style={{ padding: "24px 0", borderBottom: "1px solid var(--border)" }}>
        <div className="container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Link href="/">
            <h2 style={{ fontSize: "1.5rem", fontWeight: 800 }}>
              YKS <span className="gradient-text">Lig</span>
            </h2>
          </Link>
          <Link href="/login" style={{ fontWeight: 600, padding: "8px 16px" }}>
            Giriş Yap
          </Link>
        </div>
      </header>

      <section className="container" style={{ padding: "60px 24px", maxWidth: "800px" }}>
        <div className="animate-fade-in">
          <h1 style={{ fontSize: "2.5rem", marginBottom: "16px", textAlign: "center" }}>
            <span className="gradient-text">Kullanım Şartları</span>
          </h1>
          <p
            style={{
              color: "var(--text-muted)",
              textAlign: "center",
              marginBottom: "48px",
              fontSize: "0.95rem",
            }}
          >
            Son güncelleme: Haziran 2026
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            {sections.map((section) => (
              <div
                key={section.title}
                className="glass-panel"
                style={{ padding: "28px 32px" }}
              >
                <h2
                  style={{
                    fontSize: "1.15rem",
                    marginBottom: "12px",
                    color: "var(--primary)",
                  }}
                >
                  {section.title}
                </h2>
                <p
                  style={{
                    color: "var(--text-muted)",
                    lineHeight: 1.8,
                    fontSize: "0.95rem",
                  }}
                >
                  {section.content}
                </p>
              </div>
            ))}
          </div>

          <div style={{ textAlign: "center", marginTop: "48px" }}>
            <Link href="/" className="btn btn-outline">
              ← Ana Sayfaya Dön
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
