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
            <Eyebrow index="01" label="PODCAST" />
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
              </div>
            </div>
            <p className="mt-3 font-mono text-[10px] uppercase tracking-eyebrow text-fog text-center">
              Cover art · Operational Minds with Jamil Jones
            </p>
          </div>
        </div>
      </section>

      {/* Listen on */}
      <section className="tnv-container tnv-section mt-20">
        <Eyebrow index="02" label="LISTEN ANYWHERE" />
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-px bg-bone/8 border border-bone/8">
          {platforms.map((p) => {
            const Icon = p.icon;
            const url = podcast.links[p.key as keyof typeof podcast.links];
            return (
              <a
                key={p.key}
                href={url || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-ink/40 hover:bg-ink-soft transition-colors p-6 flex flex-col items-start gap-3 group"
              >
                <Icon className="text-cobalt group-hover:text-signal-soft transition-colors" size={20} />
                <div>
                  <div className="font-mono text-[11px] uppercase tracking-eyebrow text-bone group-hover:text-signal transition-colors">
                    {p.label}
                  </div>
                  <div className="font-mono text-[10px] uppercase tracking-eyebrow text-fog mt-1">
                    Subscribe
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      </section>

      {/* Episodes */}
      <section className="tnv-container tnv-section mt-24">
        <div className="flex items-end justify-between gap-6 flex-wrap">
          <div>
            <Eyebrow index="03" label="EPISODES" />
            <h2 className="tnv-h2 mt-6">Latest episodes.</h2>
          </div>
          <p className="tnv-body max-w-md text-pretty">
            New episodes drop every other Wednesday. Episode roster currently
            populated with placeholders.
          </p>
        </div>

        <div className="mt-12 border-t border-bone/8">
          {episodes.map((e) => (
            <article
              key={e.slug}
              className="grid grid-cols-1 md:grid-cols-12 gap-6 py-8 border-b border-bone/8"
            >
              <div className="md:col-span-1 font-display text-3xl md:text-4xl font-bold text-cobalt tabular-nums">
                {String(e.number).padStart(2, "0")}
              </div>

              <div className="md:col-span-7">
                <div className="font-mono text-[10px] uppercase tracking-eyebrow text-fog mb-2">
                  {formatDate(e.date)} · {e.duration}
                  {e.guest && (
                    <>
                      {" · "}
                      <span className="text-signal">with {e.guest}</span>
                    </>
                  )}
                </div>
                <h3 className="font-serif text-2xl md:text-3xl text-bone tracking-tight text-balance">
                  {e.title}
                </h3>
                <p className="tnv-body mt-3 text-base text-pretty max-w-xl">
                  {e.summary}
                </p>
              </div>

              <div className="md:col-span-4 flex md:justify-end items-start">
                <div className="flex flex-wrap gap-2">
                  {e.links.apple && (
                    <a href={e.links.apple} className="tnv-btn-ghost">
                      Apple
                    </a>
                  )}
                  {e.links.spotify && (
                    <a href={e.links.spotify} className="tnv-btn-ghost">
                      Spotify
                    </a>
                  )}
                  {e.links.youtube && (
                    <a href={e.links.youtube} className="tnv-btn-ghost">
                      YouTube
                    </a>
                  )}
                  {!e.links.apple && !e.links.spotify && !e.links.youtube && (
                    <span className="font-mono text-[10px] uppercase tracking-eyebrow text-flare border border-flare/40 px-2 py-1">
                      Links TBD
                    </span>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
