import Link from "next/link";
import { ChevronRight } from "lucide-react";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://trainovate.ai";

export type Crumb = { name: string; href: string };

/**
 * Visible breadcrumbs + BreadcrumbList JSON-LD in one component.
 * The visible row uses font-mono small caps; the JSON-LD emits the
 * full BreadcrumbList structured data for Google rich results.
 */
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: c.href.startsWith("http") ? c.href : `${siteUrl}${c.href}`,
    })),
  };

  return (
    <>
      <nav
        aria-label="Breadcrumb"
        className="font-mono text-[10px] uppercase tracking-eyebrow text-fog flex flex-wrap items-center gap-2"
      >
        {items.map((c, i) => {
          const isLast = i === items.length - 1;
          return (
            <span key={c.href} className="inline-flex items-center gap-2">
              {isLast ? (
                <span className="text-bone/85">{c.name}</span>
              ) : (
                <Link href={c.href} className="hover:text-cobalt-soft transition-colors">
                  {c.name}
                </Link>
              )}
              {!isLast && <ChevronRight size={12} className="text-fog/60" />}
            </span>
          );
        })}
      </nav>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
      />
    </>
  );
}
