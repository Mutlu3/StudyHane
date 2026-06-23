"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PomodoroPage() {
  const [workMinutes, setWorkMinutes] = useState(25);
  const [breakMinutes, setBreakMinutes] = useState(5);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Ayarlardan okuma
    const savedWork = localStorage.getItem("pomodoro_work");
    const savedBreak = localStorage.getItem("pomodoro_break");
    const w = savedWork ? parseInt(savedWork) : 25;
    const b = savedBreak ? parseInt(savedBreak) : 5;
    setWorkMinutes(w);
    setBreakMinutes(b);
    if (!isActive) {
      setTimeLeft(isBreak ? b * 60 : w * 60);
    }
  }, [isActive, isBreak]);

  const playAlarmSound = () => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      let startTime = ctx.currentTime;
      for (let i = 0; i < 4; i++) { // 4 beeps
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = "sine";
        osc.frequency.setValueAtTime(880, startTime);
        gain.gain.setValueAtTime(0.1, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.3);
        osc.start(startTime);
        osc.stop(startTime + 0.3);
        startTime += 0.5;
      }
    } catch (e) {
      console.log("Ses çalınamadı", e);
    }
    if ("vibrate" in navigator) {
      navigator.vibrate([500, 250, 500, 250, 500]);
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      playAlarmSound();
      if (!isBreak) {
        logPomodoro(workMinutes);
        setIsBreak(true);
        setTimeLeft(breakMinutes * 60);
        setIsActive(false);
        if ("Notification" in window && Notification.permission === "granted") {
          new Notification("Tebrikler!", { body: `${workMinutes} dakikalık çalışma bitti. Mola zamanı!` });
        }
        alert(`Tebrikler! ${workMinutes} Dakikalık çalışma süren hesabına eklendi. Şimdi ${breakMinutes} dakika mola!`);
      } else {
        setIsBreak(false);
        setTimeLeft(workMinutes * 60);
        setIsActive(false);
        if ("Notification" in window && Notification.permission === "granted") {
          new Notification("Mola Bitti!", { body: "Yeni bir odaklanma seansına hazır mısın?" });
        }
        alert("Mola bitti! Yeni bir seansa başlamaya hazır mısın?");
      }
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, isBreak, workMinutes, breakMinutes]);

  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  const logPomodoro = async (minutes: number) => {
    await fetch('/api/log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ minutes, questions: 0, note: "Pomodoro Seansı" })
    });
    router.refresh();
  };

  const toggleTimer = () => setIsActive(!isActive);
  
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(isBreak ? breakMinutes * 60 : workMinutes * 60);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="animate-fade-in" style={{ textAlign: 'center', paddingTop: '16px' }}>
      <h1 style={{ fontSize: 'clamp(1.5rem, 5vw, 2.5rem)', marginBottom: '8px' }}>Pomodoro Sayacı</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '24px', fontSize: '0.95rem' }}>
        {isBreak ? "Mola Zamanı! Biraz dinlen." : "Odaklanma Zamanı! Telefonu uzaklaştır."}
      </p>

      {!isActive && !isBreak && (
        <p style={{ marginTop: '-10px', marginBottom: '32px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
          Süreleri ⚙️ Ayarlar menüsünden değiştirebilirsiniz.
        </p>
      )}

      <div className="glass-panel pomodoro-circle" style={{ display: 'inline-block', padding: '60px 80px', borderRadius: '50%', border: `4px solid ${isBreak ? 'var(--secondary)' : 'var(--primary)'}` }}>
        <div className="pomodoro-time" style={{ fontSize: '6rem', fontWeight: 800, fontFamily: 'monospace', color: isBreak ? 'var(--secondary)' : 'var(--primary)' }}>
          {formatTime(timeLeft)}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '24px', flexWrap: 'wrap' }}>
        <button onClick={toggleTimer} className={`btn ${isActive ? 'btn-outline' : 'btn-primary'}`} style={{ minWidth: '140px' }}>
          {isActive ? 'Duraklat' : (timeLeft < (isBreak ? breakMinutes : workMinutes) * 60 ? 'Devam Et' : 'Başlat')}
        </button>
        <button onClick={resetTimer} className="btn btn-outline" style={{ minWidth: '140px' }}>
          Sıfırla
        </button>
      </div>
      
      {!isBreak && (
        <p style={{ marginTop: '24px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Seans ({workMinutes} dk) bittiğinde süren otomatik olarak günlüğüne kaydedilecektir.
        </p>
      )}
    </div>
  );
}
