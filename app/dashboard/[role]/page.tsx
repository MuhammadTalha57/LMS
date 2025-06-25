import { auth } from "@/auth";
import { redirect, notFound } from "next/navigation";
import { signout } from "@/app/lib/actions/auth";

export default async function DepartmentPage({
  params,
}: {
  params: { role: string };
}) {
  const role = params.role;
  const session = await auth();

  //console.log(await params.role);
  if (!session) redirect("/signin");

  if (role !== session.user.role) {
    redirect("/unauthorized");
  }

  return (
    <div>
      <h1>{role} Dashboard</h1>
      <form
        action={async () => {
          "use server";
          await signout();
        }}
      >
        <button className="flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3">
          <div className="hidden md:block">Sign Out</div>
        </button>
      </form>
    </div>
  );
}
