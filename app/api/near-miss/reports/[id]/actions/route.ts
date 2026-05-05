import { NextRequest } from "next/server";
import { getUserFromRequest } from "@/lib/auth/session";
import { addCorrectiveAction } from "@/lib/near-miss/store";
import { LIMITS } from "@/shared/near-miss/validation";
import { badRequest, json, notFound, unauthorized } from "@/lib/api/responses";

export const dynamic = "force-dynamic";

interface Body {
  description?: string;
  ownerName?: string;
  dueAt?: string | null;
}

/**
 * Add a corrective action. Bearer-auth — triage-only. The store
 * auto-transitions the report to "actioned" when the current status is
 * "new" or "triaged"; this route doesn't override that behavior.
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

  const description = (body.description ?? "").trim();
  const ownerName = (body.ownerName ?? "").trim().slice(0, LIMITS.ownerName.max);

  if (
    description.length < LIMITS.actionDescription.min ||
    description.length > LIMITS.actionDescription.max
  ) {
    return badRequest(
      `Description must be ${LIMITS.actionDescription.min}-${LIMITS.actionDescription.max} characters`,
    );
  }
  if (ownerName.length < LIMITS.ownerName.min) {
    return badRequest("Owner required");
  }

  let dueAt: string | null = null;
  if (body.dueAt) {
    const t = new Date(body.dueAt).getTime();
    if (!Number.isFinite(t)) return badRequest("Invalid due date");
    dueAt = new Date(t).toISOString();
  }

  const report = addCorrectiveAction(
    params.id,
    { description, ownerName, dueAt },
    user.name,
  );
  if (!report) return notFound("Report not found");
  return json({ report }, { status: 201 });
}
