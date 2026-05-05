/**
 * Use-case result type. Mutations return one of:
 *   - { ok: true, value }                     — happy path
 *   - { ok: false, status, error, fieldErrors? } — typed failure
 *
 * Returning instead of throwing lets both server-action and HTTP-route
 * adapters consume the same use-case without try/catch dance:
 *
 *   const r = addReportComment({...});
 *   if (!r.ok) return badRequest(r.error, r.fieldErrors);   // route
 *   if (!r.ok) throw new Error(r.error);                    // action
 */

export type UseCaseResult<T> =
  | { ok: true; value: T }
  | {
      ok: false;
      status: number;
      error: string;
      fieldErrors?: Record<string, string>;
    };

export const ok = <T>(value: T): UseCaseResult<T> => ({ ok: true, value });

export const fail = <T = never>(
  status: number,
  error: string,
  fieldErrors?: Record<string, string>,
): UseCaseResult<T> => ({ ok: false, status, error, fieldErrors });

/** A user identity threaded through use-cases — name lands in audit-log actorName. */
export interface Actor {
  name: string;
}
