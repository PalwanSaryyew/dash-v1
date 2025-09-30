// app/api/auth/[...nextauth]/route.ts

import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
// Prisma client'ınızı projenizin yapısına göre import edin.
// Muhtemelen bir lib veya utils klasöründe tek bir yerden export ediyorsunuzdur.
// Örnek: import prisma from "@/lib/prisma";
import { prisma } from "../../../../../prisma/prismaConfig";


// 'export' anahtar kelimesi buradan kaldırıldı. Bu, build hatasını çözer.
const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        nick: { label: "Nickname", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.nick || !credentials?.password) {
          throw new Error("Ýalňyş giriş maglumatlary.");
        }

        const admin = await prisma.admin.findUnique({
          where: { nick: credentials.nick },
        });

        if (!admin || !admin.hashedPassword) {
          throw new Error("Ulanyjy tapylmady.");
        }

        const isPasswordCorrect = await bcrypt.compare(
          credentials.password,
          admin.hashedPassword
        );

        if (!isPasswordCorrect) {
          throw new Error("Ýalňyş parol");
        }

        // Başarılı girişte kullanıcı objesini döndür (şifreyi dahil etme!)
        // Admin modelinizde tgId olduğundan emin olun, yoksa id: admin.id kullanın.
        return {
            id: admin.tgId, // Veya admin.tgId, modelinize göre
            nick: admin.nick,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt", // JWT session stratejisini kullanıyoruz
  },
  callbacks: {
    // JWT'ye ek bilgi eklemek için
    jwt: async ({ token, user }) => {
      if (user) {
        token.id = user.id;
        token.nick = (user as unknown as {nick: string}).nick;
      }
      return token;
    },
    // Client tarafındaki session objesine JWT'den bilgi aktarmak için
    session: async ({ session, token }) => {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.name = token.nick as string; // `session.user.name` alanına nick'i atıyoruz
      }
      return session;
    },
  },
  pages: {
    signIn: "/login", // Giriş sayfamızın yolu
  },
  secret: process.env.AUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
