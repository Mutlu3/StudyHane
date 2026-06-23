"use client";

import { useState, useEffect } from "react";

interface WrongAnswer {
  id: string;
  imagePath: string;
  courseName: string;
  topicName?: string;
  note?: string;
  createdAt: string;
}

export default function WrongBookPage() {
  const [wrongAnswers, setWrongAnswers] = useState<WrongAnswer[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [courseName, setCourseName] = useState("");
  const [topicName, setTopicName] = useState("");
  const [note, setNote] = useState("");

  useEffect(() => {
    fetchWrongAnswers();
  }, []);

  async function fetchWrongAnswers() {
    try {
      const res = await fetch("/api/wrong-answers");
      if (res.ok) {
        const data = await res.json();
        setWrongAnswers(data);
      }
    } catch (err) {
      console.error("Yanlışlar yüklenemedi:", err);
    } finally {
      setLoading(false);
    }
  }

  // Compress image to prevent Vercel Payload Too Large errors (413)
  const compressImage = (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const MAX_WIDTH = 1000;
          const MAX_HEIGHT = 1000;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx?.drawImage(img, 0, 0, width, height);
          canvas.toBlob(
            (blob) => {
              if (blob) {
                const compressedFile = new File([blob], file.name, {
                  type: "image/jpeg",
                  lastModified: Date.now(),
                });
                resolve(compressedFile);
              } else {
                reject(new Error("Sıkıştırma başarısız."));
              }
            },
            "image/jpeg",
            0.7
          );
        };
      };
      reader.onerror = (error) => reject(error);
    });
  };

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!imageFile || !courseName.trim()) return;

    setSubmitting(true);

    try {
      const compressedImage = await compressImage(imageFile);

      const formData = new FormData();
      formData.append("image", compressedImage);
      formData.append("courseName", courseName.trim());
      if (topicName.trim()) formData.append("topicName", topicName.trim());
      if (note.trim()) formData.append("note", note.trim());

      const res = await fetch("/api/wrong-answers", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const newAnswer = await res.json();
        setWrongAnswers((prev) => [newAnswer, ...prev]);
        // Reset form
        setImageFile(null);
        setImagePreview(null);
        setCourseName("");
        setTopicName("");
        setNote("");
        // Reset file input
        const fileInput = document.getElementById("wrong-image-input") as HTMLInputElement;
        if (fileInput) fileInput.value = "";
      } else {
        const errorData = await res.json().catch(() => ({}));
        alert("Hata: " + (errorData.error || "Sunucu yüklemeyi reddetti (Dosya çok büyük olabilir)."));
      }
    } catch (err: any) {
      console.error("Yükleme başarısız:", err);
      alert("Bir hata oluştu: " + (err.message || "Bilinmeyen hata"));
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Bu yanlışı silmek istediğine emin misin?")) return;

    try {
      const res = await fetch(`/api/wrong-answers/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setWrongAnswers((prev) => prev.filter((w) => w.id !== id));
      }
    } catch (err) {
      console.error("Silme başarısız:", err);
    }
  }

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("tr-TR", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return (
    <div className="animate-fade-in" style={{ maxWidth: "900px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "2.5rem", marginBottom: "8px" }}>📕 Yanlış Defteri</h1>
      <p style={{ color: "var(--text-muted)", marginBottom: "32px" }}>
        Yanlış yaptığın soruların ekran görüntülerini yükle, notlar ekle ve tekrar çalış.
      </p>

      {/* Upload Form */}
      <div className="glass-panel" style={{ padding: "24px", marginBottom: "32px" }}>
        <h2 style={{ fontSize: "1.3rem", marginBottom: "20px", color: "var(--primary)" }}>
          Yeni Yanlış Ekle
        </h2>

        <form onSubmit={handleSubmit}>
          {/* Image Upload */}
          <div style={{ marginBottom: "16px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: 600,
                color: "var(--text-main)",
              }}
            >
              Soru Görseli *
            </label>
            <div style={{ display: "flex", gap: "12px" }}>
              <label
                htmlFor="wrong-image-camera"
                style={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "16px 8px",
                  background: "var(--bg-primary)",
                  border: "2px dashed var(--primary)",
                  borderRadius: "var(--radius-sm)",
                  color: "var(--primary)",
                  fontWeight: 600,
                  cursor: "pointer",
                  textAlign: "center",
                  transition: "all 0.2s"
                }}
              >
                📸 Foto Çek
              </label>
              <input
                id="wrong-image-camera"
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleImageChange}
                style={{ display: "none" }}
              />

              <label
                htmlFor="wrong-image-gallery"
                style={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "16px 8px",
                  background: "var(--bg-primary)",
                  border: "2px dashed var(--secondary)",
                  borderRadius: "var(--radius-sm)",
                  color: "var(--secondary)",
                  fontWeight: 600,
                  cursor: "pointer",
                  textAlign: "center",
                  transition: "all 0.2s"
                }}
              >
                🖼️ Galeriden Seç
              </label>
              <input
                id="wrong-image-gallery"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: "none" }}
              />
            </div>

            {imageFile && (
              <div style={{ marginTop: "8px", fontSize: "0.85rem", color: "var(--text-muted)", textAlign: "center" }}>
                Seçilen dosya: {imageFile.name}
              </div>
            )}
            {imagePreview && (
              <div style={{ marginTop: "12px" }}>
                <img
                  src={imagePreview}
                  alt="Önizleme"
                  style={{
                    maxWidth: "100%",
                    maxHeight: "240px",
                    borderRadius: "var(--radius-sm)",
                    border: "1px solid var(--border)",
                    objectFit: "contain",
                  }}
                />
              </div>
            )}
          </div>

          {/* Course & Topic Row */}
          <div style={{ display: "flex", gap: "16px", marginBottom: "16px", flexWrap: "wrap" }}>
            <div style={{ flex: "1 1 200px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: 600,
                  color: "var(--text-main)",
                }}
              >
                Ders *
              </label>
              <input
                type="text"
                value={courseName}
                onChange={(e) => setCourseName(e.target.value)}
                placeholder="örn. Matematik"
                required
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  background: "var(--bg-primary)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius-sm)",
                  color: "var(--text-main)",
                  fontSize: "1rem",
                }}
              />
            </div>

            <div style={{ flex: "1 1 200px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: 600,
                  color: "var(--text-main)",
                }}
              >
                Konu
              </label>
              <input
                type="text"
                value={topicName}
                onChange={(e) => setTopicName(e.target.value)}
                placeholder="örn. Türev"
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  background: "var(--bg-primary)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius-sm)",
                  color: "var(--text-main)",
                  fontSize: "1rem",
                }}
              />
            </div>
          </div>

          {/* Note */}
          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: 600,
                color: "var(--text-main)",
              }}
            >
              Not
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Bu soruyu neden yanlış yaptın? Dikkat etmen gereken şeyler..."
              rows={3}
              style={{
                width: "100%",
                padding: "10px 14px",
                background: "var(--bg-primary)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-sm)",
                color: "var(--text-main)",
                fontSize: "1rem",
                resize: "vertical",
              }}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={submitting || !imageFile || !courseName.trim()}
            style={{ padding: "12px 32px", fontSize: "1rem" }}
          >
            {submitting ? "Yükleniyor..." : "Yanlışı Kaydet"}
          </button>
        </form>
      </div>

      {/* Wrong Answers Grid */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
          <div style={{ width: '40px', height: '40px', border: '3px solid var(--border)', borderTop: '3px solid var(--primary)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        </div>
      ) : wrongAnswers.length === 0 ? (
        <div
          className="glass-panel"
          style={{
            padding: "40px",
            textAlign: "center",
            color: "var(--text-muted)",
          }}
        >
          <p style={{ fontSize: "2rem", marginBottom: "8px" }}>📝</p>
          <p>Henüz yanlış kaydedilmemiş. Yukarıdan ilk yanlışını ekle!</p>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "24px",
          }}
        >
          {wrongAnswers.map((wa) => (
            <div
              key={wa.id}
              className="glass-panel animate-fade-in"
              style={{ padding: "0", overflow: "hidden" }}
            >
              {/* Image */}
              <img
                src={wa.imagePath}
                alt={`${wa.courseName} yanlış`}
                style={{
                  width: "100%",
                  maxHeight: "260px",
                  objectFit: "cover",
                  borderBottom: "1px solid var(--border)",
                }}
              />

              {/* Card Content */}
              <div style={{ padding: "16px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: "8px",
                  }}
                >
                  <div>
                    <span
                      style={{
                        display: "inline-block",
                        padding: "4px 10px",
                        background: "var(--primary)",
                        color: "#fff",
                        borderRadius: "var(--radius-sm)",
                        fontSize: "0.85rem",
                        fontWeight: 600,
                      }}
                    >
                      {wa.courseName}
                    </span>
                    {wa.topicName && (
                      <span
                        style={{
                          display: "inline-block",
                          padding: "4px 10px",
                          background: "var(--secondary)",
                          color: "var(--text-main)",
                          borderRadius: "var(--radius-sm)",
                          fontSize: "0.85rem",
                          fontWeight: 500,
                          marginLeft: "8px",
                        }}
                      >
                        {wa.topicName}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => handleDelete(wa.id)}
                    className="btn btn-outline"
                    style={{
                      padding: "4px 10px",
                      fontSize: "0.8rem",
                      color: "var(--accent)",
                      borderColor: "var(--accent)",
                    }}
                  >
                    Sil
                  </button>
                </div>

                {wa.note && (
                  <p
                    style={{
                      color: "var(--text-muted)",
                      fontSize: "0.95rem",
                      marginTop: "8px",
                      lineHeight: 1.5,
                    }}
                  >
                    {wa.note}
                  </p>
                )}

                <p
                  style={{
                    color: "var(--text-muted)",
                    fontSize: "0.8rem",
                    marginTop: "12px",
                    opacity: 0.7,
                  }}
                >
                  {formatDate(wa.createdAt)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
