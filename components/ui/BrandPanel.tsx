import { OrbitMark } from "@/components/marks/OrbitMark";

type Treatment = "default" | "cool" | "warm";

const slotEyebrow: Record<string, string> = {
  "hero.bg": "INGRESS",

  "field.manufacturing": "INDUSTRY · 01",
  "field.warehouse": "INDUSTRY · 02",
  "field.construction": "INDUSTRY · 03",
  "field.aviation": "INDUSTRY · 04",
  "field.energy": "INDUSTRY · 05",
  "field.government": "INDUSTRY · 06",
  "field.healthcare": "INDUSTRY · 07",
  "field.corporate": "INDUSTRY · 08",

  "services.classroom": "SERVICE",
  "services.fieldwalk": "SERVICE",

  "federal.dod": "FEDERAL · DOD",
  "federal.va": "FEDERAL · VA",

  "about.founder": "FOUNDER",
  "about.team": "POSTURE",

  "platform.safeguard": "SOTERIA · 02",
  "platform.field": "SOTERIA · 03",
  "platform.learning": "SOTERIA · 04",
  "platform.copilot": "SOTERIA · 05",
};

/**
 * BrandPanel — minimal atmospheric tile that complements (rather than
 * competes with) the persistent Three.js background scene. Pure dark
 * gradient with a cobalt + flare glow, a faint orbit decoration, and a
 * small eyebrow label. No technical drawings, no fake telemetry.
 */
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
  const eyebrow = label ?? slotEyebrow[slot] ?? "PANEL";

  const cobaltStrength =
    treatment === "warm" ? 0.18 : treatment === "cool" ? 0.45 : 0.32;
  const flareStrength =
    treatment === "warm" ? 0.32 : treatment === "cool" ? 0.08 : 0.18;

  return (
    <div
      className={`relative overflow-hidden bg-ink ${className}`}
      role="img"
      aria-label={`${eyebrow} — Trainovate.ai`}
    >
      {/* Base gradient field */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 80% 60% at 30% 20%, rgba(0,70,230,${cobaltStrength}), transparent 60%),
            radial-gradient(ellipse 60% 70% at 80% 100%, rgba(255,107,26,${flareStrength}), transparent 55%),
            linear-gradient(180deg, rgba(20,23,28,0.6), rgba(10,10,10,1))
          `,
        }}
      />

      {/* Subtle grid */}
      <div className="absolute inset-0 grid-noise opacity-30" />

      {/* Soft orbit decoration */}
      <div
        className="absolute pointer-events-none"
        style={{
          left: "50%",
          top: "55%",
          width: "min(120%, 800px)",
          aspectRatio: "1",
          transform: "translate(-50%, -50%)",
        }}
      >
        <OrbitMark className="w-full h-full text-cobalt opacity-[0.07]" />
      </div>

      {/* Edge vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 50%, rgba(10,10,10,0.6) 100%)",
        }}
      />

      {/* Eyebrow label */}
      <div className="absolute top-5 left-5 z-10">
        <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-cobalt-soft">
          {eyebrow}
        </span>
      </div>

      {/* Hairline accent */}
      <div className="absolute bottom-5 left-5 right-5 z-10 flex items-center gap-3">
        <span className="h-px flex-1 bg-bone/15" />
        <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-fog">
          tnv
        </span>
      </div>
    </div>
  );
}
