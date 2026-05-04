"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createReport } from "@/lib/near-miss/store";
import {
  HAZARD_CATEGORIES,
  HazardCategoryId,
  SEVERITY_LEVELS,
  Severity,
} from "@/lib/near-miss/types";

const HAZARD_IDS = new Set(HAZARD_CATEGORIES.map((c) => c.id));
const SEVERITY_IDS = new Set(SEVERITY_LEVELS.map((s) => s.id));

const MIN_DESCRIPTION = 10;
const MAX_DESCRIPTION = 5_000;
const MIN_LOCATION = 2;
const MAX_LOCATION = 200;
const MAX_REPORTER_NAME = 120;

function getString(fd: FormData, key: string): string {
  const v = fd.get(key);
  return typeof v === "string" ? v.trim() : "";
}

export async function submitReport(formData: FormData) {
  const anonymous = formData.get("anonymous") === "on";
  const reporterName = getString(formData, "reporterName").slice(0, MAX_REPORTER_NAME) || null;
  const siteId = getString(formData, "siteId") || "plant-1";
  const locationText = getString(formData, "locationText");
  const description = getString(formData, "description");
  const hazardCategory = getString(formData, "hazardCategory");
  const severityPotential = getString(formData, "severityPotential");
  const occurredAtRaw = getString(formData, "occurredAt");

  if (!HAZARD_IDS.has(hazardCategory as HazardCategoryId)) {
    throw new Error("Invalid hazard category");
  }
  if (!SEVERITY_IDS.has(severityPotential as Severity)) {
    throw new Error("Invalid severity");
  }
  if (locationText.length < MIN_LOCATION || locationText.length > MAX_LOCATION) {
    throw new Error(`Location must be ${MIN_LOCATION}-${MAX_LOCATION} characters`);
  }
  if (description.length < MIN_DESCRIPTION || description.length > MAX_DESCRIPTION) {
    throw new Error(
      `Description must be ${MIN_DESCRIPTION}-${MAX_DESCRIPTION} characters`,
    );
  }

  const occurredAt = parseOccurredAt(occurredAtRaw);

  const report = createReport({
    siteId,
    reporterName: anonymous ? null : reporterName,
    anonymous,
    occurredAt,
    locationText,
    hazardCategory: hazardCategory as HazardCategoryId,
    description,
    severityPotential: severityPotential as Severity,
  });

  revalidatePath("/safety/near-misses");
  redirect(`/report/thanks/${report.reference}`);
}

function parseOccurredAt(raw: string): string {
  const now = Date.now();
  if (!raw) return new Date(now).toISOString();
  const t = new Date(raw).getTime();
  if (!Number.isFinite(t)) throw new Error("Invalid occurred-at date");
  // Allow up to 5 minutes of clock skew; reject anything else in the future.
  if (t > now + 5 * 60_000) throw new Error("Occurred-at can't be in the future");
  return new Date(t).toISOString();
}
