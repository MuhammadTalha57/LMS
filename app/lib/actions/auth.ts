"use server";

import { AuthCredentials } from "../definitions";
import { signIn } from "@/auth";
import { signOut } from "@/auth";
import { redirect } from "next/navigation";

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

    return { success: true, error: "" };
  } catch (error) {
    console.log(error, "Sign in error");
    return { success: false, error: "Sign in error" };
  }
};

export const signout = async () => {
  await signOut();
  return redirect("/");
};
