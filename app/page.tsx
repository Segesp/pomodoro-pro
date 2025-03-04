import PomodoroTimer from "./components/PomodoroTimer";
import { getServerSession } from "next-auth";
import LoginButton from "./components/LoginButton";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getServerSession();

  if (session) {
    redirect('/timer');
  } else {
    redirect('/login');
  }
} 