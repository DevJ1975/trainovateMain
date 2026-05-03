import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Eyebrow } from "@/components/ui/Eyebrow";

export function FinalCTA() {
  return (
    <section className="relative tnv-section py-32">
      <div className="tnv-container">
        <Eyebrow index="08" label="START" />
        <h2 className="tnv-h1 mt-6 max-w-5xl text-balance" style={{ fontSize: "clamp(40px, 6vw, 96px)" }}>
          Ship a training program{" "}
          <span className="tnv-italic text-signal">that actually works.</span>
        </h2>

        <p className="tnv-body mt-8 max-w-2xl text-pretty text-lg">
          Whether you operate a single site or a federal contract portfolio,
          we will build a training program engineered for the way your people
          actually work — and ship it on a timeline that compounds, not
          stalls.
        </p>

        <div className="mt-12 flex flex-wrap gap-3">
          <Link href="/contact" className="tnv-btn-signal">
            Request a Demo <ArrowRight size={14} />
          </Link>
          <Link
            href="/contact"
            className="tnv-btn-signal"
            style={{ background: "var(--tnv-flare)", borderColor: "var(--tnv-flare)" }}
          >
            Start Your Training Transformation
          </Link>
        </div>

        <div className="mt-20 pt-8 border-t border-bone/8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="font-mono text-[10px] uppercase tracking-eyebrow text-fog">
            Trainovate Technologies LLC · Las Vegas, NV · SDVOSB
          </div>
          <a
            href="mailto:info@trainovate.tech"
            className="font-mono text-[10px] uppercase tracking-eyebrow text-bone hover:text-cobalt-soft transition-colors"
          >
            info@trainovate.tech
          </a>
        </div>
      </div>
    </section>
  );
}
