// // types/next-auth.d.ts
// import NextAuth from "next-auth";

// declare module "next-auth" {
//   interface User {
//     id: string;
//     role: "admin" | "teacher" | "student"; // Add your custom roles here
//   }

//   interface Session {
//     user: {
//       id: string;
//       role: "admin" | "teacher" | "student";
//     };
//   }
// }

// declare module "next-auth/jwt" {
//   interface JWT {
//     id: string;
//     role: "admin" | "teacher" | "student";
//   }
// }
