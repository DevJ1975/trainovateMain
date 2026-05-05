import { completeCorrectiveAction } from "@/lib/near-miss/store";
import type { NearMissReport } from "@/shared/near-miss/types";
import { Actor, fail, ok, UseCaseResult } from "./result";

export interface CompleteActionInput {
  reportId: string;
  actionId: string;
  actor: Actor;
}

export function completeReportCorrectiveAction(
  input: CompleteActionInput,
): UseCaseResult<NearMissReport> {
  if (!input.actionId) return fail(400, "actionId required");
  const report = completeCorrectiveAction(
    input.reportId,
    input.actionId,
    input.actor.name,
  );
  // Store returns undefined when the actionId belongs to a different
  // report or doesn't exist — both are 404 from the caller's view.
  if (!report) return fail(404, "Action not found on this report");
  return ok(report);
}
