import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const isAuth = !!req.nextauth.token;
    const isAuthPage = req.nextUrl.pathname === '/login';
    const isTimerPage = req.nextUrl.pathname === '/timer';
    const isRootPage = req.nextUrl.pathname === '/';
    const baseUrl = process.env.NEXTAUTH_URL || 'https://pomodoro-pro2.vercel.app';

    // Si el usuario está autenticado y trata de acceder a la página de login, redirigirlo al timer
    if (isAuthPage && isAuth) {
      console.log("Usuario autenticado intentando acceder a /login, redirigiendo a /timer");
      return NextResponse.redirect(new URL('/timer', baseUrl));
    }

    // Si el usuario no está autenticado y trata de acceder a una página protegida, redirigirlo al login
    if (!isAuth && (isTimerPage || isRootPage)) {
      console.log("Usuario no autenticado intentando acceder a página protegida, redirigiendo a /login");
      const loginUrl = new URL('/login', baseUrl);
      loginUrl.searchParams.set('callbackUrl', req.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => true,
    },
  }
);

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (auth endpoints)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api/auth|_next/static|_next/image|favicon.ico).*)',
  ],
}; 