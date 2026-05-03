"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Send, CheckCircle2 } from "lucide-react";
import {
  contactSchema,
  type ContactInput,
  industries,
  interests,
} from "@/lib/contact-schema";

const interestLabels: Record<(typeof interests)[number], string> = {
  "ehs-consulting": "EHS consulting",
  "soteria-platform": "Soteria platform",
  "federal-teaming": "Federal teaming",
  "training-development": "Training development",
  other: "Other",
};

const industryLabels: Record<(typeof industries)[number], string> = {
  manufacturing: "Manufacturing",
  logistics: "Logistics / Warehousing",
  aviation: "Aviation",
  energy: "Energy",
  cannabis: "Cannabis",
  "food-processing": "Food processing",
  "federal-dod": "Federal · DoD",
  "federal-va": "Federal · VA",
  other: "Other",
};

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: { interests: [], website: "" },
  });

  const onSubmit = async (data: ContactInput) => {
    setStatus("loading");
    setServerError(null);
    try {
      const r = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!r.ok) {
        const j = await r.json().catch(() => ({}));
        throw new Error(j.error || "Submission failed");
      }
      setStatus("success");
      reset();
    } catch (e: unknown) {
      setStatus("error");
      setServerError(e instanceof Error ? e.message : "Something went wrong");
    }
  };

  if (status === "success") {
    return (
      <div className="py-10 text-center" role="status" aria-live="polite">
        <CheckCircle2 className="text-signal mx-auto" size={40} />
        <h3 className="font-serif text-3xl text-bone mt-6 tracking-tight">
          Received.
        </h3>
        <p className="tnv-body mt-3">
          We respond within one business day. Often sooner.
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="tnv-btn-ghost mt-8"
        >
          Send another
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Field label="Name" error={errors.name?.message}>
          <input
            {...register("name")}
            type="text"
            autoComplete="name"
            className="tnv-input"
          />
        </Field>
        <Field label="Email" error={errors.email?.message}>
          <input
            {...register("email")}
            type="email"
            autoComplete="email"
            className="tnv-input"
          />
        </Field>
        <Field label="Organization" error={errors.org?.message}>
          <input
            {...register("org")}
            type="text"
            autoComplete="organization"
            className="tnv-input"
          />
        </Field>
        <Field label="Role" error={errors.role?.message}>
          <input
            {...register("role")}
            type="text"
            autoComplete="organization-title"
            className="tnv-input"
          />
        </Field>
        <Field label="Industry" className="md:col-span-2" error={errors.industry?.message}>
          <select {...register("industry")} className="tnv-input" defaultValue="">
            <option value="" disabled>
              Select industry
            </option>
            {industries.map((k) => (
              <option key={k} value={k}>
                {industryLabels[k]}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field label="Interest" error={errors.interests?.message}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {interests.map((k) => (
            <label
              key={k}
              className="flex items-center gap-3 px-4 py-3 border border-bone/15 hover:border-signal cursor-pointer transition-colors"
            >
              <input
                {...register("interests")}
                type="checkbox"
                value={k}
                className="accent-signal"
              />
              <span className="font-mono text-[11px] uppercase tracking-eyebrow text-bone/90">
                {interestLabels[k]}
              </span>
            </label>
          ))}
        </div>
      </Field>

      <label className="flex items-center gap-3 cursor-pointer">
        <input
          {...register("federal")}
          type="checkbox"
          className="accent-signal"
        />
        <span className="font-mono text-[11px] uppercase tracking-eyebrow text-fog">
          This is a federal opportunity
        </span>
      </label>

      <Field label="Message" error={errors.message?.message}>
        <textarea
          {...register("message")}
          rows={5}
          className="tnv-input min-h-[120px] resize-y"
          placeholder="Workforce size, current state, what you're trying to ship…"
        />
      </Field>

      {/* Honeypot */}
      <input
        {...register("website")}
        type="text"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
      />

      {serverError && (
        <div className="text-crimson font-mono text-[11px] uppercase tracking-eyebrow border border-crimson/40 px-4 py-3" role="alert">
          {serverError}
        </div>
      )}

      <div className="flex items-center justify-between gap-4">
        <p className="font-mono text-[10px] uppercase tracking-eyebrow text-fog">
          We never share or sell your information.
        </p>
        <button
          type="submit"
          disabled={status === "loading"}
          className="tnv-btn-signal disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send size={14} />
          {status === "loading" ? "Sending…" : "Send"}
        </button>
      </div>

      <style jsx>{`
        :global(.tnv-input) {
          width: 100%;
          background: rgba(5, 7, 10, 0.6);
          border: 1px solid rgba(232, 236, 241, 0.12);
          color: var(--tnv-bone);
          padding: 14px 16px;
          font-family: var(--font-inter-tight), system-ui, sans-serif;
          font-size: 15px;
          transition: border-color 0.2s ease;
          border-radius: 0;
        }
        :global(.tnv-input:hover) {
          border-color: rgba(232, 236, 241, 0.25);
        }
        :global(.tnv-input:focus) {
          outline: none;
          border-color: var(--tnv-signal);
        }
      `}</style>
    </form>
  );
}

function Field({
  label,
  children,
  error,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  error?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="font-mono text-[10px] uppercase tracking-eyebrow text-fog block mb-2">
        {label}
      </label>
      {children}
      {error && (
        <p className="mt-2 font-mono text-[10px] uppercase tracking-eyebrow text-crimson" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
