'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ErrorPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirigir a la página de login después de 3 segundos
    const timer = setTimeout(() => {
      router.push('/login');
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gray-50">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <h2 className="mt-6 text-3xl font-extrabold text-red-900">
            ¡Ups! Algo salió mal
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Hubo un problema durante la autenticación. Serás redirigido a la página de inicio de sesión en unos segundos...
          </p>
        </div>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600 mx-auto"></div>
      </div>
    </div>
  );
} 