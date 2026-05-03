import Image from "next/image";
import { Eyebrow } from "@/components/ui/Eyebrow";

/**
 * Industrial / manufacturing photography strip — black & white treatment.
 * Six stock images from Unsplash CDN, rendered grayscale + slightly darkened
 * with a cobalt edge gradient on hover. Sits between the Trust Strip and
 * Problem/Solution sections to ground the page in real-world environments.
 */

type Photo = {
  src: string;
  alt: string;
  caption: string;
  credit: { name: string; url: string };
};

const photos: Photo[] = [
  {
    src: "https://images.unsplash.com/photo-1565939420829-6b8b9b1469bf?auto=format&fit=crop&w=900&q=80",
    alt: "Manufacturing technician on the plant floor wearing PPE",
    caption: "Manufacturing",
    credit: { name: "Science in HD", url: "https://unsplash.com/@scienceinhd" },
  },
  {
    src: "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=900&q=80",
    alt: "Engineer working with technical equipment in industrial environment",
    caption: "Engineering",
    credit: { name: "ThisisEngineering", url: "https://unsplash.com/@thisisengineering" },
  },
  {
    src: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=900&q=80",
    alt: "Inspector reviewing data on a tablet during field work",
    caption: "Field inspection",
    credit: { name: "ThisisEngineering", url: "https://unsplash.com/@thisisengineering" },
  },
  {
    src: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?auto=format&fit=crop&w=900&q=80",
    alt: "Industrial refinery at night",
    caption: "Energy operations",
    credit: { name: "Patrick Hendry", url: "https://unsplash.com/@worldsbetweenlines" },
  },
  {
    src: "https://images.unsplash.com/photo-1581093588401-fbb62a02f120?auto=format&fit=crop&w=900&q=80",
    alt: "Industrial control panel with valves and gauges",
    caption: "Control systems",
    credit: { name: "ThisisEngineering", url: "https://unsplash.com/@thisisengineering" },
  },
  {
    src: "https://images.unsplash.com/photo-1581092335397-9583eb92d232?auto=format&fit=crop&w=900&q=80",
    alt: "Safety inspector with clipboard on the plant floor",
    caption: "Safety walks",
    credit: { name: "ThisisEngineering", url: "https://unsplash.com/@thisisengineering" },
  },
];

export function PhotoStrip() {
  return (
    <section className="relative tnv-section py-24 border-t border-bone/8">
      <div className="tnv-container">
        <div className="flex items-end justify-between gap-6 flex-wrap mb-10">
          <div>
            <Eyebrow label="WHERE WE SHIP" />
            <h2 className="font-display font-semibold tracking-tight mt-4 text-bone text-balance" style={{ fontSize: "clamp(24px, 3vw, 38px)", letterSpacing: "-0.02em" }}>
              The work happens here.
            </h2>
          </div>
          <p className="font-mono text-[11px] uppercase tracking-eyebrow text-fog max-w-sm text-right">
            Manufacturing · Energy · Construction · Aviation · Healthcare · Federal
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-px bg-bone/8 border border-bone/8">
          {photos.map((p, i) => (
            <figure
              key={p.src}
              className="relative aspect-[3/4] bg-ink overflow-hidden group"
            >
              <Image
                src={p.src}
                alt={p.alt}
                fill
                sizes="(min-width: 1024px) 16vw, (min-width: 768px) 33vw, 50vw"
                className="object-cover grayscale contrast-110 brightness-90 transition-all duration-700 group-hover:scale-105 group-hover:grayscale-[60%]"
              />
              {/* Bottom-up vignette so caption is readable */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(180deg, transparent 50%, rgba(10,10,10,0.95) 100%)",
                }}
              />
              {/* Subtle cobalt tint that warms on hover */}
              <div
                className="absolute inset-0 pointer-events-none mix-blend-screen opacity-30 group-hover:opacity-50 transition-opacity duration-700"
                style={{
                  background:
                    i % 2 === 0
                      ? "linear-gradient(135deg, rgba(0,70,230,0.20), transparent 60%)"
                      : "linear-gradient(135deg, rgba(255,107,26,0.16), transparent 60%)",
                }}
              />
              <figcaption className="absolute bottom-0 inset-x-0 p-4 z-10">
                <div className="font-mono text-[10px] uppercase tracking-eyebrow text-cobalt-soft">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div className="font-display font-semibold text-base text-bone mt-1 tracking-tight">
                  {p.caption}
                </div>
              </figcaption>
            </figure>
          ))}
        </div>

        <p className="mt-6 font-mono text-[10px] uppercase tracking-eyebrow text-fog/70">
          Imagery: Unsplash · ThisisEngineering · Science in HD · Patrick Hendry
        </p>
      </div>
    </section>
  );
}
