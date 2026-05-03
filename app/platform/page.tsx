import type { Metadata } from "next";
import Link from "next/link";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { products } from "@/lib/products";
import { ArrowUpRight, BarChart3 } from "lucide-react";
import { FaqSection, FaqJsonLd, type FaqItem } from "@/components/ui/FaqSection";

export const metadata: Metadata = {
  title: "Training Solutions | AI, VR, Microlearning & Custom LMS Development",
  description:
    "Explore Trainovate training solutions: AI-driven learning systems, immersive VR & 3D safety training, microlearning & daily reinforcement, safety & compliance programs, and Soteria FIELD SaaS — a custom LMS built for high-risk industries.",
  alternates: { canonical: "/platform" },
  openGraph: {
    title: "Training Solutions | AI, VR, Microlearning & Custom LMS",
    description:
      "AI-driven learning systems, immersive VR/3D simulations, microlearning, and the Soteria FIELD SaaS LMS — built for high-risk industries.",
    url: "/platform",
    type: "website",
  },
  keywords: [
    "AI-driven learning systems",
    "VR safety training",
    "3D training simulations",
    "microlearning for safety compliance",
    "custom LMS development",
    "Soteria FIELD SaaS",
    "AI-powered safety training",
    "modern LMS for safety training",
    "operational readiness training",
  ],
};

export default function PlatformPage() {
  return (
    <div className="pt-32 md:pt-40 pb-24">
      <section className="tnv-container tnv-section">
        <Eyebrow index="01" label="SOLUTIONS" />
        <h1 className="tnv-h1 mt-6 max-w-5xl text-balance">
          AI-powered training solutions, built for{" "}
          <span className="tnv-italic text-signal">high-risk industries.</span>
        </h1>
        <p className="tnv-body mt-8 max-w-2xl text-pretty">
          Soteria is the Trainovate platform — AI-driven learning systems,
          immersive VR & 3D training, microlearning, safety & compliance
          programs, and the Soteria FIELD SaaS LMS. Each solution ships
          independently or as part of the full stack, all sharing a single
          xAPI evidence spine.
        </p>
      </section>

      <section className="tnv-container tnv-section mt-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-bone/8">
          {products.map((p) => {
            const Mark = p.mark;
            return (
              <Link
                key={p.slug}
                href={`/platform/${p.slug}`}
                className="group relative bg-void p-10 md:p-12 transition-colors hover:bg-carbon"
              >
                <div className="flex items-start justify-between gap-6">
                  <div>
                    <Eyebrow index={p.index} label={p.name.toUpperCase()} />
                    <h2 className="tnv-h3 mt-4 text-bone">{p.full}</h2>
                    <p className="mt-3 font-mono text-[11px] uppercase tracking-eyebrow text-fog">
                      {p.role}
                    </p>
                  </div>
                  <Mark className="h-10 w-10 text-signal/70 group-hover:text-signal transition-colors flex-shrink-0" />
                </div>
                <p className="tnv-body mt-8 text-base text-pretty max-w-md">
                  {p.tagline}
                </p>
                <div className="mt-10 flex items-center gap-2 font-mono text-[11px] uppercase tracking-eyebrow text-bone group-hover:text-signal transition-colors">
                  Explore
                  <ArrowUpRight size={14} />
                </div>
              </Link>
            );
          })}

          {/* Data & Performance Insights — surfaced inline as a 5th capability,
              cross-cuts every product */}
          <div className="group relative bg-void p-10 md:p-12">
            <div className="flex items-start justify-between gap-6">
              <div>
                <Eyebrow index="06" label="DATA & PERFORMANCE INSIGHTS" />
                <h2 className="tnv-h3 mt-4 text-bone">Workforce performance analytics</h2>
                <p className="mt-3 font-mono text-[11px] uppercase tracking-eyebrow text-fog">
                  xAPI Learning Record Store
                </p>
              </div>
              <BarChart3 className="h-10 w-10 text-cobalt/70 flex-shrink-0" />
            </div>
            <p className="tnv-body mt-8 text-base text-pretty max-w-md">
              Every action across Soteria emits an xAPI statement to a single
              LRS. Dashboards roll up by site, shift, and individual — turning
              training into a measurable operational signal.
            </p>
            <div className="mt-10 flex items-center gap-2 font-mono text-[11px] uppercase tracking-eyebrow text-flare">
              Included with every solution
            </div>
          </div>
        </div>
      </section>

      <section className="tnv-container tnv-section mt-32">
        <Eyebrow index="06" label="ARCHITECTURE" />
        <h2 className="tnv-h2 mt-6 max-w-3xl text-balance">
          One spine. Four endpoints.
        </h2>
        <p className="tnv-body mt-6 max-w-2xl">
          Every product writes to a shared xAPI Learning Record Store. Your
          incidents inform tomorrow's training. Your training proves out in your
          inspections. Evidence flows in one direction: forward.
        </p>

        <div className="mt-16 tnv-glass rounded-2xl p-10 md:p-16">
          <SpineDiagram />
        </div>
      </section>

      <FaqSection
        index="07"
        eyebrow="FAQ"
        heading={
          <>
            Common questions about{" "}
            <span className="tnv-italic text-signal">Trainovate solutions.</span>
          </>
        }
        items={platformFaq}
      />
      <FaqJsonLd items={platformFaq} />
    </div>
  );
}

