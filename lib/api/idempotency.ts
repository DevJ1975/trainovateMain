import crypto from "node:crypto";
import { and, eq, lt } from "drizzle-orm";
import { ensureMigrated, getDb } from "@/lib/near-miss/db/client";
import { idempotencyKeys } from "@/lib/near-miss/db/schema";
import { features } from "@/lib/features";

const TTL_MS = 48 * 60 * 60 * 1000;
const KEY_MAX_LEN = 200;
// Allow Stripe-shaped keys (alphanumeric, underscore, dash, colon, dot).
const KEY_PATTERN = /^[A-Za-z0-9_\-:.]{1,200}$/;

export type DedupeOutcome<T> =
  | { kind: "fresh"; status: number; body: T }
  | { kind: "replay"; status: number; body: T }
  | { kind: "conflict" };

export interface DedupeResult<T> {
  status: number;
  body: T;
  replayed: boolean;
}

function hashBody(raw: string): string {
  return crypto.createHash("sha256").update(raw).digest("hex");
}

function nowIso() {
  return new Date().toISOString();
}

function janitorCutoffIso(now: number = Date.now()): string {
  return new Date(now - TTL_MS).toISOString();
}

/**
 * Wraps a request handler with per-key dedupe.
 *
 * - `key` null/missing → handler always runs (no caching).
 * - Cached row exists, hash matches → returns cached `{kind:"replay"}`.
 * - Cached row exists, hash differs → returns `{kind:"conflict"}` —
 *   caller should respond 409.
 * - No cached row → runs handler, stores the response, returns
 *   `{kind:"fresh"}`.
 *
 * The handler MUST be deterministic on (request body, server state).
 * Callers should reuse the same key only when retrying logically the
 * same request.
 */
export async function withIdempotency<T>(
  scope: string,
  key: string | null | undefined,
  rawBody: string,
  handler: () => Promise<{ status: number; body: T }>,
): Promise<DedupeOutcome<T>> {
  // Feature-flagged: when off, skip the cache entirely and just run
  // the handler. Clients keep sending Idempotency-Key headers; they
  // just won't dedupe. Useful for debugging or when the cache table
  // is misbehaving.
  if (!features().idempotency || !key) {
    const fresh = await handler();
    return { kind: "fresh", ...fresh };
  }
  if (!KEY_PATTERN.test(key)) {
    // Treat malformed keys as no-op so a buggy client doesn't poison
    // the cache. Caller can respond 400 if it wants stricter behavior.
    const fresh = await handler();
    return { kind: "fresh", ...fresh };
  }

  ensureMigrated();
  const db = getDb();
  const requestHash = hashBody(rawBody);
  const cutoff = janitorCutoffIso();

  const existing = db
    .select()
    .from(idempotencyKeys)
    .where(eq(idempotencyKeys.key, key))
    .get();

  if (existing && existing.scope === scope && existing.createdAt > cutoff) {
    if (existing.requestHash !== requestHash) {
      return { kind: "conflict" };
    }
    return {
      kind: "replay",
      status: existing.responseStatus,
      body: JSON.parse(existing.responseBody) as T,
    };
  }

  // Run the handler before caching — never cache a thrown error.
  const fresh = await handler();

  // Opportunistic janitor: drop expired rows so the table doesn't
  // grow forever. Cheap because of idx_idemp_created_at.
  db.delete(idempotencyKeys).where(lt(idempotencyKeys.createdAt, cutoff)).run();

  // If the existing row was either out of scope or expired, replace it.
  // SQLite's INSERT OR REPLACE handles the primary-key collision.
  db.insert(idempotencyKeys)
    .values({
      key,
      scope,
      requestHash,
      responseStatus: fresh.status,
      responseBody: JSON.stringify(fresh.body),
      createdAt: nowIso(),
    })
    .onConflictDoUpdate({
      target: idempotencyKeys.key,
      set: {
        scope,
        requestHash,
        responseStatus: fresh.status,
        responseBody: JSON.stringify(fresh.body),
        createdAt: nowIso(),
      },
    })
    .run();

  return { kind: "fresh", ...fresh };
}

export function _resetForTests(): void {
  ensureMigrated();
  getDb()
    .delete(idempotencyKeys)
    .where(and())
    .run();
}

/**
 * Reads the Idempotency-Key header (case-insensitive). Returns null
 * when absent or empty.
 */
export function readIdempotencyKey(req: Request): string | null {
  const h = req.headers.get("idempotency-key") ?? req.headers.get("Idempotency-Key");
  if (!h) return null;
  const trimmed = h.trim();
  if (!trimmed) return null;
  if (trimmed.length > KEY_MAX_LEN) return null;
  return trimmed;
}
