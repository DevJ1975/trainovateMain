import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    environment: "node",
    include: ["**/*.test.ts"],
    exclude: ["node_modules/**", ".next/**", "drizzle/**", "mobile/**"],
    // Each test file gets a fresh process so the global DB handle doesn't
    // leak between files. Within a file, the store helper resets state.
    isolate: true,
    pool: "forks",
    poolOptions: { forks: { singleFork: false } },
  },
});
