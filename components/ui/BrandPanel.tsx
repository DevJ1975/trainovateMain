/**
 * BrandPanel — generated SVG illustrations replacing stock photography.
 *
 * Each "slot" maps to a distinct technical-drawing style in the Trainovate
 * brand palette (cobalt + flare on ink). Renders deterministically — no
 * external assets, no broken hot-links, fully on-brand.
 */

type Treatment = "default" | "cool" | "warm";

const slotMeta: Record<
  string,
  { kind: PanelKind; eyebrow: string; title: string }
> = {
  "hero.bg": { kind: "topology", eyebrow: "INGRESS", title: "" },

  "field.manufacturing": { kind: "machine", eyebrow: "VERTICAL · 01", title: "Manufacturing" },
  "field.warehouse": { kind: "racks", eyebrow: "VERTICAL · 02", title: "Warehousing" },
  "field.aviation": { kind: "aircraft", eyebrow: "VERTICAL · 03", title: "Aviation MRO" },
  "field.cannabis": { kind: "lattice", eyebrow: "VERTICAL · 04", title: "Cannabis" },
  "field.energy": { kind: "tank", eyebrow: "VERTICAL · 05", title: "Energy · SIMOPS" },
  "field.food": { kind: "conveyor", eyebrow: "VERTICAL · 06", title: "Food Processing" },

  "services.classroom": { kind: "topology", eyebrow: "SERVICE", title: "Training delivery" },
  "services.fieldwalk": { kind: "machine", eyebrow: "SERVICE", title: "On-site audit" },

  "federal.dod": { kind: "radar", eyebrow: "FEDERAL · DOD", title: "Operations" },
  "federal.va": { kind: "lattice", eyebrow: "FEDERAL · VA", title: "Veteran services" },

  "about.founder": { kind: "portrait", eyebrow: "FOUNDER", title: "Jamil 'Jay' Jones" },
  "about.team": { kind: "topology", eyebrow: "TEAM", title: "Hiring engineers" },

  "platform.safeguard": { kind: "shield", eyebrow: "SOTERIA · 02", title: "Safeguard" },
  "platform.field": { kind: "racks", eyebrow: "SOTERIA · 03", title: "FIELD" },
  "platform.learning": { kind: "tablet", eyebrow: "SOTERIA · 04", title: "Learning" },
  "platform.copilot": { kind: "radar", eyebrow: "SOTERIA · 05", title: "Co-Pilot" },
};

type PanelKind =
  | "topology"
  | "machine"
  | "racks"
  | "aircraft"
  | "lattice"
  | "tank"
  | "conveyor"
  | "radar"
  | "portrait"
  | "shield"
  | "tablet";

