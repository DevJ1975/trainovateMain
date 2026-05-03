import { Eyebrow } from "@/components/ui/Eyebrow";

export function ProblemSolution() {
  return (
    <section className="relative tnv-section py-32">
      <div className="tnv-container">
        <Eyebrow index="01" label="THE PROBLEM" />
        <h2 className="tnv-h2 mt-6 max-w-4xl text-balance">
          Training is broken.{" "}
          <span className="tnv-italic text-signal">Here&rsquo;s what works.</span>
        </h2>

        <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-px bg-bone/8 border border-bone/8">
          {/* Problem */}
          <div className="bg-ink/40 p-10 md:p-12">
            <div className="font-mono text-[10px] uppercase tracking-eyebrow text-flare">
              What fails
            </div>
            <h3 className="font-display font-semibold text-2xl text-bone mt-4 tracking-tight">
              The deck. The roster. The quiz nobody studied for.
            </h3>
            <p className="tnv-body mt-5 text-pretty">
              Most workforce training is theater. A slide deck, a sign-in
              sheet, a certificate that proves attendance but not competency.
              The information is forgotten before the worker reaches the
              floor, and the only thing that gets measured is who showed up.
              When the actual moment arrives — a near-miss, a procedure under
              pressure, an audit — the program does not show up.
            </p>
          </div>

          {/* Solution */}
          <div className="bg-ink/40 p-10 md:p-12 relative">
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse 80% 60% at 30% 20%, rgba(0,70,230,0.10), transparent 60%)",
              }}
              aria-hidden="true"
            />
            <div className="relative">
              <div className="font-mono text-[10px] uppercase tracking-eyebrow text-cobalt-soft">
                What works
              </div>
              <h3 className="font-display font-semibold text-2xl text-bone mt-4 tracking-tight">
                Training the workforce actually uses.
              </h3>
              <p className="tnv-body mt-5 text-pretty">
                Trainovate replaces the deck with training built around the
                task. Microlearning timed to the moment. Immersive 3D and VR
                for procedures that have to be rehearsed. AI co-pilots that
                surface what each learner needs next. Every interaction is
                captured, so retention is not a hope and competency is not a
                guess.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
