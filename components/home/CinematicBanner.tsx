import Image from "next/image";

/**
 * CinematicBanner — single full-bleed B&W industrial photograph with a
 * bold overlay statement. Replaces the prior 6-tile PhotoStrip.
 *
 * The image is rendered grayscale with a cobalt + flare gradient lighting
 * pass and a dark vignette so the headline reads cleanly. Sits as a
 * full-width breath between content sections.
 */
export function CinematicBanner() {
  return (
    <section
      className="relative w-full overflow-hidden border-y border-bone/8"
      style={{ height: "clamp(420px, 70vh, 720px)" }}
      aria-label="Built for the people who keep the world running"
    >
      <Image
        src="https://images.unsplash.com/photo-1565939420829-6b8b9b1469bf?auto=format&fit=crop&w=2400&q=85"
        alt="Industrial worker on a manufacturing plant floor — Trainovate's training is built for people who do dangerous, complex, consequential work."
        fill
        priority={false}
        sizes="100vw"
        className="object-cover grayscale contrast-110 brightness-75"
      />

      {/* Cobalt cinematic side-light */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 80% at 18% 50%, rgba(0,70,230,0.32), transparent 55%)",
          mixBlendMode: "screen",
        }}
      />
      {/* Flare warm rim from opposite side */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 50% 70% at 95% 100%, rgba(255,107,26,0.28), transparent 55%)",
          mixBlendMode: "screen",
        }}
      />
      {/* Bottom and top fades for readability */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, rgba(10,10,10,0.55) 0%, rgba(10,10,10,0.0) 30%, rgba(10,10,10,0.0) 60%, rgba(10,10,10,0.92) 100%)",
        }}
      />

      {/* Overlay content */}
      <div className="absolute inset-0 flex items-end">
        <div className="tnv-container tnv-section pb-12 md:pb-20 w-full">
          <div className="max-w-4xl">
            <div className="flex items-center gap-3 mb-6">
              <span
                className="h-px w-12 bg-flare"
                aria-hidden="true"
              />
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
          </div>
        </div>
      </div>

      {/* Top-right metadata */}
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
