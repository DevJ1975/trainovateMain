import Link from "next/link";
import { ArrowRight, ShieldCheck, WifiOff, Receipt } from "lucide-react";
import { Eyebrow } from "@/components/ui/Eyebrow";

const points = [
  {
    icon: ShieldCheck,
    t: "Anonymous by default",
    b: "Report a hazard without giving your name. No account, no login, no friction.",
  },
  {
    icon: WifiOff,
    t: "Works offline",
    b: "Capture it on the floor with no signal. It syncs the moment a connection is back.",
  },
  {
    icon: Receipt,
    t: "Tracked with a receipt code",
    b: "Every submission returns a private code to follow the report through to close-out.",
  },
];

/**
 * LiveProductCallout — the product-led-growth beat on the home page.
 *
 * The Soteria pitch elsewhere on the page is aspirational; this section is
 * the proof. The anonymous near-miss reporting tool at /report is live and
 * free, so we surface it as a low-friction alternative to "Request a demo"
 * and route lower-intent visitors straight into the working product.
 *
 * Sits unnumbered between HowItWorks (04) and IndustriesSnapshot (05),
 * mirroring how CinematicBanner sits unnumbered in the same flow.
 */
export function LiveProductCallout() {
  return (
    <section className="relative tnv-section py-32">
      <div className="tnv-container">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left — pitch */}
          <div className="lg:col-span-5">
            <Eyebrow tone="amber" label="LIVE · NO LOGIN" />
            <h2 className="tnv-h2 mt-6 max-w-md text-balance">
              Not a demo.{" "}
              <span className="tnv-italic text-signal">It&rsquo;s already running.</span>
            </h2>
            <p className="tnv-body mt-8 max-w-md text-pretty">
              Trainovate&rsquo;s anonymous near-miss reporting tool is live right
              now — the same Soteria evidence spine, in your hands in under a
              minute. Capture a hazard, get a receipt code, and watch it move
              through triage to close-out.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-3">
              <Link href="/report" className="tnv-btn-signal">
                Report a near miss <ArrowRight size={14} />
              </Link>
              <Link href="/report/status" className="tnv-btn-ghost">
                Check a report status
              </Link>
            </div>
          </div>

          {/* Right — what you get */}
          <div className="lg:col-span-7">
            <div className="tnv-glass rounded-2xl p-8 md:p-10 relative overflow-hidden">
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "radial-gradient(ellipse 70% 60% at 80% 20%, rgba(255,107,26,0.14), transparent 60%), radial-gradient(ellipse 60% 70% at 10% 90%, rgba(0,70,230,0.16), transparent 55%)",
                }}
                aria-hidden="true"
              />
              <div className="relative">
                <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.24em] text-bone/70">
                  <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-cobalt opacity-70 animate-ping" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-cobalt" />
                  </span>
                  Trainovate · Field — Near-miss intake
                </div>

                <ul className="mt-8 divide-y divide-bone/10">
                  {points.map((p) => {
                    const Icon = p.icon;
                    return (
                      <li
                        key={p.t}
                        className="flex items-start gap-4 py-5 first:pt-0 last:pb-0"
                      >
                        <span className="mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-md border border-bone/10 bg-ink/40 text-signal">
                          <Icon size={16} />
                        </span>
                        <div>
                          <h3 className="font-display font-semibold text-lg text-bone tracking-tight">
                            {p.t}
                          </h3>
                          <p className="tnv-body mt-1 text-base text-pretty">{p.b}</p>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
