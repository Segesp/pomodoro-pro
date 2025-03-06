import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/auth.config';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    return NextResponse.json({
      authenticated: !!session,
      session: session ? {
        user: {
          id: session.user?.id,
          name: session.user?.name,
          email: session.user?.email,
        },
        expires: session.expires,
      } : null,
      nextAuthUrl: process.env.NEXTAUTH_URL,
      baseUrl: process.env.NEXT_PUBLIC_NEXTAUTH_URL,
      env: process.env.NODE_ENV,
    });
  } catch (error) {
    console.error('Error al verificar la sesión:', error);
    return NextResponse.json(
      { 
        authenticated: false, 
        error: 'Error al verificar la sesión',
        errorDetails: String(error)
      },
      { status: 500 }
    );
  }
} 