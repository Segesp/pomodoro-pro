'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import PomodoroTimer from '@/app/components/PomodoroTimer';
import PomodoroHistory from "@/app/components/PomodoroHistory";
import LofiPlayer from "@/app/components/LofiPlayer";

export default function TimerPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace('/login');
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (!session) {
    return null;
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