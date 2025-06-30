// app/layout.tsx
import "./globals.css";
//import { auth } from "@/auth"; // 👈 make sure this points to your NextAuth setup
import { SessionProvider } from "next-auth/react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <SessionProvider>
        <body>{children}</body>
      </SessionProvider>
    </html>
  );
}
