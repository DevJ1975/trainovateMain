import type { Metadata } from "next";
import Link from "next/link";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { products } from "@/lib/products";
import { ArrowUpRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Platform — Soteria",
  description:
    "Four products. One doctrine. Soteria Safeguard, FIELD, Learning, and Co-Pilot share a single xAPI evidence spine.",
};

export default function PlatformPage() {
  return (
    <div className="pt-32 md:pt-40 pb-24">
      <section className="tnv-container tnv-section">
        <Eyebrow index="01" label="PLATFORM" />
        <h1 className="tnv-h1 mt-6 max-w-5xl text-balance">
          Four products.{" "}
          <span className="tnv-italic text-signal">One doctrine.</span>
        </h1>
        <p className="tnv-body mt-8 max-w-2xl text-pretty">
          Soteria is the Trainovate platform — a connected stack of EHS,
          learning, and AI products that share a single xAPI evidence spine.
          Each product ships independently. Together, they instrument an entire
          safety operation.
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
    </div>
  );
}

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
