/**
 * Platform-agnostic near-miss API client. Works wherever `fetch` is
 * available (Node 18+, browsers, React Native / Expo).
 *
 *   import { createNearMissApi } from "@/shared/near-miss/api";
 *   const api = createNearMissApi({ baseUrl: "https://app.example.com" });
 *
 *   // Mobile login
 *   const session = await api.signIn({ email, password });
 *   await SecureStore.setItemAsync("nm_token", session.token);
 *
 *   // Authenticated calls
 *   const auth = createNearMissApi({
 *     baseUrl: "https://app.example.com",
 *     getToken: () => SecureStore.getItemAsync("nm_token"),
 *   });
 *   const reports = await auth.listReports();
 */

import {
  Attachment,
  ContributingFactorType,
  HazardCategoryId,
  NearMissReport,
  NearMissReportSummary,
  ReportStatus,
  Severity,
} from "./types";
import { CreateReportFieldKey } from "./validation";

export interface NearMissApiOptions {
  baseUrl: string;
  /**
   * Returns a bearer token to send on each authenticated request, or null
   * if the user isn't signed in. Sync or async.
   */
  getToken?: () => string | null | Promise<string | null>;
  /** Overrides the default fetch (useful for tests). */
  fetchImpl?: typeof fetch;
}

export class NearMissApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public fieldErrors?: Partial<Record<CreateReportFieldKey, string>>,
  ) {
    super(message);
    this.name = "NearMissApiError";
  }
}

export interface CreateReportInput {
  anonymous: boolean;
  reporterName?: string | null;
  siteId?: string;
  occurredAt?: string | null;
  locationText: string;
  hazardCategory: HazardCategoryId;
  severityPotential: Severity;
  description: string;
}

export interface CreateReportResponse {
  report: NearMissReport;
  receiptCode: string | null;
}

export interface AuthSession {
  token: string;
  expiresAt: string;
  user: { id: string; email: string; name: string; role: string };
}

