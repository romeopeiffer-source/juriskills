import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { isRateLimited, recordAttempt } from "@/lib/rate-limit";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days for client sessions
  },
  pages: {
    signIn: "/compte/connexion",
  },
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Client",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mot de passe", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const identifier = `client-login:${credentials.email.toLowerCase()}`;
        if (await isRateLimited(identifier)) {
          throw new Error("Trop de tentatives. Réessayez dans quelques minutes.");
        }
        await recordAttempt(identifier);

        const user = await prisma.user.findUnique({
          where: { email: credentials.email.toLowerCase() },
        });
        if (!user || user.role !== "CLIENT") return null;

        const valid = await bcrypt.compare(credentials.password, user.passwordHash);
        if (!valid) return null;

        return { id: user.id, email: user.email, name: user.name, role: user.role, emailVerified: user.emailVerified };
      },
    }),
    CredentialsProvider({
      id: "admin-credentials",
      name: "Admin",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mot de passe", type: "password" },
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) return null;

        const identifier = `admin-login:${credentials.email.toLowerCase()}`;
        if (await isRateLimited(identifier)) {
          throw new Error("Trop de tentatives. Réessayez dans quelques minutes.");
        }
        await recordAttempt(identifier);

        const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase();
        const adminHash = process.env.ADMIN_PASSWORD_HASH;
        if (!adminEmail || !adminHash) return null;
        if (credentials.email.toLowerCase() !== adminEmail) return null;

        const valid = await bcrypt.compare(credentials.password, adminHash);
        if (!valid) return null;

        return { id: "admin", email: adminEmail, name: "Administrateur", role: "ADMIN" as const };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger }) {
      if (user) {
        token.role = (user as { role: "CLIENT" | "ADMIN" }).role;
        token.id = user.id;
        token.emailVerified = (user as { emailVerified?: boolean }).emailVerified ?? true;
      }
      if (trigger === "update" && token.id) {
        const fresh = await prisma.user.findUnique({
          where: { id: token.id as string },
          select: { emailVerified: true },
        });
        if (fresh) token.emailVerified = fresh.emailVerified;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as "CLIENT" | "ADMIN";
        session.user.id = token.id as string;
        session.user.emailVerified = token.emailVerified as boolean;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
