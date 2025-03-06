import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

// Proteger rutas específicas
export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;

    // Si el usuario está autenticado y trata de acceder a /login
    if (pathname === '/login' && token) {
      return NextResponse.redirect(new URL('/timer', req.url));
    }

    // Si el usuario no está autenticado y trata de acceder a rutas protegidas
    if (!token && pathname !== '/login') {
      return NextResponse.redirect(new URL('/login', req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => true, // Permitimos que el middleware maneje todas las rutas
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