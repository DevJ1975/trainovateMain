# Hand-off — Trainovate.ai web

This is the punch list of placeholders Jay needs to confirm or replace before
production launch. Each item links to the file/line where it lives.

## Federal / Capability statement

- [ ] **CAGE code** — `app/federal/page.tsx`, `components/home/FederalPanel.tsx`, `components/shell/Footer.tsx` — currently `[on file]`
- [ ] **UEI** — same files as above
- [ ] **Capability statement PDF** — `public/pdf/capability-statement.pdf` — file does not exist; the link will 404 until you drop the PDF in
- [ ] **NAICS confirmation** — `app/federal/page.tsx` lists 611430 primary + 5 secondary; confirm 541330 fit if not delivering engineering directly

## Photography

- [ ] **Founder photo** — `lib/stock.ts` → `about.founder.url` is empty; provide a real photo path (drop into `/public/img/jay.jpg` and update the URL)

## OSHA-Authorized Trainer

`app/about/page.tsx` lists "OSHA-Authorized Trainer (in renewal)". Update once
the renewal completes.

## Insights

The three seed posts in `lib/insights.ts` are marked `draft: true` and ship a
visible "Draft" badge on the index and article pages. Set `draft: false` (and
revise text) when each is approved for publication.

## About — brand video

`app/about/page.tsx` embeds Vimeo video `1166250257` titled "Trainovations
Intro". Confirm whether the canonical brand is "Trainovate.ai" or
"Trainovations" — the section caption flags this.

## Podcast

`lib/podcast.ts` is fully placeholder data:
- [ ] Show name (currently "Field Signal" — placeholder)
- [ ] Show tagline & description
- [ ] Cover art (currently a generated placeholder tile)
- [ ] Episode roster — six placeholder episodes; replace with real titles, guests, dates, durations, summaries, and per-platform listen URLs
- [ ] Subscribe URLs — Apple, Spotify, YouTube, Overcast, RSS

## Email / Resend

`/api/contact` uses Resend. Until `RESEND_API_KEY` is set, the route accepts
submissions and logs to console (returns `{ ok: true, dev: true }`). Add the
key in production.
