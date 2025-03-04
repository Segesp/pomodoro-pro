import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Iniciar Sesión - Pomodoro Pro',
  description: 'Inicia sesión en Pomodoro Pro para gestionar tu tiempo de manera efectiva',
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 