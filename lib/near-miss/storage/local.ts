import { randomUUID } from "node:crypto";
import { mkdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import type { ObjectStat, SignedDownload, SignedUpload, StorageProvider, StoredFile } from "./types";

const UPLOAD_DIR =
  process.env.NEAR_MISS_UPLOAD_DIR ?? path.join(process.cwd(), "uploads");

function extFor(contentType: string): string {
  switch (contentType) {
    case "image/jpeg": return ".jpg";
    case "image/png": return ".png";
    case "image/webp": return ".webp";
    case "image/gif": return ".gif";
    default: return ".bin";
  }
}

const CONTENT_TYPE_BY_EXT: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
};

/**
 * Local-filesystem provider. Phase 1 dev only — Vercel/Lambda filesystems
 * are ephemeral and cross-instance, so production must use S3 (or another
 * blob store) via the StorageProvider interface.
 */
export const localProvider: StorageProvider = {
  kind: "local",

  async putBytes(data, contentType) {
    await mkdir(UPLOAD_DIR, { recursive: true });
    const id = randomUUID();
    const storageKey = `${id}${extFor(contentType)}`;
    await writeFile(path.join(UPLOAD_DIR, storageKey), data);
    return { storageKey, sizeBytes: data.byteLength, contentType };
  },

  async readBytes(storageKey) {
    return readFile(path.join(UPLOAD_DIR, path.basename(storageKey)));
  },

  // Local provider doesn't sign — clients fall back to the multipart
  // proxy endpoint. The S3 provider implements both.
  async signUpload() {
    return null;
  },

  async signDownload() {
    return null;
  },

  async statObject(storageKey): Promise<ObjectStat | null> {
    const safe = path.basename(storageKey);
    try {
      const s = await stat(path.join(UPLOAD_DIR, safe));
      const ext = path.extname(safe).toLowerCase();
      return {
        sizeBytes: s.size,
        contentType: CONTENT_TYPE_BY_EXT[ext] ?? "application/octet-stream",
      };
    } catch {
      return null;
    }
  },
};

// Tagged unused-export marker so tree-shakers see the type.
export type { SignedUpload, SignedDownload };
