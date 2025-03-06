import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "./api/auth/auth.config";

export default async function Home() {
  try {
    console.log("Verificando sesión en la página principal");
    const session = await getServerSession(authOptions);
    console.log("Resultado de sesión:", !!session, session?.user ? "Usuario presente" : "Usuario no presente");
    
    // Redirigir basado en el estado de autenticación
    if (!session?.user) {
      console.log("No hay sesión o usuario, redirigiendo a /login");
      return redirect('/login');
    } else {
      console.log("Sesión válida, redirigiendo a /timer");
      return redirect('/timer');
    }
  } catch (error) {
    console.error('Error al verificar la sesión:', error);
    return redirect('/login');
  }
} 