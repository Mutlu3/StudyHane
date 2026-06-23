"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PomodoroPage() {
  const [workMinutes, setWorkMinutes] = useState(25);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const router = useRouter();

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      if (!isBreak) {
        // Pomodoro finished, log it
        logPomodoro(workMinutes);
        setIsBreak(true);
        setTimeLeft(5 * 60); // 5 min break
        setIsActive(false);
        alert(`Tebrikler! ${workMinutes} Dakikalık çalışma süren hesabına eklendi. Şimdi 5 dakika mola!`);
      } else {
        // Break finished
        setIsBreak(false);
        setTimeLeft(workMinutes * 60);
        setIsActive(false);
        alert("Mola bitti! Yeni bir seansa başlamaya hazır mısın?");
      }
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, isBreak, workMinutes]);

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
    setTimeLeft(isBreak ? 5 * 60 : workMinutes * 60);
  };

  const handleDurationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const mins = parseInt(e.target.value);
    setWorkMinutes(mins);
    if (!isActive && !isBreak) {
      setTimeLeft(mins * 60);
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="animate-fade-in" style={{ textAlign: 'center', paddingTop: '40px' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '8px' }}>Pomodoro Sayacı</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>
        {isBreak ? "Mola Zamanı! Biraz dinlen." : "Odaklanma Zamanı! Telefonu uzaklaştır."}
      </p>

      {!isActive && !isBreak && (
        <div style={{ marginBottom: '32px' }}>
          <label style={{ marginRight: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>Çalışma Süresi:</label>
          <select 
            value={workMinutes} 
            onChange={handleDurationChange}
            style={{
              padding: '8px 16px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border)',
              background: 'var(--bg-primary)',
              color: 'var(--text-main)',
              fontSize: '1rem',
              cursor: 'pointer'
            }}
          >
            <option value={25}>25 Dakika</option>
            <option value={30}>30 Dakika</option>
            <option value={40}>40 Dakika</option>
            <option value={45}>45 Dakika</option>
            <option value={50}>50 Dakika</option>
            <option value={60}>60 Dakika</option>
          </select>
        </div>
      )}

      <div className="glass-panel" style={{ display: 'inline-block', padding: '60px 80px', borderRadius: '50%', border: `4px solid ${isBreak ? 'var(--secondary)' : 'var(--primary)'}` }}>
        <div style={{ fontSize: '6rem', fontWeight: 800, fontFamily: 'monospace', color: isBreak ? 'var(--secondary)' : 'var(--primary)' }}>
          {formatTime(timeLeft)}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginTop: '40px' }}>
        <button onClick={toggleTimer} className={`btn ${isActive ? 'btn-outline' : 'btn-primary'}`} style={{ width: '150px' }}>
          {isActive ? 'Duraklat' : (timeLeft < (isBreak ? 5 : workMinutes) * 60 ? 'Devam Et' : 'Başlat')}
        </button>
        <button onClick={resetTimer} className="btn btn-outline" style={{ width: '150px' }}>
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
