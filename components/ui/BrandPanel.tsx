import { OrbitMark } from "@/components/marks/OrbitMark";

type Treatment = "default" | "cool" | "warm";

type SlotMeta = { eyebrow: string; alt: string };

const slotMeta: Record<string, SlotMeta> = {
  "hero.bg": {
    eyebrow: "INGRESS",
    alt: "Trainovate hero environment — cobalt and flare brand backdrop",
  },

  "field.manufacturing": {
    eyebrow: "INDUSTRY · 01",
    alt: "Manufacturing safety training environment — multi-site plant operations",
  },
  "field.warehouse": {
    eyebrow: "INDUSTRY · 02",
    alt: "Warehousing and logistics training environment — daily inspection workflow",
  },
  "field.construction": {
    eyebrow: "INDUSTRY · 03",
    alt: "Construction site training environment — mobile-first OSHA 10/30 delivery",
  },
  "field.aviation": {
    eyebrow: "INDUSTRY · 04",
    alt: "Aviation maintenance training environment — FAR Part 145 procedural sign-offs",
  },
  "field.energy": {
    eyebrow: "INDUSTRY · 05",
    alt: "Energy and utilities training environment — SIMOPS and process safety",
  },
  "field.government": {
    eyebrow: "INDUSTRY · 06",
    alt: "Government and public sector training environment — Section 508 native delivery",
  },
  "field.healthcare": {
    eyebrow: "INDUSTRY · 07",
    alt: "Healthcare and emergency response training environment — protocol microlearning",
  },
  "field.corporate": {
    eyebrow: "INDUSTRY · 08",
    alt: "Corporate workforce training environment — adaptive learning paths",
  },

  "services.classroom": {
    eyebrow: "DELIVERY",
    alt: "Trainovate workforce training delivery environment",
  },
  "services.fieldwalk": {
    eyebrow: "DELIVERY",
    alt: "On-site field walk for safety program assessment",
  },

  "federal.dod": {
    eyebrow: "FEDERAL · DOD",
    alt: "Federal mission-space training operations — SDVOSB delivery",
  },
  "federal.va": {
    eyebrow: "FEDERAL · VA",
    alt: "Department of Veterans Affairs workforce training context",
  },

  "about.founder": {
    eyebrow: "FOUNDER",
    alt: "Jamil Jones, Founder of Trainovate Technologies",
  },
  "about.team": {
    eyebrow: "POSTURE",
    alt: "Trainovate operating posture — founder-led, operator-grade",
  },

  "platform.safeguard": {
    eyebrow: "SOTERIA · 02",
    alt: "Soteria Safeguard — multi-tenant SaaS for energy-control / LOTO programs",
  },
  "platform.field": {
    eyebrow: "SOTERIA · 03",
    alt: "Soteria FIELD SaaS — custom LMS for inspections, audits, and corrective actions",
  },
  "platform.learning": {
    eyebrow: "SOTERIA · 04",
    alt: "Soteria Learning — adaptive microlearning and immersive VR/3D safety training",
  },
  "platform.copilot": {
    eyebrow: "SOTERIA · 05",
    alt: "Soteria AI Co-Pilot — incident drafting and analyst-in-the-loop intelligence",
  },
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
  alt,
}: {
  slot: string;
  className?: string;
  treatment?: Treatment;
  label?: string;
  alt?: string;
}) {
  const meta = slotMeta[slot] ?? { eyebrow: "PANEL", alt: "Trainovate brand panel" };
  const eyebrow = label ?? meta.eyebrow;
  const altText = alt ?? meta.alt;

  const cobaltStrength =
    treatment === "warm" ? 0.18 : treatment === "cool" ? 0.45 : 0.32;
  const flareStrength =
    treatment === "warm" ? 0.32 : treatment === "cool" ? 0.08 : 0.18;

  return (
    <div
      className={`relative overflow-hidden bg-ink ${className}`}
      role="img"
      aria-label={altText}
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
