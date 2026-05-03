# Trainovate Technologies — Web

Production marketing site for **Trainovate Technologies** — a veteran-founded SDVOSB digital learning + EHS training company. Workforce Transformation OS for high-risk industries.

## Stack

- **Next.js 14** (App Router) · TypeScript strict
- **Tailwind CSS** with brand-token CSS variables
- **Three.js** + **@react-three/fiber** for the home scroll scene
- **GSAP** + **Lenis** for smooth scroll & timeline scrubbing
- **Framer Motion** for DOM micro-animations
- **React Hook Form** + **Zod** for forms
- **Resend** for transactional contact email

## Quickstart

```bash
npm install
cp .env.example .env.local      # fill in RESEND_API_KEY when ready
npm run dev                     # http://localhost:3000
```

## Scripts

| Command            | Purpose                          |
| ------------------ | -------------------------------- |
| `npm run dev`      | Dev server with HMR              |
| `npm run build`    | Production build                 |
| `npm run start`    | Serve production build           |
| `npm run lint`     | ESLint                           |
| `npm run typecheck`| TypeScript no-emit type check    |

## Routes

```
/                      Home (scroll-driven, 7 acts, persistent Three.js scene)
/platform              Soteria platform overview
/platform/[slug]       Per-product (safeguard | field | learning | copilot)
/services              EHS consulting + custom development
/federal               SDVOSB capability statement
/about                 Founder / values
/insights              Field-notes blog (data-driven, see lib/insights.ts)
/insights/[slug]       Article
/contact               Form (POST /api/contact)
```

## Brand system

- Color tokens live as CSS variables in `app/globals.css` and surface in Tailwind via `tailwind.config.ts`
- Fonts: **Inter Tight** (body), **Instrument Serif** (display, italic), **JetBrains Mono** (mono — Geist Mono substitute)
- Reusable components: `components/ui/*` (Eyebrow, StockImage, MarqueeStrip, StatCounter)

## Three.js scene

A single persistent `<Canvas>` mounts on the home page only via dynamic import. `components/three/ScrollScene.tsx` owns one `BufferGeometry` of ~2,400 points that lerps through 7 target shapes driven by global scroll progress (Globe → Constellation → Stack → Factory → Hex grid → Tunnel → Dispersed). The scene also color-shifts toward `--tnv-flag-blue` during the federal act and dollies the camera per act.

`prefers-reduced-motion` swaps the canvas for a static gradient.

## Deploy

```bash
vercel deploy --prod
```

Add the env vars from `.env.example` in the Vercel project. The site needs only `RESEND_API_KEY` plus the `CONTACT_*` addresses to ship; everything else is static.

## Hand-off

See `HANDOFF.md` for the punch list of `<!-- TODO Jay confirms -->` placeholders to replace before launch (logos, exact NAICS confirmation, CAGE/UEI, capability statement PDF, founder photo, JV legal language).
