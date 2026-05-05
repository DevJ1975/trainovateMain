# Changelog

All notable changes to the **near-miss reporting module** are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).
Marketing-site changes (CinematicBanner, /podcast, /industries, etc.) are
tracked separately in git history and intentionally excluded — this file is
the handoff doc for the safety module specifically.

## How to extend this file

When you ship a meaningful change to the near-miss module, add a row under
the relevant top-level section in **`[Unreleased]`**. When the team cuts a
release, rename `[Unreleased]` to the version (semver against the safety
module, not the parent site) and start a new `[Unreleased]` block.

Categories per the standard:

- **Added** — new endpoints, screens, fields, env vars
- **Changed** — non-breaking behavior changes
- **Deprecated** — slated for removal
- **Removed** — gone; document the migration path
- **Fixed** — bug fixes (call out the symptom + the file/line)
- **Security** — auth, secrets, validation, rate limiting

For each entry, prefer the form: _what changed_ · _why_ · _how a developer
verifies it_. Don't paste commit SHAs into the body — the section heading
plus `git log` is enough to reach the diff. Link new env vars to
`.env.example` and new endpoints to the file path.

---

## [Unreleased]

_Nothing yet._

---

## 2026-05-05 — Tier 2: triage comment thread

### Added

- **Free-text triage comments.** Safety team can post comments on a
  report from `/safety/near-misses/[id]` ("Comments" section between
  "Corrective actions" and the activity log). Comments are stored as
  `report_events` with `kind="commented"` and `payload.text` — no new
  table, audit-log invariants preserved.
- **Server action**: `addCommentAction(id, formData)` in
  `app/safety/near-misses/[id]/actions.ts`. Threads `actorName()` from
  the session, so the comment author is the signed-in user.
- **HTTP API**: `POST /api/near-miss/reports/[id]/comments` (bearer
  auth). Body: `{ text: string }`. Returns the refreshed report.
  Mobile triage will use this once the rest of the write surface
  lands.
- **Shared API client**: `api.addComment(reportId, text)` in
  `shared/near-miss/api.ts`.
- New limit in `shared/near-miss/validation.ts`: `LIMITS.comment` =
  `{ min: 1, max: 5000 }`.

### Changed

- **Anonymity guard tightened.** `commented` events join `factor_added`
  on the deny-list for the receipt-code anonymous lookup, in both
  `app/report/status/[code]/page.tsx` and the
  `GET /api/near-miss/reports/by-code/[code]` API route. Triage chatter
  may name people or contain working assumptions — reporters never see
  it.

### Tested

- 3 new store tests (`addComment` appends event; rejects unknown
  report id; preserves multi-comment ordering). 45 tests across 4
  suites passing.
- End-to-end smoke: 401 without auth; 400 on empty body; 201 + text +
  actor surface on triage detail; zero comments visible to code
  holders, no text leak.

---

## 2026-05-05 — Tier 2: overdue-action nudges

### Added

- **Overdue corrective-action nudges** (`lib/near-miss/cron/notify-overdue.ts`).
  Scans for `corrective_actions` where `status = 'open'` and `due_at < now`,
  dispatches one `action_overdue` event per action through the existing
  notification dispatcher.
- **`GET|POST /api/cron/overdue`** — runs the scan. Authentication:
  - On Vercel Cron: trusted via the platform-injected `x-vercel-cron`
    header. Vercel won't proxy this header from external requests.
  - Anywhere else: `Authorization: Bearer <CRON_SECRET>`. **Required**
    in production — without `CRON_SECRET` set, the route refuses all
    non-Vercel calls (under `NODE_ENV=production`).
- **`vercel.json` cron schedule** — runs hourly (`0 * * * *`). Adjust the
  cron expression there.
- **`npm run cron:overdue`** — local-dev shortcut that curls the route
  with `$CRON_SECRET` against `${CRON_URL:-http://localhost:3000}`. For
  production-grade self-hosted ops, point any cron runner (systemd
  timer, GitHub Actions schedule, traditional crontab) at the same URL
  with the bearer header.
- **Slack channel** renders `action_overdue` as a red-rotating-light
  header with owner, original due date, hours-overdue summary, and a
  danger-styled "Open report" button. Always escalates regardless of
  the underlying report's severity.
- **Console channel** logs `[notify] {ref}: OVERDUE {h}h — "{desc}"`.
- New event kind: `action_overdue` in
  `shared/near-miss/types.ts → ReportEventKind` (also flows through the
  `NotificationEvent` union with payload `{ actionId, ownerName,
  description, dueAt, hoursOverdue }`).
- New env var (see `.env.example`): `CRON_SECRET`.

### Changed

