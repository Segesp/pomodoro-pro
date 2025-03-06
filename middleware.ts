import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

// Este middleware se ejecuta antes de cada solicitud
export async function middleware(req: NextRequest) {
  // No aplicar middleware a las rutas de la API o archivos estáticos
  if (
    req.nextUrl.pathname.startsWith('/api') ||
    req.nextUrl.pathname.startsWith('/_next') ||
    req.nextUrl.pathname.includes('/favicon.ico')
  ) {
    return NextResponse.next();
  }

  // Obtener el token del usuario de la cookie
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const isAuthenticated = !!token;
  
  // Rutas y su estado de protección
  const isLoginPage = req.nextUrl.pathname === '/login';
  const isTimerPage = req.nextUrl.pathname === '/timer';
  const isRootPage = req.nextUrl.pathname === '/';

  // Redirigir si ya está autenticado y va a login
  if (isAuthenticated && isLoginPage) {
    return NextResponse.redirect(new URL('/timer', req.url));
  }

  // Redirigir si no está autenticado y va a páginas protegidas
  if (!isAuthenticated && (isTimerPage || isRootPage)) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}; 