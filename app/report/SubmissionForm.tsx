"use client";

import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import {
  HAZARD_CATEGORIES,
  SEVERITY_LEVELS,
} from "@/lib/near-miss/types";
import { submitReport, SubmitReportState } from "./actions";

const inputBase =
  "w-full rounded-md border bg-ink/40 px-3 py-2 text-bone " +
  "placeholder:text-bone/30 focus:outline-none focus:ring-1";

const inputOk = "border-bone/15 focus:border-cobalt focus:ring-cobalt";
const inputErr = "border-flare/60 focus:border-flare focus:ring-flare";

const labelBase = "block text-xs uppercase tracking-[0.18em] text-bone/60";

const initialState: SubmitReportState = {};

export function SubmissionForm() {
  const [state, formAction] = useFormState(submitReport, initialState);
  const [anonymous, setAnonymous] = useState(false);
  const errs = state.fieldErrors ?? {};

  return (
    <form action={formAction} className="flex flex-col gap-5" noValidate>
      {state.formError && (
        <div
          role="alert"
          className="rounded-md border border-flare/50 bg-flare/10 px-3 py-2 text-sm text-flare"
        >
          {state.formError}
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
        <Field id="reporterName" label="Your name" error={errs.reporterName}>
          <input
            id="reporterName"
            name="reporterName"
            type="text"
            className={fieldClass(inputBase, errs.reporterName)}
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

        <Field id="occurredAt" label="When it happened" error={errs.occurredAt}>
          <input
            id="occurredAt"
            name="occurredAt"
            type="datetime-local"
            defaultValue={defaultLocalNow()}
            className={fieldClass(inputBase, errs.occurredAt)}
          />
        </Field>
      </div>

      <Field id="locationText" label="Location" error={errs.locationText}>
        <input
          id="locationText"
          name="locationText"
          type="text"
          className={fieldClass(inputBase, errs.locationText)}
          placeholder="e.g. Loading bay 3, near pallet stack"
        />
      </Field>

      <Field id="hazardCategory" label="Hazard category" error={errs.hazardCategory}>
        <select
          id="hazardCategory"
          name="hazardCategory"
          className={fieldClass(inputBase, errs.hazardCategory)}
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
        error={errs.severityPotential}
      >
        <select
          id="severityPotential"
          name="severityPotential"
          defaultValue="medium"
          className={fieldClass(inputBase, errs.severityPotential)}
        >
          {SEVERITY_LEVELS.map((s) => (
            <option key={s.id} value={s.id}>{s.label}</option>
          ))}
        </select>
      </Field>

      <Field id="description" label="What happened" error={errs.description}>
        <textarea
          id="description"
          name="description"
          rows={5}
          className={fieldClass(inputBase, errs.description) + " resize-y"}
          placeholder="Describe the sequence of events. Stick to facts."
        />
      </Field>

      <SubmitButton />
    </form>
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

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="mt-2 inline-flex items-center justify-center rounded-md bg-cobalt px-5 py-3 text-sm font-medium tracking-wide text-bone transition hover:bg-cobalt/90 disabled:opacity-60"
    >
      {pending ? "Submitting…" : "Submit report"}
    </button>
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
