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
  HazardCategoryId,
  NearMissReport,
  NearMissReportSummary,
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
  };
}

export type NearMissApi = ReturnType<typeof createNearMissApi>;
