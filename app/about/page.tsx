import type { Metadata } from "next";
import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { VimeoEmbed } from "@/components/ui/VimeoEmbed";
import { SDVOSBSeal } from "@/components/marks/SDVOSBSeal";

const RadarBackdrop = dynamic(
  () => import("@/components/three/RadarBackdrop").then((m) => m.RadarBackdrop),
  { ssr: false }
);

export const metadata: Metadata = {
  title: "About Trainovate | Veteran-Founded Workforce Training Technology Company",
  description:
    "Learn how Trainovate builds modern workforce training systems using AI, immersive VR/3D learning, microlearning, and the Soteria FIELD SaaS LMS — for real-world safety, performance, and retention. Veteran-founded. SDVOSB.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About Trainovate | Veteran-Founded Workforce Training Technology Company",
    description:
      "AI-powered, immersive workforce training built for high-risk industries. Veteran-founded. SDVOSB. Headquartered in Las Vegas, NV.",
    url: "/about",
    type: "website",
  },
};

const builds = [
  {
    t: "AI-Driven Learning Systems",
    b: "Adaptive training that evolves with the learner and reinforces critical knowledge over time.",
  },
  {
    t: "Immersive VR & 3D Training",
    b: "Realistic simulations that prepare teams for the environments they actually operate in.",
  },
  {
    t: "Microlearning & Daily Reinforcement",
    b: "Short, focused training designed to build habits and improve retention.",
  },
  {
    t: "Custom Training Platforms (LMS)",
    b: "Scalable systems tailored to your operations, workflows, and compliance requirements.",
  },
];

const principles = [
  {
    t: "Built for Real Work",
    b: "Training is designed around actual job conditions — not theory.",
  },
  {
    t: "Focused on Retention",
    b: "If it&rsquo;s not remembered, it doesn&rsquo;t matter. We design for long-term recall.",
  },
  {
    t: "Engagement First",
    b: "Interactive, immersive experiences outperform passive content.",
  },
  {
    t: "Mobile and Accessible",
    b: "Training should be available wherever work happens.",
  },
  {
    t: "Scalable by Design",
    b: "Systems built to grow with your organization.",
  },
];

const differentiators = [
  {
    t: "We build systems, not just content",
    b: "Training is part of a larger operational ecosystem.",
  },
  {
    t: "We focus on application, not completion",
    b: "The goal is performance — not checking a box.",
  },
  {
    t: "We design for your environment",
    b: "Every solution is aligned with how your teams actually work.",
  },
  {
    t: "We combine technology with instructional design",
    b: "Tools alone don&rsquo;t solve the problem — execution does.",
  },
];

