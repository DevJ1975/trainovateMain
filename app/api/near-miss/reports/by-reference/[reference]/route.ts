import { getReportByReference } from "@/lib/near-miss/store";
import { json, notFound } from "@/lib/api/responses";

export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  { params }: { params: { reference: string } },
) {
  const ref = decodeURIComponent(params.reference);
  const report = getReportByReference(ref);
  if (!report) return notFound("Report not found");
  // Public route used by the post-submit thanks screen — only safe fields.
  return json({
    reference: report.reference,
    receiptCode: report.anonymous ? report.receiptCode : null,
    anonymous: report.anonymous,
    status: report.status,
    reportedAt: report.reportedAt,
  });
}
