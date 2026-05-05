import { NextRequest } from "next/server";
import { getReportByReceiptCode, listAttachments } from "@/lib/near-miss/store";
import { json, notFound } from "@/lib/api/responses";
import { enforce } from "@/lib/api/rate-limit";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: { code: string } },
) {
  // 30 lookups per minute per IP. The 8-char hex code space is ~4B
  // combos — IP throttling makes brute-force impractical even before
  // adding global ceilings.
  const limited = enforce(req, "by-code", 30, 60_000);
  if (limited) return limited;

  const code = decodeURIComponent(params.code);
  const report = getReportByReceiptCode(code);
  if (!report) return notFound("Code not recognized");

  // Anonymity guard: hide triage-internal events (contributing factors
  // and free-text comments may name people or contain working
  // assumptions). Mobile and web reporters get the same sanitized view.
  const safeReport = {
    ...report,
    contributingFactors: [],
    events: report.events.filter(
      (e) => e.kind !== "factor_added" && e.kind !== "commented",
    ),
  };
  return json({
    report: safeReport,
    attachments: listAttachments(report.id),
  });
}
