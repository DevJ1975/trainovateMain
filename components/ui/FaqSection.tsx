import { Eyebrow } from "@/components/ui/Eyebrow";

export type FaqItem = { q: string; a: string };

type Props = {
  index?: string;
  eyebrow?: string;
  heading: React.ReactNode;
  items: FaqItem[];
};

/**
 * FaqSection — accessible <details>/<summary> accordion for SEO-friendly
 * FAQ content. Pair with <FaqJsonLd items={...} /> on the same page to
 * emit FAQPage structured data.
 */
export function FaqSection({ index, eyebrow = "FAQ", heading, items }: Props) {
  return (
    <section className="relative tnv-section py-32">
      <div className="tnv-container">
        <Eyebrow index={index} label={eyebrow} />
        <h2 className="tnv-h2 mt-6 max-w-3xl text-balance">{heading}</h2>

        <div className="mt-12 border-y border-bone/8">
          {items.map((it) => (
            <details
              key={it.q}
              className="group border-b border-bone/8 last:border-b-0 py-6 px-2"
            >
              <summary className="flex items-baseline justify-between gap-6 cursor-pointer list-none">
                <span className="font-display font-semibold text-xl md:text-2xl text-bone tracking-tight">
                  {it.q}
                </span>
                <span
                  className="font-mono text-cobalt-soft text-2xl leading-none transition-transform group-open:rotate-45 flex-shrink-0"
                  aria-hidden="true"
                >
                  +
                </span>
              </summary>
              <div className="tnv-body mt-4 max-w-3xl text-pretty">{it.a}</div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FaqJsonLd({ items }: { items: FaqItem[] }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((it) => ({
      "@type": "Question",
      name: it.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: it.a,
      },
    })),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
