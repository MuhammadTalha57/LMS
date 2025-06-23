import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import type { User } from "@/app/lib/definitions";
import bcrypt from "bcrypt";
import sql from "./app/db/index";

async function getUser(id: number): Promise<User | undefined> {
  try {
    const user = await sql`SELECT * FROM users WHERE id=${id}`;
    if (!user[0]) return undefined;
    const dbUser = user[0];
    const mappedUser: User = {
      id: dbUser.id,
      type: dbUser.type,
      password: dbUser.password,
    };
    return mappedUser;
  } catch (error) {
    console.error("Failed to fetch user:", error);
    throw new Error("Failed to fetch user.");
  }
}

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ id: z.number().min(6), password: z.string().min(6) })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { id, password } = parsedCredentials.data;
          const user = await getUser(id);
          if (!user) {
            return null;
          }
          const passwordsMatch = await bcrypt.compare(password, user.password);
          if (passwordsMatch) {
            return user;
          }
        }

        console.log("Invalid credentials provided.");
        return null;
      },
    }),
  ],
});