- `corrective_actions` table gained `last_overdue_notified_at` (nullable
  text) plus an `(status, due_at)` composite index for the scan query.
  Migration: `drizzle/0002_jazzy_pestilence.sql`. Backwards-compatible —
  existing rows have NULL and notify on the next cron pass.
- The `CorrectiveAction` row type in
  `lib/near-miss/db/schema.ts` reflects the new column. **Not exposed**
  in the public/mobile `CorrectiveAction` shape (`shared/near-miss/types.ts`)
  because reporters don't need to see it. If you ever surface it, scrub
  it from the receipt-code page response in
  `app/report/status/[code]/page.tsx`.

### Behavior notes

- **Idempotency** is handled in `findOverdueActions(now, cooldownMs)` —
  default cooldown 20h. An hourly cron will only re-notify a
  still-overdue action once per ~24h instead of every hour.
- Notifications fire **per action**, not per report. A single report
  with 3 overdue actions produces 3 Slack messages.
- The cron handler returns `{ ok, scanned, notified, notifiedIds }` so
  observability tools can graph notification volume over time.

### Tested

- 9 new unit tests in `lib/near-miss/cron/notify-overdue.test.ts` and
  `lib/near-miss/notification-channels/slack.test.ts` cover: open
  past-due actions surface; future or null `due_at` skipped; completed
  actions skipped; cooldown respected; second run within cooldown is a
  no-op; Slack `shouldHandle` always passes overdue regardless of
  severity; payload uses rotating-light + danger-button styling.
