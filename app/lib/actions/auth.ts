"use server";

import { AuthCredentials } from "../definitions";
import { signIn } from "@/auth";
import { signOut } from "@/auth";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { error } from "console";
import { success } from "zod/v4";

export const signInWithCredentials = async (
  params: Pick<AuthCredentials, "id" | "password">
) => {
  const { id, password } = params;

  try {
    const result = await signIn("credentials", {
      id,
      password,
      redirect: false,
    });
    if (result?.error) {
      return { success: false, error: result.error };
    }

    //return { success: true, error: "None" };
  } catch (error) {
    console.log(error, "Sign in error");
    return { success: false, error: "Sign in error" };
  }

  const session = await auth();
  const role = session?.user?.role;
  switch (role) {
    case "admin":
      redirect("/admin");
    case "teacher":
      redirect("/teacher");
    case "student":
      redirect("/student");
    default:
      redirect("/unauthorized");
  }
};

export const signout = async () => {
  await signOut();
  return redirect("/");
};
