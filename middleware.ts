import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE } from "@/lib/auth/constants";

// NextAuth (Auth.js v5) names its session cookie one of these depending
// on whether the deploy is HTTPS. Both are valid signed-in markers.
const NEXTAUTH_COOKIES = [
  "authjs.session-token",
  "__Secure-authjs.session-token",
];

/**
 * Cheap presence check at the edge. Signature validation happens in the
 * safety layout (Node runtime) — middleware just bounces unauthenticated
 * traffic before it touches the app. Accepts either the NextAuth session
 * cookie (canonical web path) or the legacy HMAC session cookie
 * (backward compat during cutover).
 */
export function middleware(req: NextRequest) {
  const hasNextAuth = NEXTAUTH_COOKIES.some((c) => req.cookies.get(c));
  const hasLegacy = !!req.cookies.get(SESSION_COOKIE);
  if (hasNextAuth || hasLegacy) return NextResponse.next();

  const url = req.nextUrl.clone();
  url.pathname = "/login";
  url.searchParams.set("next", req.nextUrl.pathname);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/safety/:path*"],
};
