import type { Metadata } from "next";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { StockImage } from "@/components/ui/StockImage";
import { VimeoEmbed } from "@/components/ui/VimeoEmbed";
import { SDVOSBSeal } from "@/components/marks/SDVOSBSeal";
import { ArrowRight } from "lucide-react";

const RadarBackdrop = dynamic(
  () => import("@/components/three/RadarBackdrop").then((m) => m.RadarBackdrop),
  { ssr: false }
);

export const metadata: Metadata = {
  title: "About — Modernizing the way the world trains its workforce",
  description:
    "Trainovate Technologies is a veteran-founded digital learning and workforce training company. AI, immersive 3D/VR, microlearning, and safety-focused instructional design — built for high-risk, high-responsibility work. SDVOSB. Las Vegas, NV.",
};

const builds = [
  {
    t: "AI-powered learning",
    b: "Adaptive paths, voice-driven incident drafting, and an in-platform co-pilot that helps safety pros do the job of four people.",
  },
  {
    t: "Immersive 3D & VR",
    b: "Spatial training for procedures that have to be rehearsed before they are performed live.",
  },
  {
    t: "Mobile-first delivery",
    b: "Training shipped to the device the worker already carries — phone, tablet, kiosk, headset.",
  },
  {
    t: "Microlearning",
    b: "3–7 minute units sequenced around the actual task, not around a 60-minute compliance slot.",
  },
  {
    t: "Safety-focused ID",
    b: "Instructional design grounded in OSHA, ANSI, ISO, and the realities of high-consequence environments.",
  },
  {
    t: "Evidence layer",
    b: "Every interaction is xAPI-instrumented. The auditor and the operator read the same record.",
  },
];

const approach = [
  {
    n: "01",
    t: "Start where the work happens",
    b: "Every program begins with a job-task analysis on the floor, the hangar, or the watch room — not in a conference room.",
  },
  {
    n: "02",
    t: "Design for cognitive load",
    b: "Match the modality to the moment. Microlearning before the task. Immersive 3D for spatial procedures. AR for in-context guidance.",
  },
  {
    n: "03",
    t: "Ship to the device they carry",
    b: "Phone, tablet, kiosk, headset. Offline-first. Bilingual where the workforce demands it.",
  },
  {
    n: "04",
    t: "Instrument every interaction",
    b: "By site, by shift, by individual. Engagement is not optional, retention is not aspirational, and both are designed in.",
  },
];

const credentials = [
  "U.S. Military Veteran",
  "MBA",
  "Code Platoon · Juliet 2026",
  "OSHA-Authorized Trainer (in renewal)",
  "EHS Specialist",
  "Full-stack developer",
];

const recognition = [
  "SDVOSB · DVOSB",
  "ISO 45001 aligned",
  "Section 508",
  "WCAG 2.1 AA",
  "xAPI 1.0.3",
  "OSHA Outreach (renewal)",
];

