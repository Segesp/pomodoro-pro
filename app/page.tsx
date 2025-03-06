import PomodoroTimer from "./components/PomodoroTimer";
import { getServerSession } from "next-auth";
import LoginButton from "./components/LoginButton";
import { redirect } from "next/navigation";
import { authOptions } from "./api/auth/[...nextauth]/route";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (!session) {
    console.log("No hay sesión, redirigiendo a /login");
    redirect('/login');
  }

  console.log("Sesión encontrada, redirigiendo a /timer");
  redirect('/timer');
} 