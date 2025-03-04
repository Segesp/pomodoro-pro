'use client';

import { signIn, signOut, useSession } from 'next-auth/react';

const LoginButton = () => {
  const { data: session } = useSession();

  if (session) {
    return (
      <button
        onClick={() => signOut({ callbackUrl: '/login' })}
        className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
      >
        Cerrar Sesión
      </button>
    );
  }

  return (
    <button
      onClick={() => signIn(undefined, { callbackUrl: '/timer' })}
      className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
    >
      Iniciar Sesión
    </button>
  );
};

export default LoginButton; 