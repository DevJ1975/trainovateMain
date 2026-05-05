import { eq, sql } from "drizzle-orm";
import { ensureMigrated, getDb } from "@/lib/near-miss/db/client";
import { users } from "@/lib/near-miss/db/schema";

/**
 * Seed the demo users that everyone has been signing in as
 * (lead@trainovate.demo, admin@trainovate.demo). Idempotent — safe to
 * call from any sign-in path. Real production never calls this; it's
 * gated by the same NM_ALLOW_DEV_AUTH check the dev-stub providers use.
 */

const DEV_USERS = [
  {
    id: "u_lead",
    email: "lead@trainovate.demo",
    name: "Priya Shah",
    role: "safety_lead",
  },
  {
    id: "u_admin",
    email: "admin@trainovate.demo",
    name: "Marcus Webb",
    role: "safety_admin",
  },
];

let seeded = false;

export function ensureDevUsersSeeded(): void {
  if (seeded) return;
  if (process.env.NODE_ENV === "production" && process.env.NM_ALLOW_DEV_AUTH !== "true") {
    seeded = true;
    return;
  }
  ensureMigrated();
  const db = getDb();
  for (const u of DEV_USERS) {
    const existing = db
      .select({ count: sql<number>`count(*)` })
      .from(users)
      .where(eq(users.email, u.email))
      .get();
    if (!existing || Number(existing.count) > 0) continue;
    db.insert(users).values(u).run();
  }
  seeded = true;
}
