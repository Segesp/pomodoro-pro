import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

// Proteger rutas específicas
export default withAuth(
  function middleware(req) {
    const isAuthPage = req.nextUrl.pathname === '/login';
    const isTimerPage = req.nextUrl.pathname === '/timer';
    const isRootPage = req.nextUrl.pathname === '/';

    // Si el usuario está autenticado y trata de acceder a login, redirigir a timer
    if (isAuthPage && req.nextauth.token) {
      return NextResponse.redirect(new URL('/timer', req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      // Solo permitir acceso a rutas protegidas si hay token
      authorized: ({ req, token }) => {
        const isAuthPage = req.nextUrl.pathname === '/login';
        
        // Permitir acceso a la página de login sin autenticación
        if (isAuthPage) {
          return true;
        }

        // Requerir token para otras rutas
        return !!token;
      },
    },
    pages: {
      signIn: '/login',
    },
  }
);

// Proteger todas las rutas excepto /login y archivos estáticos
export const config = {
  matcher: [
    '/',
    '/timer',
    '/login',
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}; 