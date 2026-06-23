"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function SettingsPage() {
  const { data: session } = useSession();
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [pomodoroWork, setPomodoroWork] = useState("25");
  const [pomodoroBreak, setPomodoroBreak] = useState("5");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute("data-theme", savedTheme);
    }
    
    const savedWork = localStorage.getItem("pomodoro_work");
    const savedBreak = localStorage.getItem("pomodoro_break");
    if (savedWork) setPomodoroWork(savedWork);
    if (savedBreak) setPomodoroBreak(savedBreak);
  }, []);

  const savePomodoroWork = (val: string) => {
    setPomodoroWork(val);
    localStorage.setItem("pomodoro_work", val);
  };

  const savePomodoroBreak = (val: string) => {
    setPomodoroBreak(val);
    localStorage.setItem("pomodoro_break", val);
  };

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    localStorage.setItem("theme", next);
    document.documentElement.setAttribute("data-theme", next);
  };

  return (
    <div className="animate-fade-in">
      <h1 style={{ fontSize: "2rem", marginBottom: "32px" }}>
        ⚙️ <span className="gradient-text">Ayarlar</span>
      </h1>

      {/* Theme Section */}
      <div
        className="glass-panel"
        style={{ padding: "32px", marginBottom: "24px" }}
      >
        <h2 style={{ fontSize: "1.2rem", marginBottom: "20px" }}>
          🎨 Görünüm
        </h2>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <div style={{ fontWeight: 600, marginBottom: "4px" }}>Tema</div>
            <div style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
              {theme === "light" ? "Açık mod aktif" : "Koyu mod aktif"}
            </div>
          </div>

          <button
            onClick={toggleTheme}
            style={{
              width: "56px",
              height: "30px",
              borderRadius: "var(--radius-pill)",
              border: "none",
              cursor: "pointer",
              position: "relative",
              background:
                theme === "dark"
                  ? "var(--primary-gradient)"
                  : "var(--text-light)",
              transition: "var(--transition)",
              flexShrink: 0,
            }}
            aria-label="Tema değiştir"
          >
            <span
              style={{
                position: "absolute",
                top: "3px",
                left: theme === "dark" ? "29px" : "3px",
                width: "24px",
                height: "24px",
                borderRadius: "50%",
                background: "white",
                transition: "var(--transition)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "14px",
                boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
              }}
            >
              {theme === "dark" ? "🌙" : "☀️"}
            </span>
          </button>
        </div>
      </div>

      {/* Pomodoro Section */}
      <div
        className="glass-panel"
        style={{ padding: "32px", marginBottom: "24px" }}
      >
        <h2 style={{ fontSize: "1.2rem", marginBottom: "20px" }}>
          ⏱️ Pomodoro
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontWeight: 600, marginBottom: "4px" }}>Odaklanma Süresi</div>
              <div style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>Ana çalışma seansı</div>
            </div>
            <select
              value={pomodoroWork}
              onChange={(e) => savePomodoroWork(e.target.value)}
              style={{ padding: "8px", borderRadius: "var(--radius-sm)", background: "var(--bg-primary)", color: "var(--text-main)", border: "1px solid var(--border)" }}
            >
              <option value="25">25 Dk</option>
              <option value="30">30 Dk</option>
              <option value="40">40 Dk</option>
              <option value="45">45 Dk</option>
              <option value="50">50 Dk</option>
              <option value="60">60 Dk</option>
            </select>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontWeight: 600, marginBottom: "4px" }}>Mola Süresi</div>
              <div style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>Seanslar arası dinlenme</div>
            </div>
            <select
              value={pomodoroBreak}
              onChange={(e) => savePomodoroBreak(e.target.value)}
              style={{ padding: "8px", borderRadius: "var(--radius-sm)", background: "var(--bg-primary)", color: "var(--text-main)", border: "1px solid var(--border)" }}
            >
              <option value="5">5 Dk</option>
              <option value="10">10 Dk</option>
              <option value="15">15 Dk</option>
              <option value="20">20 Dk</option>
            </select>
          </div>
        </div>
      </div>

      {/* Account Section */}
      <div
        className="glass-panel"
        style={{ padding: "32px", marginBottom: "24px" }}
      >
        <h2 style={{ fontSize: "1.2rem", marginBottom: "20px" }}>
          👤 Hesap Bilgileri
        </h2>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          <div
            className="settings-row"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "12px 16px",
              background: "var(--bg-primary)",
              borderRadius: "var(--radius-sm)",
            }}
          >
            <span style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
              Ad
            </span>
            <span style={{ fontWeight: 600 }}>
              {session?.user?.name || "—"}
            </span>
          </div>

          <div
            className="settings-row"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "12px 16px",
              background: "var(--bg-primary)",
              borderRadius: "var(--radius-sm)",
              wordBreak: "break-all",
            }}
          >
            <span style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
              E-posta
            </span>
            <span style={{ fontWeight: 600 }}>
              {session?.user?.email || "—"}
            </span>
          </div>
        </div>
      </div>

      {/* Legal Section */}
      <div
        className="glass-panel"
        style={{ padding: "32px", marginBottom: "24px" }}
      >
        <h2 style={{ fontSize: "1.2rem", marginBottom: "20px" }}>
          📄 Yasal
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <Link
            href="/privacy"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "12px 16px",
              background: "var(--bg-primary)",
              borderRadius: "var(--radius-sm)",
              color: "var(--text-main)",
              fontWeight: 500,
            }}
          >
            <span>Gizlilik Politikası</span>
            <span style={{ color: "var(--text-muted)" }}>→</span>
          </Link>

          <Link
            href="/terms"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "12px 16px",
              background: "var(--bg-primary)",
              borderRadius: "var(--radius-sm)",
              color: "var(--text-main)",
              fontWeight: 500,
            }}
          >
            <span>Kullanım Şartları</span>
            <span style={{ color: "var(--text-muted)" }}>→</span>
          </Link>
        </div>
      </div>

      {/* Danger Zone */}
      <div
        className="glass-panel"
        style={{
          padding: "32px",
          borderColor: "rgba(244, 63, 94, 0.3)",
        }}
      >
        <h2
          style={{
            fontSize: "1.2rem",
            marginBottom: "8px",
            color: "var(--accent)",
          }}
        >
          ⚠️ Tehlikeli Bölge
        </h2>
        <p
          style={{
            color: "var(--text-muted)",
            fontSize: "0.9rem",
            marginBottom: "20px",
          }}
        >
          Hesabınızı sildiğinizde tüm verileriniz kalıcı olarak silinir. Bu
          işlem geri alınamaz.
        </p>
        <button
          className="btn"
          style={{
            background: "transparent",
            border: "2px solid var(--accent)",
            color: "var(--accent)",
            padding: "10px 24px",
          }}
          onClick={() => alert("Bu özellik yakında eklenecek.")}
        >
          Hesabımı Sil
        </button>
      </div>
    </div>
  );
}
