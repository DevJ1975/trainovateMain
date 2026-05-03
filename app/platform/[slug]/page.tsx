import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Check } from "lucide-react";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { StockImage } from "@/components/ui/StockImage";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { products, getProduct } from "@/lib/products";

type Params = { slug: string };

export async function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = getProduct(slug);
  if (!p) return {};
  return {
    title: `${p.full} — ${p.tagline}`,
    description: p.description,
  };
}

export default async function ProductPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const p = getProduct(slug);
  if (!p) notFound();

  const Mark = p.mark;
  const next = products[(products.findIndex((x) => x.slug === p.slug) + 1) % products.length];

  return (
    <div className="pt-32 md:pt-40 pb-24">
      {/* Breadcrumbs */}
      <div className="tnv-container tnv-section mb-8">
        <Breadcrumbs
          items={[
            { name: "Home", href: "/" },
            { name: "Solutions", href: "/platform" },
            { name: p.full, href: `/platform/${p.slug}` },
          ]}
        />
      </div>

      {/* Hero */}
      <section className="tnv-container tnv-section">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end">
          <div className="lg:col-span-7">
            <Eyebrow index={p.index} label={p.name.toUpperCase()} />
            <h1 className="tnv-h1 mt-6 max-w-3xl text-balance">
              <span className="tnv-italic">{p.tagline.replace(/[.]+$/, "")}.</span>
            </h1>
            <p className="tnv-body mt-8 max-w-xl text-pretty">{p.description}</p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link href="/contact" className="tnv-btn-signal">
                Request a demo
              </Link>
              <Link href="/platform" className="tnv-btn-ghost">
                All platform
              </Link>
            </div>
          </div>
          <div className="lg:col-span-5">
            <div className="relative">
              <StockImage
                stockKey={p.stockKey}
                className="aspect-[4/5] w-full"
                priority
                sizes="(min-width: 1024px) 40vw, 100vw"
              />
              <div className="absolute -top-6 -left-6 tnv-glass p-4 rounded-md">
                <Mark className="h-10 w-10 text-signal" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What it does */}
      <section className="tnv-container tnv-section mt-32">
        <Eyebrow index={`${p.index}.A`} label="WHAT IT DOES" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-bone/8 mt-10">
          {p.features.slice(0, 3).map((f) => (
            <div key={f.title} className="bg-void p-8">
              <Check className="text-signal mb-4" size={18} />
              <h3 className="font-mono text-[11px] uppercase tracking-eyebrow text-bone">
                {f.title}
              </h3>
              <p className="tnv-body mt-3 text-sm">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Feature grid (full) */}
      <section className="tnv-container tnv-section mt-24">
        <Eyebrow index={`${p.index}.B`} label="CAPABILITIES" />
        <h2 className="tnv-h2 mt-6 max-w-3xl text-balance">
          Built for operators who own the audit.
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-bone/8 mt-12 border border-bone/8">
          {p.features.map((f, i) => (
            <div key={f.title} className="bg-void p-8">
              <div className="font-mono text-[10px] uppercase tracking-eyebrow text-fog">
                {String(i + 1).padStart(2, "0")}
              </div>
              <h3 className="font-serif text-2xl mt-3 text-bone tracking-tight">{f.title}</h3>
              <p className="tnv-body mt-3 text-sm text-pretty">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Deploy */}
      <section className="tnv-container tnv-section mt-32">
        <Eyebrow index={`${p.index}.C`} label="HOW IT DEPLOYS" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
          {p.deploy.map((d, i) => (
            <div key={d.step} className="relative">
              <div className="font-mono text-[10px] uppercase tracking-eyebrow text-signal">
                Step {String(i + 1).padStart(2, "0")}
              </div>
              <div className="font-serif text-3xl text-bone mt-3 tracking-tight">{d.step}</div>
              <p className="tnv-body mt-4 text-sm text-pretty">{d.body}</p>
              {i < p.deploy.length - 1 && (
                <ArrowRight
                  className="hidden md:block absolute top-2 -right-4 text-fog/50"
                  size={16}
                />
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Compliance */}
      <section className="tnv-container tnv-section mt-32">
        <div className="border-y border-bone/8 py-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <Eyebrow index={`${p.index}.D`} label="COMPLIANCE & STANDARDS" />
          <div className="flex flex-wrap gap-4">
            {p.compliance.map((c) => (
              <span
                key={c}
                className="font-mono text-[11px] uppercase tracking-eyebrow text-bone/80 border border-bone/15 px-3 py-2"
              >
                {c}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA + next */}
      <section className="tnv-container tnv-section mt-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="tnv-glass rounded-2xl p-10">
            <Eyebrow label="START" />
            <h3 className="tnv-h3 mt-4">See {p.name} in your environment.</h3>
            <p className="tnv-body mt-4">
              30-minute working session. We map {p.name} to your real workflow,
              not a generic deck.
            </p>
            <Link href="/contact" className="tnv-btn-signal mt-8">
              Request a demo
            </Link>
          </div>
          <Link
            href={`/platform/${next.slug}`}
            className="tnv-glass rounded-2xl p-10 group"
          >
            <Eyebrow label="NEXT" tone="fog" />
            <h3 className="tnv-h3 mt-4 text-bone group-hover:text-signal transition-colors">
              {next.full}
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
