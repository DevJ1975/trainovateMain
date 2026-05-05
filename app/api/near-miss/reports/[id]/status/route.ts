import { NextRequest } from "next/server";
import { getUserFromRequest } from "@/lib/auth/session";
import { setStatus } from "@/lib/near-miss/store";
import { REPORT_STATUSES, ReportStatus } from "@/shared/near-miss/constants";
import { badRequest, json, notFound, unauthorized } from "@/lib/api/responses";

export const dynamic = "force-dynamic";

const STATUSES = new Set<string>(REPORT_STATUSES);

interface Body {
  status?: string;
}

/**
 * Triage status transition. Bearer-auth (cookie also works since
 * getUserFromRequest accepts both). Idempotent — setStatus is a no-op
 * when the requested status equals the current one.
 */
export async function PATCH(
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

  const status = (body.status ?? "").trim();
  if (!STATUSES.has(status)) {
    return badRequest(
      `Invalid status — must be one of ${REPORT_STATUSES.join(", ")}`,
    );
  }

  const report = setStatus(params.id, status as ReportStatus, user.name);
  if (!report) return notFound("Report not found");
  return json({ report });
}
