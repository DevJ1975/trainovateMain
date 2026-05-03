"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

/**
 * CinematicBanner — full-bleed B&W industrial photography with parallax
 * scroll + slow cross-fade between four images.
 *
 * Parallax: each image translates vertically based on the section's
 * position relative to the viewport (slower than scroll, ~30% factor).
 * Cross-fade: 6-second interval rotation with a 1.6s opacity transition.
 * Ken Burns: the active image slowly scales up while it's on screen.
 *
 * Both effects respect prefers-reduced-motion.
 */

const slides = [
  {
    src: "https://images.unsplash.com/photo-1565939420829-6b8b9b1469bf?auto=format&fit=crop&w=2400&q=85",
    alt: "Industrial worker on a manufacturing plant floor",
    caption: "Manufacturing",
  },
  {
    src: "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=2400&q=85",
    alt: "Engineer working with technical equipment",
    caption: "Engineering",
  },
  {
    src: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?auto=format&fit=crop&w=2400&q=85",
    alt: "Industrial refinery at night",
    caption: "Energy operations",
  },
  {
    src: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=2400&q=85",
    alt: "Inspector reviewing data on a tablet during field work",
    caption: "Field inspection",
  },
];

const ROTATE_MS = 6000;

export function CinematicBanner() {
  const sectionRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const [parallaxY, setParallaxY] = useState(0);
  const [reduced, setReduced] = useState(false);

  // prefers-reduced-motion gate
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // Auto-rotate the active slide
  useEffect(() => {
    if (reduced) return;
    const id = setInterval(() => {
      setActive((i) => (i + 1) % slides.length);
    }, ROTATE_MS);
    return () => clearInterval(id);
  }, [reduced]);

  // Parallax — translate the image stack based on section's viewport position
  useEffect(() => {
    if (reduced) return;
    let raf = 0;
    const update = () => {
      const el = sectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // progress: -1 when section is below viewport, 0 when centered, +1 when above
      const center = rect.top + rect.height / 2;
      const progress = (center - vh / 2) / (vh / 2 + rect.height / 2);
      // Scale to a comfortable parallax range (~ ±60px)
      setParallaxY(progress * -60);
      raf = 0;
    };
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [reduced]);

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden border-y border-bone/8"
      style={{ height: "clamp(440px, 72vh, 760px)" }}
      aria-label="Built for the people who keep the world running"
    >
      {/* Image stack — each absolutely positioned, opacity-cross-faded,
          parallax-translated, with a slow Ken Burns scale on the active one */}
      <div
        className="absolute inset-0"
        style={{
          transform: `translate3d(0, ${parallaxY}px, 0)`,
          willChange: "transform",
        }}
      >
        {slides.map((s, i) => {
          const isActive = i === active;
          return (
            <div
              key={s.src}
              className="absolute inset-0 transition-opacity duration-[1600ms] ease-out"
              style={{
                opacity: isActive ? 1 : 0,
              }}
              aria-hidden={!isActive}
            >
              <Image
                src={s.src}
                alt={s.alt}
                fill
                priority={i === 0}
                sizes="100vw"
                className="object-cover grayscale contrast-110 brightness-75"
                style={{
                  transform: isActive && !reduced ? "scale(1.06)" : "scale(1.0)",
                  transition: "transform 8s ease-out",
                  willChange: "transform",
                }}
              />
            </div>
          );
        })}
      </div>

      {/* Cobalt cinematic side-light */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 80% at 18% 50%, rgba(0,70,230,0.32), transparent 55%)",
          mixBlendMode: "screen",
        }}
      />
      {/* Flare warm rim */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 50% 70% at 95% 100%, rgba(255,107,26,0.28), transparent 55%)",
          mixBlendMode: "screen",
        }}
      />
      {/* Top + bottom vignette for readability */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, rgba(10,10,10,0.6) 0%, rgba(10,10,10,0) 26%, rgba(10,10,10,0) 58%, rgba(10,10,10,0.95) 100%)",
        }}
      />

      {/* Overlay content */}
      <div className="absolute inset-0 flex items-end">
        <div className="tnv-container tnv-section pb-12 md:pb-20 w-full">
          <div className="max-w-4xl">
            <div className="flex items-center gap-3 mb-6">
              <span className="h-px w-12 bg-flare" aria-hidden="true" />
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-flare">
                Who we build for
              </span>
            </div>
            <h2
              className="font-display font-semibold tracking-tight text-bone text-balance"
              style={{
                fontSize: "clamp(36px, 6vw, 88px)",
                lineHeight: 0.98,
                letterSpacing: "-0.03em",
              }}
            >
              The workforce that keeps the world running.{" "}
              <span className="tnv-italic text-signal">That&rsquo;s who we build for.</span>
            </h2>

            {/* Slide caption + position indicator */}
            <div className="mt-8 flex items-center gap-6">
              <div
                className="font-mono text-[10px] uppercase tracking-[0.24em] text-bone/85"
                aria-live="polite"
              >
                {String(active + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")} ·{" "}
                <span className="text-cobalt-soft">{slides[active].caption}</span>
              </div>
              <div className="flex items-center gap-1.5">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActive(i)}
                    aria-label={`Show ${slides[i].caption}`}
                    aria-current={i === active}
                    className="h-1 transition-all"
                    style={{
                      width: i === active ? 28 : 12,
                      background:
                        i === active ? "var(--tnv-cobalt)" : "rgba(244,241,234,0.25)",
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Top-right live status */}
      <div className="absolute top-6 right-6 md:top-10 md:right-10 z-10 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.24em] text-bone/70">
        <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
          <span className="absolute inline-flex h-full w-full rounded-full bg-cobalt opacity-70 animate-ping" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-cobalt" />
        </span>
        Trainovate · Field
      </div>
    </section>
  );
}
