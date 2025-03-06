import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '../auth/auth.config';

// Iniciar una nueva sesión de pomodoro
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const data = await req.json();
    const { startTime, endTime, type } = data;

    const pomodoro = await prisma.pomodoro.create({
      data: {
        userId: session.user.id,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        type,
      },
    });

    return NextResponse.json(pomodoro);
  } catch (error) {
    console.error('Error al crear pomodoro:', error);
    return NextResponse.json(
      { error: 'Error al crear el pomodoro' },
      { status: 500 }
    );
  }
}

// Obtener todas las sesiones de pomodoro del usuario
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const pomodoros = await prisma.pomodoro.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        startTime: 'desc',
      },
    });

    return NextResponse.json(pomodoros);
  } catch (error) {
    console.error('Error al obtener pomodoros:', error);
    return NextResponse.json(
      { error: 'Error al obtener los pomodoros' },
      { status: 500 }
    );
  }
}

// Actualizar una sesión de pomodoro
export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const { id, endTime } = await req.json();
    
    const updatedPomodoro = await prisma.pomodoro.update({
      where: {
        id,
        userId: session.user.id, // Asegurarse de que el pomodoro pertenece al usuario
      },
      data: {
        endTime: new Date(endTime),
      },
    });

    return NextResponse.json(updatedPomodoro);
  } catch (error) {
    console.error('Error al actualizar el pomodoro:', error);
    return NextResponse.json(
      { error: 'Error al actualizar el pomodoro' },
      { status: 500 }
    );
  }
} 