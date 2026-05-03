import {
  MarkSafeguard,
  MarkField,
  MarkLearning,
  MarkCopilot,
} from "@/components/marks/ProductMarks";

export type ProductSlug = "safeguard" | "field" | "learning" | "copilot";

export type Product = {
  slug: ProductSlug;
  index: string;
  name: string;
  full: string;
  tagline: string;
  description: string;
  role: string;
  mark: typeof MarkSafeguard;
  features: { title: string; body: string }[];
  deploy: { step: string; body: string }[];
  compliance: string[];
  stockKey: string;
};

export const products: Product[] = [
  {
    slug: "safeguard",
    index: "02",
    name: "Safeguard",
    full: "Soteria Safeguard",
    tagline: "Lockout/tagout, instrumented.",
    description:
      "Multi-tenant SaaS. xAPI native. Built from a real LOTO program deployed across a 700-placard manufacturing site. No theater. Just the receipts.",
    role: "Energy-control program of record.",
    mark: MarkSafeguard,
    features: [
      {
        title: "Equipment registry",
        body: "Every isolation point, every energy source — schematized, photographed, versioned.",
      },
      {
        title: "Procedure authoring",
        body: "Generate compliant LOTO procedures in minutes, not weeks. Approval workflows built in.",
      },
      {
        title: "Field execution",
        body: "Workers tap through procedures on iPad. Steps timestamp. Photos attach. Evidence ships.",
      },
      {
        title: "Periodic reviews",
        body: "Automated cadence engine. Cal/OSHA Section 3314 and ANSI Z244.1 cycles tracked.",
      },
      {
        title: "Multi-site rollout",
        body: "Tenant per facility, role-based access, central program governance.",
      },
      {
        title: "xAPI evidence stream",
        body: "Every action emits a statement to your LRS. Real audit trail. Real analytics.",
      },
    ],
    deploy: [
      { step: "Stand up tenant", body: "Provisioned in hours, not months. SSO ready." },
      { step: "Configure your sites", body: "Equipment imported, procedures templated." },
      { step: "Field rollout", body: "Workers trained, devices deployed, program live." },
    ],
    compliance: ["Cal/OSHA 3314", "29 CFR 1910.147", "ANSI Z244.1", "ISO 45001"],
    stockKey: "platform.safeguard",
  },
  {
    slug: "field",
    index: "03",
    name: "FIELD",
    full: "Soteria FIELD",
    tagline: "The compliance app for the people doing the work.",
    description:
      "A web app for inspections, audits, and corrective actions. Built for the person on the floor at 6am, not the consultant in the deck.",
    role: "Daily compliance instrument.",
    mark: MarkField,
    features: [
      { title: "Inspection templates", body: "OSHA-aligned, drag-to-build, version-tracked." },
      { title: "Photo-first capture", body: "Findings tied to media, GPS, and timestamp." },
      { title: "CAPA loop", body: "Findings → assignments → verifications → close-out." },
      { title: "Offline-first", body: "Inspect now, sync when you're back in range." },
      { title: "Roll-up dashboards", body: "Site, region, BU. Trend lines that mean something." },
      { title: "Section 508", body: "Accessible by default, because it has to be." },
    ],
    deploy: [
      { step: "Pilot a site", body: "30-day pilot, single facility, white-glove onboarding." },
      { step: "Refine", body: "Tune templates and CAPA SLAs to your operation." },
      { step: "Scale", body: "Roll across the portfolio with our customer success team." },
    ],
    compliance: ["29 CFR 1910", "ISO 45001", "ISO 14001", "Section 508"],
    stockKey: "platform.field",
  },
  {
    slug: "learning",
    index: "04",
    name: "Learning",
    full: "Soteria Field Learning System",
    tagline: "Training that meets the worker mid-task.",
    description:
      "iPadOS-first micro-learning. Built for crews who don't sit at a desk. Adaptive sequencing, xAPI evidence, and content built like a film, not a slideshow.",
    role: "Knowledge-of-task delivery.",
    mark: MarkLearning,
    features: [
      { title: "Micro-modules", body: "3–7 minute units, sequenced around real tasks." },
      { title: "Adaptive paths", body: "Curriculum reshapes around assessed competency." },
      { title: "Cinema-grade content", body: "Produced by Trainovate's in-house studio." },
      { title: "xAPI native", body: "Every interaction is a statement. Bring your own LRS." },
      { title: "SCORM bridge", body: "Plays nice with legacy LMS environments." },
      { title: "Multilingual", body: "Built for the workforce you actually have." },
    ],
    deploy: [
      { step: "Audit your library", body: "We map what you have, what you need, what's stale." },
      { step: "Co-author the path", body: "Our IDs partner with your SMEs." },
      { step: "Ship and iterate", body: "Quarterly content refresh built into the contract." },
    ],
    compliance: ["xAPI 1.0.3", "SCORM 1.2 / 2004", "Section 508", "WCAG 2.1 AA"],
    stockKey: "platform.learning",
  },
  {
    slug: "copilot",
    index: "05",
    name: "Co-Pilot",
    full: "Soteria AI Co-Pilot",
    tagline: "Incident reporting that finishes the report.",
    description:
      "An AI assistant that intakes incidents, classifies, drafts the OSHA-form narrative, and flags causal patterns across your portfolio. Designed for the safety pro who is one person doing four jobs.",
    role: "Analyst-in-the-loop intelligence.",
    mark: MarkCopilot,
    features: [
      { title: "Voice intake", body: "Tell it what happened. It writes the draft." },
      { title: "Auto-classify", body: "OSHA recordability, severity, body part, mechanism." },
      { title: "Narrative drafting", body: "300-form-ready in seconds, not hours." },
      { title: "Pattern surfacing", body: "Cross-site clustering. Near-miss heat maps." },
      { title: "Investigation prompts", body: "5-Whys / TapRooT scaffolds, not vibes." },
      { title: "Human-in-the-loop", body: "Nothing ships without your sign-off. Period." },
    ],
    deploy: [
      { step: "Connect your data", body: "We integrate to your existing incident system." },
      { step: "Tune the model", body: "We calibrate on your historical incidents and taxonomy." },
      { step: "Go live", body: "Phased rollout with a measurable false-positive budget." },
    ],
    compliance: ["NIST 800-171 (target)", "SOC 2 (target)", "29 CFR 1904", "Human-in-loop"],
    stockKey: "platform.copilot",
  },
];

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}
