import { Eyebrow } from "@/components/ui/Eyebrow";

const capabilities = [
  {
    n: "01",
    t: "AI-Driven Learning Systems",
    b: "Adaptive training that evolves with the learner, reinforcing critical knowledge and identifying gaps before they become risks.",
  },
  {
    n: "02",
    t: "Immersive VR & 3D Training",
    b: "Realistic simulations that prepare teams for the environments they actually work in — before they step into them.",
  },
  {
    n: "03",
    t: "Microlearning & Daily Reinforcement",
    b: "Short, focused training designed to improve retention, build habits, and keep safety top of mind.",
  },
  {
    n: "04",
    t: "Safety & Compliance Programs",
    b: "Training built to meet regulatory requirements while actually improving behavior and reducing risk.",
  },
  {
    n: "05",
    t: "Custom Training Platforms",
    b: "Scalable learning systems tailored to your operations, workflows, workforce structure, and compliance needs.",
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
            Each capability ships independently or as part of the full
            Trainovate stack — connected by a single evidence layer.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-bone/8 border border-bone/8">
          {capabilities.map((c) => (
            <article
              key={c.n}
              className="bg-ink/40 p-8 group transition-colors hover:bg-ink-soft"
            >
              <div className="font-mono text-[10px] uppercase tracking-eyebrow text-cobalt-soft">
                {c.n}
              </div>
              <h3 className="font-display font-semibold text-2xl text-bone mt-3 tracking-tight">
                {c.t}
              </h3>
              <p className="tnv-body mt-4 text-base text-pretty">{c.b}</p>
            </article>
          ))}

          {/* Closing outcome card — fills the 6th cell on the lg grid */}
          <article className="bg-ink/40 p-8 flex flex-col justify-center relative overflow-hidden">
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse 80% 60% at 30% 30%, rgba(0,70,230,0.16), transparent 60%), radial-gradient(ellipse 60% 70% at 80% 80%, rgba(255,107,26,0.14), transparent 55%)",
              }}
              aria-hidden="true"
            />
            <div className="relative">
              <div className="font-mono text-[10px] uppercase tracking-eyebrow text-flare">
                Outcome
              </div>
              <h3 className="font-display font-semibold text-2xl text-bone mt-3 tracking-tight">
                Workers who are ready when it counts.
              </h3>
              <p className="tnv-body mt-4 text-base text-pretty">
                Every capability is engineered for one outcome — competency
                at the moment of the task, evidenced in the record.
              </p>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
