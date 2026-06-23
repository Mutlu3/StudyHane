"use client";

import { useState, useEffect } from "react";

interface Task {
  id: string;
  title: string;
  isCompleted: boolean;
  createdAt: string;
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await fetch("/api/tasks");
      if (res.ok) {
        const data = await res.json();
        setTasks(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title.trim() }),
      });
      if (res.ok) {
        const newTask = await res.json();
        setTasks([...tasks, newTask]);
        setTitle("");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  const toggleTask = async (id: string, currentStatus: boolean) => {
    // Optimistic update
    setTasks(tasks.map(t => t.id === id ? { ...t, isCompleted: !currentStatus } : t));

    try {
      await fetch(`/api/tasks/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isCompleted: !currentStatus }),
      });
    } catch (error) {
      console.error(error);
      // Revert on error
      fetchTasks();
    }
  };

  const deleteTask = async (id: string) => {
    // Optimistic update
    setTasks(tasks.filter(t => t.id !== id));
    try {
      await fetch(`/api/tasks/${id}`, { method: "DELETE" });
    } catch (error) {
      console.error(error);
      fetchTasks();
    }
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: "700px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "2.5rem", marginBottom: "8px" }}>✅ Görevler</h1>
      <p style={{ color: "var(--text-muted)", marginBottom: "32px" }}>Günlük yapman gerekenleri yaz ve tamamladıkça işaretle.</p>

      {/* Add Task Form */}
      <form onSubmit={handleAddTask} style={{ display: 'flex', gap: '12px', marginBottom: '32px' }}>
        <input 
          type="text" 
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Örn: 20 Soru Paragraf, 10 Sayfa Kitap..."
          style={{ flex: 1, padding: '12px 16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', background: 'var(--bg-primary)', color: 'var(--text-main)', fontSize: '1rem' }}
        />
        <button type="submit" disabled={submitting || !title.trim()} className="btn btn-primary" style={{ padding: '0 24px', whiteSpace: 'nowrap', fontSize: '1rem' }}>
          Ekle
        </button>
      </form>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
          <div style={{ width: '40px', height: '40px', border: '3px solid var(--border)', borderTop: '3px solid var(--primary)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        </div>
      ) : tasks.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: "center", padding: "40px" }}>
          <p style={{ fontSize: "2.5rem", marginBottom: "16px" }}>📝</p>
          <p style={{ color: "var(--text-muted)", fontSize: "1.1rem" }}>Henüz hiç görev eklemedin. Yukarıdan ilk görevini yaz!</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {tasks.map(task => (
            <div 
              key={task.id} 
              className="glass-panel animate-fade-in"
              style={{ 
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px',
                opacity: task.isCompleted ? 0.6 : 1, transition: 'all 0.3s'
              }}
            >
              <label style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1, cursor: 'pointer' }}>
                <input 
                  type="checkbox" 
                  checked={task.isCompleted} 
                  onChange={() => toggleTask(task.id, task.isCompleted)}
                  style={{ width: '22px', height: '22px', cursor: 'pointer', accentColor: 'var(--primary)' }}
                />
                <span style={{ 
                  fontSize: '1.1rem', 
                  textDecoration: task.isCompleted ? 'line-through' : 'none',
                  color: task.isCompleted ? 'var(--text-muted)' : 'var(--text-main)',
                  transition: 'all 0.2s'
                }}>
                  {task.title}
                </span>
              </label>
              
              <button 
                onClick={() => deleteTask(task.id)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '1.2rem', cursor: 'pointer', padding: '4px 8px', marginLeft: '16px' }}
                title="Görevi Sil"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
