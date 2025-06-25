import { redirect } from "next/navigation";
import { bebasNeue } from "../../../app/ui/fonts";
import LoginInput from "../../../app/ui/loginInput";
import { handleSubmit } from "../../lib/actions/auth";
import { auth } from "@/auth";

export default async function Home({
  searchParams,
}: {
  searchParams?: { error?: string };
}) {
  const session = await auth();
  if (session) {
    redirect("/dashboard");
  }
  const errorMessage = searchParams?.error || "";
  return (
    <div className="flex min-w-screen h-screen bg-gradient-to-r from-emerald-400 to-cyan-400 flex-col items-center">
      <div
        className={`min-w-screen ${bebasNeue.className} text-8xl text-center  text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-700 p-5`}
      >
        Welcome to LMS
      </div>
      <form
        action={handleSubmit}
        className="flex flex-col min-w-40 w-1/4 h-1/2 items-center justify-center bg-indigo-200 mt-10 rounded-2xl shadow-2xl shadow-blue-500 transition duration-300 hover:scale-105 "
      >
        <div className={`text-2xl ${bebasNeue.className}`}>Login</div>
        <LoginInput labelText="ID" type="text" name="id" />
        <LoginInput labelText="Password" type="password" name="password" />
        <button
          className="rounded-md bg-green-600 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-green-700 focus:shadow-none active:bg-green-700 hover:bg-green-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ml-2"
          type="submit"
        >
          Login
        </button>
        <div
          className="flex h-8 items-end space-x-1"
          aria-live="polite"
          aria-atomic="true"
        >
          {errorMessage && (
            <>
              <p className="text-sm text-red-500">{errorMessage}</p>
            </>
          )}
        </div>
      </form>
    </div>
  );
}
