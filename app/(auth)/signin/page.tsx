import { redirect } from "next/navigation";
import { bebasNeue } from "../../../components/ui/fonts";
import LoginInput from "../../../components/ui/loginInput";
import { handleSubmit } from "../../../lib/actions/auth";
import { auth } from "@/auth";

export default async function SignInPage({
  searchParams,
}: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const session = await auth();

  const errorMessage = (await searchParams)?.error;
  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-w-screen h-screen bg-gradient-to-r from-emerald-400 to-cyan-400 flex-col items-center">
      <div
        className={`min-w-screen ${bebasNeue.className} text-8xl text-center text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-700 p-5`}
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
          className="rounded-md bg-green-600 py-2 px-4 text-sm text-white shadow-md hover:shadow-lg focus:bg-green-700"
          type="submit"
        >
          Login
        </button>

        {errorMessage && (
          <p className="text-sm text-red-500 mt-2">{errorMessage}</p>
        )}
      </form>
    </div>
  );
}
