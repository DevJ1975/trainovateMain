import { addCorrectiveAction } from "@/lib/near-miss/store";
import type { NearMissReport } from "@/shared/near-miss/types";
import { LIMITS } from "@/shared/near-miss/validation";
import { Actor, fail, ok, UseCaseResult } from "./result";

export interface AddActionInput {
  reportId: string;
  description: string;
  ownerName: string;
  /** ISO date string, or null/undefined for "no due date". */
  dueAt?: string | null;
  actor: Actor;
}

export function addReportCorrectiveAction(
  input: AddActionInput,
): UseCaseResult<NearMissReport> {
  const description = input.description.trim();
  const ownerName = input.ownerName.trim().slice(0, LIMITS.ownerName.max);

  if (
    description.length < LIMITS.actionDescription.min ||
    description.length > LIMITS.actionDescription.max
  ) {
    return fail(
      400,
      `Description must be ${LIMITS.actionDescription.min}-${LIMITS.actionDescription.max} characters`,
    );
  }
  if (ownerName.length < LIMITS.ownerName.min) {
    return fail(400, "Owner required");
  }

  let dueAt: string | null = null;
  if (input.dueAt) {
    const t = new Date(input.dueAt).getTime();
    if (!Number.isFinite(t)) return fail(400, "Invalid due date");
    dueAt = new Date(t).toISOString();
  }

  // Note: store auto-transitions report.status to "actioned" when the
  // current status is "new" or "triaged". That rule lives in the store
  // itself, intentionally — this use-case just hands the data through.
  const report = addCorrectiveAction(
    input.reportId,
    { description, ownerName, dueAt },
    input.actor.name,
  );
  if (!report) return fail(404, "Report not found");
  return ok(report);
}
