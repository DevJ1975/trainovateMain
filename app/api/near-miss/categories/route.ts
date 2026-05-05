import {
  CONTRIBUTING_FACTOR_TYPES,
  HAZARD_CATEGORIES,
  REPORT_STATUSES,
  SEVERITY_LEVELS,
} from "@/shared/near-miss/constants";
import { LIMITS, ALLOWED_PHOTO_TYPES } from "@/shared/near-miss/validation";
import { json } from "@/lib/api/responses";

export const dynamic = "force-static";

export async function GET() {
  return json({
    hazardCategories: HAZARD_CATEGORIES,
    severityLevels: SEVERITY_LEVELS,
    reportStatuses: REPORT_STATUSES,
    contributingFactorTypes: CONTRIBUTING_FACTOR_TYPES,
    limits: LIMITS,
    allowedPhotoTypes: ALLOWED_PHOTO_TYPES,
  });
}
