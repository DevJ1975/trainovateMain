import { randomUUID } from "node:crypto";
import {
  GetObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { LIMITS } from "@/shared/near-miss/validation";
import type { ObjectStat, SignedDownload, SignedUpload, StorageProvider, StoredFile } from "./types";

/**
 * S3 storage provider. Activated via NEAR_MISS_STORAGE=s3 + the
 * NEAR_MISS_S3_* env vars. The presigned URL flow lets clients upload
 * directly to S3, sidestepping serverless body-size limits (Vercel: 4.5MB).
 */

interface S3Config {
  bucket: string;
  region: string;
  prefix: string;
  client: S3Client;
}

let cached: S3Config | null = null;

function config(): S3Config {
  if (cached) return cached;
  const bucket = required("NEAR_MISS_S3_BUCKET");
  const region = process.env.NEAR_MISS_S3_REGION ?? process.env.AWS_REGION ?? "us-east-1";
  const prefix = (process.env.NEAR_MISS_S3_PREFIX ?? "near-miss/").replace(/^\/+|\/+$/g, "") + "/";
  const client = new S3Client({
    region,
    // SDK auto-resolves credentials from env / IMDS / shared config in the
    // standard order. Override with NEAR_MISS_S3_* if you need a separate
    // account from the rest of your AWS workload.
    ...(process.env.NEAR_MISS_S3_ACCESS_KEY_ID && process.env.NEAR_MISS_S3_SECRET_ACCESS_KEY
      ? {
          credentials: {
            accessKeyId: process.env.NEAR_MISS_S3_ACCESS_KEY_ID,
            secretAccessKey: process.env.NEAR_MISS_S3_SECRET_ACCESS_KEY,
          },
        }
      : {}),
    ...(process.env.NEAR_MISS_S3_ENDPOINT
      ? { endpoint: process.env.NEAR_MISS_S3_ENDPOINT, forcePathStyle: true }
      : {}),
  });
  cached = { bucket, region, prefix, client };
  return cached;
}

function required(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`${name} is required when NEAR_MISS_STORAGE=s3`);
  return v;
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

const SIGN_EXPIRES_SEC = 60 * 5;

export const s3Provider: StorageProvider = {
  kind: "s3",

  async putBytes(data, contentType) {
    const c = config();
    const storageKey = `${c.prefix}${randomUUID()}${extFor(contentType)}`;
    await c.client.send(
      new PutObjectCommand({
        Bucket: c.bucket,
        Key: storageKey,
        Body: data,
        ContentType: contentType,
      }),
    );
    return { storageKey, sizeBytes: data.byteLength, contentType };
  },

  async readBytes(storageKey) {
    const c = config();
    const res = await c.client.send(
      new GetObjectCommand({ Bucket: c.bucket, Key: storageKey }),
    );
    if (!res.Body) throw new Error("Empty body from S3");
    return Buffer.from(await res.Body.transformToByteArray());
  },

  async signUpload({ contentType }): Promise<SignedUpload | null> {
    const c = config();
    const storageKey = `${c.prefix}${randomUUID()}${extFor(contentType)}`;
    const cmd = new PutObjectCommand({
      Bucket: c.bucket,
      Key: storageKey,
      ContentType: contentType,
    });
    const uploadUrl = await getSignedUrl(c.client, cmd, {
      expiresIn: SIGN_EXPIRES_SEC,
    });
    return {
      storageKey,
      uploadUrl,
      method: "PUT",
      headers: { "content-type": contentType },
      expiresInSec: SIGN_EXPIRES_SEC,
      maxBytes: LIMITS.attachmentBytes,
    };
  },

  async signDownload(storageKey): Promise<SignedDownload | null> {
    const c = config();
    const cmd = new GetObjectCommand({ Bucket: c.bucket, Key: storageKey });
    const url = await getSignedUrl(c.client, cmd, { expiresIn: SIGN_EXPIRES_SEC });
    return { url, expiresInSec: SIGN_EXPIRES_SEC };
  },

  async statObject(storageKey): Promise<ObjectStat | null> {
    const c = config();
    try {
      const r = await c.client.send(
        new HeadObjectCommand({ Bucket: c.bucket, Key: storageKey }),
      );
      return {
        sizeBytes: Number(r.ContentLength ?? 0),
        contentType: r.ContentType ?? "application/octet-stream",
      };
    } catch {
      return null;
    }
  },
};
