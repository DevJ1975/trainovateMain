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
              The problem
            </div>
            <h3 className="font-display font-semibold text-2xl text-bone mt-4 tracking-tight">
              Most training is designed to be completed — not remembered.
            </h3>
            <p className="tnv-body mt-5 text-pretty">
              Employees click through modules, pass quizzes, and move on
              without retaining what they need when it counts. The result is
              a workforce that&rsquo;s technically &ldquo;trained,&rdquo; but
              not truly prepared.
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
                Trainovate changes that.
              </h3>
              <p className="tnv-body mt-5 text-pretty">
                We build training systems that engage people, reinforce
                knowledge over time, and prepare them to perform in
                real-world environments — where safety, precision, and
                decision-making matter.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
