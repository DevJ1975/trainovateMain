import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Eyebrow } from "@/components/ui/Eyebrow";

const industries = [
  "Manufacturing",
  "Construction",
  "Warehousing & Logistics",
  "Aviation Maintenance",
  "Energy & Utilities",
  "Government & Public Sector",
  "Healthcare & Emergency Response",
];

export function IndustriesSnapshot() {
  return (
    <section className="relative tnv-section py-32">
      <div className="tnv-container">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-end">
          <div className="lg:col-span-7">
            <Eyebrow index="05" label="INDUSTRIES WE SERVE" />
            <h2 className="tnv-h2 mt-6 max-w-2xl text-balance">
              Built for{" "}
              <span className="tnv-italic text-signal">complex, high-risk environments.</span>
            </h2>
          </div>
          <p className="lg:col-span-5 tnv-body text-pretty">
            Trainovate supports organizations operating in complex,
            high-risk environments across regulated commercial industry,
            the federal mission space, and the enterprise.
          </p>
        </div>

        <ul className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-bone/8 border border-bone/8">
          {industries.map((it, i) => (
            <li
              key={it}
              className="bg-ink/40 hover:bg-ink-soft transition-colors p-6 flex items-baseline gap-4"
            >
              <span className="font-mono text-xs text-cobalt-soft tabular-nums">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="font-display font-semibold text-lg text-bone tracking-tight">
                {it}
              </span>
            </li>
          ))}
          {/* Filler tile to close the lg grid neatly */}
          <li className="bg-ink/40 p-6 hidden lg:flex items-center justify-center">
            <Link
              href="/industries"
              className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-eyebrow text-cobalt-soft hover:text-bone"
            >
              View All Industries <ArrowUpRight size={14} />
            </Link>
          </li>
        </ul>

        <div className="mt-10 flex justify-end lg:hidden">
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