export default function AboutPage() {
  return (
    <>
      <RadarBackdrop />

      <div className="pt-32 md:pt-40 pb-24">
        {/* 1. HERO */}
        <section className="tnv-container tnv-section">
          <Eyebrow label="ABOUT TRAINOVATE" />
          <h1 className="tnv-h1 mt-6 max-w-5xl text-balance">
            Train for the real world.{" "}
            <span className="tnv-italic text-signal">Not the classroom.</span>
          </h1>
          <p className="tnv-body mt-8 max-w-2xl text-pretty text-lg">
            Trainovate builds modern workforce training systems using AI,
            immersive learning, and real-world simulation — designed to
            improve safety, performance, and retention where it actually
            matters.
          </p>
        </section>

        {/* Brand intro video */}
        <section className="tnv-container tnv-section mt-20">
          <div className="max-w-4xl mx-auto">
            <div className="tnv-glass rounded-xl p-2">
              <VimeoEmbed
                videoId="1166250257"
                hash="5718878337"
                title="Trainovate Technologies — Brand intro"
                className="rounded-lg"
              />
            </div>
          </div>
        </section>

        {/* 2. WHO WE ARE */}
        <section className="tnv-container tnv-section mt-32">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-5">
              <Eyebrow index="01" label="WHO WE ARE" />
              <h2 className="tnv-h2 mt-6 max-w-md text-balance">
                Built by people who have{" "}
                <span className="tnv-italic text-signal">done the work.</span>
              </h2>
            </div>
            <div className="lg:col-span-7 space-y-5 tnv-body text-pretty text-lg">
              <p>
                Trainovate is a veteran-founded workforce training company
                focused on high-risk, high-responsibility industries.
              </p>
              <p>
                We design and build training systems that go beyond
                compliance — helping organizations develop capable, confident
                teams who can perform in real-world conditions.
              </p>
              <p>
                Our work sits at the intersection of technology, instructional
                design, and operational reality.
              </p>
            </div>
          </div>
        </section>

        {/* 3. WHY TRAINOVATE EXISTS */}
        <section className="tnv-container tnv-section mt-32">
          <Eyebrow index="02" label="WHY TRAINOVATE EXISTS" />
          <h2 className="tnv-h2 mt-6 max-w-3xl text-balance">
            Most training{" "}
            <span className="tnv-italic text-signal">doesn&rsquo;t work.</span>
          </h2>

          <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-px bg-bone/8 border border-bone/8">
            <div className="bg-ink/40 p-10">
              <div className="font-mono text-[10px] uppercase tracking-eyebrow text-flare">
                The problem
              </div>
              <p className="tnv-body mt-5 text-pretty">
                It&rsquo;s static, forgettable, and disconnected from the
                environments people actually work in. Employees complete
                modules, check boxes, and move on — without retaining what
                they need when it matters most.
              </p>
              <p className="tnv-body mt-4 text-pretty font-medium text-bone/90">
                That gap creates real risk.
              </p>
            </div>
            <div className="bg-ink/40 p-10 relative">
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
                  Why we exist
                </div>
                <p className="tnv-body mt-5 text-pretty">
                  Trainovate exists to close that gap by building training
                  that people engage with, remember, and apply on the job.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 4. WHAT WE BUILD */}
        <section className="tnv-container tnv-section mt-32">
          <Eyebrow index="03" label="WHAT WE BUILD" />
          <h2 className="tnv-h2 mt-6 max-w-3xl text-balance">
            Modern training systems for{" "}
            <span className="tnv-italic text-signal">real-world performance.</span>
          </h2>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-px bg-bone/8 border border-bone/8">
            {builds.map((b, i) => (
              <div key={b.t} className="bg-ink/40 p-8">
                <div className="font-mono text-[10px] uppercase tracking-eyebrow text-cobalt-soft">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <h3 className="font-display font-semibold text-2xl text-bone mt-3 tracking-tight">
                  {b.t}
                </h3>
                <p className="tnv-body mt-4 text-base text-pretty">{b.b}</p>
              </div>
            ))}
          </div>

          <p className="tnv-body mt-10 max-w-2xl text-pretty">
            Everything we build is designed to drive retention, behavior
            change, and measurable improvement.
          </p>
        </section>

        {/* 5. OUR APPROACH */}
        <section className="tnv-container tnv-section mt-32">
          <Eyebrow index="04" label="OUR APPROACH" />
          <h2 className="tnv-h2 mt-6 max-w-3xl text-balance">
            We build training{" "}
            <span className="tnv-italic text-signal">differently.</span>
          </h2>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-px bg-bone/8 border border-bone/8">
            {principles.map((p, i) => (
              <div key={p.t} className="bg-ink/40 p-6">
                <div className="font-mono text-[10px] uppercase tracking-eyebrow text-cobalt-soft">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <h3 className="font-display font-semibold text-lg text-bone mt-3 tracking-tight">
                  {p.t}
                </h3>
                <p
                  className="tnv-body mt-3 text-sm text-pretty"
                  dangerouslySetInnerHTML={{ __html: p.b }}
                />
              </div>
            ))}
          </div>
        </section>

        {/* 6. VETERAN-FOUNDED */}
        <section className="tnv-container tnv-section mt-32">
          <div className="tnv-glass rounded-2xl p-10 md:p-16">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
              <div className="lg:col-span-3 flex justify-center lg:justify-start">
                <div className="relative">
                  <div
                    className="absolute -inset-8 pointer-events-none"
                    style={{
                      background:
                        "radial-gradient(circle at center, rgba(255,107,26,0.18), transparent 60%)",
                    }}
                    aria-hidden="true"
                  />
                  <SDVOSBSeal className="relative h-32 w-32 text-cobalt" />
                </div>
              </div>
              <div className="lg:col-span-9">
                <Eyebrow index="05" label="VETERAN-FOUNDED" />
                <h2 className="tnv-h2 mt-6 max-w-2xl text-balance">
                  Discipline. Accountability.{" "}
                  <span className="tnv-italic text-signal">Mission focus.</span>
                </h2>
                <p className="tnv-body mt-6 max-w-2xl text-pretty text-lg">
                  Trainovate is built on the principles of discipline,
                  accountability, and mission focus.
                </p>
                <p className="tnv-body mt-4 max-w-2xl text-pretty text-lg">
                  Our background shapes how we approach training: clear
                  objectives, practical execution, and systems that perform
                  under real-world pressure.
                </p>

                <div className="mt-8 inline-flex items-center gap-3 border border-cobalt/40 px-4 py-2">
                  <span className="font-mono text-[11px] uppercase tracking-eyebrow text-cobalt-soft">
                    SDVOSB · DVOSB
                  </span>
                  <span className="text-fog">·</span>
                  <span className="font-mono text-[10px] uppercase tracking-eyebrow text-fog">
                    Las Vegas, NV
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 7. WHAT MAKES US DIFFERENT */}
        <section className="tnv-container tnv-section mt-32">
          <Eyebrow index="06" label="WHAT MAKES US DIFFERENT" />
          <h2 className="tnv-h2 mt-6 max-w-3xl text-balance">
            We are not a content vendor.{" "}
            <span className="tnv-italic text-signal">We are a systems company.</span>
          </h2>

          <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-10">
            {differentiators.map((d, i) => (
              <div key={d.t} className="border-l-2 border-cobalt pl-5">
                <div className="font-mono text-[10px] uppercase tracking-eyebrow text-cobalt-soft">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <h3 className="font-display font-semibold text-2xl text-bone mt-2 tracking-tight">
                  {d.t}
                </h3>
                <p
                  className="tnv-body mt-3 text-base text-pretty"
                  dangerouslySetInnerHTML={{ __html: d.b }}
                />
              </div>
            ))}
          </div>
        </section>

        {/* 8. MISSION */}
        <section className="tnv-container tnv-section mt-32">
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
              <Eyebrow index="07" label="OUR MISSION" />
              <p
                className="font-display font-semibold tracking-tight mt-6 text-bone text-balance"
                style={{
                  fontSize: "clamp(28px, 4vw, 56px)",
                  lineHeight: 1.1,
                  letterSpacing: "-0.025em",
                }}
              >
                To modernize workforce training by building systems that
                improve safety,{" "}
                <span className="tnv-italic text-signal">strengthen performance,</span>{" "}
                and prepare people for the realities of their work.
              </p>
            </div>
          </div>
        </section>

        {/* 9. CTA */}
        <section className="tnv-container tnv-section mt-24">
          <div className="border-t border-bone/8 pt-16">
            <Eyebrow index="08" label="START" />
            <h2 className="tnv-h1 mt-6 max-w-4xl text-balance" style={{ fontSize: "clamp(40px, 6vw, 88px)" }}>
              Build training that{" "}
              <span className="tnv-italic text-signal">actually works.</span>
            </h2>
            <p className="tnv-body mt-8 max-w-2xl text-pretty text-lg">
              If your current training isn&rsquo;t delivering real-world
              results, it&rsquo;s time to rethink the system.
            </p>
            <div className="mt-12 flex flex-wrap gap-3">
              <Link href="/contact" className="tnv-btn-signal">
                Request a Demo <ArrowRight size={14} />
              </Link>
              <Link
                href="/contact"
                className="tnv-btn-signal"
                style={{ background: "var(--tnv-flare)", borderColor: "var(--tnv-flare)" }}
              >
                Build Your Training System
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
