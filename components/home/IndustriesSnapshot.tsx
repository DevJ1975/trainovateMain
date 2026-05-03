import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Eyebrow } from "@/components/ui/Eyebrow";

const industries = [
  { n: "01", name: "Manufacturing", note: "Multi-site LOTO + machine guarding" },
  { n: "02", name: "Construction", note: "Mobile-first OSHA 10/30 + toolbox talks" },
  { n: "03", name: "Warehousing & Logistics", note: "Start-of-shift micro-learning" },
  { n: "04", name: "Aviation Maintenance", note: "Procedural sign-offs + tooling control" },
  { n: "05", name: "Energy & Utilities", note: "SIMOPS + AI incident drafting" },
  { n: "06", name: "Government", note: "SDVOSB · Section 508 native" },
  { n: "07", name: "Healthcare", note: "Protocol microlearning + 3D scenarios" },
];

export function IndustriesSnapshot() {
  return (
    <section className="relative tnv-section py-32">
      <div className="tnv-container">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-end">
          <div className="lg:col-span-7">
            <Eyebrow index="05" label="INDUSTRIES" />
            <h2 className="tnv-h2 mt-6 max-w-2xl text-balance">
              Wherever the cost of a missed step{" "}
              <span className="tnv-italic text-signal">is real.</span>
            </h2>
          </div>
          <p className="lg:col-span-5 tnv-body text-pretty">
            Trainovate ships in the industries that don&rsquo;t tolerate
            prototype-grade tooling. Below: where we&rsquo;re live or in
            active build.
          </p>
        </div>

        <div className="mt-16 border border-bone/8">
          {industries.map((it) => (
            <div
              key={it.n}
              className="flex items-baseline justify-between gap-6 px-6 py-5 border-b border-bone/8 last:border-b-0 bg-ink/30 hover:bg-ink-soft transition-colors"
            >
              <div className="flex items-baseline gap-6">
                <div className="font-mono text-sm text-cobalt-soft tabular-nums">
                  {it.n}
                </div>
                <div className="font-display font-semibold text-xl md:text-2xl text-bone tracking-tight">
                  {it.name}
                </div>
              </div>
              <div className="hidden md:block font-mono text-[11px] uppercase tracking-eyebrow text-fog">
                {it.note}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 flex justify-end">
          <Link
            href="/industries"
            className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-eyebrow text-cobalt-soft hover:text-bone border-b border-cobalt/40 hover:border-bone pb-1"
          >
            View All Industries <ArrowUpRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}