const platformFaq: FaqItem[] = [
  {
    q: "What is Soteria FIELD SaaS?",
    a: "Soteria FIELD is Trainovate's custom multi-tenant SaaS LMS for inspections, audits, corrective actions, and workforce training in high-risk industries. It's xAPI-native, mobile-first, offline-capable, and Section 508 accessible. Most customers stand up a tenant in days and pilot a site within weeks.",
  },
  {
    q: "How is Trainovate different from a generic LMS?",
    a: "We build training systems, not just course libraries. Trainovate combines AI-driven learning, immersive VR/3D simulations, microlearning, and a custom LMS into one stack — engineered for real-world job conditions. Every interaction emits xAPI evidence, so retention and behavior change are measurable rather than assumed.",
  },
  {
    q: "Do you support OSHA compliance training?",
    a: "Yes. Trainovate ships OSHA-aligned safety and compliance programs (29 CFR 1910 / 1926, OSHA 10/30, LOTO 1910.147, ANSI Z244.1, ISO 45001). Programs can be delivered as standalone training or instrumented through Soteria for end-to-end evidence.",
  },
  {
    q: "Can the platform deploy across multiple sites and locations?",
    a: "Yes. Soteria is multi-tenant by design — tenant per facility with central program governance, role-based access, and SSO. Deployments scale from single-site pilots to enterprise portfolios without losing the program in translation.",
  },
  {
    q: "Is Trainovate a good fit for federal customers?",
    a: "Yes. Trainovate is a Service-Disabled Veteran-Owned Small Business (SDVOSB / DVOSB) registered on SAM.gov, with Section 508 accessibility built in by default. NAICS 611430 primary, plus 541611 / 541330 / 541512 / 611710 / 541990 secondary.",
  },
  {
    q: "Do you build VR and 3D training experiences?",
    a: "Yes. Immersive VR and 3D simulations are a core capability — used for spatial procedures, high-acuity skills, and high-consequence work environments where training needs to happen before the worker steps onto the floor.",
  },
  {
    q: "Can Soteria integrate with our existing LMS or HRIS?",
    a: "Yes. Soteria is xAPI 1.0.3 native and supports SCORM 1.2 / 2004 bridges for legacy LMS integration, plus standard SSO and SCIM integrations for HRIS platforms. We also support direct LRS integration for organizations bringing their own evidence layer.",
  },
];

function SpineDiagram() {
  return (
    <svg viewBox="0 0 800 360" className="w-full h-auto" aria-label="Soteria architecture diagram">
      <defs>
        <linearGradient id="spine" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="var(--tnv-signal)" stopOpacity="0.1" />
          <stop offset="50%" stopColor="var(--tnv-signal)" stopOpacity="0.6" />
          <stop offset="100%" stopColor="var(--tnv-signal)" stopOpacity="0.1" />
        </linearGradient>
      </defs>

      {/* spine */}
      <line x1="80" y1="180" x2="720" y2="180" stroke="url(#spine)" strokeWidth="2" />
      <text x="400" y="208" textAnchor="middle" fill="var(--tnv-signal)" fontFamily="ui-monospace" fontSize="11" letterSpacing="2">
        xAPI · LRS
      </text>

      {/* product nodes */}
      {[
        { x: 140, label: "Safeguard" },
        { x: 320, label: "FIELD" },
        { x: 500, label: "Learning" },
        { x: 680, label: "Co-Pilot" },
      ].map((n) => (
        <g key={n.label}>
          <circle cx={n.x} cy={180} r="6" fill="var(--tnv-signal)" />
          <line x1={n.x} y1={108} x2={n.x} y2={172} stroke="var(--tnv-fog)" strokeWidth="1" strokeDasharray="3 4" opacity="0.5" />
          <rect x={n.x - 60} y={64} width="120" height="44" fill="var(--tnv-carbon)" stroke="var(--tnv-bone)" strokeOpacity="0.15" />
          <text x={n.x} y={90} textAnchor="middle" fill="var(--tnv-bone)" fontFamily="ui-monospace" fontSize="12">
            {n.label}
          </text>
        </g>
      ))}

      {/* downstream */}
      {[
        { x: 220, label: "Audits" },
        { x: 400, label: "Curricula" },
        { x: 580, label: "Investigations" },
      ].map((n) => (
        <g key={n.label}>
          <line x1={n.x} y1={188} x2={n.x} y2={252} stroke="var(--tnv-fog)" strokeWidth="1" strokeDasharray="3 4" opacity="0.5" />
          <rect x={n.x - 70} y={252} width="140" height="38" fill="transparent" stroke="var(--tnv-fog)" strokeOpacity="0.3" />
          <text x={n.x} y={276} textAnchor="middle" fill="var(--tnv-fog)" fontFamily="ui-monospace" fontSize="11" letterSpacing="1.5">
            {n.label.toUpperCase()}
          </text>
        </g>
      ))}
    </svg>
  );
}
