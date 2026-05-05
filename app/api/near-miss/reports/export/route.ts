import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth/session";
import {
  getReport,
  listAttachments,
  listReports,
} from "@/lib/near-miss/store";
import { hazardLabel, severityLabel } from "@/shared/near-miss/constants";
import { toCsv } from "@/lib/near-miss/csv";
import { unauthorized } from "@/lib/api/responses";

export const dynamic = "force-dynamic";

const HEADERS = [
  "reference",
  "reported_at",
  "occurred_at",
  "site_id",
  "status",
  "severity_potential",
  "hazard_category",
  "location_text",
  "anonymous",
  "reporter_name",
  "description",
  "contributing_factors",
  "open_actions",
  "done_actions",
  "overdue_actions",
  "attachments",
  "comments",
  "last_updated",
];

/**
 * Triage queue → CSV. Auth required (cookie or bearer). Produces an
 * RFC 4180 file safe for Excel / Google Sheets / pandas. One row per
 * report; child rollups (factor count, action counts, attachment
 * count, comment count) are pre-aggregated to keep the spreadsheet
 * usable without joins.
 */
export async function GET(req: NextRequest) {
  const user = getUserFromRequest(req);
  if (!user) return unauthorized();

  const summaries = listReports();
  const now = Date.now();
  const rows: (string | number | boolean | null | undefined)[][] = [];

  for (const s of summaries) {
    const r = getReport(s.id);
    if (!r) continue;
    const attachments = listAttachments(r.id);

    const open = r.correctiveActions.filter((a) => a.status !== "done");
    const done = r.correctiveActions.filter((a) => a.status === "done");
    const overdue = open.filter(
      (a) => a.dueAt && new Date(a.dueAt).getTime() < now,
    );
    const comments = r.events.filter((e) => e.kind === "commented").length;

    rows.push([
      r.reference,
      r.reportedAt,
      r.occurredAt,
      r.siteId,
      r.status,
      severityLabel(r.severityPotential),
      hazardLabel(r.hazardCategory),
      r.locationText,
      r.anonymous,
      r.anonymous ? "" : r.reporterName ?? "",
      r.description,
      r.contributingFactors.length,
      open.length,
      done.length,
      overdue.length,
      attachments.length,
      comments,
      r.updatedAt,
    ]);
  }

  const csv = toCsv(HEADERS, rows);
  const filename = `near-misses-${new Date().toISOString().slice(0, 10)}.csv`;

  return new NextResponse(csv, {
    status: 200,
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": `attachment; filename="${filename}"`,
      "cache-control": "no-store",
    },
  });
}
