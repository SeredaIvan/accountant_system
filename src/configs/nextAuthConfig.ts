import { NextAuthOptions, RequestInternal } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/prismaClient";
import bcrypt from "bcryptjs";
import { use } from "react";


const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",  
  },
  providers: [
    Credentials({
      name: "Телефон і пароль",
      credentials: {
        phone: {
          label: "Телефон",
          type: "text",
          placeholder: "Введіть свій телефон",
        },
        password: {
          label: "Пароль",
          type: "password",
          placeholder: "Введіть свій пароль",
        },
      },
      async authorize(credentials, req) {
  console.log("Authorize called with:", credentials);
  if (!credentials) return null;

  const { phone, password } = credentials;

  const user = await prisma.user.findUnique({ where: { phone } });

  if (!user || !user.password) {
    console.log("User not found or password missing");
    return null;
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    console.log("Password invalid");
    return null;
  }

  console.log("Authorize success:", user);

  return {
    id: user.id,
    name: user.name,
    phone: user.phone,
    email: null,
    role: user.role
  };
},
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.phone = user.phone;
        token.name = user.name;
        token.role=user.role;
      }
      console.log("JWT callback token:", token);
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.phone = token.phone as string;
        session.user.name = token.name as string;
        session.user.role = token.role as string
      }
      console.log("Session callback session:", session);
      return session;
    },
  },
  pages: {
    signIn: "/login", 
  },
};


export default authOptions;
