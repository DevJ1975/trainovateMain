"use server";

import { redirect } from "next/navigation";
import { AuthError } from "next-auth";
import { signIn, signOut } from "@/auth";
import { assertDevAuthAllowed } from "@/lib/auth/dev-stub";

export type LoginState = { error?: string };

/**
 * Web login. Two paths, picked by which form fields are present:
 *
 *   1. Email magic-link — `email` only. Posts to NextAuth's `resend`
 *      provider, redirects to /verify-request. Active when
 *      RESEND_API_KEY + AUTH_RESEND_FROM are set.
 *   2. Dev credentials — `email` + `password`. Posts to the
 *      `dev-credentials` provider. Gated by NM_ALLOW_DEV_AUTH.
 */
export async function login(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const email = ((formData.get("email") as string) ?? "").trim();
  const password = ((formData.get("password") as string) ?? "");
  const next = ((formData.get("next") as string) || "/safety/near-misses");

  if (!email) return { error: "Email required" };

  // If the password field is filled, treat as a dev-credentials sign-in.
  if (password) {
    assertDevAuthAllowed();
    try {
      await signIn("dev-credentials", {
        email,
        password,
        redirectTo: next,
      });
      return {};
    } catch (err) {
      if (err instanceof AuthError) {
        return { error: err.type === "CredentialsSignin" ? "Unknown email" : err.message };
      }
      // signIn throws a NEXT_REDIRECT internally on success — let it bubble.
      throw err;
    }
  }

  // Magic-link path. Will fail loudly if Resend isn't configured.
  try {
    await signIn("resend", { email, redirectTo: next });
    return {};
  } catch (err) {
    if (err instanceof AuthError) {
      return {
        error:
          "Email sign-in isn't configured. Set RESEND_API_KEY + AUTH_RESEND_FROM, " +
          "or include a password to use the dev-credentials path.",
      };
    }
    throw err;
  }
}

export async function logout() {
  await signOut({ redirectTo: "/login" });
  redirect("/login");
}
