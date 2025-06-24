import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function adminPage() {
  const session = await auth();
  if (session?.user.role !== "admin") {
    redirect("/unauthorized");
  }

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <p>
        Welcome to the admin dashboard. Here you can manage users, courses, and
        other settings.
      </p>
      {/* Add more admin functionalities here */}
    </div>
  );
}