export default function AboutPage() {
  return (
    <>
      <RadarBackdrop />

      <div className="pt-32 md:pt-40 pb-24">
        {/* Hero */}
        <section className="tnv-container tnv-section">
          <Eyebrow label="ABOUT TRAINOVATE" />
          <h1 className="tnv-h1 mt-6 max-w-5xl text-balance">
            Modernizing the way the world{" "}
            <span className="tnv-italic text-signal">trains its workforce.</span>
          </h1>
          <p className="tnv-body mt-8 max-w-2xl text-pretty">
            Trainovate Technologies builds AI-powered, immersive, mobile-first
            training for the industries that operate at the edge of risk and
            responsibility.
          </p>
        </section>

        {/* Brand intro video */}
        <section className="tnv-container tnv-section mt-20">
          <Eyebrow index="01" label="BRAND INTRO" />
          <div className="mt-6 max-w-4xl mx-auto">
            <div className="tnv-glass rounded-xl p-2">
              <VimeoEmbed
                videoId="1166250257"
                hash="5718878337"
                title="Trainovate Technologies — Brand intro"
                className="rounded-lg"
              />
            </div>
            <p className="mt-4 font-mono text-[10px] uppercase tracking-eyebrow text-fog text-center">
              Brand intro · TODO Jay confirms — Trainovations vs. Trainovate.ai labelling
            </p>
          </div>
        </section>

        {/* Our mission */}
        <section className="tnv-container tnv-section mt-32">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-5">
              <Eyebrow index="02" label="OUR MISSION" />
              <h2 className="tnv-h2 mt-6 max-w-md text-balance">
                Make safety training{" "}
                <span className="tnv-italic text-signal">measurable.</span>
              </h2>
            </div>
            <div className="lg:col-span-7">
              <p className="tnv-body text-pretty text-lg">
                To bring modern training to the workforces the world depends on
                — through technology that engages, evidence that compounds, and
                design built around how people actually learn. We replace the
                binder, the printed roster, and the photocopied quiz with a
                real-time evidence stream a regulator and a CFO can both
                verify.
              </p>
            </div>
          </div>
        </section>

        {/* Who we are */}
        <section className="tnv-container tnv-section mt-32">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-5">
              <Eyebrow index="03" label="WHO WE ARE" />
              <h2 className="tnv-h2 mt-6 max-w-md text-balance">
                Veteran-founded.{" "}
                <span className="tnv-italic text-signal">Operator-built.</span>
              </h2>
            </div>
            <div className="lg:col-span-7">
              <p className="tnv-body text-pretty text-lg">
                Trainovate Technologies is a veteran-founded digital learning
                and workforce training company. We combine AI, immersive media,
                VR and 3D experiences, mobile-first microlearning, and
                safety-focused instructional design into a single platform —
                Soteria — that organizations use to train, certify, and
                instrument their people. Headquartered in Las Vegas, Nevada.
                Service-Disabled Veteran-Owned Small Business.
              </p>

              <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-px bg-bone/8 border border-bone/8">
                {[
                  { l: "Founded", v: "2024" },
                  { l: "HQ", v: "Las Vegas, NV" },
                  { l: "Designation", v: "SDVOSB" },
                  { l: "Stack", v: "SaaS · AI · 3D" },
                ].map((s) => (
                  <div key={s.l} className="bg-ink/40 p-5">
                    <div className="font-mono text-[10px] uppercase tracking-eyebrow text-fog">
                      {s.l}
                    </div>
                    <div className="font-display font-semibold text-xl text-bone mt-2 tracking-tight">
                      {s.v}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* What we build */}
        <section className="tnv-container tnv-section mt-32">
          <Eyebrow index="04" label="WHAT WE BUILD" />
          <h2 className="tnv-h2 mt-6 max-w-3xl text-balance">
            One platform.{" "}
            <span className="tnv-italic text-signal">Six capabilities.</span>
          </h2>
          <p className="tnv-body mt-6 max-w-2xl text-pretty">
            Every product line we ship rolls up to Soteria, the Trainovate
            workforce-safety platform. Below: the capabilities that make
            modern training real.
          </p>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-bone/8 border border-bone/8">
            {builds.map((b, i) => (
              <div key={b.t} className="bg-ink/40 p-7">
                <div className="font-mono text-[10px] uppercase tracking-eyebrow text-cobalt-soft">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <h3 className="font-display font-semibold text-2xl text-bone mt-3 tracking-tight">
                  {b.t}
                </h3>
                <p className="tnv-body mt-3 text-sm text-pretty">{b.b}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Why Trainovate exists */}
        <section className="tnv-container tnv-section mt-32">
          <div className="tnv-glass rounded-2xl p-10 md:p-16">
            <Eyebrow index="05" label="WHY TRAINOVATE EXISTS" />
            <h2 className="tnv-h2 mt-6 max-w-4xl text-balance">
              Most workforce training is{" "}
              <span className="tnv-italic text-signal">theater.</span>
            </h2>
            <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-10">
              <p className="tnv-body text-pretty text-lg">
                Slide decks, sign-in sheets, and certificates that prove
                attendance but not competency. The industries that keep the
                world running — manufacturing, energy, aviation, healthcare,
                federal — deserve better.
              </p>
              <p className="tnv-body text-pretty text-lg">
                Trainovate exists to close the gap between compliance
                paperwork and real operational capability. We treat training
                the way modern engineering teams treat deployments:
                instrumented, versioned, observable, and reversible.
              </p>
            </div>
          </div>
        </section>

        {/* Our approach */}
        <section className="tnv-container tnv-section mt-32">
          <Eyebrow index="06" label="OUR APPROACH" />
          <h2 className="tnv-h2 mt-6 max-w-3xl text-balance">
            We start where the{" "}
            <span className="tnv-italic text-signal">work happens.</span>
          </h2>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-bone/8 border border-bone/8">
            {approach.map((s) => (
              <div key={s.n} className="bg-ink/40 p-7">
                <div className="font-mono text-[10px] uppercase tracking-eyebrow text-cobalt-soft">
                  Step {s.n}
                </div>
                <div className="font-display font-semibold text-xl text-bone mt-3 tracking-tight">
                  {s.t}
                </div>
                <p className="tnv-body mt-3 text-sm text-pretty">{s.b}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Veteran-founded */}
        <section className="tnv-container tnv-section mt-32">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-5">
              <div className="relative">
                <StockImage
                  stockKey="about.founder"
                  className="aspect-[4/5] w-full"
                  sizes="(min-width: 1024px) 40vw, 100vw"
                />
                <div className="absolute -bottom-4 -left-4 tnv-glass rounded-md px-4 py-3">
                  <div className="font-mono text-[10px] uppercase tracking-eyebrow text-fog">
                    Founder & CEO
                  </div>
                  <div className="font-serif text-xl text-bone">Jamil &quot;Jay&quot; Jones</div>
                </div>
              </div>
            </div>
            <div className="lg:col-span-7">
              <Eyebrow index="07" label="VETERAN-FOUNDED" />
              <h2 className="tnv-h2 mt-6 text-balance">
                Mission-first.{" "}
                <span className="tnv-italic text-signal">By construction.</span>
              </h2>
              <div className="mt-8 space-y-5 tnv-body text-pretty text-lg">
                <p>
                  Trainovate is veteran-founded and led. We bring a
                  mission-first operating posture to everything we build —
                  accountability to the people doing the work, fidelity to
                  the standard, and an obligation to ship.
                </p>
                <p>
                  As a Service-Disabled Veteran-Owned Small Business, we
                  serve federal customers with the credentialing required
                  and the platform IP to actually deliver. The same
                  operator-grade craft is what every commercial customer
                  gets too.
                </p>
              </div>

              <div className="mt-10 flex items-center gap-5">
                <SDVOSBSeal className="h-20 w-20 text-cobalt flex-shrink-0" />
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-eyebrow text-cobalt-soft">
                    Designation
                  </div>
                  <div className="font-display font-semibold text-2xl text-bone mt-1 tracking-tight">
                    SDVOSB · DVOSB
                  </div>
                  <div className="font-mono text-[10px] uppercase tracking-eyebrow text-fog mt-1">
                    Service-Disabled · Veteran-Owned · Small Business
                  </div>
                </div>
              </div>

              <div className="mt-10 grid grid-cols-2 gap-3 max-w-md">
                {credentials.map((c) => (
                  <div
                    key={c}
                    className="font-mono text-[10px] uppercase tracking-eyebrow text-bone/80 border border-bone/10 px-3 py-2"
                  >
                    {c}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Recognition band */}
        <section className="tnv-container tnv-section mt-32">
          <div className="border-y border-bone/8 py-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-4">
              <Eyebrow index="08" label="STANDARDS WE BUILD TO" />
            </div>
            <div className="lg:col-span-8 flex flex-wrap gap-3">
              {recognition.map((r) => (
                <span
                  key={r}
                  className="font-mono text-[11px] uppercase tracking-eyebrow text-bone/85 border border-bone/15 px-3 py-2"
                >
                  {r}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="tnv-container tnv-section mt-24">
          <div className="tnv-glass rounded-2xl p-10 md:p-16">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7">
                <Eyebrow label="START" />
                <h2 className="tnv-h2 mt-4 max-w-2xl text-balance">
                  Ready to modernize your{" "}
                  <span className="tnv-italic text-signal">training?</span>
                </h2>
                <p className="tnv-body mt-6 max-w-xl text-pretty">
                  We work with organizations that have moved past the question
                  of whether to upgrade — and are ready to ship.
                </p>
              </div>
              <div className="lg:col-span-5 flex flex-wrap gap-3 lg:justify-end">
                <Link href="/contact" className="tnv-btn-signal">
                  Build Your Training Program <ArrowRight size={14} />
                </Link>
                <Link href="/contact" className="tnv-btn-ghost">
                  Partner With Trainovate
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
