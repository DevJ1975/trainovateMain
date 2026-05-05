import crypto from "node:crypto";
import { cookies } from "next/headers";
import { SESSION_COOKIE } from "./constants";
import { findUserById, User } from "./users";

export { SESSION_COOKIE };

const SECRET =
  process.env.SESSION_SECRET ?? "dev-only-session-secret-change-in-prod";
const MAX_AGE_SEC = 60 * 60 * 24 * 7;

function sign(payload: string): string {
  return crypto.createHmac("sha256", SECRET).update(payload).digest("hex");
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

export function getCurrentUser(): User | null {
  const token = cookies().get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const decoded = decode(token);
  if (!decoded) return null;
  return findUserById(decoded.userId) ?? null;
}

/**
 * Resolve the current user from either the session cookie (web) or an
 * Authorization: Bearer <token> header (mobile / Expo). The token format
 * is the same HMAC string returned by `issueToken()`.
 */
export function getUserFromRequest(req: Request): User | null {
  const auth = req.headers.get("authorization");
  if (auth?.toLowerCase().startsWith("bearer ")) {
    const token = auth.slice(7).trim();
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
