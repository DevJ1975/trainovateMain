import type { Metadata } from "next";
import Link from "next/link";
import { Download } from "lucide-react";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { StockImage } from "@/components/ui/StockImage";
import { SDVOSBSeal } from "@/components/marks/SDVOSBSeal";

export const metadata: Metadata = {
  title: "Federal — SDVOSB capabilities",
  description:
    "Trainovate Technologies is a Service-Disabled Veteran-Owned Small Business serving DoD, VA, and federally regulated industry. JV with Synergy Federal Group.",
};

const NAICS = [
  { code: "611430", title: "Professional & Management Development Training", primary: true },
  { code: "541611", title: "Administrative Management Consulting" },
  { code: "541330", title: "Engineering Services" },
  { code: "541512", title: "Computer Systems Design" },
  { code: "611710", title: "Educational Support Services" },
  { code: "541990", title: "All Other Professional, Scientific & Technical" },
];

const vehicles = [
  { name: "GSA MAS", status: "Pursuing", tone: "amber" as const },
  { name: "VA T4NG-adjacent", status: "Targeting", tone: "amber" as const },
  { name: "SPRUCE IDIQ", status: "Targeting", tone: "amber" as const },
  { name: "SAM.gov registration", status: "Active", tone: "signal" as const },
];

const pastPerformance = [
  { client: "Snak King", scope: "700+ LOTO placards deployed across multi-site CPG operation" },
  { client: "MES Fire", scope: "Fire & life-safety training program development" },
  { client: "StandardAero", scope: "Aviation MRO compliance and training instrumentation" },
  { client: "UNFI", scope: "Distribution-center EHS audit cycle" },
  { client: "Code Platoon (adjacent)", scope: "Veteran technical workforce pipeline collaboration" },
];

