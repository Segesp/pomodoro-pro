'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import PomodoroTimer from '@/app/components/PomodoroTimer';
import PomodoroHistory from "@/app/components/PomodoroHistory";
import LofiPlayer from "@/app/components/LofiPlayer";

export default function TimerPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  // Este efecto se ejecuta solo en el lado del cliente
  useEffect(() => {
    setIsClient(true);
    
    console.log("Estado de sesión en timer:", status);
    console.log("Datos de sesión en timer:", session);
    
    if (status === "unauthenticated") {
      console.log("Usuario no autenticado en /timer, redirigiendo a /login");
      router.replace('/login');
    }
  }, [status, session, router]);

  // Mostrar estado de carga mientras se verifica la sesión
  if (status === "loading" || !isClient) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
        <span className="ml-3 text-gray-700">Verificando tu sesión...</span>
      </div>
    );
  }

  // Si no hay sesión después de verificar, no renderizar nada
  // El middleware o el useEffect se encargarán de la redirección
  if (status === "unauthenticated" || !session?.user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
        <div className="text-xl text-red-700 mb-4">No tienes acceso a esta página</div>
        <button 
          onClick={() => router.push('/login')}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
        >
          Ir a iniciar sesión
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white shadow-xl rounded-lg p-6">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-3xl font-bold text-red-900">
                Pomodoro Timer
              </h1>
              <div className="text-gray-600">
                Bienvenido, {session.user?.name || session.user?.email}
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <PomodoroTimer />
              </div>
              <div className="space-y-6">
                <LofiPlayer />
                <PomodoroHistory />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 