import { NextRequest } from "next/server";
import { getUserFromRequest } from "@/lib/auth/session";
import { getReport, listAttachments } from "@/lib/near-miss/store";
import { json, notFound, unauthorized } from "@/lib/api/responses";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const user = await getUserFromRequest(req);
  if (!user) return unauthorized();

  const report = getReport(params.id);
  if (!report) return notFound("Report not found");
  const attachments = listAttachments(report.id);
  return json({ report, attachments });
}
