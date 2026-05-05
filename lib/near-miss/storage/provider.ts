import type { StorageProvider } from "./types";
import { localProvider } from "./local";
import { s3Provider } from "./s3";

let cached: StorageProvider | null = null;

export function getStorage(): StorageProvider {
  if (cached) return cached;
  const driver = (process.env.NEAR_MISS_STORAGE ?? "local").toLowerCase();
  cached = driver === "s3" ? s3Provider : localProvider;
  return cached;
}

export function isS3(): boolean {
  return getStorage().kind === "s3";
}

// For tests.
export function _resetStorage() {
  cached = null;
}
