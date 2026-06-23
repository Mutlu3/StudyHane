"use client";

import { useState, useEffect } from "react";

export default function SubjectsPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newCourseName, setNewCourseName] = useState("");
  const [newTopicNames, setNewTopicNames] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await fetch("/api/courses");
      if (res.ok) {
        const data = await res.json();
        setCourses(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourseName) return;
    try {
      const res = await fetch("/api/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCourseName }),
      });
      if (res.ok) {
        setNewCourseName("");
        fetchCourses();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteCourse = async (id: string) => {
    if (!confirm("Dersi ve içindeki tüm konuları silmek istediğinize emin misiniz?")) return;
    try {
      const res = await fetch(`/api/courses/${id}`, { method: "DELETE" });
      if (res.ok) fetchCourses();
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddTopic = async (e: React.FormEvent, courseId: string) => {
    e.preventDefault();
    const name = newTopicNames[courseId];
    if (!name) return;
    try {
      const res = await fetch("/api/topics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId, name }),
      });
      if (res.ok) {
        setNewTopicNames({ ...newTopicNames, [courseId]: "" });
        fetchCourses();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleToggleTopic = async (topicId: string, currentStatus: boolean) => {
    // Optimistic update
    setCourses(courses.map(c => ({
      ...c,
      topics: c.topics.map((t:any) => t.id === topicId ? { ...t, isCompleted: !currentStatus } : t)
    })));

    try {
      const res = await fetch(`/api/topics/${topicId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isCompleted: !currentStatus }),
      });
      if (!res.ok) fetchCourses(); // revert if failed
    } catch (error) {
      console.error(error);
      fetchCourses();
    }
  };

  const handleDeleteTopic = async (id: string) => {
    try {
      const res = await fetch(`/api/topics/${id}`, { method: "DELETE" });
      if (res.ok) fetchCourses();
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return <div>Yükleniyor...</div>;

  return (
    <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '8px' }}>Konu Takibi</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>
        Kendi derslerini ve konularını ekle, ilerlemeni adım adım takip et.
      </p>

      {/* Add Course Form */}
      <form onSubmit={handleAddCourse} className="glass-panel" style={{ padding: '24px', marginBottom: '40px', display: 'flex', gap: '16px' }}>
        <input 
          type="text" 
          value={newCourseName}
          onChange={e => setNewCourseName(e.target.value)}
          placeholder="Yeni Ders Ekle (Örn: Matematik)"
          style={{ flex: 1, padding: '12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', background: 'var(--bg-primary)', color: 'var(--text-main)' }}
        />
        <button type="submit" className="btn btn-primary" style={{ padding: '12px 24px' }}>Ders Ekle</button>
      </form>

      {/* Courses List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {courses.map(course => {
          const totalTopics = course.topics.length;
          const completedTopics = course.topics.filter((t:any) => t.isCompleted).length;
          const progressPercent = totalTopics === 0 ? 0 : Math.round((completedTopics / totalTopics) * 100);

          return (
            <div key={course.id} className="glass-panel" style={{ padding: '24px', position: 'relative' }}>
              <button 
                onClick={() => handleDeleteCourse(course.id)} 
                style={{ position: 'absolute', top: '24px', right: '24px', color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                Sil
              </button>
              
              <h2 style={{ fontSize: '1.5rem', marginBottom: '8px', color: 'var(--primary)' }}>{course.name}</h2>
              
              {/* Progress Bar */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                <div style={{ flex: 1, height: '8px', background: 'var(--bg-primary)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${progressPercent}%`, height: '100%', background: 'var(--primary)', transition: 'width 0.3s ease' }} />
                </div>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{completedTopics} / {totalTopics} (%{progressPercent})</span>
              </div>

              {/* Topics List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
                {course.topics.map((topic:any) => (
                  <div key={topic.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: 'var(--bg-primary)', borderRadius: 'var(--radius-sm)' }}>
                    <input 
                      type="checkbox" 
                      checked={topic.isCompleted}
                      onChange={() => handleToggleTopic(topic.id, topic.isCompleted)}
                      style={{ width: '20px', height: '20px', accentColor: 'var(--primary)', cursor: 'pointer' }}
                    />
                    <span style={{ flex: 1, fontSize: '1.1rem', textDecoration: topic.isCompleted ? 'line-through' : 'none', color: topic.isCompleted ? 'var(--text-muted)' : 'var(--text-main)' }}>
                      {topic.name}
                    </span>
                    <button onClick={() => handleDeleteTopic(topic.id)} style={{ color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.85rem' }}>
                      Sil
                    </button>
                  </div>
                ))}
              </div>

              {/* Add Topic Form */}
              <form onSubmit={(e) => handleAddTopic(e, course.id)} style={{ display: 'flex', gap: '12px' }}>
                <input 
                  type="text" 
                  value={newTopicNames[course.id] || ""}
                  onChange={e => setNewTopicNames({ ...newTopicNames, [course.id]: e.target.value })}
                  placeholder="Yeni Konu Ekle (Örn: Türev)"
                  style={{ flex: 1, padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', background: 'var(--bg-primary)', color: 'var(--text-main)', fontSize: '0.95rem' }}
                />
                <button type="submit" className="btn btn-outline" style={{ padding: '10px 16px', fontSize: '0.95rem' }}>Ekle</button>
              </form>
            </div>
          );
        })}
      </div>
    </div>
  );
}
