"use server";

import { redirect } from "next/navigation";
import { setSessionCookie, clearSessionCookie } from "@/lib/auth/session";
import { assertDevAuthAllowed } from "@/lib/auth/dev-stub";
import { findUserByEmail } from "@/lib/auth/users";

export type LoginState = { error?: string };

export async function login(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  assertDevAuthAllowed();

  const email = (formData.get("email") as string | null)?.trim() ?? "";
  const password = (formData.get("password") as string | null) ?? "";
  const next = (formData.get("next") as string | null) || "/safety/near-misses";

  if (!email || !password) return { error: "Email and password required" };
  const user = findUserByEmail(email);
  if (!user) return { error: "Unknown email" };

  setSessionCookie(user.id);
  redirect(next.startsWith("/") ? next : "/safety/near-misses");
}

export async function logout() {
  clearSessionCookie();
  redirect("/login");
}
