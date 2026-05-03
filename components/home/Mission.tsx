import { Eyebrow } from "@/components/ui/Eyebrow";

export function Mission() {
  return (
    <section className="relative tnv-section py-32">
      <div className="tnv-container">
        <div className="tnv-glass rounded-2xl p-10 md:p-20 relative overflow-hidden">
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 80% 60% at 30% 20%, rgba(0,70,230,0.18), transparent 60%), radial-gradient(ellipse 60% 70% at 80% 80%, rgba(255,107,26,0.14), transparent 55%)",
            }}
            aria-hidden="true"
          />
          <div className="relative max-w-4xl">
            <Eyebrow index="07" label="MISSION" />
            <h2 className="font-display font-semibold tracking-tight mt-6 text-bone text-balance" style={{ fontSize: "clamp(36px, 5vw, 72px)", lineHeight: 1.04, letterSpacing: "-0.025em" }}>
              Make the people who keep the world running{" "}
              <span className="tnv-italic text-signal">ready, capable, and protected.</span>
            </h2>
            <p className="tnv-body mt-8 text-pretty text-lg max-w-3xl">
              Trainovate exists to end the era of training as theater. We
              build for the workforce on the floor, the hangar, the wellpad,
              and the watch room. We measure what matters, and we ship what
              works — so the people who do dangerous, complex, and
              consequential work go home at the end of the shift.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
