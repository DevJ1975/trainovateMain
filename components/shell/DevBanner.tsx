/**
 * DevBanner — thin top strip indicating the site is under active development.
 * Left side: blinking "ACTIVE BUILD" pill (with a pulsing flare-orange dot).
 * Right side: a scrolling marquee with development status notes.
 */

const marqueeItems = [
  "Site under development",
  "Copy & links are evolving",
  "Soteria platform in active build",
  "Capability statement pending publication",
  "Last build · 2026-05-03",
  "Founder photo pending",
  "Reach out via /contact",
  "Trainovate.ai",
];

export function DevBanner() {
  const sequence = [...marqueeItems, ...marqueeItems];

  return (
    <div
      role="status"
      aria-label="Site under active development"
      className="fixed top-0 inset-x-0 z-50 h-7 flex items-center bg-ink-soft/95 backdrop-blur-md border-b border-bone/10 overflow-hidden"
    >
      {/* Blinking badge */}
      <div className="flex-shrink-0 flex items-center gap-2 px-4 h-full border-r border-bone/10 bg-ink/60">
        <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
          <span className="absolute inline-flex h-full w-full rounded-full bg-flare opacity-60 animate-ping" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-flare" />
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-flare animate-blink">
          Active build
        </span>
      </div>

      {/* Scrolling message */}
      <div
        className="relative flex-1 h-full overflow-hidden"
        aria-hidden="true"
      >
        <div className="absolute inset-y-0 flex items-center whitespace-nowrap will-change-transform animate-marquee-fast">
          {sequence.map((item, i) => (
            <span
              key={i}
              className="font-mono text-[10px] uppercase tracking-[0.24em] text-fog mx-6 inline-flex items-center gap-6"
            >
              {item}
              <span className="text-flare/60" aria-hidden="true">
                ◆
              </span>
            </span>
          ))}
        </div>
        {/* Edge fades so text doesn't pop in/out hard */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-ink-soft to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-ink-soft to-transparent" />
      </div>

      {/* Screen-reader-friendly version of the marquee */}
      <span className="sr-only">
        Site under development. Copy and links are evolving.
      </span>
    </div>
  );
}
