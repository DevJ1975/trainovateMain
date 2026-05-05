"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  HAZARD_CATEGORIES,
  SEVERITY_LEVELS,
} from "@/lib/near-miss/types";
import {
  NearMissApiError,
  createNearMissApi,
  type CreateReportInput,
} from "@/shared/near-miss/api";
import {
  drainQueue,
  enqueueDraft,
  pendingCount,
} from "@/lib/near-miss/web-queue";

const inputBase =
  "w-full rounded-md border bg-ink/40 px-3 py-2 text-bone " +
  "placeholder:text-bone/30 focus:outline-none focus:ring-1";

const inputOk = "border-bone/15 focus:border-cobalt focus:ring-cobalt";
const inputErr = "border-flare/60 focus:border-flare focus:ring-flare";

const labelBase = "block text-xs uppercase tracking-[0.18em] text-bone/60";

type FieldKey =
  | "reporterName"
  | "occurredAt"
  | "locationText"
  | "hazardCategory"
  | "severityPotential"
  | "description"
  | "photos";

type FormStatus =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "queued" }
  | {
      kind: "delivered";
      delivered: { reference: string; receiptCode: string | null };
    };

export function SubmissionForm() {
  const router = useRouter();
  const [anonymous, setAnonymous] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<FieldKey, string>>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [status, setStatus] = useState<FormStatus>({ kind: "idle" });
  const [queueCount, setQueueCount] = useState(0);
  const [draining, setDraining] = useState(false);

  const refreshPending = useCallback(async () => {
    try {
      setQueueCount(await pendingCount());
    } catch {
      // IndexedDB may be unavailable (private mode in some browsers); fail silent.
    }
  }, []);

  const tryDrain = useCallback(async () => {
    setDraining(true);
    try {
      const summary = await drainQueue();
      if (summary.delivered.length > 0) {
        setStatus({
          kind: "delivered",
          delivered: summary.delivered[summary.delivered.length - 1],
        });
      }
    } catch {
      // network still down — leave drafts queued
    } finally {
      setDraining(false);
      await refreshPending();
    }
  }, [refreshPending]);

  // Drain on mount + on every "online" event.
  useEffect(() => {
    refreshPending();
    void tryDrain();
    const onOnline = () => void tryDrain();
    window.addEventListener("online", onOnline);
    return () => window.removeEventListener("online", onOnline);
  }, [refreshPending, tryDrain]);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus({ kind: "submitting" });
    setFieldErrors({});
    setFormError(null);

    const fd = new FormData(e.currentTarget);
    const isAnon = fd.get("anonymous") === "on";
    const input: CreateReportInput = {
      anonymous: isAnon,
      reporterName: isAnon ? null : ((fd.get("reporterName") as string) ?? "").trim() || null,
      siteId: ((fd.get("siteId") as string) || "plant-1"),
      occurredAt: ((fd.get("occurredAt") as string) ?? "") || null,
      locationText: ((fd.get("locationText") as string) ?? "").trim(),
      hazardCategory: ((fd.get("hazardCategory") as string) ?? "") as CreateReportInput["hazardCategory"],
      severityPotential: ((fd.get("severityPotential") as string) ?? "medium") as CreateReportInput["severityPotential"],
      description: ((fd.get("description") as string) ?? "").trim(),
    };

    const photos = fd.getAll("photos").filter(
      (f): f is File => f instanceof File && f.size > 0,
    );
    const idempotencyKey = uuid();

    const api = createNearMissApi({ baseUrl: window.location.origin });

    try {
      const { report, receiptCode } = await api.createReport(input, {
        idempotencyKey,
      });

      // Best-effort photo uploads sequentially. A failure here doesn't
      // discard the report — the user can re-attach later from triage.
      for (const photo of photos) {
        try {
          await api.uploadPhoto(report.id, photo, {
            code: receiptCode ?? undefined,
            filename: photo.name,
          });
        } catch {
          // continue
        }
      }

      router.push(`/report/thanks/${encodeURIComponent(report.reference)}`);
    } catch (err) {
      if (err instanceof NearMissApiError && err.fieldErrors) {
        // Validation 400 — never queue. Surface field errors.
        setFieldErrors(err.fieldErrors as Partial<Record<FieldKey, string>>);
        setStatus({ kind: "idle" });
        return;
      }

      // Network failure or 5xx — save locally. Server-side
      // Idempotency-Key dedupe makes the inevitable retry safe even
      // if the original POST actually succeeded server-side and the
      // response was lost.
      try {
        await enqueueDraft(input, {
          idempotencyKey,
          photo: photos[0], // first photo only for now; multi-photo queue is a follow-up
        });
        setStatus({ kind: "queued" });
        await refreshPending();
      } catch (queueErr) {
        setFormError(
          `Couldn't reach the server and couldn't save locally: ${(queueErr as Error).message}`,
        );
        setStatus({ kind: "idle" });
      }
    }
  };

  if (status.kind === "queued") {
    return <QueuedConfirmation queueCount={queueCount} onRetry={tryDrain} draining={draining} />;
  }
  if (status.kind === "delivered") {
    // Soft transition into the standard thanks page so the receipt code
    // shows up in its usual place.
    router.push(`/report/thanks/${encodeURIComponent(status.delivered.reference)}`);
    return null;
  }

  const submitting = status.kind === "submitting";

  return (
    <>
      {queueCount > 0 && (
        <div
          role="status"
          className="mb-5 flex items-center justify-between gap-3 rounded-md border border-flare/40 bg-flare/10 px-3 py-2 text-sm text-flare"
        >
          <span>
            {queueCount} draft{queueCount === 1 ? "" : "s"} waiting to send
            {draining ? " · sending…" : ""}
          </span>
          {!draining && (
            <button
              type="button"
              onClick={() => void tryDrain()}
              className="text-xs uppercase tracking-[0.14em] text-flare hover:underline"
            >
              Retry now
            </button>
          )}
        </div>
      )}

      <form onSubmit={onSubmit} className="flex flex-col gap-5" noValidate>
        {formError && (
          <div
            role="alert"
            className="rounded-md border border-flare/50 bg-flare/10 px-3 py-2 text-sm text-flare"
          >
            {formError}
          </div>
        )}

        <label className="flex items-center gap-3 rounded-md border border-bone/10 bg-ink/30 px-3 py-2">
          <input
            type="checkbox"
            name="anonymous"
            checked={anonymous}
            onChange={(e) => setAnonymous(e.target.checked)}
            className="h-4 w-4 accent-cobalt"
          />
          <span className="text-sm text-bone/85">
            Report anonymously
            <span className="block text-xs text-bone/50">
              Your name won&apos;t be saved. You&apos;ll get a receipt code to check status.
            </span>
          </span>
        </label>

        {!anonymous && (
          <Field id="reporterName" label="Your name" error={fieldErrors.reporterName}>
            <input
              id="reporterName"
              name="reporterName"
              type="text"
              className={fieldClass(inputBase, fieldErrors.reporterName)}
              placeholder="Optional"
            />
          </Field>
        )}

        <div className="grid gap-5 sm:grid-cols-2">
          <Field id="siteId" label="Site">
            <select id="siteId" name="siteId" defaultValue="plant-1" className={fieldClass(inputBase)}>
              <option value="plant-1">Plant 1</option>
              <option value="plant-2">Plant 2</option>
              <option value="warehouse-a">Warehouse A</option>
            </select>
          </Field>

          <Field id="occurredAt" label="When it happened" error={fieldErrors.occurredAt}>
            <input
              id="occurredAt"
              name="occurredAt"
              type="datetime-local"
              defaultValue={defaultLocalNow()}
              className={fieldClass(inputBase, fieldErrors.occurredAt)}
            />
          </Field>
        </div>

        <Field id="locationText" label="Location" error={fieldErrors.locationText}>
          <input
            id="locationText"
            name="locationText"
            type="text"
            className={fieldClass(inputBase, fieldErrors.locationText)}
            placeholder="e.g. Loading bay 3, near pallet stack"
          />
        </Field>

        <Field id="hazardCategory" label="Hazard category" error={fieldErrors.hazardCategory}>
          <select
            id="hazardCategory"
            name="hazardCategory"
            className={fieldClass(inputBase, fieldErrors.hazardCategory)}
          >
            {HAZARD_CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>{c.label}</option>
            ))}
          </select>
        </Field>

        <Field
          id="severityPotential"
          label="Severity potential"
          hint="What was the worst plausible outcome?"
          error={fieldErrors.severityPotential}
        >
          <select
            id="severityPotential"
            name="severityPotential"
            defaultValue="medium"
            className={fieldClass(inputBase, fieldErrors.severityPotential)}
          >
            {SEVERITY_LEVELS.map((s) => (
              <option key={s.id} value={s.id}>{s.label}</option>
            ))}
          </select>
        </Field>

        <Field id="description" label="What happened" error={fieldErrors.description}>
          <textarea
            id="description"
            name="description"
            rows={5}
            className={fieldClass(inputBase, fieldErrors.description) + " resize-y"}
            placeholder="Describe the sequence of events. Stick to facts."
          />
        </Field>

        <Field
          id="photos"
          label="Photos (optional)"
          hint="Up to 5 photos, 10MB each. JPG, PNG, WEBP, or GIF. (When offline, only the first photo is queued.)"
          error={fieldErrors.photos}
        >
          <input
            id="photos"
            name="photos"
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            multiple
            className={
              "block w-full text-sm text-bone/85 " +
              "file:mr-3 file:rounded-md file:border-0 file:bg-cobalt/15 file:px-3 file:py-1.5 " +
              "file:text-sm file:text-cobalt hover:file:bg-cobalt/25"
            }
          />
        </Field>

        <button
          type="submit"
          disabled={submitting}
          className="mt-2 inline-flex items-center justify-center rounded-md bg-cobalt px-5 py-3 text-sm font-medium tracking-wide text-bone transition hover:bg-cobalt/90 disabled:opacity-60"
        >
          {submitting ? "Submitting…" : "Submit report"}
        </button>
      </form>
    </>
  );
}

