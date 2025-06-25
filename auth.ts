import sql from "./app/db/index";
import type { User } from "@/app/lib/definitions";
import { compare } from "bcrypt";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        try {
          if (!credentials.id || !credentials.password) {
            return null;
          }

          // Fetching User
          console.log("Fetching user with ID:", credentials.id);
          let mappedUser: User | undefined;
          try {
            const user =
              await sql`SELECT * FROM users WHERE id=${credentials.id}`;
            if (!user[0]) return null;
            const dbUser = user[0];
            mappedUser = {
              id: dbUser.id,
              role: dbUser.role,
              password: dbUser.password,
            };
          } catch (error) {
            console.error("Failed to fetch user:", error);
            throw new Error("Failed to fetch user.");
          }

          if (!mappedUser) {
            return null;
          }

          console.log("Mapped User: ", mappedUser);

          // Validating Password
          const isPasswordsMatch = await compare(
            credentials.password as string,
            mappedUser.password
          );

          if (!isPasswordsMatch) {
            console.log("Passwords Mismatch");
            return null;
          }

          console.log("Password Match");

          return {
            id: mappedUser.id,
            role: mappedUser.role as "student" | "teacher" | "admin",
          } as User;
        } catch (error) {
          console.log("ERROR: ", error);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/signin",
  },
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },

    async session({ session, token }: any) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as "student" | "teacher" | "admin";
      }
      console.log("SESSION Returned", session);
      return session;
    },
  },
});
