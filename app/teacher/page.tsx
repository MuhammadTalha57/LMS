import { signOut } from "@/auth";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function teacherPage() {
  const session = await auth();
  if (session?.user.role !== "teacher") {
    redirect("/unauthorized");
  }
  return (
    <div>
      <h1>Teacher Dashboard</h1>
      <p>
        Welcome to the teacher dashboard. Here you can manage your classes,
        assignments, and other settings.
      </p>
      {/* Add more teacher functionalities here */}
      <form
        action={async () => {
          "use server";
          await signOut({ redirectTo: "/" });
        }}
      >
        <button className="flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3">
          <div className="hidden md:block">Sign Out</div>
        </button>
      </form>
    </div>
  );
}
