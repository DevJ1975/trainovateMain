/**
 * Mutation use-cases — single source of truth for validation +
 * store invocation per write op. Both server actions and HTTP routes
 * call into these; they stay thin adapters that resolve auth +
 * translate the result into their layer's response shape.
 *
 * Read paths (getReport, listReports, etc.) are still called
 * directly from store — there's no validation to dedupe.
 *
 * Add a new mutation:
 *   1. Drop a use-case file here that returns UseCaseResult<NearMissReport>.
 *   2. Use it from the action (`refreshFor + throw on !ok`) and from
 *      the HTTP route (`return error(r.status, r.error, r.fieldErrors)`).
 *   3. Add a unit test under lib/near-miss/use-cases/__tests__/.
 */

export type { Actor, UseCaseResult } from "./result";
export { ok, fail } from "./result";

export { changeReportStatus } from "./change-status";
export type { ChangeStatusInput } from "./change-status";

export { addReportFactor } from "./add-factor";
export type { AddFactorInput } from "./add-factor";

export { addReportCorrectiveAction } from "./add-action";
export type { AddActionInput } from "./add-action";

export { completeReportCorrectiveAction } from "./complete-action";
export type { CompleteActionInput } from "./complete-action";

export { addReportComment } from "./add-comment";
export type { AddCommentInput } from "./add-comment";
