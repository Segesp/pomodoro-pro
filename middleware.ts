import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

// Middleware para manejar la autenticación
export default withAuth(
  function middleware(req) {
    // Obtenemos la información del token y la ruta
    const { pathname } = req.nextUrl;
    const token = req.nextauth?.token;

    console.log(`Middleware ejecutándose para ruta: ${pathname}, token presente: ${!!token}`);

    // Rutas públicas que no requieren autenticación
    const publicRoutes = ['/login', '/api/auth'];
    const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));
    
    // Rutas protegidas que requieren autenticación
    const protectedRoutes = ['/timer'];
    const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

    // Si el usuario está autenticado y trata de acceder a /login
    if (pathname === '/login' && token) {
      console.log('Usuario autenticado intentando acceder a /login. Redirigiendo a /timer');
      return NextResponse.redirect(new URL('/timer', req.url));
    }

    // Si el usuario no está autenticado y trata de acceder a una ruta protegida
    if (!token && isProtectedRoute) {
      console.log(`Usuario no autenticado intentando acceder a ruta protegida: ${pathname}. Redirigiendo a /login`);
      return NextResponse.redirect(new URL('/login', req.url));
    }

    // En cualquier otro caso, permitir la solicitud
    return NextResponse.next();
  },
  {
    callbacks: {
      // Solo evaluamos la autenticación a nivel de manejo de rutas
      authorized: () => true,
    },
  }
);

// Matcher para las rutas que queremos proteger
export const config = {
  matcher: [
    '/',
    '/timer',
    '/login',
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)',
  ],
}; 