import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function studentPage() {
  const session = await auth();
  if (session?.user.role !== "student") {
    redirect("/unauthorized");
  }
  return (
    <div>
      <h1>Student Dashboard</h1>
      <p>
        Welcome to the student dashboard. Here you can manage your courses,
        assignments, and other settings.
      </p>
      {/* Add more student functionalities here */}
    </div>
  );
}
