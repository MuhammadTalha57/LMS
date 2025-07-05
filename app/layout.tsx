// app/layout.tsx
import "./globals.css";
//import { auth } from "@/auth"; // 👈 make sure this points to your NextAuth setup
import { SessionProvider } from "next-auth/react";
import { Toaster } from "@/components/ui/sonner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <SessionProvider>
        <body>
          <main>{children}</main>
          <Toaster richColors />
        </body>
      </SessionProvider>
    </html>
  );
}
