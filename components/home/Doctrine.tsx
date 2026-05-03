import { Eyebrow } from "@/components/ui/Eyebrow";

const pillars = [
  {
    word: "Instrument",
    body: "Every action, every hazard, every learner — measured.",
  },
  {
    word: "Adapt",
    body: "Curricula that rewrite themselves around your workforce.",
  },
  {
    word: "Deploy",
    body: "Field-ready on iPad, web, and offline.",
  },
];

const counters = [
  { v: "12+", l: "Industries" },
  { v: "xAPI", l: "Native" },
  { v: "SDVOSB", l: "Verified" },
  { v: "ISO 45001", l: "Aligned" },
];

export function Doctrine() {
  return (
    <section className="relative tnv-section min-h-[100vh] flex items-center py-24">
      <div className="tnv-container w-full">
        <Eyebrow index="01" label="DOCTRINE" />

        <h2 className="tnv-h2 mt-6 max-w-4xl text-balance">
          The future of safety is{" "}
          <span className="tnv-italic text-signal">adaptive.</span>
        </h2>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-px bg-bone/8 border border-bone/8">
          {pillars.map((p, i) => (
            <div key={p.word} className="bg-void/60 backdrop-blur-sm p-10">
              <div className="font-mono text-[10px] uppercase tracking-eyebrow text-signal">
                {String(i + 1).padStart(2, "0")}
              </div>
              <div className="font-serif text-5xl text-bone mt-4 tracking-tight">
                {p.word}
                <span className="text-signal">.</span>
              </div>
              <p className="tnv-body mt-6 text-base text-pretty">{p.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
          {counters.map((c) => (
            <div key={c.l} className="border-l-2 border-signal pl-4">
              <div className="font-serif text-3xl md:text-4xl text-bone tracking-tight">
                {c.v}
              </div>
              <div className="font-mono text-[10px] uppercase tracking-eyebrow text-fog mt-1">
                {c.l}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
