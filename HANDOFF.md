# Hand-off — Trainovate Web

This is the punch list of placeholders Jay needs to confirm or replace before
production launch. Each item links to the file/line where it lives.

## Federal / Capability statement

- [ ] **CAGE code** — `app/federal/page.tsx`, `components/home/FederalPanel.tsx`, `components/shell/Footer.tsx` — currently `[on file]`
- [ ] **UEI** — same files as above
- [ ] **Capability statement PDF** — `public/pdf/capability-statement.pdf` — file does not exist; the link will 404 until you drop the PDF in
- [ ] **JV legal language** — `app/federal/page.tsx` (Synergy Federal Group block) — confirm Wyoming entity formation status & exact language
- [ ] **NAICS confirmation** — `app/federal/page.tsx` lists 611430 primary + 5 secondary; confirm 541330 fit if not delivering engineering directly

## Past performance

In `app/federal/page.tsx` the `pastPerformance` array lists Snak King, MES Fire,
StandardAero, UNFI, and Code Platoon adjacent. Each requires written client
permission before you publish the capability statement. The page currently
includes a visible "TODO Jay confirms" badge.

## Photography

- [ ] **Founder photo** — `lib/stock.ts` → `about.founder.url` is empty; provide a real photo path (drop into `/public/img/jay.jpg` and update the URL)
- [ ] **Stock images** — `lib/stock.ts` currently uses Unsplash hot-link URLs. For production you should:
  1. Replace each URL with a confirmed-licensed photo,
  2. Verify each photographer credit on the `credit` object,
  3. Optionally self-host inside `/public/img/stock/`
- The `tnv-photo` CSS treatment is already applied to all stock photos to keep them visually consistent.

## OSHA-Authorized Trainer

`app/about/page.tsx` lists "OSHA-Authorized Trainer (in renewal)". Update once
the renewal completes.

## Insights

The three seed posts in `lib/insights.ts` are marked `draft: true` and ship a
visible "Draft" badge on the index and article pages. Set `draft: false` (and
revise text) when each is approved for publication.

## Wordmark

`components/marks/Wordmark.tsx` is a hand-coded SVG using a system serif/sans
fallback for the "rainovate" portion. If you want the strict geometric mark
described in the brief, replace the `<text>` element with extruded path data.

## Email / Resend

`/api/contact` uses Resend. Until `RESEND_API_KEY` is set, the route accepts
submissions and logs to console (returns `{ ok: true, dev: true }`). Add the
key in production.

## Capability PDF

Drop the production capability statement at `public/pdf/capability-statement.pdf`.
The download links from both the Federal page and the Hero already point there.
