import Link from "next/link";
import { Download } from "lucide-react";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { SDVOSBSeal } from "@/components/marks/SDVOSBSeal";

const NAICS = ["611430 ·", "541611 ·", "541330 ·", "541512 ·", "611710 ·", "541990"];

export function FederalPanel() {
  return (
    <section className="relative tnv-section py-32">
      <div className="tnv-container">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 flex justify-center lg:justify-start">
            <div className="text-center lg:text-left">
              <SDVOSBSeal className="h-48 w-48 text-signal mx-auto lg:mx-0" />
              <div className="mt-6 font-mono text-[10px] uppercase tracking-eyebrow text-fog">
                Service-Disabled · Veteran-Owned · Small Business
              </div>
              <div className="mt-6 grid grid-cols-2 gap-3 max-w-xs mx-auto lg:mx-0">
                <Stat label="UEI" value="[on file]" />
                <Stat label="CAGE" value="[on file]" />
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <Eyebrow index="04" label="FEDERAL" />
            <h2 className="tnv-h2 mt-6 max-w-2xl text-balance">
              Built for the <span className="tnv-italic text-signal">mission.</span>
            </h2>
            <p className="tnv-body mt-6 max-w-xl text-pretty">
              Trainovate is a Service-Disabled Veteran-Owned Small Business.
              We work where the standard is non-negotiable — DoD, VA, and
              federally regulated industry. Our joint venture with Synergy
              Federal Group extends our reach into SDVOSB and women-owned
              set-aside vehicles.
            </p>

            <div className="mt-10">
              <div className="font-mono text-[10px] uppercase tracking-eyebrow text-fog mb-3">
                Primary NAICS · 611430
              </div>
              <div className="font-mono text-sm text-bone/80 flex flex-wrap gap-x-2 gap-y-1">
                {NAICS.map((n) => (
                  <span key={n}>{n}</span>
                ))}
              </div>
            </div>

            <div className="mt-10 flex flex-wrap gap-3">
              <a href="/pdf/capability-statement.pdf" className="tnv-btn-signal">
                <Download size={14} />
                Capability statement
              </a>
              <Link href="/federal" className="tnv-btn-ghost">
                Federal page
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-bone/10 px-3 py-3">
      <div className="font-mono text-[10px] uppercase tracking-eyebrow text-fog">{label}</div>
      <div className="font-mono text-sm text-bone mt-1">{value}</div>
    </div>
  );
}
