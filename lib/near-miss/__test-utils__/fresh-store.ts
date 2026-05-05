import { mkdtempSync, rmSync } from "node:fs";
import path from "node:path";
import { tmpdir } from "node:os";

/**
 * Per-test isolation: rebuild the DB at a fresh on-disk SQLite file in an
 * OS tempdir, return a cleanup function.
 *
 * The store pins its DB handle to globalThis.__nmDb. We can't just delete
 * the global because lib/near-miss/db/client.ts captures the holder
 * reference at module-load — we have to mutate that holder in place so
 * the next ensureMigrated() call rebuilds against the new path.
 */
type Holder = { sqlite?: { close?: () => void }; db?: unknown; migrated?: boolean };

export function withFreshStore(): { cleanup: () => void } {
  const dir = mkdtempSync(path.join(tmpdir(), "nm-test-"));
  const dbPath = path.join(dir, "near-miss.db");
  process.env.NEAR_MISS_DB_PATH = dbPath;

  resetHolder();

  return {
    cleanup: () => {
      resetHolder();
      try {
        rmSync(dir, { recursive: true, force: true });
      } catch {
        // best-effort
      }
    },
  };
}

function resetHolder() {
  const g = globalThis as unknown as { __nmDb?: Holder };
  const h = g.__nmDb;
  if (!h) return;
  try {
    h.sqlite?.close?.();
  } catch {
    // ignore
  }
  delete h.sqlite;
  delete h.db;
  delete h.migrated;
}
