import { Eyebrow } from "@/components/ui/Eyebrow";

const reasons = [
  {
    n: "01",
    t: "Designed for actual job conditions",
    b: "Training aligned with real work, real risks, and real decisions.",
  },
  {
    n: "02",
    t: "Focused on retention and behavior change",
    b: "Learning experiences built to help people remember, apply, and improve.",
  },
  {
    n: "03",
    t: "Mobile-first and accessible",
    b: "Training available where work happens — across teams, shifts, and locations.",
  },
  {
    n: "04",
    t: "Scalable across operations",
    b: "Systems designed to grow with your organization.",
  },
];

export function WhyTrainovate() {
  return (
    <section className="relative tnv-section py-32">
      <div className="tnv-container">
        <Eyebrow index="06" label="WHY TRAINOVATE" />
        <h2 className="tnv-h2 mt-6 max-w-3xl text-balance">
          Built for{" "}
          <span className="tnv-italic text-signal">real-world performance.</span>
        </h2>

        <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-10">
          <p className="tnv-body text-pretty text-lg">
            Training should prepare people for the environments they actually
            work in — not just help them pass a quiz.
          </p>
          <p className="tnv-body text-pretty text-lg">
            Trainovate combines AI, immersive technology, instructional
            design, and operational insight to create training systems that
            are engaging, measurable, and built for application.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-10">
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
