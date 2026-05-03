import type { Metadata } from "next";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { StockImage } from "@/components/ui/StockImage";
import { VimeoEmbed } from "@/components/ui/VimeoEmbed";
import { SDVOSBSeal } from "@/components/marks/SDVOSBSeal";

const RadarBackdrop = dynamic(
  () => import("@/components/three/RadarBackdrop").then((m) => m.RadarBackdrop),
  { ssr: false }
);

export const metadata: Metadata = {
  title: "About — Veteran-founded. Operator-built.",
  description:
    "Trainovate.ai builds the workforce safety platform for high-risk industries. Veteran-founded. SDVOSB. Las Vegas, NV.",
};

const credentials = [
  "U.S. Military Veteran",
  "MBA",
  "Code Platoon · Juliet 2026",
  "OSHA-Authorized Trainer (in renewal)",
  "EHS Specialist",
  "Full-stack developer",
];

const values = [
  { word: "Mission", body: "We build for the workforce, not the boardroom." },
  { word: "Measurement", body: "Every claim is xAPI-instrumented. Evidence ships with deliverables." },
  { word: "Mastery", body: "Operator-grade craft across software, programs, and content." },
];

const snapshot = [
  { label: "Founded", value: "2024" },
  { label: "HQ", value: "Las Vegas, NV" },
  { label: "Designation", value: "SDVOSB · DVOSB" },
  { label: "Stack", value: "SaaS · Training · AI" },
];

const engagementSteps = [
  {
    n: "01",
    t: "Discover",
    b: "30-minute working session — we map your real workflow, not a generic deck. No sales theater.",
  },
  {
    n: "02",
    t: "Configure",
    b: "Tenant provisioned in hours. Equipment, procedures, and templates pre-loaded for your operation.",
  },
  {
    n: "03",
    t: "Deploy",
    b: "Pilot site live in weeks. Workers trained, devices in hand, evidence flowing into the LRS.",
  },
  {
    n: "04",
    t: "Iterate",
    b: "Quarterly content + product cycles. We ship, you measure, the program compounds.",
  },
];

const recognition = [
  "SDVOSB · DVOSB",
  "OSHA Outreach (renewal)",
  "ISO 45001 aligned",
  "Section 508",
  "WCAG 2.1 AA",
  "xAPI 1.0.3",
];

