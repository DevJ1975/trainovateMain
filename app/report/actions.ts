"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { addAttachment, createReport } from "@/lib/near-miss/store";
import {
  ALLOWED_PHOTO_TYPES,
  MAX_FILE_BYTES,
  MAX_FILES_PER_REPORT,
  writeUpload,
} from "@/lib/near-miss/storage";
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

type FieldKey =
  | "reporterName"
  | "occurredAt"
  | "locationText"
  | "hazardCategory"
  | "severityPotential"
  | "description"
  | "photos";

export type SubmitReportState = {
  fieldErrors?: Partial<Record<FieldKey, string>>;
  formError?: string;
};

function getString(fd: FormData, key: string): string {
  const v = fd.get(key);
  return typeof v === "string" ? v.trim() : "";
}

export async function submitReport(
  _prev: SubmitReportState,
  formData: FormData,
): Promise<SubmitReportState> {
  const fieldErrors: SubmitReportState["fieldErrors"] = {};

  const anonymous = formData.get("anonymous") === "on";
  const reporterName =
    getString(formData, "reporterName").slice(0, MAX_REPORTER_NAME) || null;
  const siteId = getString(formData, "siteId") || "plant-1";
  const locationText = getString(formData, "locationText");
  const description = getString(formData, "description");
  const hazardCategory = getString(formData, "hazardCategory");
  const severityPotential = getString(formData, "severityPotential");
  const occurredAtRaw = getString(formData, "occurredAt");

  if (!HAZARD_IDS.has(hazardCategory as HazardCategoryId)) {
    fieldErrors.hazardCategory = "Pick a category";
  }
  if (!SEVERITY_IDS.has(severityPotential as Severity)) {
    fieldErrors.severityPotential = "Pick a severity";
  }
  if (locationText.length < MIN_LOCATION) {
    fieldErrors.locationText = `At least ${MIN_LOCATION} characters`;
  } else if (locationText.length > MAX_LOCATION) {
    fieldErrors.locationText = `At most ${MAX_LOCATION} characters`;
  }
  if (description.length < MIN_DESCRIPTION) {
    fieldErrors.description = `At least ${MIN_DESCRIPTION} characters — describe what happened`;
  } else if (description.length > MAX_DESCRIPTION) {
    fieldErrors.description = `At most ${MAX_DESCRIPTION} characters`;
  }

  let occurredAt: string;
  try {
    occurredAt = parseOccurredAt(occurredAtRaw);
  } catch (err) {
    fieldErrors.occurredAt = (err as Error).message;
    occurredAt = new Date().toISOString();
  }

  const rawFiles = formData.getAll("photos");
  const photos: File[] = rawFiles
    .filter((f): f is File => f instanceof File && f.size > 0);

  if (photos.length > MAX_FILES_PER_REPORT) {
    fieldErrors.photos = `Up to ${MAX_FILES_PER_REPORT} photos`;
  }
  for (const f of photos) {
    if (!ALLOWED_PHOTO_TYPES.has(f.type)) {
      fieldErrors.photos = "Only JPG, PNG, WEBP, or GIF";
      break;
    }
    if (f.size > MAX_FILE_BYTES) {
      fieldErrors.photos = `Each photo must be under ${Math.round(MAX_FILE_BYTES / 1024 / 1024)}MB`;
      break;
    }
  }

  if (Object.keys(fieldErrors).length > 0) return { fieldErrors };

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

  for (const f of photos) {
    const buf = Buffer.from(await f.arrayBuffer());
    const stored = await writeUpload(buf, f.type);
    addAttachment(report.id, {
      kind: "photo",
      storageKey: stored.storageKey,
      contentType: stored.contentType,
      sizeBytes: stored.sizeBytes,
    });
  }

  revalidatePath("/safety/near-misses");
  redirect(`/report/thanks/${report.reference}`);
}

function parseOccurredAt(raw: string): string {
  const now = Date.now();
  if (!raw) return new Date(now).toISOString();
  const t = new Date(raw).getTime();
  if (!Number.isFinite(t)) throw new Error("Invalid date");
  if (t > now + 5 * 60_000) throw new Error("Can't be in the future");
  return new Date(t).toISOString();
}
