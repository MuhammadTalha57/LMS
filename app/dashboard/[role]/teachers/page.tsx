"use server";

import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Dashboard from "@/components/ui/dashboard";
import {
  editTeacher,
  getTeacherDetails,
  getUserNameById,
  teacherSearchQuery,
} from "@/lib/actions/queries";
import { signout } from "@/lib/actions/auth";
import SearchTable from "@/components/ui/searchTable";
import AddTeacherForm from "@/components/ui/addTeacherForm";
import { DataColumn, editTeacherFormFields } from "@/lib/actions/definitions";

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

  const modifiable: boolean = role === "admin";

  const tableCols: DataColumn[] = [
    { accessor: "id", header: "ID", className: "w-[100px]" },
    { accessor: "name", header: "Name", className: "" },
  ];

  const userName = await getUserNameById(session.user.id);
  return (
    <Dashboard
      userRole={session.user.role}
      userName={userName}
      handleSignOut={signout}
      backBtnHidden={false}
      children={
        <div>
          {/* Add Teacher Button */}
          {modifiable && <AddTeacherForm></AddTeacherForm>}

          <SearchTable
            categories={["Id", "Name", "Department", "Year", "Course"]}
            searchQuery={teacherSearchQuery}
            modifiable={modifiable}
            descQuery={getTeacherDetails}
            tableCaption="Click on the row to view teacher details"
            descDialogTitle="Teacher Details"
            descDialogDescription=""
            tableCols={tableCols}
            editFormTitle="Edit Teacher Details"
            editFormDescription=""
            editFormSubmitBtnText="Edit"
            editFormFields={editTeacherFormFields}
            onEdit={editTeacher}
          ></SearchTable>
        </div>
      }
    ></Dashboard>
  );
}
