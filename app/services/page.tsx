import type { Metadata } from "next";
import Link from "next/link";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { StockImage } from "@/components/ui/StockImage";

export const metadata: Metadata = {
  title: "Services — EHS, training, analytics",
  description:
    "EHS program development, OSHA outreach training, custom training development, HSE travel risk, compliance audits, and xAPI implementation.",
};

const services = [
  {
    title: "EHS Program Development",
    body: "Policy authoring, gap analyses, audit prep, and ground-up program builds for facilities that need a real one.",
    deliverables: ["Written program package", "Roles & responsibilities matrix", "30/60/90 implementation plan"],
  },
  {
    title: "OSHA Outreach Training",
    body: "10/30 hr, 511, 501. Authorization currently in renewal — bookings are taken on a waitlist.",
    deliverables: ["10-hr & 30-hr courses", "Train-the-trainer cohorts", "Bilingual delivery"],
    note: "Authorization in renewal",
  },
  {
    title: "Custom Training Development",
    body: "Instructional design, video, motion graphics, and post-production through our in-house studio (Axiom Post).",
    deliverables: ["xAPI / SCORM packages", "Cinema-grade video", "Motion graphics & VFX"],
  },
  {
    title: "HSE Travel Risk Management",
    body: "Pre-deployment risk assessments, in-country protocols, and incident response playbooks for distributed workforces.",
    deliverables: ["Country risk dossiers", "Traveller training", "24/7 incident playbooks"],
  },
  {
    title: "Compliance Audits",
    body: "ISO 45001 and ISO 14001 readiness, gap, and surveillance support. We audit like a regulator, not a vendor.",
    deliverables: ["Gap report", "Corrective action plan", "Re-audit cycle"],
  },
  {
    title: "Workforce Analytics & xAPI",
    body: "Stand up an LRS, instrument your existing content, and turn training data into operational signal.",
    deliverables: ["LRS deployment", "Statement design", "BI dashboards"],
  },
];

export default function ServicesPage() {
  return (
    <div className="pt-32 md:pt-40 pb-24">
      <section className="tnv-container tnv-section">
        <Eyebrow index="01" label="SERVICES" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mt-6 items-end">
          <div className="lg:col-span-7">
            <h1 className="tnv-h1 max-w-4xl text-balance">
              The work behind the <span className="tnv-italic text-signal">work.</span>
            </h1>
            <p className="tnv-body mt-8 max-w-xl text-pretty">
              Software is the floor. Programs are the building. Trainovate's
              services arm builds, audits, and instruments the EHS programs our
              platform runs on top of.
            </p>
          </div>
          <div className="lg:col-span-5">
            <StockImage
              stockKey="services.classroom"
              className="aspect-[4/3] w-full"
              priority
              sizes="(min-width: 1024px) 40vw, 100vw"
            />
          </div>
        </div>
      </section>

      <section className="tnv-container tnv-section mt-32">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-bone/8 border border-bone/8">
          {services.map((s, i) => (
            <article key={s.title} className="bg-void p-8 md:p-10">
              <div className="flex items-center justify-between gap-4">
                <div className="font-mono text-[10px] uppercase tracking-eyebrow text-signal">
                  {String(i + 1).padStart(2, "0")}
                </div>
                {s.note && (
                  <div className="font-mono text-[10px] uppercase tracking-eyebrow text-amber border border-amber/40 px-2 py-1">
                    {s.note}
                  </div>
                )}
              </div>
              <h2 className="font-serif text-3xl mt-4 text-bone tracking-tight text-balance">
                {s.title}
              </h2>
              <p className="tnv-body mt-4 text-base text-pretty">{s.body}</p>
              <ul className="mt-6 space-y-2">
                {s.deliverables.map((d) => (
                  <li
                    key={d}
                    className="font-mono text-[11px] uppercase tracking-eyebrow text-fog flex items-start gap-2"
                  >
                    <span className="text-signal">→</span>
                    <span>{d}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="tnv-container tnv-section mt-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <StockImage
            stockKey="services.fieldwalk"
            className="aspect-[5/4] w-full"
            sizes="(min-width: 1024px) 50vw, 100vw"
          />
          <div>
            <Eyebrow label="ENGAGEMENT" />
            <h2 className="tnv-h2 mt-6 text-balance">
              We embed. We don't <span className="tnv-italic text-signal">visit.</span>
            </h2>
            <p className="tnv-body mt-6 text-pretty">
              Trainovate engagements start in the field — on the floor, on the
              tarmac, in the cleanroom. We sit with the people who do the work,
              not just the people who buy the software. Every deliverable
              survives contact with reality.
            </p>
            <Link href="/contact" className="tnv-btn-signal mt-10">
              Start a conversation
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
