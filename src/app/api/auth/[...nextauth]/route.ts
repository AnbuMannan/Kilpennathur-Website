import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { CredentialsSignin } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import * as bcrypt from "bcryptjs";
import type { NextAuthConfig } from "next-auth";

export const authOptions: NextAuthConfig = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new CredentialsSignin("Invalid credentials");
        }
        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });
        if (!user) {
          throw new CredentialsSignin("Invalid credentials");
        }
        const isValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        );
        if (!isValid) {
          throw new CredentialsSignin("Invalid credentials");
        }
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
      }
      return session;
    },
  },
};

const { handlers, auth } = NextAuth(authOptions);

export const GET = handlers.GET;
export const POST = handlers.POST;
export { auth };
