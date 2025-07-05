import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Dashboard from "@/components/ui/dashboard";
import { getUserNameById } from "@/lib/actions/queries";
import { signout } from "@/lib/actions/auth";
import AdminDashboardChildren from "@/components/ui/adminDashboardChildren";
import TeacherDashboardChildren from "@/components/ui/teacherDashboardChildren";
import StudentDashboardChildren from "@/components/ui/studentDashboardChildren";

export default async function DashboardPage({
  params,
}: {
  params: { role: string };
}) {
  const session = await auth();

  const { role } = await params;

  if (!session) {
    redirect("/signin");
  } else if (session.user.role !== role) {
    redirect("/unauthorized");
  }

  const userName = await getUserNameById(session.user.id);
  return (
    <Dashboard
      userRole={session.user.role}
      userName={userName}
      handleSignOut={signout}
      backBtnHidden={true}
      children={
        <div className="flex flex-col gap-y-4 items-center">
          <h1 className="font-bold text-3xl">{`Welcome to ${
            role.charAt(0).toUpperCase() + role.slice(1)
          } Dashboard`}</h1>
          {role === "admin" ? (
            <AdminDashboardChildren></AdminDashboardChildren>
          ) : role === "teacher" ? (
            <TeacherDashboardChildren></TeacherDashboardChildren>
          ) : (
            <StudentDashboardChildren></StudentDashboardChildren>
          )}
        </div>
      }
    ></Dashboard>
  );
}
