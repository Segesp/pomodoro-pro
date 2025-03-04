import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from 'next/server';

export default withAuth(
  function middleware(req) {
    const isAuth = !!req.nextauth.token;
    const isAuthPage = req.nextUrl.pathname === '/login';
    const isPublicPage = req.nextUrl.pathname === '/';

    if (isAuthPage && isAuth) {
      return NextResponse.redirect(new URL('/timer', req.url));
    }

    if (!isAuth && !isAuthPage && !isPublicPage) {
      return NextResponse.redirect(
        new URL(`/login?callbackUrl=${encodeURIComponent(req.nextUrl.pathname)}`, req.url)
      );
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
  matcher: ["/timer", "/login", "/"],
}; 