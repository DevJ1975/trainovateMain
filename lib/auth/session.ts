import crypto from "node:crypto";
import { cookies } from "next/headers";
import { SESSION_COOKIE } from "./constants";
import { findUserById, User } from "./users";

export { SESSION_COOKIE };

const DEV_FALLBACK_SECRET = "dev-only-session-secret-change-in-prod";
const MAX_AGE_SEC = 60 * 60 * 24 * 7;

let cachedSecret: string | null = null;

function getSecret(): string {
  if (cachedSecret !== null) return cachedSecret;
  const env = process.env.SESSION_SECRET;
  if (env && env.length >= 32) {
    cachedSecret = env;
    return cachedSecret;
  }
  // `next build` collects page data with NODE_ENV=production; we don't want
  // to crash the build there, only actual request handling at runtime.
  const isBuildPhase =
    process.env.NEXT_PHASE === "phase-production-build" ||
    process.env.NEXT_PHASE === "phase-export";
  if (process.env.NODE_ENV === "production" && !isBuildPhase) {
    throw new Error(
      "SESSION_SECRET is required in production and must be at least 32 chars. " +
        "Generate one with `openssl rand -hex 32` and set it in your deploy env.",
    );
  }
  cachedSecret = env && env.length > 0 ? env : DEV_FALLBACK_SECRET;
  return cachedSecret;
}

function sign(payload: string): string {
  return crypto.createHmac("sha256", getSecret()).update(payload).digest("hex");
}

function encode(userId: string): string {
  const exp = Math.floor(Date.now() / 1000) + MAX_AGE_SEC;
  const payload = `${userId}.${exp}`;
  return `${payload}.${sign(payload)}`;
}

function decode(token: string): { userId: string; exp: number } | null {
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [userId, expStr, sig] = parts;
  if (sign(`${userId}.${expStr}`) !== sig) return null;
  const exp = parseInt(expStr, 10);
  if (!Number.isFinite(exp) || exp < Math.floor(Date.now() / 1000)) return null;
  return { userId, exp };
}

export function setSessionCookie(userId: string) {
  cookies().set(SESSION_COOKIE, encode(userId), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE_SEC,
    secure: process.env.NODE_ENV === "production",
  });
}

export function clearSessionCookie() {
  cookies().delete(SESSION_COOKIE);
}

/**
 * Resolve the current web user. Prefers the NextAuth (Auth.js) session
 * (canonical path post-cutover) and falls back to the legacy HMAC
 * cookie so mid-cutover deploys don't sign everyone out.
 *
 * Async because NextAuth's `auth()` is async. Server components and
 * server actions handle this fine; route handlers were already async.
 */
export async function getCurrentUser(): Promise<User | null> {
  // Lazy import to avoid pulling the auth.ts graph (Drizzle adapter +
  // Resend provider) into edge bundles or test runs that don't need it.
  try {
    const mod = await import("@/auth");
    const session = await mod.auth();
    if (session?.user?.id) {
      const u = findUserById(session.user.id);
      if (u) return u;
    }
  } catch {
    // NextAuth not available (rare — startup misconfig). Fall through.
  }

  const token = cookies().get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const decoded = decode(token);
  if (!decoded) return null;
  return findUserById(decoded.userId) ?? null;
}

/**
 * Resolve the current user from one of three sources in order:
 *   1. `Authorization: Bearer <hmac-token>` header (mobile / Expo)
 *   2. NextAuth session cookie (web after cutover)
 *   3. Legacy HMAC session cookie (web pre-cutover)
 *
 * The HMAC bearer token format is the string returned by `issueToken()`.
 */
export async function getUserFromRequest(req: Request): Promise<User | null> {
  const authHeader = req.headers.get("authorization");
  if (authHeader?.toLowerCase().startsWith("bearer ")) {
    const token = authHeader.slice(7).trim();
    const decoded = decode(token);
    if (decoded) {
      const u = findUserById(decoded.userId);
      if (u) return u;
    }
  }
  return getCurrentUser();
}

/**
 * Issue a bearer token for the given user. Same encoding as the cookie
 * session — clients can persist this and send it as Authorization: Bearer.
 */
export function issueToken(userId: string): { token: string; expiresAt: string } {
  const token = encode(userId);
  return {
    token,
    expiresAt: new Date((Math.floor(Date.now() / 1000) + MAX_AGE_SEC) * 1000).toISOString(),
  };
}
