import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Home } from "lucide-react";
import { Eyebrow } from "@/components/ui/Eyebrow";

export const metadata: Metadata = {
  title: "404 — Page not found",
  description:
    "The page you're looking for doesn't exist or has moved. Explore Trainovate.ai — workforce training systems, industries we serve, the Soteria FIELD SaaS, and more.",
  robots: { index: false, follow: true },
};

const links = [
  { href: "/", label: "Home", note: "The training platform overview" },
  { href: "/platform", label: "Solutions", note: "AI · VR · microlearning · LMS" },
  { href: "/industries", label: "Industries", note: "8 high-risk verticals we serve" },
  { href: "/about", label: "About", note: "Veteran-founded. Operator-built." },
  { href: "/podcast", label: "Operational Minds Podcast", note: "Coming soon" },
  { href: "/contact", label: "Contact", note: "Request a demo" },
];

export default function NotFound() {
  return (
    <div className="pt-32 md:pt-40 pb-24">
      <section className="tnv-container tnv-section">
        <Eyebrow label="404" />
        <h1 className="tnv-h1 mt-6 max-w-4xl text-balance">
          We couldn&rsquo;t find that page.{" "}
          <span className="tnv-italic text-signal">But you&rsquo;re close.</span>
        </h1>
        <p className="tnv-body mt-8 max-w-2xl text-pretty text-lg">
          The page you&rsquo;re looking for doesn&rsquo;t exist or has moved.
          Pick up where you left off below — or head back to the homepage.
        </p>

        <div className="mt-12 flex flex-wrap gap-3">
          <Link href="/" className="tnv-btn-signal">
            <Home size={14} />
            Back to home
          </Link>
          <Link href="/contact" className="tnv-btn-ghost">
            Talk to us
          </Link>
        </div>
      </section>

      <section className="tnv-container tnv-section mt-24">
        <Eyebrow index="01" label="WHERE TO NEXT" />
        <ul className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-bone/8 border border-bone/8">
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="bg-ink/40 hover:bg-ink-soft transition-colors p-7 group block h-full"
              >
                <div className="font-display font-semibold text-2xl text-bone tracking-tight group-hover:text-cobalt-soft transition-colors">
                  {l.label}
                </div>
                <p className="font-mono text-[11px] uppercase tracking-eyebrow text-fog mt-2">
                  {l.note}
                </p>
                <div className="mt-6 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-eyebrow text-cobalt-soft">
                  Go <ArrowRight size={12} />
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
