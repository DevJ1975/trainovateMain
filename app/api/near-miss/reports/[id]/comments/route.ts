import { NextRequest } from "next/server";
import { getUserFromRequest } from "@/lib/auth/session";
import { addComment } from "@/lib/near-miss/store";
import { LIMITS } from "@/shared/near-miss/validation";
import { badRequest, json, notFound, unauthorized } from "@/lib/api/responses";

export const dynamic = "force-dynamic";

interface Body {
  text?: string;
}

/**
 * Append a triage comment to a report. Bearer-auth — comments are
 * triage-internal, never exposed to anonymous reporters via the
 * receipt-code path.
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

  const text = (body.text ?? "").trim();
  if (text.length < LIMITS.comment.min || text.length > LIMITS.comment.max) {
    return badRequest(
      `Comment must be ${LIMITS.comment.min}-${LIMITS.comment.max} characters`,
    );
  }

  const report = addComment(params.id, text, user.name);
  if (!report) return notFound("Report not found");
  return json({ report }, { status: 201 });
}
