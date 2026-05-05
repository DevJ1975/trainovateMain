import { NextRequest } from "next/server";
import { error } from "./responses";

/**
 * In-process token-bucket rate limiter. Per-key state lives in a Map; old
 * keys are garbage-collected lazily as they're touched.
 *
 * **Single-instance only.** When you scale to multiple Node instances or
 * Vercel functions, swap this for an Upstash / Redis backend (the
 * `consume()` interface is the same — replace the body with an INCR + EX
 * pipeline). Until then, each instance enforces its own limits, which
 * means the effective ceiling under load is N × `limit`.
 */

interface Bucket {
  tokens: number;
  resetAt: number;
}

const buckets = new Map<string, Bucket>();
const MAX_BUCKETS = 10_000; // soft cap; oldest expire when limits land

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number; // ms epoch
  retryAfterSec: number;
}

export function consume(
  key: string,
  limit: number,
  windowMs: number,
  now: number = Date.now(),
): RateLimitResult {
  // Lazy GC — drop the oldest expired bucket if we're over the soft cap.
  if (buckets.size > MAX_BUCKETS) {
    for (const [k, b] of buckets) {
      if (b.resetAt <= now) buckets.delete(k);
      if (buckets.size <= MAX_BUCKETS * 0.9) break;
    }
  }

  let bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    bucket = { tokens: limit, resetAt: now + windowMs };
    buckets.set(key, bucket);
  }

  if (bucket.tokens <= 0) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: bucket.resetAt,
      retryAfterSec: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)),
    };
  }

  bucket.tokens -= 1;
  return {
    allowed: true,
    remaining: bucket.tokens,
    resetAt: bucket.resetAt,
    retryAfterSec: 0,
  };
}

export function clientIp(req: NextRequest): string {
  // Prefer the forwarded chain so a reverse proxy (Vercel, Cloudflare,
  // nginx) gives us the real client address. Fall back to a stable
  // sentinel so local dev still rate-limits per process.
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  const real = req.headers.get("x-real-ip");
  if (real) return real.trim();
  return req.ip ?? "unknown";
}

/**
 * Convenience wrapper that returns a 429 response when the limit is hit.
 * Caller short-circuits if the result is non-null.
 */
export function enforce(
  req: NextRequest,
  scope: string,
  limit: number,
  windowMs: number,
) {
  const key = `${scope}:${clientIp(req)}`;
  const r = consume(key, limit, windowMs);
  if (r.allowed) return null;
  const res = error(429, "Too many requests", { retryAfterSec: r.retryAfterSec });
  res.headers.set("retry-after", String(r.retryAfterSec));
  return res;
}

// Reset for tests.
export function _reset() {
  buckets.clear();
}
