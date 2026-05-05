import type { Config } from "drizzle-kit";

export default {
  schema: "./lib/near-miss/db/schema.ts",
  out: "./drizzle",
  dialect: "sqlite",
  dbCredentials: {
    url: process.env.NEAR_MISS_DB_PATH ?? "./near-miss.db",
  },
} satisfies Config;
