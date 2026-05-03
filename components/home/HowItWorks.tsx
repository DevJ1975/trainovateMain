import { Eyebrow } from "@/components/ui/Eyebrow";
import { ArrowRight } from "lucide-react";

const steps = [
  {
    n: "01",
    t: "Design",
    b: "We analyze your operations, risks, and training gaps to build a system aligned with how your teams actually work.",
  },
  {
    n: "02",
    t: "Build",
    b: "We develop your training using AI, immersive environments, microlearning, and structured learning pathways.",
  },
  {
    n: "03",
    t: "Deploy & Scale",
    b: "We launch across your organization and provide tools to track performance, reinforce learning, and scale over time.",
  },
];

export function HowItWorks() {
  return (
    <section className="relative tnv-section py-32">
      <div className="tnv-container">
        <Eyebrow index="04" label="HOW IT WORKS" />
        <h2 className="tnv-h2 mt-6 max-w-3xl text-balance">
          Three steps.{" "}
          <span className="tnv-italic text-signal">Shipped, not pitched.</span>
        </h2>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((s, i) => (
            <div key={s.n} className="relative">
              <div className="font-mono text-[10px] uppercase tracking-eyebrow text-cobalt-soft">
                Step {s.n}
              </div>
              <div className="font-display font-semibold text-4xl md:text-5xl text-bone mt-3 tracking-tight">
                {s.t}
                <span className="text-flare">.</span>
              </div>
              <p className="tnv-body mt-5 text-base text-pretty max-w-sm">
                {s.b}
              </p>
              {i < steps.length - 1 && (
                <ArrowRight
                  className="hidden md:block absolute top-2 -right-4 text-fog/50"
                  size={18}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
