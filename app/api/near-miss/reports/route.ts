import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth/session";
import { createReport, listReports } from "@/lib/near-miss/store";
import { validateCreateReport } from "@/shared/near-miss/validation";
import { HazardCategoryId, Severity } from "@/shared/near-miss/types";
import {
  badRequest,
  error,
  json,
  unauthorized,
} from "@/lib/api/responses";
import { enforce } from "@/lib/api/rate-limit";
import { readIdempotencyKey, withIdempotency } from "@/lib/api/idempotency";

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
  // 10 anonymous submissions per minute per IP. Real production should
  // run an additional bot-protection layer (Cloudflare Turnstile, hCaptcha)
  // since IP rate limiting alone won't stop a determined botnet.
  const limited = enforce(req, "submit", 10, 60_000);
  if (limited) return limited;

  // Read the body as text once so we can both parse it and hash it for
  // the dedupe cache.
  const rawBody = await req.text();
  let body: CreateBody;
  try {
    body = rawBody ? (JSON.parse(rawBody) as CreateBody) : {};
  } catch {
    return badRequest("Invalid JSON body");
  }

  const idempotencyKey = readIdempotencyKey(req);

  const outcome = await withIdempotency<{
    report: Awaited<ReturnType<typeof createReport>>;
    receiptCode: string | null;
  }>("submit-report", idempotencyKey, rawBody, async () => {
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
      return {
        status: 400,
        body: {
          // Cast to satisfy the generic; consumers see {error, fieldErrors}.
          report: undefined as never,
          receiptCode: null,
          error: "Validation failed",
          fieldErrors,
        } as unknown as { report: Awaited<ReturnType<typeof createReport>>; receiptCode: string | null },
      };
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

    // For anonymous reports we surface the receipt code here — once on
    // the fresh response, and replayed verbatim on subsequent identical
    // requests with the same Idempotency-Key.
    return {
      status: 201,
      body: {
        report,
        receiptCode: report.anonymous ? report.receiptCode : null,
      },
    };
  });

  if (outcome.kind === "conflict") {
    return error(
      409,
      "Idempotency-Key reuse with a different request body. Use a new key.",
    );
  }

  return NextResponse.json(outcome.body, {
    status: outcome.status,
    headers: outcome.kind === "replay" ? { "x-idempotent-replay": "true" } : {},
  });
}

export async function GET(req: NextRequest) {
  const user = getUserFromRequest(req);
  if (!user) return unauthorized();
  return json({ reports: listReports() });
}
