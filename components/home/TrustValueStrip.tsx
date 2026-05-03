const items = [
  "AI-Driven Learning Systems",
  "Immersive VR & 3D Training",
  "Mobile-First Microlearning",
  "Built for Safety & Compliance",
  "Scalable for Enterprise Teams",
];

export function TrustValueStrip() {
  return (
    <section
      className="relative tnv-section py-8 border-y border-bone/8 bg-ink-soft/40 backdrop-blur-sm"
      aria-label="Capabilities at a glance"
    >
      <div className="tnv-container">
        <ul className="flex flex-wrap items-center justify-between gap-x-10 gap-y-4">
          {items.map((it, i) => (
            <li
              key={it}
              className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.2em] text-bone/85"
            >
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{
                  background: i % 2 === 0 ? "var(--tnv-cobalt)" : "var(--tnv-flare)",
                }}
                aria-hidden="true"
              />
              {it}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
