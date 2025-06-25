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
    //console.log(error, "Sign in error");
    return { success: false, error: "Incorrect Credentials" };
  }
};

export const signout = async () => {
  await signOut();
  return redirect("/");
};

export const handleSubmit = async (data: FormData) => {
  const id = data.get("id");
  const password = data.get("password");
  if (typeof id === "string" && typeof password === "string") {
    const { success, error } = await signInWithCredentials({ id, password });

    if (success) {
      redirect("/dashboard");
    } else {
      redirect("/signin?error=" + encodeURIComponent(error || "Login failed"));
    }
  } else {
    redirect("/signin?error=ID%20and%20Password%20are%20required");
  }
};