export function createNearMissApi(opts: NearMissApiOptions) {
  const fetchImpl: typeof fetch =
    opts.fetchImpl ?? (globalThis.fetch?.bind(globalThis) as typeof fetch);
  if (!fetchImpl) {
    throw new Error("No fetch implementation available");
  }
  const base = opts.baseUrl.replace(/\/$/, "");

  async function authHeaders(): Promise<HeadersInit> {
    if (!opts.getToken) return {};
    const t = await opts.getToken();
    return t ? { authorization: `Bearer ${t}` } : {};
  }

  async function call<T>(
    path: string,
    init: RequestInit = {},
    requireAuth = false,
  ): Promise<T> {
    const headers: HeadersInit = {
      accept: "application/json",
      ...(init.headers ?? {}),
      ...(requireAuth ? await authHeaders() : {}),
    };
    const res = await fetchImpl(`${base}${path}`, { ...init, headers });
    const text = await res.text();
    const body = text
      ? (() => {
          try {
            return JSON.parse(text);
          } catch {
            return null;
          }
        })()
      : null;
    if (!res.ok) {
      const message =
        (body && typeof body === "object" && "error" in body
          ? String((body as { error: unknown }).error)
          : `HTTP ${res.status}`) || `HTTP ${res.status}`;
      const fieldErrors =
        body && typeof body === "object" && "fieldErrors" in body
          ? ((body as { fieldErrors: Record<string, string> }).fieldErrors as never)
          : undefined;
      throw new NearMissApiError(res.status, message, fieldErrors);
    }
    return body as T;
  }

  return {
    /** Auth — exchange email+password for a bearer token. */
    async signIn(input: { email: string; password: string }): Promise<AuthSession> {
      return call<AuthSession>("/api/auth/token", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(input),
      });
    },

    /** Whoami for the held bearer token. */
    async me(): Promise<AuthSession["user"]> {
      const r = await call<{ user: AuthSession["user"] }>(
        "/api/auth/me",
        {},
        true,
      );
      return r.user;
    },

    /** Categories, severity levels, statuses, validation limits. */
    async getCategories() {
      return call<{
        hazardCategories: { id: string; label: string }[];
        severityLevels: { id: string; label: string }[];
        reportStatuses: string[];
        contributingFactorTypes: { id: string; label: string }[];
        limits: Record<string, number>;
        allowedPhotoTypes: string[];
      }>("/api/near-miss/categories");
    },

    /** Submit a new report. Public — anonymous flag is honored. */
    async createReport(input: CreateReportInput): Promise<CreateReportResponse> {
      return call<CreateReportResponse>("/api/near-miss/reports", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(input),
      });
    },

    /** Triage list — requires auth. */
    async listReports(): Promise<NearMissReportSummary[]> {
      const r = await call<{ reports: NearMissReportSummary[] }>(
        "/api/near-miss/reports",
        {},
        true,
      );
      return r.reports;
    },

    /** Triage detail — requires auth. */
    async getReport(id: string): Promise<{ report: NearMissReport; attachments: Attachment[] }> {
      return call<{ report: NearMissReport; attachments: Attachment[] }>(
        `/api/near-miss/reports/${encodeURIComponent(id)}`,
        {},
        true,
      );
    },

    /** Change a report's status. Bearer-auth. Idempotent. */
    async setStatus(reportId: string, status: ReportStatus): Promise<{ report: NearMissReport }> {
      return call<{ report: NearMissReport }>(
        `/api/near-miss/reports/${encodeURIComponent(reportId)}/status`,
        {
          method: "PATCH",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ status }),
        },
        true,
      );
    },

    /** Add a contributing factor. Bearer-auth. Triage-internal. */
    async addFactor(
      reportId: string,
      input: { type: ContributingFactorType; note: string },
    ): Promise<{ report: NearMissReport }> {
      return call<{ report: NearMissReport }>(
        `/api/near-miss/reports/${encodeURIComponent(reportId)}/factors`,
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(input),
        },
        true,
      );
    },

    /**
     * Add a corrective action. Bearer-auth. Auto-transitions the
     * report status to "actioned" when previously "new" or "triaged".
     */
    async addCorrectiveAction(
      reportId: string,
      input: { description: string; ownerName: string; dueAt?: string | null },
    ): Promise<{ report: NearMissReport }> {
      return call<{ report: NearMissReport }>(
        `/api/near-miss/reports/${encodeURIComponent(reportId)}/actions`,
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(input),
        },
        true,
      );
    },

    /** Mark a corrective action done. Bearer-auth. Idempotent. */
    async completeCorrectiveAction(
      reportId: string,
      actionId: string,
    ): Promise<{ report: NearMissReport }> {
      return call<{ report: NearMissReport }>(
        `/api/near-miss/reports/${encodeURIComponent(reportId)}/actions/${encodeURIComponent(actionId)}/complete`,
        { method: "POST" },
        true,
      );
    },

    /** Append a triage comment. Bearer-auth required. */
    async addComment(reportId: string, text: string): Promise<{ report: NearMissReport }> {
      return call<{ report: NearMissReport }>(
        `/api/near-miss/reports/${encodeURIComponent(reportId)}/comments`,
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ text }),
        },
        true,
      );
    },

    /** Anonymous status lookup — public. */
    async getByReceiptCode(code: string): Promise<{ report: NearMissReport; attachments: Attachment[] }> {
      return call<{ report: NearMissReport; attachments: Attachment[] }>(
        `/api/near-miss/reports/by-code/${encodeURIComponent(code)}`,
      );
    },

    /** Post-submit summary by reference — public, returns minimal fields. */
    async getByReference(reference: string) {
      return call<{
        reference: string;
        receiptCode: string | null;
        anonymous: boolean;
        status: string;
        reportedAt: string;
      }>(`/api/near-miss/reports/by-reference/${encodeURIComponent(reference)}`);
    },

    /**
     * Upload a photo attachment for an existing report. Pass `code` for
     * anonymous reporters, otherwise the call uses the held bearer token.
     */
    async uploadPhoto(
      reportId: string,
      file: File | Blob,
      opts: { code?: string; filename?: string } = {},
    ): Promise<{ attachment: Attachment }> {
      const form = new FormData();
      form.append(
        "photo",
        file as Blob,
        opts.filename ?? (file instanceof File ? file.name : "photo"),
      );
      const qs = opts.code ? `?code=${encodeURIComponent(opts.code)}` : "";
      return call<{ attachment: Attachment }>(
        `/api/near-miss/reports/${encodeURIComponent(reportId)}/attachments${qs}`,
        { method: "POST", body: form as unknown as BodyInit },
        !opts.code,
      );
    },

    /** Build a URL for streaming an attachment (use as <Image src=> in RN). */
    attachmentUrl(attachmentId: string, opts: { code?: string } = {}): string {
      const qs = opts.code ? `?code=${encodeURIComponent(opts.code)}` : "";
      return `${base}/api/attachments/${encodeURIComponent(attachmentId)}${qs}`;
    },

    /**
     * Two-step S3 upload (recommended for production). Step 1 asks the
     * server for a presigned PUT URL, step 2 the client uploads directly
     * to S3, step 3 confirms with the server which records the row.
     *
     * Returns null when the server is on local-FS storage — caller should
     * fall back to `uploadPhoto()` (the multipart proxy path).
     */
    async signedUploadPhoto(
      reportId: string,
      file: { contentType: string; sizeBytes: number; bytes: Blob | ArrayBuffer },
      opts: { code?: string } = {},
    ): Promise<{ attachment: Attachment } | null> {
      const qs = opts.code ? `?code=${encodeURIComponent(opts.code)}` : "";
      const idEnc = encodeURIComponent(reportId);

      let signed: {
        storageKey: string;
        uploadUrl: string;
        method: "PUT";
        headers: Record<string, string>;
      };
      try {
        signed = await call<typeof signed>(
          `/api/near-miss/reports/${idEnc}/attachments/sign${qs}`,
          {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({
              contentType: file.contentType,
              sizeBytes: file.sizeBytes,
            }),
          },
          !opts.code,
        );
      } catch (e) {
        if (e instanceof NearMissApiError && e.status === 501) return null;
        throw e;
      }

      // Direct PUT to S3 — bytes don't go through the app server.
      const putRes = await fetchImpl(signed.uploadUrl, {
        method: "PUT",
        headers: signed.headers,
        body: file.bytes,
      });
      if (!putRes.ok) {
        throw new NearMissApiError(
          putRes.status,
          `Direct upload failed: HTTP ${putRes.status}`,
        );
      }

      return call<{ attachment: Attachment }>(
        `/api/near-miss/reports/${idEnc}/attachments/confirm${qs}`,
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ storageKey: signed.storageKey }),
        },
        !opts.code,
      );
    },
  };
}

export type NearMissApi = ReturnType<typeof createNearMissApi>;
