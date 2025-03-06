import NextAuth, { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import { compare } from "bcryptjs";

const prisma = new PrismaClient();

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
    }),
    CredentialsProvider({
      name: "Credenciales",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Contraseña", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Por favor ingresa tu email y contraseña');
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        });

        if (!user) {
          throw new Error('Usuario no encontrado');
        }

        if (!user.password) {
          throw new Error('Esta cuenta fue creada con Google. Por favor, usa el botón de inicio de sesión con Google.');
        }

        const isPasswordValid = await compare(credentials.password, user.password);

        if (!isPasswordValid) {
          throw new Error('Contraseña incorrecta');
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
        };
      }
    }),
  ],
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        if (account?.provider === "google") {
          if (!user.email) {
            throw new Error('No se pudo obtener el email de Google');
          }
          
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email }
          });

          if (!existingUser) {
            console.log('Creando nuevo usuario con Google', user.email);
            const newUser = await prisma.user.create({
              data: {
                email: user.email,
                name: user.name || "",
                image: user.image || "",
              }
            });
            user.id = newUser.id;
          } else {
            console.log('Usuario existente con Google', existingUser.email);
            user.id = existingUser.id;
          }
        }
        return true;
      } catch (error) {
        console.error("Error en signIn:", error);
        return false;
      }
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Asegurarse de que las URLs sean absolutas
      const timerUrl = new URL('/timer', baseUrl).toString();
      
      // Si la URL es relativa al timer, usar la URL absoluta del timer
      if (url === '/timer') {
        return timerUrl;
      }

      // Si la URL comienza con el baseUrl, permitirla
      if (url.startsWith(baseUrl)) {
        return url;
      }

      // Si es una ruta relativa, convertirla a absoluta
      if (url.startsWith('/')) {
        return new URL(url, baseUrl).toString();
      }

      // Por defecto, redirigir al timer
      return timerUrl;
    }
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 días
  },
  debug: true,
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }; 