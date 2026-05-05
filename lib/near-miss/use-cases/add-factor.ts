import { addContributingFactor } from "@/lib/near-miss/store";
import { ContributingFactorType } from "@/shared/near-miss/constants";
import type { NearMissReport } from "@/shared/near-miss/types";
import { isFactorType, LIMITS } from "@/shared/near-miss/validation";
import { Actor, fail, ok, UseCaseResult } from "./result";

export interface AddFactorInput {
  reportId: string;
  type: string;
  note: string;
  actor: Actor;
}

export function addReportFactor(
  input: AddFactorInput,
): UseCaseResult<NearMissReport> {
  const note = input.note.trim();
  if (!isFactorType(input.type)) return fail(400, "Invalid factor type");
  if (note.length < LIMITS.factorNote.min || note.length > LIMITS.factorNote.max) {
    return fail(
      400,
      `Note must be ${LIMITS.factorNote.min}-${LIMITS.factorNote.max} characters`,
    );
  }
  const report = addContributingFactor(
    input.reportId,
    input.type as ContributingFactorType,
    note,
    input.actor.name,
  );
  if (!report) return fail(404, "Report not found");
  return ok(report);
}
