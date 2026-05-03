import type { Metadata } from "next";
import Link from "next/link";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { insights } from "@/lib/insights";

export const metadata: Metadata = {
  title: "Insights | Trainovate Workforce Training Blog",
  description:
    "Field notes on AI-powered workforce training, VR safety training, microlearning, OSHA compliance, and the Soteria FIELD SaaS LMS — from the Trainovate team.",
  alternates: { canonical: "/insights" },
};

const formatDate = (iso: string) =>
  new Date(iso + "T12:00:00Z").toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

export default function InsightsIndex() {
  return (
    <div className="pt-32 md:pt-40 pb-24">
      <section className="tnv-container tnv-section">
        <Eyebrow label="INSIGHTS" />
        <h1 className="tnv-h1 mt-6 max-w-4xl text-balance">
          Field notes from the <span className="tnv-italic text-signal">work.</span>
        </h1>
        <p className="tnv-body mt-8 max-w-2xl text-pretty">
          Operator-grade notes on EHS doctrine, training instrumentation, and
          the federal market for veteran-owned small business.
        </p>
      </section>

      <section className="tnv-container tnv-section mt-24">
        <div className="border-t border-bone/8">
          {insights.map((p, i) => (
            <Link
              key={p.slug}
              href={`/insights/${p.slug}`}
              className="group block border-b border-bone/8 py-10 hover:bg-carbon/40 transition-colors px-2 -mx-2"
            >
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-baseline">
                <div className="md:col-span-2 font-mono text-[10px] uppercase tracking-eyebrow text-fog">
                  <div>{String(i + 1).padStart(2, "0")} · {p.topic}</div>
                  <div className="mt-1">{formatDate(p.date)} · {p.readTime}</div>
                </div>
                <div className="md:col-span-8">
                  <h2 className="font-serif text-3xl md:text-4xl text-bone tracking-tight group-hover:text-signal transition-colors text-balance">
                    {p.title}
                  </h2>
                  <p className="tnv-body mt-3 text-base text-pretty max-w-2xl">
                    {p.excerpt}
                  </p>
                </div>
                <div className="md:col-span-2 flex md:justify-end">
                  {p.draft && (
                    <span className="font-mono text-[10px] uppercase tracking-eyebrow text-amber border border-amber/40 px-2 py-1">
                      Draft
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
