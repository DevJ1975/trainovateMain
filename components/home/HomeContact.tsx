import Link from "next/link";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ContactForm } from "@/components/contact/ContactForm";

export function HomeContact() {
  return (
    <section className="relative tnv-section py-32">
      <div className="tnv-container">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-5">
            <Eyebrow index="06" label="CONTACT" />
            <h2 className="tnv-h2 mt-6 text-balance">
              Tell us about your{" "}
              <span className="tnv-italic text-signal">workforce.</span>
            </h2>
            <p className="tnv-body mt-8 max-w-md text-pretty">
              We answer every inquiry within one business day. If you're
              evaluating the platform, we ship a 30-minute working session, not
              a deck.
            </p>

            <dl className="mt-12 space-y-5">
              <Row label="Email" value={
                <a href="mailto:info@trainovate.tech" className="text-bone hover:text-signal transition-colors">
                  info@trainovate.tech
                </a>
              } />
              <Row label="Location" value="Las Vegas, NV" />
              <Row label="Designation" value="SDVOSB · DVOSB" />
            </dl>

            <Link href="/contact" className="tnv-btn-ghost mt-10">
              Full contact page
            </Link>
          </div>

          <div className="lg:col-span-7">
            <div className="tnv-glass rounded-2xl p-8 md:p-10">
              <ContactForm />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-6 border-b border-bone/8 pb-3">
      <dt className="font-mono text-[11px] uppercase tracking-eyebrow text-fog">{label}</dt>
      <dd className="font-mono text-sm text-bone/90">{value}</dd>
    </div>
  );
}
