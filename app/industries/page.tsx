import type { Metadata } from "next";
import Link from "next/link";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { StockImage } from "@/components/ui/StockImage";
import { industries } from "@/lib/industries";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Industries — Where Trainovate.ai ships",
  description:
    "Trainovate.ai serves manufacturing, warehousing, aviation MRO, cannabis, energy/SIMOPS, and food processing — high-risk industries that don't tolerate prototype tooling.",
};

const crossCapabilities = [
  { t: "xAPI evidence spine", b: "Every action emits a statement. Bring your own LRS or use ours." },
  { t: "Multi-tenant SaaS", b: "Tenant per facility. Central program governance. SSO ready." },
  { t: "Offline field operation", b: "Inspect and train in low-connectivity environments. Sync on return." },
  { t: "Section 508 + WCAG 2.1 AA", b: "Accessible by default. Required for federal work, good for everyone." },
];

export default function IndustriesPage() {
  return (
    <div className="pt-32 md:pt-40 pb-24">
      {/* Hero */}
      <section className="tnv-container tnv-section">
        <Eyebrow index="01" label="INDUSTRIES" />
        <h1 className="tnv-h1 mt-6 max-w-5xl text-balance">
          Where Trainovate.ai{" "}
          <span className="tnv-italic text-signal">ships.</span>
        </h1>
        <p className="tnv-body mt-8 max-w-2xl text-pretty">
          Soteria is built for industries that don't tolerate prototype-grade
          tooling. Below: the verticals with active or production deployments
          and the regulatory frameworks they run against.
        </p>
      </section>

      {/* Vertical sections */}
      <section className="tnv-container tnv-section mt-24 space-y-24">
        {industries.map((v, i) => (
          <article
            key={v.slug}
            className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start"
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
              <h2 className="tnv-h2 mt-6 max-w-2xl text-balance">{v.tagline}</h2>

              <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-px bg-bone/8 border border-bone/8">
                <div className="bg-ink/40 p-6">
                  <div className="font-mono text-[10px] uppercase tracking-eyebrow text-flare">
                    Pain
                  </div>
                  <p className="tnv-body mt-3 text-base text-pretty">{v.pain}</p>
                </div>
                <div className="bg-ink/40 p-6">
                  <div className="font-mono text-[10px] uppercase tracking-eyebrow text-cobalt-soft">
                    Soteria fit
                  </div>
                  <p className="tnv-body mt-3 text-base text-pretty">{v.fit}</p>
                </div>
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
                  <div className="font-serif text-3xl text-bone tracking-tight">
                    {v.signal.stat}
                  </div>
                  <div className="font-mono text-[10px] uppercase tracking-eyebrow text-fog mt-1">
                    {v.signal.label}
                  </div>
                </div>
              </div>
            </div>
          </article>
        ))}
      </section>

      {/* Cross-vertical capabilities */}
      <section className="tnv-container tnv-section mt-32">
        <Eyebrow index="07" label="ACROSS VERTICALS" />
        <h2 className="tnv-h2 mt-6 max-w-3xl text-balance">
          One stack. <span className="tnv-italic text-signal">Six industries.</span>
        </h2>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-bone/8 border border-bone/8">
          {crossCapabilities.map((c) => (
            <div key={c.t} className="bg-ink/40 p-6">
              <div className="text-flare font-mono text-[10px] uppercase tracking-eyebrow">→</div>
              <h3 className="font-serif text-xl text-bone mt-3 tracking-tight">{c.t}</h3>
              <p className="tnv-body mt-3 text-sm text-pretty">{c.b}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="tnv-container tnv-section mt-32">
        <div className="tnv-glass rounded-2xl p-10 md:p-16 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <Eyebrow label="START" />
            <h3 className="tnv-h3 mt-4 max-w-md">
              See Soteria in your environment.
            </h3>
          </div>
          <Link href="/contact" className="tnv-btn-signal">
            Request a demo <ArrowRight size={14} />
          </Link>
        </div>
      </section>
    </div>
  );
}
