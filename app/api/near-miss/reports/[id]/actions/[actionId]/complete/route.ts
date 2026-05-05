import { NextRequest } from "next/server";
import { getUserFromRequest } from "@/lib/auth/session";
import { completeReportCorrectiveAction } from "@/lib/near-miss/use-cases";
import { error, json, unauthorized } from "@/lib/api/responses";

export const dynamic = "force-dynamic";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string; actionId: string } },
) {
  const user = await getUserFromRequest(req);
  if (!user) return unauthorized();

  const r = completeReportCorrectiveAction({
    reportId: params.id,
    actionId: params.actionId,
    actor: { name: user.name },
  });
  if (!r.ok) return error(r.status, r.error);
  return json({ report: r.value });
}
