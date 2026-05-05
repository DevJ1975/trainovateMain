import { NextRequest } from "next/server";
import { getUserFromRequest } from "@/lib/auth/session";
import { createReport, listReports } from "@/lib/near-miss/store";
import { validateCreateReport } from "@/shared/near-miss/validation";
import { HazardCategoryId, Severity } from "@/shared/near-miss/types";
import {
  badRequest,
  json,
  unauthorized,
} from "@/lib/api/responses";

export const dynamic = "force-dynamic";

interface CreateBody {
  anonymous?: boolean;
  reporterName?: string | null;
  siteId?: string;
  occurredAt?: string | null;
  locationText?: string;
  hazardCategory?: string;
  severityPotential?: string;
  description?: string;
}

export async function POST(req: NextRequest) {
  let body: CreateBody;
  try {
    body = await req.json();
  } catch {
    return badRequest("Invalid JSON body");
  }

  const anonymous = !!body.anonymous;
  const input = {
    anonymous,
    reporterName: anonymous ? null : (body.reporterName ?? null),
    siteId: body.siteId,
    occurredAt: body.occurredAt ?? null,
    locationText: (body.locationText ?? "").trim(),
    hazardCategory: body.hazardCategory ?? "",
    severityPotential: body.severityPotential ?? "",
    description: (body.description ?? "").trim(),
  };

  const { fieldErrors, parsedOccurredAt } = validateCreateReport(input);
  if (Object.keys(fieldErrors).length > 0) {
    return badRequest("Validation failed", fieldErrors as Record<string, string>);
  }

  const report = createReport({
    siteId: input.siteId || "plant-1",
    reporterName: input.reporterName,
    anonymous: input.anonymous,
    occurredAt: parsedOccurredAt,
    locationText: input.locationText,
    hazardCategory: input.hazardCategory as HazardCategoryId,
    description: input.description,
    severityPotential: input.severityPotential as Severity,
  });

  // For anonymous reports we surface the receipt code once, here only — the
  // safety surface never returns it. After this response, the only way back
  // in is via /api/near-miss/reports/by-code/[code].
  return json(
    {
      report,
      receiptCode: report.anonymous ? report.receiptCode : null,
    },
    { status: 201 },
  );
}

export async function GET(req: NextRequest) {
  const user = getUserFromRequest(req);
  if (!user) return unauthorized();
  return json({ reports: listReports() });
}
