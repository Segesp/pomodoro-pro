import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from 'next/server';

export default withAuth(
  function middleware(req) {
    const isAuth = !!req.nextauth.token;
    const isAuthPage = req.nextUrl.pathname.startsWith('/login');

    if (isAuthPage) {
      if (isAuth) {
        return NextResponse.redirect(new URL('/timer', req.url));
      }
      return null;
    }

    if (!isAuth) {
      let from = req.nextUrl.pathname;
      if (from) {
        return NextResponse.redirect(
          new URL(`/login?callbackUrl=${encodeURIComponent(from)}`, req.url)
        );
      }
      return NextResponse.redirect(new URL('/login', req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ["/timer", "/login"],
}; 