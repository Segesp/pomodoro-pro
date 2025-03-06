import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Iniciar una nueva sesión de pomodoro
export async function POST(req: Request) {
  try {
    const session = await getServerSession();
    
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { type } = await req.json();
    
    const pomodoroSession = await prisma.pomodoroSession.create({
      data: {
        userId: session.user.id,
        type,
        startTime: new Date(),
      },
    });

    return NextResponse.json(pomodoroSession);
  } catch (error) {
    console.error('Error al crear la sesión de pomodoro:', error);
    return NextResponse.json(
      { error: 'Error al crear la sesión' },
      { status: 500 }
    );
  }
}

// Obtener el historial de sesiones
export async function GET(req: Request) {
  try {
    const session = await getServerSession();
    
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const sessions = await prisma.pomodoroSession.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        startTime: 'desc',
      },
    });

    return NextResponse.json(sessions);
  } catch (error) {
    console.error('Error al obtener el historial:', error);
    return NextResponse.json(
      { error: 'Error al obtener el historial' },
      { status: 500 }
    );
  }
}

// Actualizar una sesión (marcar como completada)
export async function PUT(req: Request) {
  try {
    const session = await getServerSession();
    
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { id } = await req.json();
    
    const updatedSession = await prisma.pomodoroSession.update({
      where: {
        id,
      },
      data: {
        completed: true,
        endTime: new Date(),
      },
    });

    return NextResponse.json(updatedSession);
  } catch (error) {
    console.error('Error al actualizar la sesión:', error);
    return NextResponse.json(
      { error: 'Error al actualizar la sesión' },
      { status: 500 }
    );
  }
} 