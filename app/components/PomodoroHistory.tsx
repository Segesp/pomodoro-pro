'use client';

import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface PomodoroSession {
  id: string;
  startTime: string;
  endTime: string | null;
  type: string;
  completed: boolean;
}

export default function PomodoroHistory() {
  const [sessions, setSessions] = useState<PomodoroSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await fetch('/api/pomodoro');
        if (response.ok) {
          const data = await response.json();
          setSessions(data);
        }
      } catch (error) {
        console.error('Error al cargar el historial:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, []);

  const getSessionStats = () => {
    const completed = sessions.filter(s => s.completed).length;
    const work = sessions.filter(s => s.type === 'work').length;
    const breaks = sessions.filter(s => s.type === 'break').length;

    return { completed, work, breaks };
  };

  const stats = getSessionStats();

  if (loading) {
    return (
      <div className="text-center py-4">
        <p className="text-gray-600">Cargando historial...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mt-8 w-full max-w-md">
      <h2 className="text-2xl font-bold text-red-800 mb-4">Tu Historial</h2>
      
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-red-50 p-4 rounded-lg text-center">
          <p className="text-2xl font-bold text-red-800">{stats.completed}</p>
          <p className="text-sm text-red-600">Completados</p>
        </div>
        <div className="bg-red-50 p-4 rounded-lg text-center">
          <p className="text-2xl font-bold text-red-800">{stats.work}</p>
          <p className="text-sm text-red-600">Trabajo</p>
        </div>
        <div className="bg-red-50 p-4 rounded-lg text-center">
          <p className="text-2xl font-bold text-red-800">{stats.breaks}</p>
          <p className="text-sm text-red-600">Descansos</p>
        </div>
      </div>

      <div className="space-y-4">
        {sessions.slice(0, 5).map((session) => (
          <div
            key={session.id}
            className="border border-red-100 rounded-lg p-4 hover:bg-red-50 transition-colors"
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium text-red-800">
                  {session.type === 'work' ? '🎯 Trabajo' : '☕ Descanso'}
                </p>
                <p className="text-sm text-gray-600">
                  {format(new Date(session.startTime), "d 'de' MMMM, HH:mm", { locale: es })}
                </p>
              </div>
              <span
                className={`px-2 py-1 rounded text-sm ${
                  session.completed
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}
              >
                {session.completed ? 'Completado' : 'En progreso'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {sessions.length > 5 && (
        <div className="text-center mt-4">
          <button className="text-red-600 hover:text-red-800 text-sm font-medium">
            Ver más
          </button>
        </div>
      )}
    </div>
  );
} 