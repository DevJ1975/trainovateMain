import { NextRequest } from "next/server";
import { getUserFromRequest } from "@/lib/auth/session";
import { addReportComment } from "@/lib/near-miss/use-cases";
import { badRequest, error, json, unauthorized } from "@/lib/api/responses";

export const dynamic = "force-dynamic";

interface Body {
  text?: string;
}

export async function POST(
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

  const r = addReportComment({
    reportId: params.id,
    text: (body.text ?? "").trim(),
    actor: { name: user.name },
  });
  if (!r.ok) return error(r.status, r.error, r.fieldErrors ? { fieldErrors: r.fieldErrors } : undefined);
  return json({ report: r.value }, { status: 201 });
}
