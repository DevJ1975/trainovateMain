const items = [
  "ISO 45001",
  "OSHA-aligned",
  "xAPI",
  "SCORM 1.2 / 2004",
  "Section 508",
  "FedRAMP-pursuit",
  "NIST 800-171",
  "WCAG 2.1 AA",
  "ANSI Z244.1",
  "29 CFR 1910",
];

export function MarqueeStrip() {
  const sequence = [...items, ...items];
  return (
    <div
      className="relative overflow-hidden border-y border-bone/5 bg-carbon/30 py-4"
      aria-hidden="true"
    >
      <div className="flex animate-marquee whitespace-nowrap will-change-transform">
        {sequence.map((it, i) => (
          <span
            key={i}
            className="font-mono text-[11px] uppercase tracking-marquee text-fog mx-8 flex items-center gap-8"
          >
            {it}
            <span className="text-signal/40">·</span>
          </span>
        ))}
      </div>
    </div>
  );
}
