import { Eyebrow } from "@/components/ui/Eyebrow";

const reasons = [
  {
    n: "01",
    t: "Built for real-world environments",
    b: "Designed for low connectivity, rotating crews, layered regulators, and the constant pressure of production.",
  },
  {
    n: "02",
    t: "Designed for retention and behavior change",
    b: "Cognitive science meets operational reality. Training that lands when the worker needs it and sticks because it was reinforced.",
  },
  {
    n: "03",
    t: "Mobile-first and accessible anywhere",
    b: "Phone, tablet, kiosk, headset. Online or off. Section 508 by default. The medium adapts to the work — not the other way around.",
  },
  {
    n: "04",
    t: "Scalable across teams and locations",
    b: "Multi-tenant SaaS. Tenant per facility, central program governance, role-based access, SSO ready.",
  },
  {
    n: "05",
    t: "AI + immersive tech + instructional design",
    b: "Three disciplines that almost nobody runs under one roof. Trainovate does — and ships them as one stack.",
  },
];

export function WhyTrainovate() {
  return (
    <section className="relative tnv-section py-32">
      <div className="tnv-container">
        <Eyebrow index="06" label="WHY TRAINOVATE" />
        <h2 className="tnv-h2 mt-6 max-w-3xl text-balance">
          The difference is{" "}
          <span className="tnv-italic text-signal">in the engineering.</span>
        </h2>

        <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-10">
          {reasons.map((r) => (
            <div key={r.n} className="border-l-2 border-cobalt pl-5">
              <div className="font-mono text-[10px] uppercase tracking-eyebrow text-cobalt-soft">
                {r.n}
              </div>
              <h3 className="font-display font-semibold text-2xl text-bone mt-2 tracking-tight">
                {r.t}
              </h3>
              <p className="tnv-body mt-3 text-base text-pretty">{r.b}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
