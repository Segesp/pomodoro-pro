import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./providers/AuthProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Pomodoro Pro",
  description: "Una aplicación profesional de Pomodoro para mejorar tu productividad",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <div className="tomato-pattern">
          {[...Array(12)].map((_, i) => (
            <div key={i} className={`tomato tomato-${i + 1}`}>🍅</div>
          ))}
        </div>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
} 