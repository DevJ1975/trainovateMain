import {
  ALLOWED_PHOTO_TYPES as SHARED_ALLOWED,
  LIMITS,
} from "@/shared/near-miss/validation";
import { getStorage } from "./storage/provider";
import type { StoredFile } from "./storage/types";

/**
 * Public storage surface. Backed by `lib/near-miss/storage/provider.ts`
 * which selects between Local (dev default) and S3 (NEAR_MISS_STORAGE=s3
 * + NEAR_MISS_S3_* env vars). The signed-URL flow is exposed via the new
 * /api/near-miss/reports/[id]/attachments/sign + /confirm endpoints —
 * use the provider directly for those.
 */

export const MAX_FILE_BYTES = LIMITS.attachmentBytes;
export const MAX_FILES_PER_REPORT = LIMITS.attachmentsPerReport;
export const ALLOWED_PHOTO_TYPES = new Set<string>(SHARED_ALLOWED);

export type { StoredFile };
export { getStorage } from "./storage/provider";

export async function writeUpload(
  data: Buffer,
  contentType: string,
): Promise<StoredFile> {
  return getStorage().putBytes(data, contentType);
}

export async function readUpload(storageKey: string): Promise<Buffer> {
  return getStorage().readBytes(storageKey);
}

export async function uploadExists(storageKey: string): Promise<boolean> {
  const stat = await getStorage().statObject(storageKey);
  return stat !== null;
}
