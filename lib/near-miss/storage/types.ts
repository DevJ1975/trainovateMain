export interface StoredFile {
  storageKey: string;
  sizeBytes: number;
  contentType: string;
}

export interface SignedUpload {
  storageKey: string;
  uploadUrl: string;
  method: "PUT";
  /** Headers the client MUST include on the PUT (S3 enforces them). */
  headers: Record<string, string>;
  expiresInSec: number;
  /**
   * Maximum bytes the signed URL will accept (S3 honors this via the
   * content-length header binding). Mirrors LIMITS.attachmentBytes today.
   */
  maxBytes: number;
}

export interface SignedDownload {
  url: string;
  expiresInSec: number;
}

export interface ObjectStat {
  contentType: string;
  sizeBytes: number;
}

export interface StorageProvider {
  /** Identifies the backend in API responses + logs. */
  kind: "local" | "s3";

  /** Server-side multipart upload — used by the proxying API route. */
  putBytes(data: Buffer, contentType: string): Promise<StoredFile>;

  /** Read bytes back through the server (proxy GET path). */
  readBytes(storageKey: string): Promise<Buffer>;

  /**
   * Presigned client-direct upload. Returns null when the provider
   * doesn't support it (local FS); the caller should fall back to the
   * multipart proxy endpoint.
   */
  signUpload(opts: { contentType: string; sizeBytes: number }): Promise<SignedUpload | null>;

  /**
   * Presigned client-direct download. Returns null when the provider
   * doesn't support it; the caller should keep proxying through
   * GET /api/attachments/[id].
   */
  signDownload(storageKey: string): Promise<SignedDownload | null>;

  /**
   * Verify what the client actually uploaded matches what they claimed.
   * Used by the confirm endpoint after a signed upload — clients can lie
   * in the confirm body, the underlying object can't.
   */
  statObject(storageKey: string): Promise<ObjectStat | null>;
}
