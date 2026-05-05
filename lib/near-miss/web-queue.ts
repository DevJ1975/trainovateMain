/**
 * Browser-side offline submit queue. Mirrors the mobile queue
 * (mobile/src/queue.ts) — same idempotency-key strategy, same
 * permanent-vs-retryable logic. Backed by IndexedDB so drafts
 * (including photo Blobs) survive tab close, browser restart, and
 * device reboot.
 *
 * NOTE: this module touches `indexedDB` and `fetch`, so it must only
 * be imported from client components.
 */

import type {
  CreateReportInput,
  CreateReportResponse,
} from "@/shared/near-miss/api";
import { NearMissApiError, createNearMissApi } from "@/shared/near-miss/api";

const DB_NAME = "nm_offline_queue";
const DB_VERSION = 1;
const STORE = "drafts";

export interface QueuedDraft {
  id?: number; // auto-increment, set on read
  idempotencyKey: string;
  createdAt: string;
  input: CreateReportInput;
  /** First photo only for now; multi-photo queueing is a follow-up. */
  photo?: File | Blob;
  attempts: number;
  lastError?: string;
}

export interface DrainSummary {
  attempted: number;
  succeeded: number;
  permanentFailures: number;
  remaining: number;
  delivered: { reference: string; receiptCode: string | null }[];
}

let dbPromise: Promise<IDBDatabase> | null = null;

function openDb(): Promise<IDBDatabase> {
  if (dbPromise) return dbPromise;
  dbPromise = new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) {
        const store = db.createObjectStore(STORE, {
          keyPath: "id",
          autoIncrement: true,
        });
        store.createIndex("createdAt", "createdAt");
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
  return dbPromise;
}

function tx(mode: IDBTransactionMode): Promise<IDBObjectStore> {
  return openDb().then((db) => db.transaction(STORE, mode).objectStore(STORE));
}

function awaitReq<T>(req: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

function uuid(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export async function enqueueDraft(
  input: CreateReportInput,
  opts: { idempotencyKey?: string; photo?: File | Blob } = {},
): Promise<QueuedDraft> {
  const draft: Omit<QueuedDraft, "id"> = {
    idempotencyKey: opts.idempotencyKey ?? uuid(),
    createdAt: new Date().toISOString(),
    input,
    photo: opts.photo,
    attempts: 0,
  };
  const store = await tx("readwrite");
  const id = (await awaitReq(store.add(draft))) as number;
  return { id, ...draft };
}

export async function listDrafts(): Promise<QueuedDraft[]> {
  const store = await tx("readonly");
  const all = (await awaitReq(store.getAll())) as QueuedDraft[];
  return all.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
}

export async function pendingCount(): Promise<number> {
  const store = await tx("readonly");
  return awaitReq(store.count()) as Promise<number>;
}

async function removeDraft(id: number): Promise<void> {
  const store = await tx("readwrite");
  await awaitReq(store.delete(id));
}

async function updateDraft(id: number, patch: Partial<QueuedDraft>): Promise<void> {
  const store = await tx("readwrite");
  const existing = (await awaitReq(store.get(id))) as QueuedDraft | undefined;
  if (!existing) return;
  await awaitReq(store.put({ ...existing, ...patch, id }));
}

export async function clearQueue(): Promise<void> {
  const store = await tx("readwrite");
  await awaitReq(store.clear());
}

/**
 * Drain the queue against the live API. Photo upload is best-effort;
 * a 2xx on `createReport` is enough to remove the draft. Photo
 * failures are noted but don't requeue.
 */
export async function drainQueue(baseUrl: string = ""): Promise<DrainSummary> {
  const drafts = await listDrafts();
  const summary: DrainSummary = {
    attempted: drafts.length,
    succeeded: 0,
    permanentFailures: 0,
    remaining: 0,
    delivered: [],
  };

  // Use the shared client so the request shape (Idempotency-Key
  // header, JSON body) stays in lockstep with mobile.
  const api = createNearMissApi({ baseUrl: baseUrl || window.location.origin });

  for (const draft of drafts) {
    if (draft.id === undefined) continue;
    try {
      const { report, receiptCode }: CreateReportResponse =
        await api.createReport(draft.input, {
          idempotencyKey: draft.idempotencyKey,
        });

      if (draft.photo && draft.photo.size > 0) {
        try {
          await api.uploadPhoto(report.id, draft.photo, {
            code: receiptCode ?? undefined,
            filename:
              draft.photo instanceof File
                ? draft.photo.name
                : `photo.${guessExt(draft.photo.type)}`,
          });
        } catch {
          // best-effort
        }
      }

      summary.succeeded += 1;
      summary.delivered.push({
        reference: report.reference,
        receiptCode: receiptCode ?? null,
      });
      await removeDraft(draft.id);
    } catch (err) {
      const apiErr = err instanceof NearMissApiError ? err : null;
      const status = apiErr?.status ?? 0;
      const isPermanent =
        status >= 400 && status < 500 && status !== 408 && status !== 429;
      if (isPermanent) {
        summary.permanentFailures += 1;
        await removeDraft(draft.id);
        continue;
      }
      await updateDraft(draft.id, {
        attempts: draft.attempts + 1,
        lastError: (err as Error).message,
      });
      summary.remaining += 1;
    }
  }

  return summary;
}

function guessExt(contentType: string): string {
  switch (contentType) {
    case "image/png": return "png";
    case "image/webp": return "webp";
    case "image/gif": return "gif";
    default: return "jpg";
  }
}
