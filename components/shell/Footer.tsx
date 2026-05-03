import Link from "next/link";
import { Wordmark } from "@/components/marks/Wordmark";
import { SDVOSBSeal } from "@/components/marks/SDVOSBSeal";

const NAICS = ["611430", "541611", "541330", "541512", "611710", "541990"];

export function Footer() {
  return (
    <footer className="relative border-t border-bone/8 bg-carbon/40 mt-32">
      <div className="tnv-container tnv-section py-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          <div className="md:col-span-4">
            <Wordmark className="text-2xl text-bone" />
            <p className="mt-5 tnv-body text-sm max-w-xs">
              Workforce Transformation OS for high-risk industries. Veteran-founded.
              Federally credentialed. Built to ship.
            </p>
            <div className="mt-6 flex items-center gap-4">
              <SDVOSBSeal className="h-14 w-14 text-signal" />
              <div className="font-mono text-[10px] uppercase tracking-eyebrow text-fog leading-relaxed">
                Service-Disabled
                <br />
                Veteran-Owned
                <br />
                Small Business
              </div>
            </div>
          </div>

          <div className="md:col-span-2">
            <div className="tnv-eyebrow-fog mb-4">Platform</div>
            <ul className="space-y-3 text-sm">
              <FooterLink href="/platform/safeguard">Safeguard</FooterLink>
              <FooterLink href="/platform/field">FIELD</FooterLink>
              <FooterLink href="/platform/learning">Learning</FooterLink>
              <FooterLink href="/platform/copilot">Co-Pilot</FooterLink>
            </ul>
          </div>

          <div className="md:col-span-2">
            <div className="tnv-eyebrow-fog mb-4">Company</div>
            <ul className="space-y-3 text-sm">
              <FooterLink href="/industries">Industries</FooterLink>
              <FooterLink href="/federal">Federal</FooterLink>
              <FooterLink href="/about">About</FooterLink>
              <FooterLink href="/podcast">Podcast</FooterLink>
              <FooterLink href="/insights">Insights</FooterLink>
              <FooterLink href="/contact">Contact</FooterLink>
            </ul>
          </div>

          <div className="md:col-span-4">
            <div className="tnv-eyebrow-fog mb-4">Federal</div>
            <dl className="space-y-3 text-sm">
              <Row label="NAICS Primary" value="611430" />
              <Row label="NAICS Secondary" value={NAICS.slice(1).join(" · ")} />
              <Row label="UEI" value={<span className="text-fog/70">[on file]</span>} />
              <Row label="CAGE" value={<span className="text-fog/70">[on file]</span>} />
              <Row
                label="SAM.gov"
                value={
                  <span className="text-signal">Registered</span>
                }
              />
            </dl>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-bone/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="font-mono text-[10px] uppercase tracking-eyebrow text-fog">
            © {new Date().getFullYear()} Trainovate Technologies LLC · Las Vegas, NV ·
            SDVOSB | DVOSB · Veteran-owned
          </div>
          <div className="font-mono text-[10px] uppercase tracking-eyebrow text-fog">
            <a href="mailto:info@trainovate.tech" className="hover:text-signal">
              info@trainovate.tech
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link
        href={href}
        className="text-bone/70 hover:text-signal transition-colors font-sans"
      >
        {children}
      </Link>
    </li>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-bone/5 pb-2">
      <dt className="font-mono text-[10px] uppercase tracking-eyebrow text-fog">{label}</dt>
      <dd className="font-mono text-xs text-bone/80">{value}</dd>
    </div>
  );
}
