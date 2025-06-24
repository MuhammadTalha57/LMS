// app/layout.tsx
import "./globals.css";
import { auth } from "@/auth"; // 👈 make sure this points to your NextAuth setup

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth(); // 👈 this makes session work in middleware

  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
