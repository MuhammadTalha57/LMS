import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Dashboard from "@/components/ui/dashboard";
import { getUserNameById } from "@/lib/actions/queries";
import { signout } from "@/lib/actions/auth";
import CardHolder from "@/components/ui/cardsHolder";
import AdminDashboardChildren from "@/components/ui/adminDashboardChildren";
import TeacherDashboardChildren from "@/components/ui/teacherDashboardChildren";
import StudentDashboardChildren from "@/components/ui/studentDashboardChildren";

type ButtonProps = {
  text: string;
  handleClick: () => void;
};

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
      children={
        role === "admin" ? (
          <AdminDashboardChildren></AdminDashboardChildren>
        ) : role === "teacher" ? (
          <TeacherDashboardChildren></TeacherDashboardChildren>
        ) : (
          <StudentDashboardChildren></StudentDashboardChildren>
        )
      }
    ></Dashboard>
  );
}
