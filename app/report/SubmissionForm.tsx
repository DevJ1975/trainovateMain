"use client";

import { useState } from "react";
import {
  HAZARD_CATEGORIES,
  SEVERITY_LEVELS,
} from "@/lib/near-miss/types";
import { submitReport } from "./actions";

const inputBase =
  "w-full rounded-md border border-bone/15 bg-ink/40 px-3 py-2 text-bone " +
  "placeholder:text-bone/30 focus:border-cobalt focus:outline-none focus:ring-1 focus:ring-cobalt";

const labelBase = "block text-xs uppercase tracking-[0.18em] text-bone/60";

export function SubmissionForm() {
  const [anonymous, setAnonymous] = useState(false);
  const [pending, setPending] = useState(false);

  return (
    <form
      action={async (fd) => {
        setPending(true);
        try {
          await submitReport(fd);
        } finally {
          setPending(false);
        }
      }}
      className="flex flex-col gap-5"
    >
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
        <div>
          <label htmlFor="reporterName" className={labelBase}>Your name</label>
          <input id="reporterName" name="reporterName" type="text" className={inputBase + " mt-1"} placeholder="Optional" />
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="siteId" className={labelBase}>Site</label>
          <select id="siteId" name="siteId" defaultValue="plant-1" className={inputBase + " mt-1"}>
            <option value="plant-1">Plant 1</option>
            <option value="plant-2">Plant 2</option>
            <option value="warehouse-a">Warehouse A</option>
          </select>
        </div>

        <div>
          <label htmlFor="occurredAt" className={labelBase}>When it happened</label>
          <input
            id="occurredAt"
            name="occurredAt"
            type="datetime-local"
            defaultValue={defaultLocalNow()}
            className={inputBase + " mt-1"}
          />
        </div>
      </div>

      <div>
        <label htmlFor="locationText" className={labelBase}>Location</label>
        <input
          id="locationText"
          name="locationText"
          type="text"
          required
          minLength={2}
          className={inputBase + " mt-1"}
          placeholder="e.g. Loading bay 3, near pallet stack"
        />
      </div>

      <div>
        <label htmlFor="hazardCategory" className={labelBase}>Hazard category</label>
        <select id="hazardCategory" name="hazardCategory" required className={inputBase + " mt-1"}>
          {HAZARD_CATEGORIES.map((c) => (
            <option key={c.id} value={c.id}>{c.label}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="severityPotential" className={labelBase}>Severity potential</label>
        <select id="severityPotential" name="severityPotential" required defaultValue="medium" className={inputBase + " mt-1"}>
          {SEVERITY_LEVELS.map((s) => (
            <option key={s.id} value={s.id}>{s.label}</option>
          ))}
        </select>
        <p className="mt-1 text-xs text-bone/45">What was the worst plausible outcome?</p>
      </div>

      <div>
        <label htmlFor="description" className={labelBase}>What happened</label>
        <textarea
          id="description"
          name="description"
          required
          minLength={10}
          rows={5}
          className={inputBase + " mt-1 resize-y"}
          placeholder="Describe the sequence of events. Stick to facts."
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="mt-2 inline-flex items-center justify-center rounded-md bg-cobalt px-5 py-3 text-sm font-medium tracking-wide text-bone transition hover:bg-cobalt/90 disabled:opacity-60"
      >
        {pending ? "Submitting…" : "Submit report"}
      </button>
    </form>
  );
}

function defaultLocalNow() {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 16);
}
