import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Dashboard from "@/components/ui/dashboard";
import {
  addTeacher,
  addUser,
  getTeacherDetails,
  getUserNameById,
  teacherSearchQuery,
} from "@/lib/actions/queries";
import { signout } from "@/lib/actions/auth";
import Search from "@/components/ui/search";
import SearchTable from "@/components/ui/searchTable";
import { addTeacherFormFields } from "@/lib/actions/definitions";

export default async function DashboardPage({
  params,
}: {
  params: { role: string };
}) {
  const session = await auth();

  const { role } = await params;

  if (!session) {
    redirect("/signin");
  } else if (session.user.role !== role || role !== "admin") {
    redirect("/unauthorized");
  }

  const userName = await getUserNameById(session.user.id);
  return (
    <Dashboard
      userRole={session.user.role}
      userName={userName}
      handleSignOut={signout}
      backBtnHidden={false}
      children={
        <div>
          <SearchTable
            categories={["Id", "Name", "Department", "Year", "Course"]}
            searchQuery={teacherSearchQuery}
            modifiable={true}
            addQuery={addTeacher}
            descQuery={getTeacherDetails}
            formFields={addTeacherFormFields}
          ></SearchTable>
        </div>
      }
    ></Dashboard>
  );
}
