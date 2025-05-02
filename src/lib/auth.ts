import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import prisma from "@/lib/prisma";
import type { Account, Profile } from "next-auth";
import type { JWT } from "next-auth/jwt";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async jwt({
      token,
      account,
      profile,
    }: {
      token: JWT;
      account?: Account | null;
      profile?: Profile | null;
    }) {
      if (account && profile?.email) {
        let user = await prisma.user.findFirst({
          where: { email: profile.email },
        });

        if (!user) {
          user = await prisma.user.create({
            data: {
              email: profile.email,
              username:
                profile.name?.replace(/\s+/g, "").toLowerCase() ||
                profile.email.split("@")[0],
              firstName:
                profile.given_name || profile.name?.split(" ")[0] || "OAuth",
              lastName:
                profile.family_name || profile.name?.split(" ")[1] || "",
            },
          });
        }

        token.userId = user.id.toString();
        token.email = user.email;
      }

      return token;
    },

    async session({ session, token }) {
      if (token?.userId) {
        session.user.id = token.userId;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
