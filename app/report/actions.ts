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

export async function submitReport(formData: FormData) {
  const anonymous = formData.get("anonymous") === "on";
  const reporterName = (formData.get("reporterName") as string | null)?.trim() || null;
  const siteId = (formData.get("siteId") as string | null)?.trim() || "plant-1";
  const locationText = (formData.get("locationText") as string | null)?.trim() || "";
  const description = (formData.get("description") as string | null)?.trim() || "";
  const hazardCategory = formData.get("hazardCategory") as string;
  const severityPotential = formData.get("severityPotential") as string;
  const occurredAtRaw = formData.get("occurredAt") as string | null;

  if (!HAZARD_IDS.has(hazardCategory as HazardCategoryId)) {
    throw new Error("Invalid hazard category");
  }
  if (!SEVERITY_IDS.has(severityPotential as Severity)) {
    throw new Error("Invalid severity");
  }
  if (locationText.length < 2) throw new Error("Location is required");
  if (description.length < 10) {
    throw new Error("Description must be at least 10 characters");
  }

  const occurredAt = occurredAtRaw
    ? new Date(occurredAtRaw).toISOString()
    : new Date().toISOString();

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
