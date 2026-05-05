import { NextRequest } from "next/server";
import { getUserFromRequest } from "@/lib/auth/session";
import { addContributingFactor } from "@/lib/near-miss/store";
import { ContributingFactorType } from "@/shared/near-miss/constants";
import {
  isFactorType,
  LIMITS,
} from "@/shared/near-miss/validation";
import { badRequest, json, notFound, unauthorized } from "@/lib/api/responses";

export const dynamic = "force-dynamic";

interface Body {
  type?: string;
  note?: string;
}

/**
 * Append a contributing-factor note to a report. Bearer-auth — factors
 * are triage-internal and never exposed via the receipt-code path.
 */
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const user = getUserFromRequest(req);
  if (!user) return unauthorized();

  let body: Body;
  try {
    body = await req.json();
  } catch {
    return badRequest("Invalid JSON body");
  }

  const type = (body.type ?? "").trim();
  const note = (body.note ?? "").trim();

  if (!isFactorType(type)) return badRequest("Invalid factor type");
  if (note.length < LIMITS.factorNote.min || note.length > LIMITS.factorNote.max) {
    return badRequest(
      `Note must be ${LIMITS.factorNote.min}-${LIMITS.factorNote.max} characters`,
    );
  }

  const report = addContributingFactor(
    params.id,
    type as ContributingFactorType,
    note,
    user.name,
  );
  if (!report) return notFound("Report not found");
  return json({ report }, { status: 201 });
}
