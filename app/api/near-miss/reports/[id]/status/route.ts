import { NextRequest } from "next/server";
import { getUserFromRequest } from "@/lib/auth/session";
import { changeReportStatus } from "@/lib/near-miss/use-cases";
import { badRequest, error, json, unauthorized } from "@/lib/api/responses";

export const dynamic = "force-dynamic";

interface Body {
  status?: string;
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const user = await getUserFromRequest(req);
  if (!user) return unauthorized();

  let body: Body;
  try {
    body = await req.json();
  } catch {
    return badRequest("Invalid JSON body");
  }

  const r = changeReportStatus({
    reportId: params.id,
    status: (body.status ?? "").trim(),
    actor: { name: user.name },
  });
  if (!r.ok) return error(r.status, r.error, r.fieldErrors ? { fieldErrors: r.fieldErrors } : undefined);
  return json({ report: r.value });
}
