import { Eyebrow } from "@/components/ui/Eyebrow";

const capabilities = [
  {
    n: "01",
    t: "AI-Driven Learning Systems",
    b: "Adaptive curricula that reshape themselves around each learner. AI co-pilots that draft incident reports, surface knowledge gaps, and help safety pros do the job of four people.",
  },
  {
    n: "02",
    t: "Immersive VR & 3D Training",
    b: "Spatial procedures rehearsed in a safe environment before they are performed live. High-acuity skills practiced until they are muscle memory, not theory.",
  },
  {
    n: "03",
    t: "Microlearning & Daily Reinforcement",
    b: "Three-to-seven minute units delivered at the start of shift, before the task, and after a near-miss. Knowledge that compounds because it is reinforced when it matters.",
  },
  {
    n: "04",
    t: "Safety & Compliance Programs",
    b: "Operator-grade EHS programs built around real workflows — LOTO, machine guarding, confined space, OSHA 10/30 — instrumented through Soteria so every step is timestamped and audit-ready.",
  },
  {
    n: "05",
    t: "Custom Training Platforms (LMS)",
    b: "We build the platform, not just the content. Multi-tenant SaaS, xAPI-native, offline-first, Section 508 accessible. Your training stack, ready for the audit and the workforce at the same time.",
  },
];

export function CoreCapabilities() {
  return (
    <section className="relative tnv-section py-32">
      <div className="tnv-container">
        <Eyebrow index="03" label="CORE CAPABILITIES" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mt-6 items-end">
          <h2 className="lg:col-span-7 tnv-h2 max-w-3xl text-balance">
            Five capabilities.{" "}
            <span className="tnv-italic text-signal">One platform.</span>
          </h2>
          <p className="lg:col-span-5 tnv-body text-pretty">
            Each capability ships independently or as part of the full Soteria
            stack. All of them roll up to a single evidence layer.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-bone/8 border border-bone/8">
          {capabilities.map((c) => (
            <article key={c.n} className="bg-ink/40 p-8">
              <div className="font-mono text-[10px] uppercase tracking-eyebrow text-cobalt-soft">
                {c.n}
              </div>
              <h3 className="font-display font-semibold text-2xl text-bone mt-3 tracking-tight">
                {c.t}
              </h3>
              <p className="tnv-body mt-4 text-base text-pretty">{c.b}</p>
            </article>
          ))}

          {/* Filler tile that closes the grid on lg with a quiet CTA card */}
          <article className="bg-ink/40 p-8 flex flex-col justify-between">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-eyebrow text-flare">
                Outcome
              </div>
              <h3 className="font-display font-semibold text-2xl text-bone mt-3 tracking-tight">
                Workers who are ready when it counts.
              </h3>
              <p className="tnv-body mt-4 text-base text-pretty">
                Every capability is engineered for one outcome — competency at
                the moment of the task, evidenced in the record.
              </p>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
