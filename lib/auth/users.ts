import { eq } from "drizzle-orm";
import { ensureMigrated, getDb } from "@/lib/near-miss/db/client";
import { users } from "@/lib/near-miss/db/schema";
import { ensureDevUsersSeeded } from "./seed";

export type Role = "safety_lead" | "safety_admin";

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
}

function rowToUser(row: typeof users.$inferSelect): User {
  return {
    id: row.id,
    email: row.email,
    name: row.name ?? row.email,
    role: (row.role as Role) ?? "safety_lead",
  };
}

export function findUserByEmail(email: string): User | undefined {
  const e = email.trim().toLowerCase();
  if (!e) return undefined;
  ensureMigrated();
  ensureDevUsersSeeded();
  const row = getDb().select().from(users).where(eq(users.email, e)).get();
  return row ? rowToUser(row) : undefined;
}

export function findUserById(id: string): User | undefined {
  if (!id) return undefined;
  ensureMigrated();
  ensureDevUsersSeeded();
  const row = getDb().select().from(users).where(eq(users.id, id)).get();
  return row ? rowToUser(row) : undefined;
}
