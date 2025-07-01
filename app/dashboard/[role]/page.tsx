import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Dashboard from "@/components/ui/dashboard";
import { getUserNameById } from "@/lib/actions/queries";
import { signout } from "@/lib/actions/auth";

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect("/signin");
  }

  const userName = await getUserNameById(session.user.id);
  return (
    <Dashboard
      userRole={session.user.role}
      userName={userName}
      handleSignOut={signout}
      children={<div></div>}
    ></Dashboard>
  );
}
