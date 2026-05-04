import path from "node:path";
import Database from "better-sqlite3";
import { drizzle, BetterSQLite3Database } from "drizzle-orm/better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import * as schema from "./schema";

type DB = BetterSQLite3Database<typeof schema>;

type Holder = {
  sqlite?: Database.Database;
  db?: DB;
  migrated?: boolean;
};

const holder: Holder = ((globalThis as unknown as { __nmDb?: Holder }).__nmDb ??=
  {});

function init(): { sqlite: Database.Database; db: DB } {
  if (holder.sqlite && holder.db) {
    return { sqlite: holder.sqlite, db: holder.db };
  }
  const dbPath = process.env.NEAR_MISS_DB_PATH ?? "./near-miss.db";
  const sqlite = new Database(dbPath);
  sqlite.pragma("journal_mode = WAL");
  sqlite.pragma("foreign_keys = ON");
  const db = drizzle(sqlite, { schema });
  holder.sqlite = sqlite;
  holder.db = db;
  return { sqlite, db };
}

export function getDb(): DB {
  ensureMigrated();
  return holder.db!;
}

export function getSqlite(): Database.Database {
  ensureMigrated();
  return holder.sqlite!;
}

export function ensureMigrated(): void {
  if (holder.migrated) return;
  const { sqlite, db } = init();
  const migrationsFolder = path.join(process.cwd(), "drizzle");
  migrate(db, { migrationsFolder });
  sqlite
    .prepare("INSERT OR IGNORE INTO near_miss_meta (key, value) VALUES (?, ?)")
    .run("ref_counter", 0);
  holder.migrated = true;
}
