import { NextRequest } from "next/server";
import { issueToken } from "@/lib/auth/session";
import { assertDevAuthAllowed } from "@/lib/auth/dev-stub";
import { findUserByEmail } from "@/lib/auth/users";
import { badRequest, json, unauthorized } from "@/lib/api/responses";

export const dynamic = "force-dynamic";

interface Body {
  email?: string;
  password?: string;
}

/**
 * Mobile login. Returns a bearer token that the client persists and sends
 * as `Authorization: Bearer <token>` on subsequent calls.
 *
 * Dev stub: any non-empty password is accepted for known emails. Real
 * production must validate against an IdP / hashed password.
 */
export async function POST(req: NextRequest) {
  assertDevAuthAllowed();

  let body: Body;
  try {
    body = await req.json();
  } catch {
    return badRequest("Invalid JSON body");
  }

  const email = (body.email ?? "").trim();
  const password = body.password ?? "";
  if (!email || !password) return badRequest("Email and password required");

  const user = findUserByEmail(email);
  if (!user) return unauthorized();

  const { token, expiresAt } = issueToken(user.id);
  return json({
    token,
    expiresAt,
    user: { id: user.id, email: user.email, name: user.name, role: user.role },
  });
}
