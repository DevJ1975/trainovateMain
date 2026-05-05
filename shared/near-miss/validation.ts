import {
  CONTRIBUTING_FACTOR_TYPES,
  ContributingFactorType,
  HAZARD_CATEGORIES,
  HazardCategoryId,
  SEVERITY_LEVELS,
  Severity,
} from "./constants";

export const LIMITS = {
  description: { min: 10, max: 5_000 },
  location: { min: 2, max: 200 },
  reporterName: { max: 120 },
  factorNote: { min: 3, max: 1_000 },
  actionDescription: { min: 3, max: 1_000 },
  ownerName: { min: 1, max: 120 },
  comment: { min: 1, max: 5_000 },
  occurredAtFutureSkewMs: 5 * 60_000,
  attachmentsPerReport: 5,
  attachmentBytes: 10 * 1024 * 1024,
} as const;

export const ALLOWED_PHOTO_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
] as const;

export type CreateReportFieldKey =
  | "reporterName"
  | "occurredAt"
  | "locationText"
  | "hazardCategory"
  | "severityPotential"
  | "description";

export interface CreateReportInput {
  anonymous: boolean;
  reporterName?: string | null;
  siteId?: string;
  occurredAt?: string | null;
  locationText: string;
  hazardCategory: string;
  severityPotential: string;
  description: string;
}

export interface CreateReportFieldErrors {
  fieldErrors: Partial<Record<CreateReportFieldKey, string>>;
  parsedOccurredAt: string;
}

const HAZARD_IDS = new Set<string>(HAZARD_CATEGORIES.map((c) => c.id));
const SEVERITY_IDS = new Set<string>(SEVERITY_LEVELS.map((s) => s.id));
const FACTOR_TYPE_IDS = new Set<string>(
  CONTRIBUTING_FACTOR_TYPES.map((t) => t.id),
);

export function isHazardCategory(value: string): value is HazardCategoryId {
  return HAZARD_IDS.has(value);
}

export function isSeverity(value: string): value is Severity {
  return SEVERITY_IDS.has(value);
}

export function isFactorType(value: string): value is ContributingFactorType {
  return FACTOR_TYPE_IDS.has(value);
}

/**
 * Validates a create-report input. Returns field-level errors plus the
 * parsed occurredAt (defaults to now on missing/invalid). Pure — safe to
 * call from web server actions, mobile clients, or tests.
 */
export function validateCreateReport(
  input: CreateReportInput,
  nowMs: number = Date.now(),
): CreateReportFieldErrors {
  const fieldErrors: CreateReportFieldErrors["fieldErrors"] = {};

  if (!isHazardCategory(input.hazardCategory)) {
    fieldErrors.hazardCategory = "Pick a category";
  }
  if (!isSeverity(input.severityPotential)) {
    fieldErrors.severityPotential = "Pick a severity";
  }

  const loc = (input.locationText ?? "").trim();
  if (loc.length < LIMITS.location.min) {
    fieldErrors.locationText = `At least ${LIMITS.location.min} characters`;
  } else if (loc.length > LIMITS.location.max) {
    fieldErrors.locationText = `At most ${LIMITS.location.max} characters`;
  }

  const desc = (input.description ?? "").trim();
  if (desc.length < LIMITS.description.min) {
    fieldErrors.description = `At least ${LIMITS.description.min} characters`;
  } else if (desc.length > LIMITS.description.max) {
    fieldErrors.description = `At most ${LIMITS.description.max} characters`;
  }

  let parsedOccurredAt = new Date(nowMs).toISOString();
  if (input.occurredAt) {
    const t = new Date(input.occurredAt).getTime();
    if (!Number.isFinite(t)) {
      fieldErrors.occurredAt = "Invalid date";
    } else if (t > nowMs + LIMITS.occurredAtFutureSkewMs) {
      fieldErrors.occurredAt = "Can't be in the future";
    } else {
      parsedOccurredAt = new Date(t).toISOString();
    }
  }

  return { fieldErrors, parsedOccurredAt };
}
