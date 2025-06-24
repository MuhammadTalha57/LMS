//export { auth as middleware } from "@/auth";

// middleware.ts
import { auth } from "@/auth";

export const middleware = auth;

export const config = {
  matcher: ["/admin/:path*", "/teacher/:path*", "/student/:path*"],
  runtime: "nodejs", // 👈 Force middleware to run in Node.js instead of Edge
};
