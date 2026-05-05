import { NextRequest } from "next/server";
import { getUserFromRequest } from "@/lib/auth/session";
import { addReportCorrectiveAction } from "@/lib/near-miss/use-cases";
import { badRequest, error, json, unauthorized } from "@/lib/api/responses";

export const dynamic = "force-dynamic";

interface Body {
  description?: string;
  ownerName?: string;
  dueAt?: string | null;
}

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

  const r = addReportCorrectiveAction({
    reportId: params.id,
    description: (body.description ?? "").trim(),
    ownerName: (body.ownerName ?? "").trim(),
    dueAt: body.dueAt ?? null,
    actor: { name: user.name },
  });
  if (!r.ok) return error(r.status, r.error, r.fieldErrors ? { fieldErrors: r.fieldErrors } : undefined);
  return json({ report: r.value }, { status: 201 });
}
