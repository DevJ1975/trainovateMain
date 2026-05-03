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
  return {
    title: p.title,
    description: p.excerpt,
    alternates: { canonical: `/insights/${p.slug}` },
    openGraph: {
      title: p.title,
      description: p.excerpt,
      url: `/insights/${p.slug}`,
      type: "article",
      publishedTime: p.date,
      authors: ["Trainovate Technologies"],
      tags: [p.topic],
    },
    robots: p.draft ? { index: false, follow: true } : { index: true, follow: true },
  };
}

const formatDate = (iso: string) =>
  new Date(iso + "T12:00:00Z").toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://trainovate.ai";

export default async function InsightPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const p = getInsight(slug);
  if (!p) notFound();

  const wordCount = p.body.join(" ").split(/\s+/).length;
  const blogPostingJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: p.title,
    description: p.excerpt,
    datePublished: p.date,
    dateModified: p.date,
    author: {
      "@type": "Organization",
      name: "Trainovate Technologies",
      url: siteUrl,
    },
    publisher: {
      "@type": "Organization",
      name: "Trainovate Technologies",
      logo: { "@type": "ImageObject", url: `${siteUrl}/icon.svg` },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": `${siteUrl}/insights/${p.slug}` },
    wordCount,
    articleSection: p.topic,
    image: `${siteUrl}/opengraph-image`,
  };

  return (
    <article className="pt-32 md:pt-40 pb-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingJsonLd) }}
      />
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
            — Trainovate.ai
          </div>
          <Link href="/contact" className="tnv-btn-ghost">
            Talk to us
          </Link>
        </div>
      </div>
    </article>
  );
}
