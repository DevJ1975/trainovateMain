import type { Metadata } from "next";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ContactForm } from "@/components/contact/ContactForm";

export const metadata: Metadata = {
  title: "Contact — Tell us about your workforce",
  description:
    "Reach Trainovate.ai about the Soteria platform, training programs, federal teaming, and partnerships.",
};

export default function ContactPage() {
  return (
    <div className="pt-32 md:pt-40 pb-24">
      <section className="tnv-container tnv-section">
        <Eyebrow label="CONTACT" />
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-5">
            <h1 className="tnv-h1 max-w-md text-balance" style={{ fontSize: "clamp(44px, 7vw, 96px)" }}>
              Tell us about your <span className="tnv-italic text-signal">workforce.</span>
            </h1>
            <p className="tnv-body mt-8 max-w-md text-pretty">
              We answer every inquiry. If you're evaluating the platform, we'll
              ship a 30-minute working session, not a deck.
            </p>

            <dl className="mt-12 space-y-6">
              <Row label="Email" value={
                <a href="mailto:info@trainovate.tech" className="text-bone hover:text-signal">
                  info@trainovate.tech
                </a>
              } />
              <Row label="Location" value="Las Vegas, NV" />
              <Row label="Designation" value="SDVOSB · DVOSB" />
              <Row label="Hours" value="Mon–Fri · 0700–1800 PT" />
            </dl>
          </div>

          <div className="lg:col-span-7">
            <div className="tnv-glass rounded-2xl p-8 md:p-10">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-6 border-b border-bone/8 pb-4">
      <dt className="font-mono text-[11px] uppercase tracking-eyebrow text-fog">{label}</dt>
      <dd className="font-mono text-sm text-bone/90 text-right">{value}</dd>
    </div>
  );
}
