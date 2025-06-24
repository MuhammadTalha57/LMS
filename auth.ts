// import NextAuth from "next-auth";
// import { authConfig } from "./auth.config";
// import Credentials from "next-auth/providers/credentials";
// import { z } from "zod";
// import type { User } from "@/app/lib/definitions";
// import bcrypt from "bcrypt";
// import sql from "./app/db/index";

// async function getUser(id: string): Promise<User | undefined> {
//   console.log("Fetching user with ID:", id);
//   try {
//     const user = await sql`SELECT * FROM users WHERE id=${id}`;
//     if (!user[0]) return undefined;
//     const dbUser = user[0];
//     const mappedUser: User = {
//       id: dbUser.id,
//       role: dbUser.role,
//       password: dbUser.password,
//     };
//     return mappedUser;
//   } catch (error) {
//     console.error("Failed to fetch user:", error);
//     throw new Error("Failed to fetch user.");
//   }
// }

// export const { auth, signIn, signOut } = NextAuth({
//   ...authConfig,
//   session: {
//     strategy: "jwt",
//   },
//   providers: [
//     Credentials({
//       async authorize(credentials) {
//         const parsedCredentials = z
//           .object({ id: z.string().min(6), password: z.string().min(6) })
//           .safeParse(credentials);

//         if (parsedCredentials.success) {
//           const { id, password } = parsedCredentials.data;
//           const user = await getUser(id);
//           if (!user) {
//             return null;
//           }
//           const passwordsMatch = await bcrypt.compare(password, user.password);
//           if (passwordsMatch) {
//             return {
//               id: user.id,
//               role: user.role as "student" | "teacher" | "admin",
//             };
//           }
//         }

//         console.log("Invalid credentials provided.");
//         return null;
//       },
//     }),
//   ],
//   callbacks: {
//     async jwt({ token, user }) {
//       if (user) {
//         token.role = user.role;
//       }
//       return token;
//     },
//     async session({ session, token }) {
//       console.log("SESSION has", token.role);
//       if (
//         session?.user &&
//         typeof token?.role === "string" &&
//         ["student", "teacher", "admin"].includes(token.role)
//       ) {
//         session.user.role = token.role as "student" | "teacher" | "admin";
//       }
//       return session;
//     },
//   },
// });

import sql from "./app/db/index";
import type { User } from "@/app/lib/definitions";
import { compare } from "bcrypt";
import { map } from "zod/v4";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
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

        // Validating Password
        const isPasswordsMatch = await compare(
          credentials.password as string,
          mappedUser.password
        );

        if (!isPasswordsMatch) {
          return null;
        }

        return {
          id: mappedUser.id,
          role: mappedUser.role as "student" | "teacher" | "admin",
        } as User;
      },
    }),
  ],
  pages: {
    signIn: "/sign-in",
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
      return session;
    },
  },
});
