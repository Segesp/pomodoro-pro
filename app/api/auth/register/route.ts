import { NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    // Validar campos requeridos
    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email y contraseña son requeridos' },
        { status: 400 }
      );
    }

    // Verificar si el usuario ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: 'El usuario ya existe' },
        { status: 400 }
      );
    }

    // Encriptar contraseña
    const hashedPassword = await hash(password, 12);

    // Crear usuario
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    return NextResponse.json(
      { message: 'Usuario creado exitosamente' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error en el registro:', error);
    return NextResponse.json(
      { message: 'Error al crear el usuario' },
      { status: 500 }
    );
  }
} 