import type { Metadata } from "next";
import Image from "next/image";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { podcast, episodes } from "@/lib/podcast";
import { Headphones, Mic, ExternalLink, Rss } from "lucide-react";

export const metadata: Metadata = {
  title: `${podcast.name} — The Trainovate.ai podcast`,
  description: podcast.description,
};

const formatDate = (iso: string) =>
  new Date(iso + "T12:00:00Z").toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

const platforms = [
  { key: "apple", label: "Apple Podcasts", icon: Headphones },
  { key: "spotify", label: "Spotify", icon: Mic },
  { key: "youtube", label: "YouTube", icon: ExternalLink },
  { key: "overcast", label: "Overcast", icon: Headphones },
  { key: "rss", label: "RSS", icon: Rss },
] as const;

export default function PodcastPage() {
  return (
    <div className="pt-32 md:pt-40 pb-24">
      {/* Hero */}
      <section className="tnv-container tnv-section">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end">
          <div className="lg:col-span-7">
            <div className="flex items-center gap-3">
              <Eyebrow index="01" label="PODCAST" />
              <ComingSoonPill />
            </div>
            <h1 className="tnv-h1 mt-6 text-balance">
              {podcast.name.split(" ").map((w, i, a) =>
                i === a.length - 1 ? (
                  <span key={i} className="tnv-italic text-signal">
                    {w}.
                  </span>
                ) : (
                  <span key={i}>{w} </span>
                )
              )}
            </h1>
            <p className="font-display font-medium text-xl text-bone/85 mt-6 max-w-xl text-pretty">
              with Jamil Jones
            </p>
            <p className="tnv-body mt-6 max-w-xl text-pretty">
              {podcast.description}
            </p>

            {/* Show pillars */}
            <ul className="mt-10 flex flex-wrap gap-2">
              {podcast.pillars.map((p) => (
                <li
                  key={p}
                  className="font-mono text-[11px] uppercase tracking-eyebrow text-bone/85 border border-bone/15 px-3 py-2"
                >
                  {p}
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-5">
            <div className="tnv-glass aspect-square rounded-2xl relative overflow-hidden p-2">
              <div className="relative w-full h-full overflow-hidden rounded-xl bg-ink-soft">
                <Image
                  src={podcast.coverArt}
                  alt={`${podcast.name} podcast cover art`}
                  fill
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  className="object-cover"
                  priority
                />
                {/* Coming Soon ribbon overlay on the cover */}
                <div className="absolute top-4 right-4 z-10">
                  <div className="flex items-center gap-2 bg-flare text-ink font-mono text-[10px] uppercase tracking-[0.24em] px-3 py-2 shadow-lg">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="absolute inline-flex h-full w-full rounded-full bg-ink/60 opacity-70 animate-ping" />
                      <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-ink" />
                    </span>
                    Coming Soon
                  </div>
                </div>
              </div>
            </div>
            <p className="mt-3 font-mono text-[10px] uppercase tracking-eyebrow text-fog text-center">
              Cover art · Operational Minds with Jamil Jones
            </p>
          </div>
        </div>
      </section>

      {/* Listen on */}
      {/* Coming Soon banner */}
      <section className="tnv-container tnv-section mt-20">
        <div className="tnv-glass rounded-2xl p-8 md:p-12 relative overflow-hidden">
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 80% 60% at 30% 20%, rgba(0,70,230,0.16), transparent 60%), radial-gradient(ellipse 60% 70% at 80% 80%, rgba(255,107,26,0.18), transparent 55%)",
            }}
            aria-hidden="true"
          />
          <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-8">
              <ComingSoonPill />
              <h2
                className="font-display font-semibold tracking-tight mt-5 text-bone text-balance"
                style={{ fontSize: "clamp(28px, 4vw, 48px)", letterSpacing: "-0.025em" }}
              >
                Operational Minds is{" "}
                <span className="text-flare">launching soon.</span>
              </h2>
              <p className="tnv-body mt-4 text-pretty max-w-2xl">
                Subscribe links, the episode roster, and the first episode
                drop are all on the way. In the meantime, follow Trainovate
                or reach out to be notified at launch.
              </p>
            </div>
            <div className="lg:col-span-4 flex lg:justify-end">
              <a href="/contact" className="tnv-btn-signal">
                Get launch updates
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Listen on — surface platforms but mark them as Coming Soon */}
      <section className="tnv-container tnv-section mt-24">
        <div className="flex items-end justify-between gap-6 flex-wrap mb-6">
          <Eyebrow index="02" label="LISTEN ANYWHERE — COMING SOON" />
          <span className="font-mono text-[10px] uppercase tracking-eyebrow text-fog">
            Subscribe links wire up at launch
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-px bg-bone/8 border border-bone/8">
          {platforms.map((p) => {
            const Icon = p.icon;
            return (
              <div
                key={p.key}
                className="bg-ink/40 p-6 flex flex-col items-start gap-3 opacity-70"
                aria-disabled
              >
                <Icon className="text-cobalt-soft" size={20} />
                <div>
                  <div className="font-mono text-[11px] uppercase tracking-eyebrow text-bone">
                    {p.label}
                  </div>
                  <div className="font-mono text-[10px] uppercase tracking-eyebrow text-flare mt-1">
                    Coming Soon
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Episodes — mock roster behind a Coming Soon overlay */}
      <section className="tnv-container tnv-section mt-24">
        <div className="flex items-end justify-between gap-6 flex-wrap">
          <div>
            <Eyebrow index="03" label="EPISODES" />
            <h2 className="tnv-h2 mt-6">First episodes drop soon.</h2>
          </div>
          <p className="tnv-body max-w-md text-pretty">
            New episodes will land every other Wednesday once the show goes
            live. The roster below is a preview placeholder.
          </p>
        </div>

        <div className="mt-12 border-t border-bone/8 relative">
          {/* Dimmed placeholder roster */}
          <div className="opacity-30 pointer-events-none select-none" aria-hidden="true">
            {episodes.slice(0, 3).map((e) => (
              <article
                key={e.slug}
                className="grid grid-cols-1 md:grid-cols-12 gap-6 py-8 border-b border-bone/8"
              >
                <div className="md:col-span-1 font-display text-3xl md:text-4xl font-bold text-cobalt tabular-nums">
                  {String(e.number).padStart(2, "0")}
                </div>
                <div className="md:col-span-11">
                  <div className="font-mono text-[10px] uppercase tracking-eyebrow text-fog mb-2">
                    {formatDate(e.date)} · {e.duration}
                  </div>
                  <h3 className="font-serif text-2xl md:text-3xl text-bone tracking-tight">
                    {e.title}
                  </h3>
                  <p className="tnv-body mt-3 text-base max-w-xl">{e.summary}</p>
                </div>
              </article>
            ))}
          </div>

          {/* Coming Soon overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="tnv-glass rounded-xl px-8 py-6 text-center max-w-sm">
              <ComingSoonPill className="mx-auto" />
              <p className="font-display font-semibold text-xl text-bone mt-4 tracking-tight">
                Episodes go live at launch.
              </p>
              <p className="font-mono text-[10px] uppercase tracking-eyebrow text-fog mt-3">
                Be the first to hear them.
              </p>
              <a href="/contact" className="tnv-btn-ghost mt-5 w-full justify-center">
                Notify me
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function ComingSoonPill({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-2 bg-flare/15 text-flare border border-flare/40 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.24em] ${className}`}
    >
      <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
        <span className="absolute inline-flex h-full w-full rounded-full bg-flare opacity-70 animate-ping" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-flare" />
      </span>
      Coming Soon
    </span>
  );
}
