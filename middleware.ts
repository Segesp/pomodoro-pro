import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const isAuth = !!req.nextauth.token;
    const isAuthPage = req.nextUrl.pathname === '/login';
    const isTimerPage = req.nextUrl.pathname === '/timer';

    // Si el usuario está autenticado y trata de acceder a la página de login, redirigirlo al timer
    if (isAuthPage && isAuth) {
      console.log("Usuario autenticado intentando acceder a /login, redirigiendo a /timer");
      return NextResponse.redirect(new URL('/timer', req.url));
    }

    // Si el usuario no está autenticado y trata de acceder a una página protegida, redirigirlo al login
    if (!isAuth && isTimerPage) {
      console.log("Usuario no autenticado intentando acceder a /timer, redirigiendo a /login");
      return NextResponse.redirect(
        new URL(`/login?callbackUrl=${encodeURIComponent(req.nextUrl.pathname)}`, req.url)
      );
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => true, // Permitir todas las peticiones y manejar la lógica en el middleware
    },
  }
);

export const config = {
  matcher: ["/timer", "/login", "/"],
}; 