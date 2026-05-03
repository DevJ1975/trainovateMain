import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Check } from "lucide-react";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { StockImage } from "@/components/ui/StockImage";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { industries, getIndustry } from "@/lib/industries";

type Params = { slug: string };

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://trainovate.ai";

export async function generateStaticParams() {
  return industries.map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const i = getIndustry(slug);
  if (!i) return {};
  return {
    title: i.seoTitle,
    description: i.seoDescription,
    keywords: i.keywords,
    alternates: { canonical: `/industries/${i.slug}` },
    openGraph: {
      title: i.seoTitle,
      description: i.seoDescription,
      url: `/industries/${i.slug}`,
      type: "website",
    },
  };
}

export default async function IndustryPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const i = getIndustry(slug);
  if (!i) notFound();

  const idx = industries.findIndex((x) => x.slug === i.slug);
  const next = industries[(idx + 1) % industries.length];

  // Service schema specific to this vertical
  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: `${i.name} Workforce Training`,
    name: i.seoTitle,
    description: i.seoDescription,
    url: `${siteUrl}/industries/${i.slug}`,
    provider: {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: "Trainovate Technologies",
    },
    areaServed: { "@type": "Country", name: "United States" },
    audience: {
      "@type": "BusinessAudience",
      audienceType: i.name,
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: `${i.name} training programs`,
      itemListElement: i.programs.map((p) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: p.t,
          description: p.b,
        },
      })),
    },
  };

  return (
    <div className="pt-32 md:pt-40 pb-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />

      {/* Breadcrumbs */}
      <div className="tnv-container tnv-section mb-8">
        <Breadcrumbs
          items={[
            { name: "Home", href: "/" },
            { name: "Industries", href: "/industries" },
            { name: i.name, href: `/industries/${i.slug}` },
          ]}
        />
      </div>

      {/* Hero */}
      <section className="tnv-container tnv-section">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end">
          <div className="lg:col-span-7">
            <Eyebrow index={i.index} label={i.name.toUpperCase()} />
            <h1 className="tnv-h1 mt-6 max-w-3xl text-balance">{i.tagline}</h1>
            <p className="tnv-body mt-8 max-w-xl text-pretty text-lg">
              {i.intro}
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link href="/contact" className="tnv-btn-signal">
                Request a Demo <ArrowRight size={14} />
              </Link>
              <Link href="/platform" className="tnv-btn-ghost">
                Explore Solutions
              </Link>
            </div>
          </div>
          <div className="lg:col-span-5">
            <StockImage
              stockKey={i.stockKey}
              className="aspect-[4/5] w-full"
              priority
              sizes="(min-width: 1024px) 40vw, 100vw"
            />
          </div>
        </div>
      </section>

      {/* Capabilities + Frameworks + Signal */}
      <section className="tnv-container tnv-section mt-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-bone/8 border border-bone/8">
          {i.capabilities.map((c) => (
            <div key={c} className="bg-ink/40 p-6">
              <div className="font-mono text-[10px] uppercase tracking-eyebrow text-cobalt-soft">→</div>
              <div className="font-display font-semibold text-lg text-bone mt-2">{c}</div>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap items-baseline justify-between gap-6">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-eyebrow text-fog">
              Aligned to
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {i.frameworks.map((f) => (
                <span
                  key={f}
                  className="font-mono text-[10px] uppercase tracking-eyebrow text-bone/85 border border-bone/15 px-2 py-1"
                >
                  {f}
                </span>
              ))}
            </div>
          </div>
          <div className="border-l-2 border-flare pl-4">
            <div className="font-display font-semibold text-3xl text-bone tracking-tight">
              {i.signal.stat}
            </div>
            <div className="font-mono text-[10px] uppercase tracking-eyebrow text-fog mt-1">
              {i.signal.label}
            </div>
          </div>
        </div>
      </section>

      {/* Challenges */}
      <section className="tnv-container tnv-section mt-32">
        <Eyebrow index={`${i.index}.A`} label="WHAT WE SOLVE" />
        <h2 className="tnv-h2 mt-6 max-w-3xl text-balance">
          The challenges{" "}
          <span className="tnv-italic text-signal">{i.shortName}</span> teams face.
        </h2>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-px bg-bone/8 border border-bone/8">
          {i.challenges.map((c) => (
            <div key={c.t} className="bg-ink/40 p-7">
              <Check className="text-flare mb-4" size={18} />
              <h3 className="font-display font-semibold text-xl text-bone tracking-tight">
                {c.t}
              </h3>
              <p className="tnv-body mt-3 text-base text-pretty">{c.b}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Programs */}
      <section className="tnv-container tnv-section mt-32">
        <Eyebrow index={`${i.index}.B`} label="HOW WE SHIP" />
        <h2 className="tnv-h2 mt-6 max-w-3xl text-balance">
          Programs built for{" "}
          <span className="tnv-italic text-signal">{i.shortName}.</span>
        </h2>
        <div className="mt-12 space-y-8">
          {i.programs.map((p, n) => (
            <div
              key={p.t}
              className="grid grid-cols-1 md:grid-cols-12 gap-6 border-l-2 border-cobalt pl-6 py-4"
            >
              <div className="md:col-span-1 font-mono text-xs text-cobalt-soft tabular-nums">
                {String(n + 1).padStart(2, "0")}
              </div>
              <div className="md:col-span-11">
                <h3 className="font-display font-semibold text-2xl text-bone tracking-tight">
                  {p.t}
                </h3>
                <p className="tnv-body mt-3 text-base text-pretty max-w-3xl">
                  {p.b}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Outcomes */}
      <section className="tnv-container tnv-section mt-32">
        <Eyebrow index={`${i.index}.C`} label="OUTCOMES" />
        <h2 className="tnv-h2 mt-6 max-w-3xl text-balance">
          What changes when{" "}
          <span className="tnv-italic text-signal">we ship.</span>
        </h2>
        <ul className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-px bg-bone/8 border border-bone/8">
          {i.outcomes.map((o) => (
            <li key={o} className="bg-ink/40 p-6 flex items-start gap-3">
              <span className="text-cobalt-soft mt-1 flex-shrink-0">→</span>
              <span className="font-display font-medium text-lg text-bone tracking-tight">
                {o}
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* CTA + next industry */}
      <section className="tnv-container tnv-section mt-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="tnv-glass rounded-2xl p-10">
            <Eyebrow label="START" />
            <h3 className="tnv-h3 mt-4">See Soteria in your environment.</h3>
            <p className="tnv-body mt-4">
              30-minute working session. We map Trainovate to your real
              workflow — no generic deck.
            </p>
            <Link href="/contact" className="tnv-btn-signal mt-8">
              Request a Demo
            </Link>
          </div>
          <Link
            href={`/industries/${next.slug}`}
            className="tnv-glass rounded-2xl p-10 group"
          >
            <Eyebrow label="NEXT INDUSTRY" tone="fog" />
            <h3 className="tnv-h3 mt-4 text-bone group-hover:text-signal transition-colors">
              {next.name}
            </h3>
            <p className="tnv-body mt-4">{next.tagline}</p>
            <div className="mt-8 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-eyebrow group-hover:text-signal">
              Continue <ArrowUpRight size={14} />
            </div>
          </Link>
        </div>
      </section>
    </div>
  );
}
