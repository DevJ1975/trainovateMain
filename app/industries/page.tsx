import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { StockImage } from "@/components/ui/StockImage";
import { industries } from "@/lib/industries";
import { FaqSection, FaqJsonLd, type FaqItem } from "@/components/ui/FaqSection";

export const metadata: Metadata = {
  title: "Industries We Serve | Safety Training & Workforce Learning Solutions",
  description:
    "Trainovate supports manufacturing, construction, warehousing & logistics, aviation maintenance, energy & utilities, government, healthcare & emergency response, and corporate teams with AI-powered safety training, immersive VR/3D simulations, microlearning, and the Soteria FIELD SaaS LMS.",
  alternates: { canonical: "/industries" },
  openGraph: {
    title: "Industries We Serve | Safety & Workforce Training Solutions",
    description:
      "Modern safety and workforce training systems for high-risk industries — from manufacturing and construction to government and healthcare.",
    url: "/industries",
    type: "website",
  },
  keywords: [
    "manufacturing safety training",
    "construction safety training",
    "warehouse safety training",
    "logistics training",
    "aviation maintenance training",
    "energy and utilities training",
    "government workforce training",
    "healthcare emergency response training",
    "corporate workforce training",
    "industrial safety training",
  ],
};

export default function IndustriesPage() {
  return (
    <div className="pt-32 md:pt-40 pb-24">
      {/* Hero */}
      <section className="tnv-container tnv-section">
        <Eyebrow index="01" label="INDUSTRIES" />
        <h1 className="tnv-h1 mt-6 max-w-5xl text-balance">
          Training built for the industries the{" "}
          <span className="tnv-italic text-signal">world depends on.</span>
        </h1>
        <p className="tnv-body mt-8 max-w-2xl text-pretty">
          Trainovate Technologies serves high-risk, high-responsibility
          workforces — across regulated commercial industry, the federal
          mission space, and the enterprise. Wherever the cost of a missed
          step is real, that is where we ship.
        </p>
      </section>

      {/* Industry overview */}
      <section className="tnv-container tnv-section mt-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-5">
            <Eyebrow index="02" label="OVERVIEW" />
            <h2 className="tnv-h2 mt-6 max-w-md text-balance">
              The same problem,{" "}
              <span className="tnv-italic text-signal">eight ways.</span>
            </h2>
          </div>
          <div className="lg:col-span-7">
            <p className="tnv-body text-pretty">
              Across every sector we serve, the underlying problem is the
              same — programs that look good on paper and fail at the point
              of execution. Trainovate is built for the inverse: training
              designed around the task, instrumented from the floor, and
              proven in the audit. Below: where we ship, and what changes
              when we do.
            </p>
          </div>
        </div>
      </section>

      {/* Industry sections */}
      <section className="tnv-container tnv-section mt-24 space-y-24">
        {industries.map((v, i) => (
          <article
            key={v.slug}
            className={`grid grid-cols-1 lg:grid-cols-12 gap-10 items-start ${
              i % 2 === 1 ? "lg:[&>:first-child]:order-last" : ""
            }`}
          >
            <div className="lg:col-span-5">
              <StockImage
                stockKey={v.stockKey}
                className="aspect-[4/5] w-full"
                sizes="(min-width: 1024px) 40vw, 100vw"
              />
            </div>

            <div className="lg:col-span-7">
              <Eyebrow index={v.index} label={v.name.toUpperCase()} />
              <h3 className="tnv-h2 mt-6 max-w-2xl text-balance" style={{ fontSize: "clamp(28px, 4vw, 56px)" }}>
                {v.tagline}
              </h3>
              <p className="tnv-body mt-6 max-w-xl text-pretty">{v.body}</p>

              <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-px bg-bone/8 border border-bone/8">
                {v.capabilities.map((c) => (
                  <div key={c} className="bg-ink/40 p-5">
                    <div className="font-mono text-[10px] uppercase tracking-eyebrow text-cobalt-soft">→</div>
                    <div className="font-serif text-base text-bone mt-2">{c}</div>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap items-baseline justify-between gap-6">
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-eyebrow text-fog">
                    Frameworks
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {v.frameworks.map((f) => (
                      <span
                        key={f}
                        className="font-mono text-[10px] uppercase tracking-eyebrow text-bone/80 border border-bone/15 px-2 py-1"
                      >
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="border-l-2 border-flare pl-4">
                  <div className="font-display font-semibold text-3xl text-bone tracking-tight">
                    {v.signal.stat}
                  </div>
                  <div className="font-mono text-[10px] uppercase tracking-eyebrow text-fog mt-1">
                    {v.signal.label}
                  </div>
                </div>
              </div>

              <Link
                href={`/industries/${v.slug}`}
                className="mt-8 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-eyebrow text-cobalt-soft hover:text-bone border-b border-cobalt/40 hover:border-bone pb-1"
              >
                Deep dive — {v.shortName} <ArrowRight size={14} />
              </Link>
            </div>
          </article>
        ))}
      </section>

      {/* Built for High-Risk, High-Responsibility Work */}
      <section className="tnv-container tnv-section mt-32">
        <div className="tnv-glass rounded-2xl p-10 md:p-16">
          <Eyebrow index="09" label="OUR POSTURE" />
          <h2 className="tnv-h2 mt-6 max-w-4xl text-balance">
            Built for high-risk,{" "}
            <span className="tnv-italic text-signal">high-responsibility work.</span>
          </h2>
          <p className="tnv-body mt-8 max-w-3xl text-pretty">
            Trainovate&rsquo;s customers operate where mistakes are not
            abstract — where the cost of a missed step is measured in injury,
            downtime, regulatory action, or mission failure. We design for that
            reality. Every program we build is engineered to withstand contact
            with the actual environment: low connectivity, rotating crews,
            layered regulators, and the constant pressure of production. Our
            platform is xAPI-native, multi-tenant, offline-capable, and
            accessible by default — because that is what serious work
            requires.
          </p>

          <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { t: "xAPI-native", b: "Every action emits an evidence statement" },
              { t: "Multi-tenant", b: "Tenant per facility, central governance" },
              { t: "Offline-capable", b: "Inspect and train without connectivity" },
              { t: "Section 508", b: "Accessible by default — federal-ready" },
            ].map((p) => (
              <div key={p.t} className="border-l-2 border-cobalt pl-4">
                <div className="font-mono text-[11px] uppercase tracking-eyebrow text-cobalt-soft">
                  {p.t}
                </div>
                <div className="mt-2 text-sm text-bone/85">{p.b}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Training That Meets People Where They Work */}
      <section className="tnv-container tnv-section mt-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-5">
            <Eyebrow index="10" label="DELIVERY MODEL" />
            <h2 className="tnv-h2 mt-6 text-balance">
              Training that meets people{" "}
              <span className="tnv-italic text-signal">where they work.</span>
            </h2>
          </div>
          <div className="lg:col-span-7">
            <p className="tnv-body text-pretty">
              The workforce we serve is rarely at a desk. They are on the
              line, in the hangar, on the wellpad, in the ambulance, on the
              construction site. So we ship training to the device they
              already carry — phone, tablet, headset, or kiosk — in the
              modality that fits the moment.
            </p>

            <ul className="mt-10 space-y-5">
              {[
                {
                  t: "Microlearning",
                  b: "3–7 minute units delivered before the task — built around what the worker actually needs to know in the next ten minutes.",
                },
                {
                  t: "Immersive 3D & VR",
                  b: "Spatial procedures rehearsed in a safe environment before they are performed live.",
                },
                {
                  t: "AR overlays",
                  b: "In-context guidance for complex multi-step tasks, served on the device in the worker&rsquo;s hand.",
                },
                {
                  t: "Voice intake",
                  b: "Hands-full reporting and incident drafting that captures the moment as it happens.",
                },
              ].map((m) => (
                <li key={m.t} className="border-l-2 border-flare pl-4">
                  <div className="font-mono text-[11px] uppercase tracking-eyebrow text-flare">
                    {m.t}
                  </div>
                  <p
                    className="mt-2 text-base text-bone/85 text-pretty"
                    dangerouslySetInnerHTML={{ __html: m.b }}
                  />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <FaqSection
        index="11"
        eyebrow="FAQ"
        heading={
          <>
            Industry questions,{" "}
            <span className="tnv-italic text-signal">answered.</span>
          </>
        }
        items={industriesFaq}
      />
      <FaqJsonLd items={industriesFaq} />

      {/* Final CTA */}
      <section className="tnv-container tnv-section mt-32">
        <div className="tnv-glass rounded-2xl p-10 md:p-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7">
              <Eyebrow label="START" />
              <h2 className="tnv-h2 mt-4 max-w-2xl text-balance">
                Ready to bring your training into the{" "}
                <span className="tnv-italic text-signal">modern era?</span>
              </h2>
              <p className="tnv-body mt-6 max-w-xl text-pretty">
                Whether you are a single-site operator or a federal prime, we
                will build a program that ships.
              </p>
            </div>
            <div className="lg:col-span-5 flex flex-wrap gap-3 lg:justify-end">
              <Link href="/platform" className="tnv-btn-signal">
                Explore Training Solutions <ArrowRight size={14} />
              </Link>
              <Link href="/contact" className="tnv-btn-ghost">
                Partner With Trainovate
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

const industriesFaq: FaqItem[] = [
  {
    q: "What industries does Trainovate serve?",
    a: "Trainovate serves manufacturing, construction, warehousing & logistics, aviation maintenance, energy & utilities, government & public sector, healthcare & emergency response, and corporate workforce training. We focus on high-risk, high-responsibility environments where the cost of a missed step is real.",
  },
  {
    q: "Do you build custom safety training for manufacturing?",
    a: "Yes. We standardize lockout/tagout, machine guarding, and PPE training across multi-site manufacturing operations, instrumented through Soteria FIELD SaaS so every plant reads off the same dashboard. OSHA 29 CFR 1910.147, ANSI Z244.1, ISO 45001, and Cal/OSHA 3314 aligned.",
  },
  {
    q: "Can Trainovate support construction OSHA 10/30 training?",
    a: "Yes. Our mobile-first construction training covers OSHA 10/30 outreach content, toolbox talks, and task-specific safety briefings — delivered on the device the crew already carries, in the language the workforce actually speaks, with evidence captured in real time.",
  },
  {
    q: "What does immersive VR safety training look like in practice?",
    a: "VR and 3D simulations are used for spatial procedures, high-acuity skills, and high-consequence tasks — confined space entries, energized work, emergency response, equipment operation. The worker rehearses the procedure in a safe environment until it becomes muscle memory, then performs it live.",
  },
  {
    q: "How does Trainovate support federal and government customers?",
    a: "Trainovate is a Service-Disabled Veteran-Owned Small Business (SDVOSB / DVOSB) registered on SAM.gov. Section 508 accessibility is built in by default. We support DoD, VA, and civilian agency requirements through Soteria FIELD SaaS — NAICS 611430 primary plus engineering, IT, and educational support secondaries.",
  },
  {
    q: "Can Soteria handle rotating crews and high-turnover workforces?",
    a: "Yes. Multi-tenant SaaS with role-based access, SSO, and per-site governance. Microlearning sequences are designed for short-attention-span starts of shift; competency tracking persists across rotations so a new crew member doesn't restart the curriculum.",
  },
  {
    q: "Do you offer training programs for healthcare and emergency response?",
    a: "Yes. Protocol microlearning, immersive 3D scenarios for high-acuity skills, and competency tracking across rotating shifts. Aligned with TJC standards, OSHA 1910.1030 bloodborne pathogens, NIMS / ICS, and HIPAA where applicable.",
  },
];
