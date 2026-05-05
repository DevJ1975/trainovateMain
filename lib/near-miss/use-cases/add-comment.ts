import { addComment } from "@/lib/near-miss/store";
import type { NearMissReport } from "@/shared/near-miss/types";
import { LIMITS } from "@/shared/near-miss/validation";
import { Actor, fail, ok, UseCaseResult } from "./result";

export interface AddCommentInput {
  reportId: string;
  text: string;
  actor: Actor;
}

export function addReportComment(
  input: AddCommentInput,
): UseCaseResult<NearMissReport> {
  const text = input.text.trim();
  if (text.length < LIMITS.comment.min || text.length > LIMITS.comment.max) {
    return fail(
      400,
      `Comment must be ${LIMITS.comment.min}-${LIMITS.comment.max} characters`,
    );
  }
  const report = addComment(input.reportId, text, input.actor.name);
  if (!report) return fail(404, "Report not found");
  return ok(report);
}