function QueuedConfirmation({
  queueCount,
  onRetry,
  draining,
}: {
  queueCount: number;
  onRetry: () => void;
  draining: boolean;
}) {
  return (
    <div className="flex flex-col gap-5">
      <div className="rounded-md border border-flare/40 bg-flare/10 px-4 py-4">
        <h2 className="text-lg font-semibold text-bone">
          Saved. We&apos;ll send it when you&apos;re back online.
        </h2>
        <p className="mt-2 text-sm text-bone/85">
          You&apos;re offline (or the server didn&apos;t respond). Your
          report and any photo are stored on this device. Reopen this
          page when you&apos;re back online and the queue will drain
          automatically.
        </p>
        <p className="mt-2 text-xs text-bone/55">
          Anonymous reports stay anonymous either way. Receipt codes
          appear on the standard thanks page once delivery completes.
        </p>
      </div>

      <div className="flex items-center justify-between rounded-md border border-bone/15 bg-ink/40 px-4 py-3 text-sm">
        <span className="text-bone/85">
          {queueCount} draft{queueCount === 1 ? "" : "s"} pending
          {draining ? " · retrying…" : ""}
        </span>
        <button
          type="button"
          onClick={onRetry}
          disabled={draining}
          className="rounded-md bg-cobalt px-3 py-1.5 text-xs uppercase tracking-[0.14em] text-bone hover:bg-cobalt/90 disabled:opacity-60"
        >
          Retry now
        </button>
      </div>
    </div>
  );
}

function Field({
  id,
  label,
  error,
  hint,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className={labelBase}>
        {label}
      </label>
      <div className="mt-1">{children}</div>
      {error ? (
        <p role="alert" className="mt-1 text-xs text-flare">
          {error}
        </p>
      ) : hint ? (
        <p className="mt-1 text-xs text-bone/45">{hint}</p>
      ) : null}
    </div>
  );
}

function fieldClass(base: string, error?: string): string {
  return base + " " + (error ? inputErr : inputOk);
}

function defaultLocalNow() {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 16);
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
