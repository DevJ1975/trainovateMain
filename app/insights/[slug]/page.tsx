import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { insights, getInsight } from "@/lib/insights";

type Params = { slug: string };

export async function generateStaticParams() {
  return insights.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = getInsight(slug);
  if (!p) return {};
  return { title: p.title, description: p.excerpt };
}

const formatDate = (iso: string) =>
  new Date(iso + "T12:00:00Z").toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

export default async function InsightPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const p = getInsight(slug);
  if (!p) notFound();

  return (
    <article className="pt-32 md:pt-40 pb-24">
      <div className="tnv-container tnv-section">
        <Link
          href="/insights"
          className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-eyebrow text-fog hover:text-signal transition-colors"
        >
          <ArrowLeft size={14} /> All insights
        </Link>

        <header className="mt-12 max-w-3xl">
          <Eyebrow label={p.topic} />
          <h1 className="tnv-h1 mt-6 text-balance" style={{ fontSize: "clamp(40px, 6vw, 84px)" }}>
            {p.title}
          </h1>
          <div className="mt-8 flex items-center gap-4 font-mono text-[11px] uppercase tracking-eyebrow text-fog">
            <span>{formatDate(p.date)}</span>
            <span aria-hidden>·</span>
            <span>{p.readTime}</span>
            {p.draft && (
              <span className="text-amber border border-amber/40 px-2 py-1">Draft</span>
            )}
          </div>
        </header>

        <div className="mt-16 max-w-3xl">
          {p.body.map((para, i) => (
            <p
              key={i}
              className="font-serif text-xl md:text-2xl text-bone/90 leading-[1.55] mb-6 text-pretty"
              style={{ letterSpacing: "-0.01em" }}
            >
              {para}
            </p>
          ))}
        </div>

        <div className="mt-24 max-w-3xl border-t border-bone/8 pt-10 flex items-center justify-between gap-4">
          <div className="font-mono text-[11px] uppercase tracking-eyebrow text-fog">
            — Trainovate Technologies
          </div>
          <Link href="/contact" className="tnv-btn-ghost">
            Talk to us
          </Link>
        </div>
      </div>
    </article>
  );
}
