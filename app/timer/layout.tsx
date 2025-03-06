import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Temporizador Pomodoro - Pomodoro Pro',
  description: 'Gestiona tu tiempo de manera efectiva con nuestro temporizador Pomodoro',
};

export default function TimerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
} 