export default function AboutPage() {
  return (
    <>
      <RadarBackdrop />

      <div className="pt-32 md:pt-40 pb-24">
        {/* Hero */}
        <section className="tnv-container tnv-section">
          <Eyebrow label="ABOUT" />
          <h1 className="tnv-h1 mt-6 max-w-5xl text-balance">
            One operator's bet on a{" "}
            <span className="tnv-italic text-signal">better field.</span>
          </h1>
          <p className="tnv-body mt-8 max-w-2xl text-pretty">
            Trainovate.ai exists because the workforce that keeps the world
            running deserves a real product — not another binder, not another
            slide deck, and not a consultancy invoice.
          </p>
        </section>

        {/* Brand video */}
        <section className="tnv-container tnv-section mt-20">
          <Eyebrow index="01" label="BRAND INTRO" />
          <div className="mt-6 max-w-4xl mx-auto">
            <div className="tnv-glass rounded-xl p-2">
              <VimeoEmbed
                videoId="1166250257"
                hash="5718878337"
                title="Trainovate.ai — Brand intro"
                className="rounded-lg"
              />
            </div>
            <p className="mt-4 font-mono text-[10px] uppercase tracking-eyebrow text-fog text-center">
              Brand intro · TODO Jay confirms — Trainovations vs. Trainovate.ai labelling
            </p>
          </div>
        </section>

        {/* Mission + Vision */}
        <section className="tnv-container tnv-section mt-32">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-bone/8 border border-bone/8">
            <div className="bg-ink/40 p-10">
              <Eyebrow label="MISSION" />
              <h2 className="tnv-h3 mt-6 text-balance">
                Make safety training {" "}
                <span className="tnv-italic text-signal">measurable.</span>
              </h2>
              <p className="tnv-body mt-5 text-base text-pretty">
                Replace the binder, the printed roster, and the photocopied
                quiz with a real-time evidence stream a regulator and a CFO
                can both verify.
              </p>
            </div>
            <div className="bg-ink/40 p-10">
              <Eyebrow label="VISION" />
              <h2 className="tnv-h3 mt-6 text-balance">
                One platform from the floor to the{" "}
                <span className="tnv-italic text-signal">contracting officer.</span>
              </h2>
              <p className="tnv-body mt-5 text-base text-pretty">
                Soteria becomes the workforce-safety system of record across
                regulated commercial industry and the federal mission space.
              </p>
            </div>
          </div>
        </section>

        {/* Snapshot */}
        <section className="tnv-container tnv-section mt-24">
          <Eyebrow index="02" label="COMPANY SNAPSHOT" />
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-px bg-bone/8 border border-bone/8">
            {snapshot.map((s) => (
              <div key={s.label} className="bg-ink/40 p-6">
                <div className="font-mono text-[10px] uppercase tracking-eyebrow text-fog">
                  {s.label}
                </div>
                <div className="font-display font-semibold text-2xl text-bone mt-3 tracking-tight">
                  {s.value}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Founder */}
        <section className="tnv-container tnv-section mt-32">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-5">
              <div className="relative">
                <StockImage
                  stockKey="about.founder"
                  className="aspect-[4/5] w-full"
                  sizes="(min-width: 1024px) 40vw, 100vw"
                />
                <div className="absolute -bottom-4 -left-4 tnv-glass rounded-md px-4 py-3">
                  <div className="font-mono text-[10px] uppercase tracking-eyebrow text-fog">
                    Founder
                  </div>
                  <div className="font-serif text-xl text-bone">Jamil "Jay" Jones</div>
                </div>
              </div>
            </div>
            <div className="lg:col-span-7">
              <Eyebrow index="03" label="FOUNDER" />
              <h2 className="tnv-h2 mt-6 text-balance">
                Veteran. Operator. <span className="tnv-italic">Builder.</span>
              </h2>
              <div className="mt-8 space-y-6 tnv-body text-pretty">
                <p>
                  After leaving the service, Jay spent years on the floor as an
                  EHS specialist — running LOTO programs, training crews,
                  writing the policies the auditors come for. He kept noticing
                  the same thing: the field was twenty years behind the way
                  modern teams actually learn.
                </p>
                <p>
                  Trainovate.ai is the bet that the gap closes when one
                  company ships a real product. Soteria is that product —
                  a SaaS + training platform built by people who have actually
                  run the program. No subcontractor chain, no broken handoffs,
                  no theater.
                </p>
                <p>
                  Jay leads the company from Las Vegas, NV, with a curated
                  bench of specialist partners brought in per engagement.
                  Every deliverable is signed by the person who built it.
                </p>
              </div>
              <div className="mt-10 grid grid-cols-2 gap-3">
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

        {/* How we work */}
        <section className="tnv-container tnv-section mt-32">
          <Eyebrow index="04" label="HOW WE WORK" />
          <h2 className="tnv-h2 mt-6 max-w-3xl text-balance">
            Four steps. <span className="tnv-italic text-signal">No theater.</span>
          </h2>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-px bg-bone/8 border border-bone/8">
            {engagementSteps.map((s) => (
              <div key={s.n} className="bg-ink/40 p-6">
                <div className="font-mono text-[10px] uppercase tracking-eyebrow text-cobalt-soft">
                  Step {s.n}
                </div>
                <div className="font-display font-semibold text-2xl text-bone mt-3 tracking-tight">
                  {s.t}
                </div>
                <p className="tnv-body mt-4 text-sm text-pretty">{s.b}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Values */}
        <section className="tnv-container tnv-section mt-32">
          <Eyebrow index="05" label="VALUES" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-bone/8 border border-bone/8 mt-10">
            {values.map((v, i) => (
              <div key={v.word} className="bg-ink/40 p-10 md:p-12">
                <div className="font-mono text-[10px] uppercase tracking-eyebrow text-signal">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div className="mt-4 font-display font-semibold text-5xl text-bone tracking-tight">
                  {v.word}
                  <span className="text-signal">.</span>
                </div>
                <p className="tnv-body mt-6 text-base text-pretty">{v.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Recognition */}
        <section className="tnv-container tnv-section mt-32">
          <div className="border-y border-bone/8 py-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-4 flex items-center gap-4">
              <SDVOSBSeal className="h-16 w-16 text-cobalt flex-shrink-0" />
              <Eyebrow index="06" label="RECOGNITION & STANDARDS" />
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
          <div className="tnv-glass rounded-2xl p-10 md:p-16 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <Eyebrow label="START" />
              <h3 className="tnv-h3 mt-4 max-w-md">
                Talk to the person who'll be on the call.
              </h3>
            </div>
            <Link href="/contact" className="tnv-btn-signal">
              Start a conversation
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