- End-to-end smoke (in this commit's verification): cron route refuses
  without auth (401), trusts `x-vercel-cron` header (200), accepts
  correct bearer (200), idempotency cooldown drops second run to 0.

---

## 2026-05-05 — Tier 2: notification channels

### Added

- **Slack notification channel.** `lib/near-miss/notification-channels/slack.ts`
  POSTs Block Kit messages to a Slack incoming webhook for high/critical
  `report_created` events (severity floor configurable) and every
  `status_changed` transition. Auto-registers when
  `NEAR_MISS_SLACK_WEBHOOK_URL` is set; skipped under `VITEST`. 2-second
  `AbortController` timeout — slow Slack ≠ slow user response. Send
  failures swallowed by the dispatcher; Slack outage never breaks a
  report write.
- New env vars (see `.env.example`):
  - `NEAR_MISS_SLACK_WEBHOOK_URL`
  - `NEAR_MISS_SLACK_MIN_SEVERITY` (default `high`)
  - `NEAR_MISS_PUBLIC_BASE_URL` (used to build "Open report" deep-link
    buttons in Slack messages; falls back to `NEXT_PUBLIC_SITE_URL`)

### Tested

- 13 new unit tests in `lib/near-miss/notification-channels/slack.test.ts`
  cover `formatPayload` (anonymity masking, button styles, link
  omission, long-description truncation) and `shouldHandle` (severity
  floor, status pass-through, action_assigned exclusion).

---

## 2026-05-05 — Tier 1: production hardening

### Security

- **`SESSION_SECRET` is now lazily resolved per request** in
  `lib/auth/session.ts` and refuses to fall back to the dev value in
  production (`NODE_ENV=production` outside `NEXT_PHASE=phase-production-build`
  throws). Minimum length is 32 chars. Both the web cookie session and
  the mobile bearer token are signed with this secret.
- **Dev-stub authentication is gated.** `assertDevAuthAllowed()` in
  `lib/auth/dev-stub.ts` throws in production unless
  `NM_ALLOW_DEV_AUTH=true` is set. Both `/login` server action and
  `POST /api/auth/token` call it before issuing sessions.
- **Rate limiting** (in-process token-bucket, `lib/api/rate-limit.ts`) on
  the three public endpoints:
  - `POST /api/near-miss/reports` — 10/min/IP
  - `GET /api/near-miss/reports/by-code/[code]` — 30/min/IP
  - `POST /api/auth/token` — 5/min/IP
  Returns `429` with `Retry-After`. **Single-instance only** — for
  multi-instance deploys, swap `consume()` for an Upstash/Redis
  pipeline behind the same interface.

### Added

- **S3 storage provider.** `lib/near-miss/storage/s3.ts` implements the
  `StorageProvider` interface with presigned-URL uploads/downloads via
  `@aws-sdk/client-s3`. Selected via `NEAR_MISS_STORAGE=s3`.
- **Two-step client-direct upload flow** for production where
  serverless body-size limits (Vercel: 4.5MB) make the multipart proxy
  path infeasible:
  - `POST /api/near-miss/reports/[id]/attachments/sign` — returns a
    presigned PUT URL (501 on local-FS storage, by design)
  - `POST /api/near-miss/reports/[id]/attachments/confirm` — verifies
    the actual stored object via `HEAD` before persisting (clients can
    lie in the request body, S3 can't)
- `GET /api/attachments/[id]` now 302s to a short-lived presigned GET
  URL when on S3.
- Shared API client gained `api.signedUploadPhoto()` that does the full
  sign → PUT → confirm dance and returns null on local-mode servers
  (so mobile/web can fall back to `api.uploadPhoto()`).
- New env vars (see `.env.example`):
  - `NEAR_MISS_STORAGE`, `NEAR_MISS_S3_BUCKET`, `NEAR_MISS_S3_REGION`,
    `NEAR_MISS_S3_PREFIX`
  - Optional: `NEAR_MISS_S3_ACCESS_KEY_ID`,
    `NEAR_MISS_S3_SECRET_ACCESS_KEY`, `NEAR_MISS_S3_ENDPOINT` (for
    MinIO / R2)

### Tested

- Vitest harness (`vitest.config.mts`) with 15 store invariant tests in
  `lib/near-miss/store.test.ts` and 4 rate-limit tests. Each test runs
  against a fresh on-disk SQLite tempfile; the holder pinned to
  `globalThis` is reset in place per test (`__test-utils__/fresh-store.ts`).
  Run with `npm test` or `npm run test:watch`.

### CI

- **GitHub Actions workflow** at `.github/workflows/ci.yml` runs
  typecheck → test → build on every PR + push to `main`. Cancels
  in-progress runs on the same ref. Uses Node 20 with npm cache.

---

## 2026-05-05 — Mobile / Expo readiness

### Added

- **`shared/near-miss/`** — platform-agnostic core (types, constants,
  validation, format, fetch client) consumed by both Next.js and Expo.
  `shared/near-miss/README.md` documents the Expo `tsconfig.json` paths
  and Metro config.
- **Public HTTP API** mirroring the parts of the server-action surface
  that mobile needs:
  - `GET /api/near-miss/categories` — public reference data
    (force-static)
  - `POST /api/near-miss/reports` — submit (anon or named)
  - `GET /api/near-miss/reports` — triage list (bearer)
  - `GET /api/near-miss/reports/[id]` — triage detail (bearer)
  - `GET /api/near-miss/reports/by-reference/[ref]` — post-submit
    confirmation (only safe fields)
  - `GET /api/near-miss/reports/by-code/[code]` — anonymous status;
    strips `factor_added` events and contributing factors
  - `POST /api/near-miss/reports/[id]/attachments` — multipart photo
    upload (proxied)
  - `POST /api/auth/token` — mobile sign-in; returns HMAC bearer token
  - `GET /api/auth/me` — whoami (bearer)
- **Bearer-token auth.** `lib/auth/session.ts` now resolves the current
  user from either the session cookie (web) or
  `Authorization: Bearer …` header (mobile) — same HMAC token format.
  `issueToken()` returns a token for mobile clients to persist.
- `shared/near-miss/api.ts` — typed
  `createNearMissApi({ baseUrl, getToken })` fetch client; throws
  `NearMissApiError` (with `fieldErrors` on 400) for typed handling.
- Companion **Expo app** scaffolded at `/home/user/mobile/` (sibling
  repo, not in this codebase) with `tsconfig.json` paths +
  `metro.config.js` resolving `@nm-shared/*` to
  `../trainovateMain/shared/near-miss/*`. Includes example screens for
  anonymous submit (with `expo-image-picker`), receipt-code lookup
  (with `expo-secure-store`), team sign-in, and triage.

### Changed

- `lib/near-miss/types.ts` and `lib/near-miss/format.ts` are now
  re-export shims pointing into `shared/near-miss/`. Existing imports
  unchanged. Web-only badge-class helpers stayed in
  `lib/near-miss/format.ts`.
- `lib/near-miss/storage.ts` reads its limits from
  `shared/near-miss/validation.ts` so mobile and web enforce the same
  caps.

---

## 2026-05-05 — Marketing site integration

### Added

- **Primary nav** (`components/shell/Nav.tsx`): "Report a near miss"
  ghost CTA next to "Request demo" on desktop, mirrored in the mobile
  menu.
- **Footer** (`components/shell/Footer.tsx`): "Safety" column with
  links to `/report`, `/report/status`, and `/safety/near-misses`.
  Footer grid rebalanced to keep the 12-col layout.

### Changed

- Merged the `claude/near-miss-reporting-plan-jhG1E` feature branch
  into `main`, layered on top of the existing Trainovate marketing
  site. Conflicts resolved in `app/layout.tsx` (kept main's font +
  metadata + SiteShell; layered manifest/icons/appleWebApp on top),
  `app/globals.css` (kept main's full version), `.gitignore` (combined),
  `package.json` (added Drizzle + better-sqlite3 deps; lockfile
  regenerated).

---

## 2026-05-05 — Phase 1: persistence + complete UX loop

### Added

- **Drizzle ORM + better-sqlite3 persistence.** Schema in
  `lib/near-miss/db/schema.ts`; initial migration in
  `drizzle/0000_*.sql`. Repository
  (`lib/near-miss/store.ts`) preserves the same exported function
  signatures as Phase 0. Auto-migrates on first DB access; demo seed
  runs once when the table is empty. Reference counter persisted to a
  `near_miss_meta` row.
- **Anonymous status lookup.** `/report/status` paste-code form +
  `/report/status/[code]` read-only view. Hides triage-internal
  `factor_added` events. Receipt code shown once on the thanks page
  with a deep link.
- **Field-level validation errors.** Submission and login forms use
  `useFormState`. Server actions return `{fieldErrors}` instead of
  throwing.
- **Safety-route error boundary** (`app/safety/error.tsx`) catches
  anything that still throws.
- **Cookie-session auth gate** on `/safety/*`. Edge middleware
  (`middleware.ts`) bounces unauthenticated traffic; safety layout
  re-validates the HMAC signature in the Node runtime so tampered
  cookies redirect to login. Hardcoded dev users in
  `lib/auth/users.ts`. Triage actions resolve `actorName()` from the
  session — audit log shows the real user.
- **Photo attachments.** `attachments` table (FK + cascade delete,
  `drizzle/0001_*.sql`); local-FS storage in
  `lib/near-miss/storage.ts`. Up to 5 photos × 10MB on submission. `GET
  /api/attachments/[id]` streams bytes with two auth paths:
  authenticated safety users (cookie) or anonymous reporters via
  `?code=`. Triage detail and receipt-code pages render thumbnails.
- **PWA scaffold.** `public/manifest.webmanifest` makes the site
  installable. `public/sw.js` pre-caches the report shell with
  network-first/cache-fallback for `/report` and `/report/status`.
  Offline banner via `navigator.onLine` (`components/RegisterSW.tsx`).
- **Notification dispatcher.** `lib/near-miss/notifications.ts` defines
  a pluggable `NotificationChannel` interface. Default `consoleChannel`
  fires `report_created` (high/critical), `status_changed`,
  `action_assigned`. Send failures swallowed.

### Tooling

- `npm run db:generate` / `npm run db:studio` scripts for schema
  migration / inspection.
- `near-miss.db*` and `uploads/` gitignored.

---

## 2026-05-05 — Phase 0: working spike

### Added

- Initial **Phase 0 vertical slice** of the near-miss reporting module
  on top of the in-memory store:
  - `/report` — public submission form (anonymous toggle, hazard
    category, severity, when/where, description) with a server action
  - `/report/thanks/[reference]` — confirmation page; anonymous
    reporters get a one-time receipt code
  - `/safety/near-misses` — triage queue with status filter chips and
    counts
  - `/safety/near-misses/[id]` — detail with status transitions,
    contributing factors, corrective actions (add + mark done), and an
    append-only activity log
- `lib/near-miss/types.ts` — domain types and curated hazard
  categories, severity levels, statuses, contributing-factor types
- `lib/near-miss/store.ts` — process-local in-memory store with
  audit-log invariants, pinned to `globalThis` for HMR survival
- `lib/near-miss/format.ts` — badge-class helpers and a relative-time
  formatter

### Fixed

- `addCorrectiveAction` was logging `from: "triaged"` even when the
  previous status was `"new"`. Replaced the duplicated transition
  logic in `setStatus` and `addCorrectiveAction` with a single
  `transitionStatus` helper that captures the real previous status.
  Test in `lib/near-miss/store.test.ts` ("addCorrectiveAction
  auto-transition records from='new'") locks this in.
- `relativeTime` now handles future timestamps (`"in 5m"`), fresh
  writes (`"just now"`), and invalid input (`"—"`) instead of negative
  `"-3s ago"` strings.

### Security

- Description, location, contributing-factor note, action description,
  owner name now have explicit min/max bounds. `occurredAt` rejects
  invalid date strings and anything > 5 minutes in the future.

---

## 2026-05-05 — Plan document

### Added

- `docs/near-miss-reporting-plan.md` — the original module plan
  spanning purpose, goals/non-goals, four user journeys, initial data
  model, surfaces, privacy/anonymity/retention, integrations, four
  rollout phases, success metrics, and open questions. Updated as each
  phase shipped.
