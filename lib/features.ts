/**
 * Centralized feature-flag layer for the near-miss module.
 *
 * Every flag defaults to **ON** because the modules already shipped.
 * To disable one in a deploy, set the corresponding env var to "false"
 * (or "0" / "off" / "no") — no code changes needed:
 *
 *   NM_FEATURE_COMMENTS=false           # turn off triage comments
 *   NM_FEATURE_CSV_EXPORT=false         # turn off the CSV download
 *   NM_FEATURE_IDEMPOTENCY=false        # turn off Idempotency-Key cache
 *   NM_FEATURE_OVERDUE_CRON=false       # disable the overdue notifier
 *   NM_FEATURE_WEB_OFFLINE_QUEUE=false  # web reverts to online-only submit
 *   NM_FEATURE_MOBILE_OFFLINE_QUEUE=false  # advisory; mobile reads from /api/features
 *   NM_FEATURE_PHOTO_ATTACHMENTS=false  # disable upload + display
 *
 * Some features are already implicitly toggled by other env vars and
 * have no separate flag here:
 *   - Slack notifications: NEAR_MISS_SLACK_WEBHOOK_URL
 *   - Magic-link login: RESEND_API_KEY + AUTH_RESEND_FROM
 *   - Dev-credentials login: NM_ALLOW_DEV_AUTH
 *   - S3 storage / signed uploads: NEAR_MISS_STORAGE=s3
 *
 * Lazy-evaluated and cached at process startup — flipping a flag
 * requires a restart. A future iteration could swap this for a
 * config table + admin UI for runtime toggling without redeploy.
 */

interface FeatureFlags {
  comments: boolean;
  csvExport: boolean;
  idempotency: boolean;
  overdueCron: boolean;
  webOfflineQueue: boolean;
  mobileOfflineQueue: boolean;
  photoAttachments: boolean;
}

const TRUTHY = new Set(["1", "true", "yes", "on"]);
const FALSY = new Set(["0", "false", "no", "off"]);

function readBool(envVar: string, defaultValue: boolean): boolean {
  const raw = process.env[envVar]?.trim().toLowerCase();
  if (!raw) return defaultValue;
  if (TRUTHY.has(raw)) return true;
  if (FALSY.has(raw)) return false;
  // Unknown value — log once and use the default. Don't throw; bad env
  // shouldn't crash the app, only mis-toggle quietly.
  console.warn(
    `[features] ${envVar}=${raw} is not a boolean; using default ${defaultValue}`,
  );
  return defaultValue;
}

let cached: FeatureFlags | null = null;

export function features(): FeatureFlags {
  if (cached) return cached;
  cached = {
    comments: readBool("NM_FEATURE_COMMENTS", true),
    csvExport: readBool("NM_FEATURE_CSV_EXPORT", true),
    idempotency: readBool("NM_FEATURE_IDEMPOTENCY", true),
    overdueCron: readBool("NM_FEATURE_OVERDUE_CRON", true),
    webOfflineQueue: readBool("NM_FEATURE_WEB_OFFLINE_QUEUE", true),
    mobileOfflineQueue: readBool("NM_FEATURE_MOBILE_OFFLINE_QUEUE", true),
    photoAttachments: readBool("NM_FEATURE_PHOTO_ATTACHMENTS", true),
  };
  return cached;
}

/** The subset of flags safe to expose to clients (mobile / browser). */
export function publicFeatures() {
  const f = features();
  return {
    comments: f.comments,
    csvExport: f.csvExport,
    webOfflineQueue: f.webOfflineQueue,
    mobileOfflineQueue: f.mobileOfflineQueue,
    photoAttachments: f.photoAttachments,
  };
}

export type PublicFeatures = ReturnType<typeof publicFeatures>;

/** For tests — drop the cache. */
export function _resetFeatures(): void {
  cached = null;
}
