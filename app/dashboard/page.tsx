import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function DashboardRedirect() {
  const session = await auth();
  if (!session || !session.user || !session.user.role) {
    redirect("/");
  }

  if (session?.user.role === "admin") redirect("/dashboard/admin");
  if (session?.user.role === "teacher") redirect("/dashboard/teacher");
  if (session?.user.role === "student") redirect("/dashboard/student");
}
