import { getReportByReceiptCode, listAttachments } from "@/lib/near-miss/store";
import { json, notFound } from "@/lib/api/responses";

export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  { params }: { params: { code: string } },
) {
  const code = decodeURIComponent(params.code);
  const report = getReportByReceiptCode(code);
  if (!report) return notFound("Code not recognized");

  // Anonymity guard: hide triage-internal contributing factors. Mobile and
  // web reporters get the same sanitized view.
  const safeReport = {
    ...report,
    contributingFactors: [],
    events: report.events.filter((e) => e.kind !== "factor_added"),
  };
  return json({
    report: safeReport,
    attachments: listAttachments(report.id),
  });
}
