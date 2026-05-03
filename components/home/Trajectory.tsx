import { Eyebrow } from "@/components/ui/Eyebrow";

const milestones = [
  { year: "2024", t: "Founded", b: "Trainovate Technologies launches in Las Vegas." },
  { year: "2025", t: "Soteria FIELD", b: "Inspection + CAPA web app deployed in production." },
  { year: "2026", t: "Code Platoon · Safeguard SaaS", b: "Multi-tenant LOTO platform; Jay completes Code Platoon Juliet 2026." },
  { year: "2027", t: "Federal capture", b: "First federal contract pursuit cycle; JV active." },
  { year: "2028", t: "Enterprise expansion", b: "Co-Pilot and Learning at scale across regulated commercial." },
];

export function Trajectory() {
  return (
    <section className="relative tnv-section py-32">
      <div className="tnv-container">
        <Eyebrow index="05" label="TRAJECTORY" />
        <h2 className="tnv-h2 mt-6 max-w-3xl text-balance">
          The line is <span className="tnv-italic text-signal">forward.</span>
        </h2>

        <div className="mt-20 relative">
          {/* horizontal line */}
          <div className="hidden md:block absolute top-2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-signal/40 to-transparent" />

          <ol className="grid grid-cols-1 md:grid-cols-5 gap-10 md:gap-4">
            {milestones.map((m, i) => (
              <li key={m.year} className="relative">
                <div className="hidden md:block absolute -top-1 left-0 w-3 h-3 bg-signal rounded-full" />
                <div className="md:pt-10">
                  <div className="font-mono text-[10px] uppercase tracking-eyebrow text-signal">
                    {m.year}
                  </div>
                  <div className="font-serif text-2xl text-bone mt-3 tracking-tight">
                    {m.t}
                  </div>
                  <p className="tnv-body mt-3 text-sm text-pretty">{m.b}</p>
                </div>
                {i < milestones.length - 1 && (
                  <div className="md:hidden mt-6 h-px bg-fog/30" />
                )}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
