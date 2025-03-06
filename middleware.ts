import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // Ignorar las rutas de la API
    if (req.nextUrl.pathname.startsWith('/api')) {
      return NextResponse.next();
    }

    const isAuth = !!req.nextauth.token;
    const isAuthPage = req.nextUrl.pathname === '/login';
    const isTimerPage = req.nextUrl.pathname === '/timer';
    const isRootPage = req.nextUrl.pathname === '/';

    // Si el usuario está autenticado y trata de acceder a la página de login, redirigirlo al timer
    if (isAuthPage && isAuth) {
      return NextResponse.redirect(new URL('/timer', req.url));
    }

    // Si el usuario no está autenticado y trata de acceder a una página protegida, redirigirlo al login
    if (!isAuth && (isTimerPage || isRootPage)) {
      return NextResponse.redirect(new URL('/login', req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: [
    '/',
    '/login',
    '/timer',
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}; 