export default function FederalPage() {
  return (
    <div className="pt-32 md:pt-40 pb-24">
      {/* Hero */}
      <section className="tnv-container tnv-section">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-7">
            <Eyebrow index="05" label="FEDERAL" />
            <h1 className="tnv-h1 mt-6 max-w-3xl text-balance">
              Built for the <span className="tnv-italic text-signal">mission.</span>
            </h1>
            <p className="tnv-body mt-8 max-w-xl text-pretty">
              Trainovate is a Service-Disabled Veteran-Owned Small Business.
              We work where the standard is non-negotiable — DoD, VA, and
              federally regulated industry. Our joint venture with Synergy
              Federal Group extends our reach into SDVOSB and women-owned
              set-aside vehicles.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <a
                href="/pdf/capability-statement.pdf"
                className="tnv-btn-signal"
                aria-label="Download capability statement (PDF)"
              >
                <Download size={14} />
                Capability statement
              </a>
              <Link href="/contact" className="tnv-btn-ghost">
                Federal teaming inquiry
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col gap-6">
            <StockImage
              stockKey="federal.dod"
              className="aspect-[4/3] w-full"
              treatment="cool"
              priority
              sizes="(min-width: 1024px) 40vw, 100vw"
            />
            <div className="tnv-glass rounded-md p-6 flex items-center gap-5">
              <SDVOSBSeal className="h-20 w-20 text-signal flex-shrink-0" />
              <div>
                <div className="font-mono text-[10px] uppercase tracking-eyebrow text-signal">
                  Designation
                </div>
                <div className="font-serif text-2xl text-bone mt-1">SDVOSB · DVOSB</div>
                <div className="font-mono text-[10px] uppercase tracking-eyebrow text-fog mt-1">
                  Service-Disabled · Veteran-Owned · Small Business
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Designations grid */}
      <section className="tnv-container tnv-section mt-24">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-bone/8 border border-bone/8">
          {[
            { label: "UEI", value: "[on file]" },
            { label: "CAGE", value: "[on file]" },
            { label: "SAM.gov", value: "Registered" },
            { label: "State of Incorporation", value: "Nevada" },
          ].map((r) => (
            <div key={r.label} className="bg-void p-6 md:p-8">
              <div className="font-mono text-[10px] uppercase tracking-eyebrow text-fog">
                {r.label}
              </div>
              <div className="font-serif text-2xl md:text-3xl mt-3 text-bone tracking-tight">
                {r.value}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* NAICS */}
      <section className="tnv-container tnv-section mt-32">
        <Eyebrow index="05.A" label="NAICS CODES" />
        <h2 className="tnv-h2 mt-6 max-w-3xl text-balance">
          Where we sit on the schedule.
        </h2>
        <div className="mt-12 border border-bone/8">
          {NAICS.map((n) => (
            <div
              key={n.code}
              className="flex items-baseline justify-between gap-6 px-6 py-5 border-b border-bone/8 last:border-b-0"
            >
              <div className="flex items-baseline gap-6">
                <div className="font-mono text-2xl text-signal">{n.code}</div>
                <div className="text-bone/90 font-sans">{n.title}</div>
              </div>
              {n.primary && (
                <span className="font-mono text-[10px] uppercase tracking-eyebrow text-signal border border-signal/40 px-2 py-1">
                  Primary
                </span>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Differentiators */}
      <section className="tnv-container tnv-section mt-32">
        <Eyebrow index="05.B" label="DIFFERENTIATORS" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-bone/8 border border-bone/8 mt-10">
          {[
            {
              t: "Veteran-led leadership",
              b: "Founded and operated by a veteran with field, MBA, and JD-track depth.",
            },
            {
              t: "EHS + AI + media in one shop",
              b: "We run the program, build the platform, and produce the content. No subcontract chain.",
            },
            {
              t: "Soteria platform IP",
              b: "Proprietary multi-tenant SaaS already deployed in commercial production.",
            },
          ].map((d) => (
            <div key={d.t} className="bg-void p-8">
              <div className="text-signal font-mono text-[10px] uppercase tracking-eyebrow">→</div>
              <h3 className="tnv-h3 mt-4 text-bone">{d.t}</h3>
              <p className="tnv-body mt-4 text-base text-pretty">{d.b}</p>
            </div>
          ))}
        </div>
      </section>

      {/* JV */}
      <section className="tnv-container tnv-section mt-32">
        <div className="tnv-glass rounded-2xl p-10 md:p-16">
          <Eyebrow index="05.C" label="JOINT VENTURE" />
          <h2 className="tnv-h2 mt-6 max-w-4xl text-balance">
            With Synergy Federal Group.
          </h2>
          <p className="tnv-body mt-6 max-w-3xl text-pretty">
            Trainovate's joint venture with Synergy Federal Group (Wyoming
            entity in formation) combines an SDVOSB platform company with a
            federally-experienced capture and delivery partner. Target verticals
            include the Department of Veterans Affairs, the Department of
            Defense, and adjacent civilian agencies. {/* TODO Jay confirms — JV legal language */}
          </p>
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border-l-2 border-signal pl-5">
              <div className="font-mono text-[10px] uppercase tracking-eyebrow text-fog">
                Trainovate brings
              </div>
              <div className="font-serif text-xl text-bone mt-2">
                Soteria platform · EHS programs · training production
              </div>
            </div>
            <div className="border-l-2 border-signal pl-5">
              <div className="font-mono text-[10px] uppercase tracking-eyebrow text-fog">
                Synergy brings
              </div>
              <div className="font-serif text-xl text-bone mt-2">
                Federal capture · contract administration · agency relationships
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Past performance */}
      <section className="tnv-container tnv-section mt-32">
        <Eyebrow index="05.D" label="PAST PERFORMANCE" />
        <p className="tnv-body mt-4 text-sm max-w-2xl">
          Each engagement listed below requires client confirmation before
          publication on a final capability statement.
          {" "}
          <span className="text-amber font-mono text-[10px] uppercase tracking-eyebrow">
            TODO Jay confirms
          </span>
        </p>
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-bone/8 border border-bone/8">
          {pastPerformance.map((c) => (
            <div key={c.client} className="bg-void p-6">
              <div className="font-mono text-[10px] uppercase tracking-eyebrow text-signal">
                Client
              </div>
              <div className="font-serif text-2xl text-bone mt-2 tracking-tight">
                {c.client}
              </div>
              <p className="tnv-body mt-3 text-sm text-pretty">{c.scope}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Vehicles */}
      <section className="tnv-container tnv-section mt-32">
        <Eyebrow index="05.E" label="CONTRACT VEHICLES" />
        <div className="mt-10 border border-bone/8">
          {vehicles.map((v) => (
            <div
              key={v.name}
              className="flex items-center justify-between gap-6 px-6 py-5 border-b border-bone/8 last:border-b-0"
            >
              <div className="font-serif text-xl text-bone">{v.name}</div>
              <span
                className={`font-mono text-[10px] uppercase tracking-eyebrow border px-2 py-1 ${
                  v.tone === "signal"
                    ? "text-signal border-signal/40"
                    : "text-amber border-amber/40"
                }`}
              >
                {v.status}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
