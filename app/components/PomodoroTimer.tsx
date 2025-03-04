'use client';

import { useState, useEffect, useCallback } from 'react';
import { signOut } from 'next-auth/react';

interface PomodoroSession {
  id: string;
  startTime: string;
  endTime: string | null;
  type: string;
  completed: boolean;
}

const PomodoroTimer = () => {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'work' | 'break'>('work');
  const [currentSession, setCurrentSession] = useState<PomodoroSession | null>(null);

  const createSession = async () => {
    try {
      const response = await fetch('/api/pomodoro', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: mode,
        }),
      });

      if (response.ok) {
        const session = await response.json();
        setCurrentSession(session);
      }
    } catch (error) {
      console.error('Error al crear la sesión:', error);
    }
  };

  const completeSession = async () => {
    if (currentSession) {
      try {
        await fetch('/api/pomodoro', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: currentSession.id,
            completed: true,
          }),
        });
        setCurrentSession(null);
      } catch (error) {
        console.error('Error al completar la sesión:', error);
      }
    }
  };

  const resetTimer = useCallback(() => {
    setIsActive(false);
    if (mode === 'work') {
      setMinutes(25);
    } else {
      setMinutes(5);
    }
    setSeconds(0);
    if (currentSession) {
      completeSession();
    }
  }, [mode, currentSession]);

  const toggleTimer = useCallback(() => {
    setIsActive((prev) => {
      if (!prev) {
        createSession();
      }
      return !prev;
    });
  }, []);

  const switchMode = useCallback(() => {
    if (currentSession) {
      completeSession();
    }
    const newMode = mode === 'work' ? 'break' : 'work';
    setMode(newMode);
    setIsActive(false);
    setMinutes(newMode === 'work' ? 25 : 5);
    setSeconds(0);
  }, [mode, currentSession]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout | undefined;

    if (isActive) {
      intervalId = setInterval(() => {
        setSeconds((prevSeconds) => {
          if (prevSeconds === 0) {
            setMinutes((prevMinutes) => {
              if (prevMinutes === 0) {
                if (currentSession) {
                  completeSession();
                }
                switchMode();
                return mode === 'work' ? 25 : 5;
              }
              return prevMinutes - 1;
            });
            return 59;
          }
          return prevSeconds - 1;
        });
      }, 1000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isActive, mode, switchMode, currentSession]);

  // Calcular el progreso para el círculo
  const totalSeconds = mode === 'work' ? 25 * 60 : 5 * 60;
  const currentSeconds = minutes * 60 + seconds;
  const progress = 1 - currentSeconds / totalSeconds;

  const handleSignOut = () => {
    signOut({ callbackUrl: '/login' });
  };

  return (
    <div className="bg-gradient-to-br from-red-50 to-white rounded-xl shadow-2xl p-8 w-full max-w-md border border-red-100">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-red-800">Pomodoro Timer</h1>
        <button
          onClick={handleSignOut}
          className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-800 transition-colors"
        >
          Cerrar Sesión
        </button>
      </div>

      <div className="relative h-64 mb-8">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-6xl font-bold text-red-900">
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </div>
        </div>
        <svg className="transform -rotate-90 w-full h-full">
          <circle
            className="text-red-100"
            strokeWidth="12"
            stroke="currentColor"
            fill="transparent"
            r="120"
            cx="50%"
            cy="50%"
          />
          <circle
            className={`${
              mode === 'work' ? 'text-red-500' : 'text-green-500'
            } transition-all duration-300`}
            strokeWidth="12"
            strokeDasharray={2 * Math.PI * 120}
            strokeDashoffset={2 * Math.PI * 120 * progress}
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r="120"
            cx="50%"
            cy="50%"
          />
        </svg>
      </div>

      <div className="space-y-6">
        <div className="flex justify-center space-x-4">
          <button
            onClick={toggleTimer}
            className={`px-8 py-3 rounded-lg font-semibold text-white transition-colors shadow-md ${
              isActive
                ? 'bg-red-600 hover:bg-red-700 active:bg-red-800'
                : 'bg-red-500 hover:bg-red-600 active:bg-red-700'
            }`}
          >
            {isActive ? 'Pausar' : 'Iniciar'}
          </button>
          <button
            onClick={resetTimer}
            className="px-8 py-3 rounded-lg font-semibold text-red-700 bg-white border-2 border-red-200 hover:bg-red-50 hover:border-red-300 transition-colors shadow-md"
          >
            Reiniciar
          </button>
        </div>
        <div className="text-center">
          <span className={`inline-block px-4 py-2 rounded-full ${
            mode === 'work' 
              ? 'bg-red-100 text-red-800' 
              : 'bg-green-100 text-green-800'
          } font-medium`}>
            Modo: {mode === 'work' ? 'Trabajo' : 'Descanso'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PomodoroTimer; 