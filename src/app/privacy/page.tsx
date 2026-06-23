import Link from "next/link";

export default function PrivacyPage() {
  const sections = [
    {
      title: "1. Toplanan Veriler",
      content:
        "StudyHane, hizmetlerini sunabilmek için aşağıdaki verileri toplar: ad, e-posta adresi, çalışma kayıtları (ders adı, süre, çözülen soru sayısı), grup üyelik bilgileri ve oturum verileri. Bu veriler yalnızca hizmetin işleyişi için gereklidir ve üçüncü taraflarla paylaşılmaz.",
    },
    {
      title: "2. Verilerin Kullanımı",
      content:
        "Toplanan veriler; kullanıcı hesabının oluşturulması ve yönetilmesi, çalışma istatistiklerinin hesaplanması ve gösterilmesi, grup sıralama tablolarının oluşturulması, uygulama deneyiminin iyileştirilmesi ve gerektiğinde kullanıcıyla iletişim kurulması amacıyla kullanılır.",
    },
    {
      title: "3. Veri Güvenliği",
      content:
        "Verilerinizin güvenliği bizim için önemlidir. Tüm veriler şifreli bağlantılar (HTTPS) üzerinden iletilir, şifreler bcrypt algoritması ile hashlenerek saklanır ve veritabanı erişimi yetkilendirme ile sınırlıdır. Düzenli güvenlik kontrolleri yapılmaktadır.",
    },
    {
      title: "4. Çerezler",
      content:
        "StudyHane, oturum yönetimi ve tema tercihinizi hatırlamak için çerezler kullanır. Bu çerezler zorunlu çerezlerdir ve hizmetin düzgün çalışması için gereklidir. Üçüncü taraf reklam veya izleme çerezleri kullanılmamaktadır.",
    },
    {
      title: "5. İletişim",
      content:
        "Gizlilik politikamız hakkında sorularınız varsa veya verilerinizle ilgili talepleriniz için bizimle iletişime geçebilirsiniz. Hesabınızı silmek istediğinizde tüm kişisel verileriniz kalıcı olarak silinir.",
    },
  ];

  return (
    <main>
      <header style={{ padding: "24px 0", borderBottom: "1px solid var(--border)" }}>
        <div className="container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Link href="/">
            <h2 style={{ fontSize: "1.5rem", fontWeight: 800 }}>
              Study<span className="gradient-text">Hane</span>
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
            <span className="gradient-text">Gizlilik Politikası</span>
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
