import { setStatus } from "@/lib/near-miss/store";
import {
  REPORT_STATUSES,
  ReportStatus,
} from "@/shared/near-miss/constants";
import type { NearMissReport } from "@/shared/near-miss/types";
import { Actor, fail, ok, UseCaseResult } from "./result";

const STATUSES = new Set<string>(REPORT_STATUSES);

export interface ChangeStatusInput {
  reportId: string;
  status: string;
  actor: Actor;
}

export function changeReportStatus(
  input: ChangeStatusInput,
): UseCaseResult<NearMissReport> {
  if (!STATUSES.has(input.status)) {
    return fail(
      400,
      `Invalid status — must be one of ${REPORT_STATUSES.join(", ")}`,
    );
  }
  const report = setStatus(
    input.reportId,
    input.status as ReportStatus,
    input.actor.name,
  );
  if (!report) return fail(404, "Report not found");
  return ok(report);
}