export function BrandPanel({
  slot,
  className = "",
  treatment = "default",
  label,
}: {
  slot: string;
  className?: string;
  treatment?: Treatment;
  label?: string;
}) {
  const meta = slotMeta[slot] ?? { kind: "topology" as PanelKind, eyebrow: "PANEL", title: "" };
  const eyebrow = label ?? meta.eyebrow;

  const tint =
    treatment === "warm"
      ? "linear-gradient(135deg, rgba(255,107,26,0.18), transparent 55%)"
      : treatment === "cool"
      ? "linear-gradient(135deg, rgba(0,26,102,0.55), transparent 55%)"
      : "linear-gradient(135deg, rgba(0,70,230,0.18), transparent 55%), linear-gradient(225deg, rgba(255,107,26,0.10), transparent 60%)";

  return (
    <div
      className={`relative overflow-hidden bg-ink ${className}`}
      role="img"
      aria-label={`${meta.title || slot} — Trainovate brand illustration`}
    >
      {/* Base ink + grid */}
      <div className="absolute inset-0 grid-noise opacity-60" />

      {/* Generative artwork */}
      <svg
        viewBox="0 0 600 750"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 w-full h-full"
      >
        <defs>
          <linearGradient id={`bg-${slot}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0A0A0A" />
            <stop offset="50%" stopColor="#14171C" />
            <stop offset="100%" stopColor="#0A0A0A" />
          </linearGradient>
          <radialGradient id={`glow-${slot}`} cx="50%" cy="38%" r="55%">
            <stop offset="0%" stopColor="#0046E6" stopOpacity="0.35" />
            <stop offset="60%" stopColor="#0046E6" stopOpacity="0" />
          </radialGradient>
          <radialGradient id={`flare-${slot}`} cx="78%" cy="80%" r="35%">
            <stop offset="0%" stopColor="#FF6B1A" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#FF6B1A" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="600" height="750" fill={`url(#bg-${slot})`} />
        <rect width="600" height="750" fill={`url(#glow-${slot})`} />
        <rect width="600" height="750" fill={`url(#flare-${slot})`} />

        {renderArtwork(meta.kind, slot)}
      </svg>

      {/* Tint overlay */}
      <div
        className="absolute inset-0 pointer-events-none mix-blend-screen"
        style={{ background: tint }}
      />

      {/* Bottom fade */}
      <div
        className="absolute inset-x-0 bottom-0 h-1/2 pointer-events-none"
        style={{
          background: "linear-gradient(180deg, transparent, rgba(10,10,10,0.85))",
        }}
      />

      {/* Label badge */}
      <div className="absolute top-4 left-4 right-4 flex items-start justify-between gap-2 z-10">
        <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-cobalt-soft bg-ink/70 backdrop-blur-sm px-2 py-1 border border-cobalt/30">
          {eyebrow}
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-flare bg-ink/70 backdrop-blur-sm px-2 py-1 border border-flare/30">
          ● live
        </span>
      </div>
    </div>
  );
}

function renderArtwork(kind: PanelKind, key: string) {
  const stroke = "#F4F1EA";
  const cobalt = "#0046E6";
  const flare = "#FF6B1A";

  switch (kind) {
    case "topology":
      return (
        <g opacity="0.55" stroke={stroke} fill="none" strokeWidth="1">
          {Array.from({ length: 22 }).map((_, i) => {
            const y = 40 + i * 32 + Math.sin(i * 0.5) * 14;
            return (
              <path
                key={i}
                d={`M -20 ${y} Q 150 ${y - 30 + (i % 2) * 40} 300 ${y} T 620 ${y - 20}`}
                opacity={0.3 + (i % 5) * 0.12}
              />
            );
          })}
          <circle cx="300" cy="280" r="60" stroke={cobalt} strokeWidth="1.4" />
          <circle cx="300" cy="280" r="100" stroke={cobalt} strokeWidth="0.8" opacity="0.4" />
          <circle cx="300" cy="280" r="6" fill={flare} />
        </g>
      );

    case "machine":
      return (
        <g stroke={stroke} fill="none" strokeWidth="1.2">
          {/* Industrial frame */}
          <rect x="80" y="150" width="440" height="380" stroke={cobalt} strokeWidth="1.4" opacity="0.9" />
          <rect x="120" y="190" width="360" height="100" opacity="0.55" />
          <rect x="120" y="310" width="170" height="200" opacity="0.45" />
          <rect x="310" y="310" width="170" height="200" opacity="0.45" />
          {/* Pipes */}
          <path d="M 30 220 L 80 220 L 80 260 L 30 260" stroke={flare} strokeWidth="1.5" />
          <path d="M 520 350 L 570 350 L 570 410 L 520 410" stroke={flare} strokeWidth="1.5" />
          {/* Gauges */}
          <circle cx="160" cy="240" r="14" stroke={flare} strokeWidth="1.2" />
          <circle cx="200" cy="240" r="14" />
          <circle cx="240" cy="240" r="14" />
          {/* Schematic dots */}
          {Array.from({ length: 18 }).map((_, i) => (
            <circle key={i} cx={140 + (i % 6) * 70} cy={350 + Math.floor(i / 6) * 60} r="2" fill={cobalt} />
          ))}
          {/* Worker silhouette */}
          <g transform="translate(280, 540)" stroke={stroke} strokeWidth="1.2" fill="none">
            <circle cx="20" cy="0" r="8" />
            <path d="M 12 10 L 12 50 M 28 10 L 28 50 M 8 22 L 32 22" />
          </g>
        </g>
      );

    case "racks":
      return (
        <g stroke={stroke} fill="none" strokeWidth="1.1" opacity="0.85">
          {/* Vanishing-point warehouse racks */}
          {Array.from({ length: 5 }).map((_, row) => {
            const y = 180 + row * 75;
            return (
              <g key={row}>
                <line x1="40" y1={y} x2="560" y2={y} stroke={cobalt} opacity={0.7} />
                {Array.from({ length: 8 }).map((_, c) => (
                  <line key={c} x1={60 + c * 70} y1={y - 50} x2={60 + c * 70} y2={y} opacity={0.5} />
                ))}
                {Array.from({ length: 7 }).map((_, c) => (
                  <rect
                    key={c}
                    x={70 + c * 70}
                    y={y - 45}
                    width="50"
                    height="40"
                    opacity={0.35 + (c % 3) * 0.12}
                  />
                ))}
              </g>
            );
          })}
          {/* Forklift pictogram */}
          <g transform="translate(80, 580)" stroke={flare} strokeWidth="1.4">
            <rect x="0" y="20" width="60" height="30" />
            <circle cx="15" cy="58" r="8" fill={flare} fillOpacity="0.5" />
            <circle cx="50" cy="58" r="8" fill={flare} fillOpacity="0.5" />
            <path d="M 60 30 L 100 10 L 100 50 L 60 50 Z" fill="none" />
          </g>
        </g>
      );

    case "aircraft":
      return (
        <g stroke={stroke} fill="none" strokeWidth="1.1">
          {/* Top-down aircraft outline */}
          <g transform="translate(300, 380)" stroke={cobalt} strokeWidth="1.4">
            <path d="M 0 -160 Q 30 -140 30 -10 L 200 30 L 200 60 L 30 50 L 30 110 L 80 130 L 80 145 L 30 140 L 30 165 L -30 165 L -30 140 L -80 145 L -80 130 L -30 110 L -30 50 L -200 60 L -200 30 L -30 -10 Q -30 -140 0 -160 Z" />
            <line x1="0" y1="-160" x2="0" y2="170" stroke={flare} strokeDasharray="4 6" opacity="0.6" />
          </g>
          {/* Hangar lines */}
          <line x1="0" y1="120" x2="600" y2="120" opacity="0.3" />
          <line x1="0" y1="640" x2="600" y2="640" opacity="0.3" />
          {/* Service points */}
          {[
            [180, 380], [420, 380], [300, 230], [300, 540],
          ].map(([x, y], i) => (
            <g key={i}>
              <circle cx={x} cy={y} r="4" fill={flare} />
              <circle cx={x} cy={y} r="14" stroke={flare} opacity="0.6" />
            </g>
          ))}
        </g>
      );

    case "lattice":
      return (
        <g stroke={stroke} fill="none" strokeWidth="0.9" opacity="0.7">
          {/* Plant lattice / hex pattern */}
          {Array.from({ length: 9 }).map((_, r) =>
            Array.from({ length: 7 }).map((_, c) => {
              const x = 60 + c * 80 + (r % 2) * 40;
              const y = 80 + r * 75;
              return (
                <g key={`${r}-${c}`} transform={`translate(${x}, ${y})`}>
                  <polygon
                    points="0,-20 17,-10 17,10 0,20 -17,10 -17,-10"
                    stroke={c === 3 && r === 4 ? flare : cobalt}
                    strokeWidth={c === 3 && r === 4 ? 1.6 : 0.9}
                    opacity={c === 3 && r === 4 ? 1 : 0.55}
                  />
                  {(r + c) % 3 === 0 && (
                    <circle cx="0" cy="0" r="2.5" fill={cobalt} opacity="0.7" />
                  )}
                </g>
              );
            })
          )}
        </g>
      );

    case "tank":
      return (
        <g stroke={stroke} fill="none" strokeWidth="1.2">
          {/* Storage tanks */}
          {[120, 300, 480].map((cx, i) => (
            <g key={i}>
              <ellipse cx={cx} cy="280" rx="65" ry="14" stroke={cobalt} />
              <line x1={cx - 65} y1="280" x2={cx - 65} y2="500" stroke={cobalt} />
              <line x1={cx + 65} y1="280" x2={cx + 65} y2="500" stroke={cobalt} />
              <ellipse cx={cx} cy="500" rx="65" ry="14" />
              <ellipse cx={cx} cy="500" rx="65" ry="14" stroke={cobalt} opacity="0.4" />
              <line x1={cx - 65} y1="380" x2={cx + 65} y2="380" opacity="0.3" />
              <line x1={cx - 65} y1="440" x2={cx + 65} y2="440" opacity="0.3" />
            </g>
          ))}
          {/* Pipework */}
          <path d="M 120 280 L 120 220 L 480 220 L 480 280" stroke={flare} strokeWidth="1.5" />
          <circle cx="300" cy="220" r="6" fill={flare} />
          {/* Valve tags */}
          {[120, 300, 480].map((cx) => (
            <rect key={cx} x={cx - 14} y="260" width="28" height="14" stroke={flare} strokeWidth="1" opacity="0.8" />
          ))}
          {/* Ground line */}
          <line x1="0" y1="510" x2="600" y2="510" stroke={stroke} opacity="0.4" />
        </g>
      );

    case "conveyor":
      return (
        <g stroke={stroke} fill="none" strokeWidth="1.1">
          {/* Conveyor belts */}
          <rect x="40" y="280" width="520" height="40" stroke={cobalt} />
          <rect x="40" y="380" width="520" height="40" stroke={cobalt} opacity="0.7" />
          <rect x="40" y="480" width="520" height="40" stroke={cobalt} opacity="0.5" />
          {/* Rollers */}
          {Array.from({ length: 14 }).map((_, i) => (
            <g key={i}>
              <circle cx={70 + i * 35} cy="320" r="6" />
              <circle cx={70 + i * 35} cy="420" r="6" opacity="0.7" />
              <circle cx={70 + i * 35} cy="520" r="6" opacity="0.5" />
            </g>
          ))}
          {/* Items */}
          {[100, 220, 340, 460].map((x, i) => (
            <rect key={i} x={x} y="260" width="40" height="20" fill={flare} fillOpacity="0.6" stroke={flare} />
          ))}
          {[160, 280, 400].map((x, i) => (
            <circle key={i} cx={x} cy="370" r="14" stroke={flare} opacity="0.7" />
          ))}
        </g>
      );

    case "radar":
      return (
        <g stroke={stroke} fill="none" strokeWidth="1">
          <circle cx="300" cy="375" r="60" stroke={cobalt} />
          <circle cx="300" cy="375" r="120" stroke={cobalt} opacity="0.6" />
          <circle cx="300" cy="375" r="180" stroke={cobalt} opacity="0.4" />
          <circle cx="300" cy="375" r="240" stroke={cobalt} opacity="0.2" />
          <line x1="60" y1="375" x2="540" y2="375" opacity="0.3" />
          <line x1="300" y1="135" x2="300" y2="615" opacity="0.3" />
          {/* Sweep */}
          <path d="M 300 375 L 480 280 A 200 200 0 0 0 540 375 Z" fill={cobalt} fillOpacity="0.18" stroke="none" />
          <line x1="300" y1="375" x2="540" y2="375" stroke={flare} strokeWidth="1.4" />
          {/* Blips */}
          {[
            [400, 240], [180, 460], [460, 470], [240, 250],
          ].map(([x, y], i) => (
            <g key={i}>
              <circle cx={x} cy={y} r="3" fill={flare} />
              <circle cx={x} cy={y} r="8" stroke={flare} opacity="0.5" />
            </g>
          ))}
        </g>
      );

    case "portrait":
      return (
        <g stroke={stroke} fill="none" strokeWidth="1">
          {/* Abstract portrait silhouette */}
          <g transform="translate(300, 390)" stroke={cobalt} strokeWidth="1.4">
            <ellipse cx="0" cy="-80" rx="70" ry="85" />
            <path d="M -130 200 Q -130 50 0 50 Q 130 50 130 200 Z" />
          </g>
          {/* Concentric rings as a motif */}
          {[100, 150, 210, 280].map((r, i) => (
            <circle key={i} cx="300" cy="300" r={r} stroke={i === 1 ? flare : stroke} opacity={0.15 + i * 0.05} />
          ))}
          {/* Eyebrow ticks */}
          {Array.from({ length: 12 }).map((_, i) => {
            const a = (i / 12) * Math.PI * 2;
            const x1 = 300 + Math.cos(a) * 290;
            const y1 = 300 + Math.sin(a) * 290;
            const x2 = 300 + Math.cos(a) * 305;
            const y2 = 300 + Math.sin(a) * 305;
            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={cobalt} />;
          })}
        </g>
      );

    case "shield":
      return (
        <g stroke={stroke} fill="none" strokeWidth="1.2">
          <g transform="translate(300, 360)" stroke={cobalt} strokeWidth="1.6">
            <path d="M 0 -180 L 140 -130 L 140 30 Q 140 150 0 220 Q -140 150 -140 30 L -140 -130 Z" />
            <path d="M 0 -140 L 100 -100 L 100 20 Q 100 110 0 170 Q -100 110 -100 20 L -100 -100 Z" opacity="0.5" />
            <rect x="-40" y="-30" width="80" height="80" stroke={flare} strokeWidth="1.5" />
            <path d="M -25 -30 L -25 -55 Q -25 -75 0 -75 Q 25 -75 25 -55 L 25 -30" stroke={flare} strokeWidth="1.5" />
            <circle cx="0" cy="10" r="6" fill={flare} />
          </g>
          {/* Compliance ticks */}
          {Array.from({ length: 6 }).map((_, i) => (
            <text
              key={i}
              x={60 + i * 90}
              y="660"
              fill={cobalt}
              fontFamily="ui-monospace"
              fontSize="11"
              opacity="0.7"
            >
              {["LOTO", "OSHA", "ISO", "ANSI", "xAPI", "AUDIT"][i]}
            </text>
          ))}
        </g>
      );

    case "tablet":
      return (
        <g stroke={stroke} fill="none" strokeWidth="1.2">
          {/* Tablet frame */}
          <g transform="translate(170, 200)" stroke={cobalt} strokeWidth="1.5">
            <rect width="260" height="350" rx="14" />
            <rect x="14" y="20" width="232" height="280" stroke={stroke} opacity="0.5" />
            {/* Mock content lines */}
            {Array.from({ length: 8 }).map((_, i) => (
              <line
                key={i}
                x1="28"
                y1={50 + i * 28}
                x2={28 + 180 - (i % 3) * 30}
                y2={50 + i * 28}
                stroke={stroke}
                opacity={0.4}
              />
            ))}
            {/* Progress bar */}
            <rect x="28" y="240" width="200" height="6" stroke={flare} opacity="0.6" />
            <rect x="28" y="240" width="120" height="6" fill={flare} fillOpacity="0.6" stroke="none" />
            {/* Dot indicator */}
            <circle cx="130" cy="320" r="5" fill={cobalt} />
          </g>
          {/* Hand line */}
          <path d="M 100 700 Q 220 600 300 540 L 320 540" stroke={flare} strokeWidth="1.4" opacity="0.6" />
        </g>
      );

    default:
      return null;
  }
}
