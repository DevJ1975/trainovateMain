/**
 * Dev-stub authentication is intentionally insecure: it accepts any
 * non-empty password for known emails so contributors can sign in without
 * an IdP. Real authentication (NextAuth backed by your customer's IdP)
 * lands in Phase 2.
 *
 * To stop the foot-gun where this leaks into production, every entry
 * point that uses the stub must call `assertDevAuthAllowed()` first.
 *
 * In production the stub is forbidden. To explicitly opt in (e.g. an
 * internal staging deploy), set `NM_ALLOW_DEV_AUTH=true`.
 */
export function assertDevAuthAllowed(): void {
  if (process.env.NODE_ENV !== "production") return;
  if (process.env.NM_ALLOW_DEV_AUTH === "true") return;
  throw new Error(
    "Dev-stub authentication is disabled in production. Wire up real auth " +
      "(NextAuth/Auth.js + your IdP) or set NM_ALLOW_DEV_AUTH=true to opt in " +
      "for a staging deploy.",
  );
}
