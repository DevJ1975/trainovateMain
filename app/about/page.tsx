import type { Metadata } from "next";
import Link from "next/link";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { StockImage } from "@/components/ui/StockImage";

export const metadata: Metadata = {
  title: "About — Veteran-founded. Operator-built.",
  description:
    "Trainovate Technologies was founded by Jamil 'Jay' Jones — veteran, EHS specialist, software builder, and film editor. We exist because the workforce that keeps the world running deserves training that meets them where they are.",
};

const credentials = [
  "U.S. Military Veteran",
  "MBA",
  "JD Candidate · Entertainment Law",
  "Code Platoon · Juliet 2026",
  "OSHA-Authorized Trainer (in renewal)",
  "EHS Specialist",
  "Full-stack developer",
  "Film editor / motion graphics / DP",
];

const values = [
  { word: "Mission", body: "We build for the workforce, not the boardroom." },
  { word: "Measurement", body: "Every claim is xAPI-instrumented. Evidence ships with deliverables." },
  { word: "Mastery", body: "Operator-grade craft across software, programs, and content." },
];

export default function AboutPage() {
  return (
    <div className="pt-32 md:pt-40 pb-24">
      {/* Hero */}
      <section className="tnv-container tnv-section">
        <Eyebrow label="ABOUT" />
        <h1 className="tnv-h1 mt-6 max-w-5xl text-balance">
          One operator's bet on a{" "}
          <span className="tnv-italic text-signal">better field.</span>
        </h1>
        <p className="tnv-body mt-8 max-w-2xl text-pretty">
          Trainovate exists because the workforce that keeps the world running
          deserves training that meets them where they are: on the floor, on
          the iPad, mid-task, and measurable.
        </p>
      </section>

      {/* Founder */}
      <section className="tnv-container tnv-section mt-24">
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
            <Eyebrow index="01" label="ORIGIN" />
            <h2 className="tnv-h2 mt-6 text-balance">
              Veteran. Operator. <span className="tnv-italic">Builder.</span>
            </h2>
            <div className="mt-8 space-y-6 tnv-body text-pretty">
              <p>
                After leaving the service, Jay spent years on the floor as an
                EHS specialist — running LOTO programs, training crews, writing
                the policies the auditors come for. He kept noticing the same
                thing: the field was twenty years behind the way modern teams
                actually learn.
              </p>
              <p>
                Trainovate is the bet that the gap can be closed by one company
                that does all three jobs at once — operates the program,
                ships the platform, and produces the content. No subcontractor
                chain, no broken handoffs, no theater.
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

      {/* Team */}
      <section className="tnv-container tnv-section mt-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <Eyebrow index="02" label="TEAM" />
            <h2 className="tnv-h2 mt-6 text-balance">
              A roster of one.{" "}
              <span className="tnv-italic text-signal">Hiring the rest.</span>
            </h2>
            <p className="tnv-body mt-6 text-pretty">
              Trainovate is currently a roster of one. We are hiring engineers,
              instructional designers, and federal capture managers who want to
              build a category-defining workforce platform. We do not invent
              team members on the website.
            </p>
            <Link href="/contact" className="tnv-btn-ghost mt-8">
              Reach out about a role
            </Link>
          </div>
          <StockImage
            stockKey="about.team"
            className="aspect-[5/4] w-full"
            sizes="(min-width: 1024px) 50vw, 100vw"
          />
        </div>
      </section>

      {/* Values */}
      <section className="tnv-container tnv-section mt-32">
        <Eyebrow index="03" label="VALUES" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-bone/8 border border-bone/8 mt-10">
          {values.map((v, i) => (
            <div key={v.word} className="bg-void p-10 md:p-12">
              <div className="font-mono text-[10px] uppercase tracking-eyebrow text-signal">
                {String(i + 1).padStart(2, "0")}
              </div>
              <div className="mt-4 font-serif text-5xl text-bone tracking-tight">
                {v.word}
                <span className="text-signal">.</span>
              </div>
              <p className="tnv-body mt-6 text-base text-pretty">{v.body}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
