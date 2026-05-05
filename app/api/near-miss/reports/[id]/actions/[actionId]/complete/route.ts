import { NextRequest } from "next/server";
import { getUserFromRequest } from "@/lib/auth/session";
import { completeCorrectiveAction } from "@/lib/near-miss/store";
import { json, notFound, unauthorized } from "@/lib/api/responses";

export const dynamic = "force-dynamic";

/**
 * Mark a corrective action done. Bearer-auth. Idempotent —
 * completeCorrectiveAction skips already-done actions and refuses
 * cross-report action_id mismatches (returns notFound here).
 */
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string; actionId: string } },
) {
  const user = getUserFromRequest(req);
  if (!user) return unauthorized();

  const report = completeCorrectiveAction(params.id, params.actionId, user.name);
  if (!report) return notFound("Action not found on this report");
  return json({ report });
}
