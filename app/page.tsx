import { redirect } from "next/navigation";
import { SessionProvider } from "next-auth/react";

export default function Home() {
  redirect("/signin");
}
