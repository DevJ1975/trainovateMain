import { randomUUID } from "node:crypto";
import { mkdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import {
  ALLOWED_PHOTO_TYPES as SHARED_ALLOWED,
  LIMITS,
} from "@/shared/near-miss/validation";

/**
 * Local-filesystem storage. Phase 1 dev only — Vercel/Lambda filesystems are
 * ephemeral and cross-instance, so production needs S3 (or equivalent) with
 * signed URLs and face/plate auto-blur.
 */

const UPLOAD_DIR =
  process.env.NEAR_MISS_UPLOAD_DIR ?? path.join(process.cwd(), "uploads");

export const MAX_FILE_BYTES = LIMITS.attachmentBytes;
export const MAX_FILES_PER_REPORT = LIMITS.attachmentsPerReport;
export const ALLOWED_PHOTO_TYPES = new Set<string>(SHARED_ALLOWED);

export interface StoredFile {
  storageKey: string;
  sizeBytes: number;
  contentType: string;
}

function extFor(contentType: string): string {
  switch (contentType) {
    case "image/jpeg": return ".jpg";
    case "image/png": return ".png";
    case "image/webp": return ".webp";
    case "image/gif": return ".gif";
    default: return ".bin";
  }
}

export async function writeUpload(
  data: Buffer,
  contentType: string,
): Promise<StoredFile> {
  await mkdir(UPLOAD_DIR, { recursive: true });
  const id = randomUUID();
  const storageKey = `${id}${extFor(contentType)}`;
  await writeFile(path.join(UPLOAD_DIR, storageKey), data);
  return { storageKey, sizeBytes: data.byteLength, contentType };
}

export async function readUpload(storageKey: string): Promise<Buffer> {
  const safe = path.basename(storageKey);
  const full = path.join(UPLOAD_DIR, safe);
  return readFile(full);
}

export async function uploadExists(storageKey: string): Promise<boolean> {
  const safe = path.basename(storageKey);
  try {
    await stat(path.join(UPLOAD_DIR, safe));
    return true;
  } catch {
    return false;
  }
}
