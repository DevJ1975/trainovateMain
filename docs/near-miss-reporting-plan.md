# Near Miss Reporting Module — Plan

## 1. Purpose

A near miss is an unplanned event that did not result in injury, illness, or
damage but had the potential to do so. Capturing them early is one of the
highest-leverage interventions in workplace safety: each reported near miss is a
free lesson before the same chain of events produces a real incident.

This module gives Trainovate customers a fast, low-friction way to report,
triage, investigate, and learn from near misses across their workforce — and
feeds that signal back into Trainovate's training recommendations.

## 2. Goals & non-goals

**Goals**
- Sub-60-second submission from a phone in the field (the "while I'm thinking
  about it" window).
- Anonymous reporting option, with org-level policy controls.
- Structured-enough data to support trend analysis (location, hazard category,
  severity-potential, contributing factors) without becoming a form-filling
  chore.
- Closed-loop workflow: every report reaches a defined status (triaged →
  investigated → actioned → closed) with an auditable trail.
- Tie-in to training: surface relevant micro-lessons when a hazard pattern
  emerges for a team or site.

**Non-goals (v1)**
- OSHA 300/301 recordkeeping (incidents that already caused harm) — separate
  module.
- Full root-cause analysis frameworks (5-Why, TapRoot). v1 captures structured
  notes; deep RCA is a fast-follow.
- Native mobile app. PWA-first.

## 3. Primary user journeys

1. **Frontline reporter** opens a QR code or shortcut, picks a hazard category,
   describes what happened, optionally attaches a photo, submits. Receives a
   reference number.
2. **Supervisor / safety lead** sees a queue of new reports for their site,
   triages severity-potential, assigns owner, sets corrective actions with due
   dates.
3. **Safety manager** views the dashboard: heatmap by location, top hazard
   categories, time-to-close, repeat patterns.
4. **Worker (returning)** gets a notification when a report they filed is
   actioned or closed — visible feedback is the strongest driver of continued
   reporting.

## 4. Data model (initial)

- `NearMissReport` — id, org_id, site_id, reporter_id (nullable when anonymous),
  occurred_at, reported_at, location_text, geo (optional), hazard_category,
  description, severity_potential (low/med/high/critical), status, anonymous,
  created_at, updated_at.
- `Attachment` — id, report_id, kind (photo/video/doc), storage_key, content_type.
- `ContributingFactor` — id, report_id, type (human/equipment/environment/process),
  note.
- `CorrectiveAction` — id, report_id, owner_id, description, due_at, status,
  completed_at.
- `ReportEvent` — id, report_id, actor_id, kind (created/triaged/assigned/
  commented/status_changed/closed), payload, at. Append-only audit log.

Hazard categories start with a curated list (slips/trips, struck-by, electrical,
ergonomic, chemical, PPE, vehicle, etc.) and are configurable per org.

## 5. Surfaces

- **PWA submission flow** (`/report`) — works offline, queues and syncs.
- **Dashboard** (`/safety/near-misses`) — list, filters, map/heatmap, exports.
- **Report detail** (`/safety/near-misses/:id`) — timeline, actions, comments.
- **Admin settings** — categories, anonymity policy, notification routing,
  retention.

## 6. Privacy, anonymity, retention

- "Anonymous" means the reporter_id is not persisted on the report and is
  irrecoverable — not just hidden in the UI. Trade-off: we lose the ability to
  notify them of closure unless they opt into a pseudonymous receipt code.
- Reports are visible only to users with the safety role for the relevant
  site/org by default.
- Retention defaults to 7 years (typical safety-records guideline); configurable
  per org with regional minimums enforced.
- Photos are scanned for faces/plates with optional auto-blur before storage.

## 7. Integrations

- **Training engine** — when a category crosses a per-team threshold
  (e.g., 3 ergonomic near misses in 30 days), recommend the matching micro-lesson.
- **Notifications** — email + SMS + Slack/Teams webhooks for triage queues.
- **SSO** — reuse existing org auth; anonymous path bypasses auth via signed QR
  tokens scoped to a site.
- **Export** — CSV and a scheduled BI extract (Parquet to S3).

## 8. Rollout phases

- **Phase 0 — Spike (1 wk).** Submission API + minimal form, manual triage in
  admin. Internal dogfood at one pilot site. **✅ Shipped on this branch — see
  §11.**
- **Phase 1 — MVP (3–4 wks).** Full submission flow (incl. offline + photo),
  dashboard list + filters, corrective actions, audit log, anonymity, role-based
  access. **🟡 Persistence + anonymous status lookup shipped on this branch —
  see §10. Auth/SSO, attachments, offline PWA, and notifications still
  outstanding.**
- **Phase 2 — Insights (3 wks).** Heatmap, trend detection, training-engine
  hook, notification routing, exports.
- **Phase 3 — Depth (ongoing).** Light RCA templates, repeat-pattern alerts,
  benchmarks across orgs (opt-in, aggregated).

## 9. Success metrics

- **Reporting rate**: near misses reported per 100 workers per month. Target
  uplift vs. customer baseline.
- **Time-to-submit**: median seconds from open to submit. Target < 60s.
- **Time-to-close**: median days from report to closed. Target < 14d.
- **Loop-closure rate**: % reports that reach closed status. Target > 90%.
- **Training tie-in**: % of pattern-triggered recommendations that convert to a
  completed lesson by the affected team.

## 10. Phase 0 — what shipped

A working vertical slice exists at:

- `/report` — public submission form (anonymous toggle, hazard category,
  severity-potential, free-text description, when-it-happened).
- `/report/thanks/[reference]` — confirmation page; anonymous reporters
  receive a one-time receipt code.
- `/safety/near-misses` — triage queue with status filters and counts.
- `/safety/near-misses/[id]` — detail view with status transitions,
  contributing factors, corrective actions (add + mark done), and an
  append-only activity log.

Code layout:

- `lib/near-miss/types.ts` — domain types + curated hazard categories,
  severity levels, statuses, contributing-factor types.
- `lib/near-miss/store.ts` — process-local in-memory store with audit-log
  invariants. `globalThis`-pinned so HMR and route handlers share state.
- `lib/near-miss/format.ts` — badge classes and relative-time helper.
- `app/report/*` — submission UI + server action.
- `app/safety/*` — triage layout, list, detail, and triage server actions.

Verified by `next build` (typecheck passes; routes generate).

### Phase 1 progress — what shipped on this branch

- **Persistence (✅).** Drizzle ORM + SQLite via `better-sqlite3`. Schema
  in `lib/near-miss/db/schema.ts`, generated migration in `drizzle/`.
  Repository (`lib/near-miss/store.ts`) preserves the same exported function
  signatures the route handlers were already using. Auto-migrates on first DB
  access; demo seed runs once when the table is empty.
- **Anonymous status lookup (✅).** `/report/status` paste-code form +
  `/report/status/[code]` read-only view. Hides triage-internal contributing
  factors. Receipt code is shown once on the thanks page with a deep link.
- **Reference counter (✅).** Persisted to a `near_miss_meta` row instead
  of in-process; survives restarts.

Stack notes:

- SQLite is fine for local dev. **Production swap:** change the dialect in
  `drizzle.config.ts` and the driver in `lib/near-miss/db/client.ts` to
  `drizzle-orm/postgres-js` (or `drizzle-orm/node-postgres`). Schema and
  migrations are dialect-portable for the columns we use.
- `next-miss.db` is gitignored. Set `NEAR_MISS_DB_PATH` to override the
  location.
- Run `npm run db:generate` after schema edits; commit the new SQL files
  in `drizzle/`.

### Still outstanding for Phase 1

- **Auth & roles** — every visitor can both report and triage. Wire up SSO
  (NextAuth or similar), scope reads/writes by org + site role, lock
  `/safety/*` behind a session.
- **Photo / video attachments** — `Attachment` table + S3 (or equivalent),
  face/plate auto-blur, upload UX with progress + retry.
- **Offline submit** — PWA manifest + service worker queue + IndexedDB
  buffer.
- **Notifications** — email/SMS/Slack on triage events; per-user routing
  preferences.
- **Field-level validation errors** — server actions still `throw`; convert
  to `useActionState` returning `{fieldErrors}` so the form can render per-
  field messages without reloads.
- **Training-engine tie-in** — pattern detection (§7) lands with insights
  in Phase 2.

## 11. Open questions

- Anonymity policy: org-configurable, or platform-mandated minimum?
- Geo capture: opt-in per submission, or per org policy? Privacy implications
  for off-site or remote workers.
- How do we handle reports filed against a contractor working on a customer
  site — visibility, ownership, data sharing?
- Severity-potential rubric: do we ship our own, or import a customer's
  existing risk matrix? Probably both, with a default.
- Multi-language: which languages ship with v1? Reporter form is the highest
  priority surface for translation.
