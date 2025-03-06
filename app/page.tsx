import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "./api/auth/auth.config";

export default async function Home() {
  try {
    const session = await getServerSession(authOptions);
    
    // Redirigir basado en el estado de autenticación
    if (!session?.user) {
      redirect('/login');
    } else {
      redirect('/timer');
    }
  } catch (error) {
    console.error('Error al verificar la sesión:', error);
    redirect('/login');
  }
} 