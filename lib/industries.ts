export type Industry = {
  slug: string;
  index: string;
  name: string;
  shortName: string;
  tagline: string;
  /** Brief snippet for the /industries overview list */
  body: string;
  /** Three short capability tiles for the overview card */
  capabilities: string[];
  /** Compliance / regulatory frameworks the program is aligned to */
  frameworks: string[];
  /** Headline stat for the overview card */
  signal: { stat: string; label: string };
  /** Brand panel slot key */
  stockKey: string;

  /** ----- Deep-dive content (used by /industries/[slug]) ----- */

  /** SEO meta title for the deep-dive page */
  seoTitle: string;
  /** SEO meta description for the deep-dive page */
  seoDescription: string;
  /** Hero copy on the deep-dive page (longer than `body`) */
  intro: string;
  /** The pain points Trainovate addresses for this vertical */
  challenges: { t: string; b: string }[];
  /** How Trainovate solutions map to the vertical */
  programs: { t: string; b: string }[];
  /** Outcomes language for ROI/benefits */
  outcomes: string[];
  /** Vertical-specific keywords for SEO */
  keywords: string[];
};

export const industries: Industry[] = [
  {
    slug: "manufacturing",
    index: "01",
    name: "Manufacturing",
    shortName: "Manufacturing",
    tagline: "One backbone for every plant.",
    body:
      "Multi-site manufacturing programs need a shared backbone. Trainovate standardizes lockout/tagout, machine guarding, and PPE training across plants, instrumented through Soteria so every site reads off the same dashboard. Audit prep stops being a quarter-long exercise.",
    capabilities: ["LOTO program of record", "Machine-guarding training", "Multi-tenant rollout"],
    frameworks: ["29 CFR 1910.147", "ANSI Z244.1", "ISO 45001", "Cal/OSHA 3314"],
    signal: { stat: "700+", label: "Placards deployed across multi-site CPG" },
    stockKey: "field.manufacturing",
    seoTitle: "Manufacturing Safety Training | AI-Powered LOTO & Machine Guarding",
    seoDescription:
      "Modern manufacturing safety training built on AI, immersive VR/3D simulations, microlearning, and the Soteria FIELD SaaS LMS. Standardize LOTO, machine guarding, and PPE across plants — instrumented end-to-end.",
    intro:
      "Multi-plant manufacturing operations live or die on consistency. The lockout/tagout program in one plant has to look like every other plant — and the audit trail has to prove it. Trainovate builds AI-powered manufacturing safety training systems that standardize the program, ship it on the device the worker carries, and instrument every step into a single evidence layer.",
    challenges: [
      {
        t: "Procedure drift across plants",
        b: "LOTO procedures written by ten different EHS managers in ten different binders. Trainovate replaces them with a single program of record, versioned and synchronized across every site.",
      },
      {
        t: "Audit prep eats a quarter",
        b: "Most manufacturers run a fire drill before every Cal/OSHA, ISO 45001, or customer audit. With Soteria, the evidence layer is always live — audit prep becomes a query, not a project.",
      },
      {
        t: "Refresher training that nobody remembers",
        b: "Annual classroom refreshers are forgotten by week two. Microlearning timed to the actual task — and immersive 3D for high-consequence procedures — is what makes the training stick.",
      },
    ],
    programs: [
      {
        t: "Soteria Safeguard for LOTO",
        b: "Energy-control program of record — equipment registry, procedure authoring, field execution, periodic reviews, and an xAPI evidence stream.",
      },
      {
        t: "Machine guarding microlearning",
        b: "3–7 minute units delivered before the task. Rolled out site-by-site with central program governance.",
      },
      {
        t: "Immersive VR for high-risk procedures",
        b: "Confined-space entry, energized work, and high-consequence machine operation rehearsed in VR before the worker steps onto the line.",
      },
    ],
    outcomes: [
      "Standardized LOTO across every plant",
      "Audit-ready evidence in real time",
      "Reduced incident rates on guarded equipment",
      "Faster onboarding for new operators",
    ],
    keywords: [
      "manufacturing safety training",
      "lockout tagout training software",
      "machine guarding training",
      "OSHA 1910.147 training",
      "AI-powered safety training for manufacturing",
      "multi-plant LMS for safety",
    ],
  },
  {
    slug: "warehousing-logistics",
    index: "02",
    name: "Warehousing & Logistics",
    shortName: "Warehousing & Logistics",
    tagline: "Training that lands at the start of shift.",
    body:
      "High-turnover associates and powered-industrial-truck risk demand training that lands in minutes, not hours. We deliver micro-learning at the start of shift, instrument every daily inspection, and close CAPA loops before the next audit window opens.",
    capabilities: ["Start-of-shift micro-learning", "Daily inspection capture", "CAPA loop"],
    frameworks: ["29 CFR 1910.178", "ANSI/ITSDF B56.1", "ISO 45001"],
    signal: { stat: "Offline-first", label: "Inspections sync when back in range" },
    stockKey: "field.warehouse",
    seoTitle: "Warehouse Safety Training | Forklift, Logistics & DC Workforce Training",
    seoDescription:
      "Mobile-first warehouse safety training and forklift certification programs for high-turnover distribution-center workforces. Daily PIT inspections, microlearning, and the Soteria FIELD SaaS LMS — built for warehousing and logistics.",
    intro:
      "Distribution centers don't have time for hour-long classroom sessions. New hires arrive every week, shifts rotate, and powered-industrial-truck risk is constant. Trainovate ships warehouse safety training that lands in the first ten minutes of a shift — micro-learning on the device, daily PIT inspections instrumented through Soteria, and CAPA loops that close before the next audit window opens.",
    challenges: [
      {
        t: "High turnover, constant onboarding",
        b: "Associates churn fast. Adaptive learning paths get a new hire to operational competency in days, not weeks.",
      },
      {
        t: "Daily inspections that are paper theater",
        b: "Pre-shift PIT inspections often live on a clipboard nobody reads. Soteria FIELD digitizes them — photo capture, GPS, timestamp, instant CAPA assignment.",
      },
      {
        t: "Multi-DC consistency",
        b: "Programs that work in one DC don't always travel. Multi-tenant SaaS keeps every facility aligned to one program of record.",
      },
    ],
    programs: [
      {
        t: "Forklift / PIT certification + recertification",
        b: "Fully digital powered-industrial-truck training aligned to OSHA 29 CFR 1910.178 and ANSI/ITSDF B56.1 — with practical evaluation tracking.",
      },
      {
        t: "Start-of-shift microlearning",
        b: "Bite-sized safety briefings delivered before the shift begins. Rotates topics by site risk profile.",
      },
      {
        t: "Soteria FIELD inspections + CAPA",
        b: "Daily and weekly inspection templates; finding-to-CAPA-to-closure flow with full audit trail.",
      },
    ],
    outcomes: [
      "Faster operator certification",
      "Lower PIT-related incident rate",
      "Real-time visibility across the DC network",
      "Audit-ready inspection evidence at every site",
    ],
    keywords: [
      "warehouse safety training",
      "forklift safety training",
      "logistics training software",
      "powered industrial truck certification",
      "distribution center safety LMS",
      "OSHA 1910.178 training",
    ],
  },
  {
    slug: "construction",
    index: "03",
    name: "Construction",
    shortName: "Construction",
    tagline: "Training that meets the site where it is today.",
    body:
      "Site conditions change every day. Our mobile-first training meets crews where they work — on the device in their pocket, in the language they speak — with task-specific safety briefings, OSHA 10/30 content, and evidence captured in real time. The auditor sees the same record the foreman does.",
    capabilities: ["OSHA 10/30 delivery", "Toolbox-talk instrumentation", "Bilingual content"],
    frameworks: ["29 CFR 1926", "OSHA Outreach 10/30", "ANSI A10"],
    signal: { stat: "Mobile-first", label: "Phone, tablet, kiosk — same evidence layer" },
    stockKey: "field.construction",
    seoTitle: "Construction Safety Training | Mobile OSHA 10/30 & Toolbox Talks",
    seoDescription:
      "Mobile-first construction safety training including OSHA 10/30, toolbox talks, and task-specific briefings. Bilingual content, evidence capture in real time, and the Soteria FIELD SaaS LMS — built for general contractors and trade crews.",
    intro:
      "Construction sites change shape every shift. Crews rotate, conditions evolve, and the workforce often speaks more than one language. Trainovate ships construction safety training systems that meet the crew where they actually work — on the device in their pocket, in the language they speak — and capture evidence in real time so the foreman, the safety pro, and the OSHA auditor are reading the same record.",
    challenges: [
      {
        t: "Task-specific briefings, not generic decks",
        b: "Trench, fall protection, hot work, and confined space all require different briefings. Trainovate ships task-specific microlearning that fires when the work order does.",
      },
      {
        t: "Bilingual workforce reality",
        b: "OSHA 10/30 content delivered in English and Spanish (additional languages on request). The training does not exist if the worker can't understand it.",
      },
      {
        t: "Toolbox talks that disappear",
        b: "Most toolbox talks have no evidence layer. Soteria captures attendance, signoff, and topic — generating the audit trail automatically.",
      },
    ],
    programs: [
      {
        t: "OSHA 10/30 outreach delivery",
        b: "Authorized OSHA Outreach training (in renewal) — 10-hr and 30-hr Construction with full xAPI evidence.",
      },
      {
        t: "Toolbox talk instrumentation",
        b: "Schedule, deliver, sign off, and report on toolbox talks across every active jobsite.",
      },
      {
        t: "Soteria FIELD jobsite inspections",
        b: "Mobile inspections, photo capture, finding-to-CAPA-to-close — works offline on the jobsite, syncs when the crew is back in range.",
      },
    ],
    outcomes: [
      "Compliant OSHA 10/30 delivery on every job",
      "Documented toolbox talks across every site",
      "Faster CAPA closure on inspection findings",
      "Bilingual training that crews actually engage with",
    ],
    keywords: [
      "construction safety training",
      "OSHA 10/30 training online",
      "toolbox talk software",
      "mobile construction training",
      "29 CFR 1926 training",
      "bilingual safety training construction",
    ],
  },
  {
    slug: "aviation-maintenance",
    index: "04",
    name: "Aviation Maintenance",
    shortName: "Aviation MRO",
    tagline: "Tooling control, sign-offs, and proof.",
    body:
      "FAR Part 145 environments don't tolerate broken sign-off chains. We instrument tooling control, procedural sign-offs, and recurring training so every step is timestamped and every sign-off is attributable. Tribal memory becomes audit-ready data.",
    capabilities: ["Procedural sign-off", "Tooling control", "Recurring-training cycle"],
    frameworks: ["FAA Part 145", "AS9110", "ISO 9001"],
    signal: { stat: "100%", label: "Step attribution by default" },
    stockKey: "field.aviation",
    seoTitle: "Aviation Maintenance Training | FAR Part 145 Procedural & Tooling Control",
    seoDescription:
      "Aviation maintenance training and tooling control software for FAR Part 145 repair stations. Procedural sign-offs, recurring training cycles, and the Soteria FIELD SaaS LMS — built for MRO operations.",
    intro:
      "Aviation maintenance operations cannot tolerate broken sign-off chains. Every tool issued, every step performed, every signature applied — has to be attributable, timestamped, and produce-on-demand for the FAA, AS9110 auditor, or customer airline. Trainovate ships aviation maintenance training and program-of-record systems that turn tribal memory into audit-ready data.",
    challenges: [
      {
        t: "Tooling control that survives audit",
        b: "Lost tools, FOD risk, and broken accountability are perennial MRO problems. Soteria instruments tool issue / return / verification end-to-end.",
      },
      {
        t: "Procedural sign-offs without paper",
        b: "Every step in a Part 145 procedure has to be signed by an authorized technician. Soteria captures the sign-off, the timestamp, and the certification attribution automatically.",
      },
      {
        t: "Recurring training compliance",
        b: "Authorization currency, recurrent training cycles, and IA renewals tracked centrally with auto-notification before expiry.",
      },
    ],
    programs: [
      {
        t: "Soteria FIELD for procedural execution",
        b: "Step-by-step procedure execution with photo evidence and authorized-tech sign-off at each step.",
      },
      {
        t: "Tooling control SaaS",
        b: "Issue, return, calibration cycle, and FOD-prevention workflows.",
      },
      {
        t: "Recurring training calendar",
        b: "Authorization-currency dashboard — green/yellow/red status by tech, by certification, by station.",
      },
    ],
    outcomes: [
      "100% procedural step attribution",
      "Zero lost-tool incidents",
      "Always-current authorization status",
      "Customer- and FAA-ready audit packets",
    ],
    keywords: [
      "aviation maintenance training",
      "FAR Part 145 training",
      "AS9110 training",
      "MRO training software",
      "aviation tooling control software",
      "aircraft maintenance LMS",
    ],
  },
  {
    slug: "energy-utilities",
    index: "05",
    name: "Energy & Utilities",
    shortName: "Energy & Utilities",
    tagline: "High-consequence work. Non-negotiable standard.",
    body:
      "Simultaneous operations, contractor sprawl, and the worst kind of incident the moment the pressure is on. Trainovate builds training and AI-assisted incident workflows for SIMOPS, line work, and process safety — designed for high-consequence environments where the standard is non-negotiable.",
    capabilities: ["SIMOPS training", "AI incident drafting", "Contractor onboarding"],
    frameworks: ["API RP 75", "29 CFR 1910.119 PSM", "NERC CIP", "ISO 45001"],
    signal: { stat: "AI co-pilot", label: "OSHA 300-form-ready drafts" },
    stockKey: "field.energy",
    seoTitle: "Energy & Utilities Safety Training | SIMOPS, PSM, NERC CIP",
    seoDescription:
      "AI-powered safety training for energy and utilities — SIMOPS, process safety management (29 CFR 1910.119), NERC CIP, and contractor onboarding. Soteria FIELD SaaS for line work, oilfield ops, and grid operations.",
    intro:
      "Energy and utility operations sit at the top of the consequence pyramid. Simultaneous operations, contractor sprawl, layered regulators, and the constant possibility of a process-safety event. Trainovate builds AI-powered training and incident workflows for SIMOPS, line work, oilfield operations, and grid operators — designed for environments where the standard is genuinely non-negotiable.",
    challenges: [
      {
        t: "SIMOPS coordination",
        b: "Multiple work crews on the same wellpad, plant, or substation create overlapping risk profiles. SIMOPS-aware training and pre-job briefings keep crews aligned.",
      },
      {
        t: "Contractor onboarding at scale",
        b: "Most operators rely on rotating contractor labor. Soteria onboards every contractor through the same program-of-record before they touch the asset.",
      },
      {
        t: "Process safety incidents that take days to write up",
        b: "AI co-pilot drafts the OSHA 300-form-ready narrative in minutes; the safety pro reviews, edits, and signs.",
      },
    ],
    programs: [
      {
        t: "PSM training (29 CFR 1910.119)",
        b: "Process Safety Management training for refining, chemical, and high-hazard energy operations.",
      },
      {
        t: "SIMOPS training + JSA / PTW",
        b: "Soteria FIELD digitizes Job Safety Analysis and Permit to Work workflows across simultaneous operations.",
      },
      {
        t: "AI Co-Pilot for incident drafting",
        b: "Voice intake, OSHA classification, narrative drafting, and pattern surfacing across the portfolio.",
      },
    ],
    outcomes: [
      "Faster permit issuance and SIMOPS alignment",
      "Verifiable contractor competency before site access",
      "AI-assisted incident reporting in minutes",
      "Cross-asset pattern detection on near-misses",
    ],
    keywords: [
      "energy safety training",
      "utilities safety training",
      "SIMOPS training",
      "process safety management training",
      "29 CFR 1910.119 PSM training",
      "NERC CIP training",
      "contractor onboarding software",
    ],
  },
  {
    slug: "government-public-sector",
    index: "06",
    name: "Government & Public Sector",
    shortName: "Government & Public Sector",
    tagline: "Built for the standard the IG actually checks.",
    body:
      "Federal and public-sector workforces require Section 508 accessibility, FedRAMP-pursuit posture, and credentialing that survives an Inspector General visit. As an SDVOSB, Trainovate ships the platform and the program in one package — built for DoD, VA, and civilian agency requirements.",
    capabilities: ["SDVOSB-led delivery", "Section 508 native", "Federal teaming"],
    frameworks: ["Section 508", "FedRAMP-pursuit", "NIST 800-171", "FAR / DFARS"],
    signal: { stat: "SDVOSB", label: "Verified · DVOSB" },
    stockKey: "field.government",
    seoTitle: "Government Workforce Training | SDVOSB Federal LMS & Safety Training",
    seoDescription:
      "SDVOSB-led federal and government workforce training. Section 508 native, FedRAMP-pursuit posture, NIST 800-171 aligned, and the Soteria FIELD SaaS LMS — built for DoD, VA, and civilian agency requirements.",
    intro:
      "Federal and government workforces operate against a different standard. Section 508 accessibility, FedRAMP-pursuit posture, NIST 800-171 alignment, and credentialing that survives an Inspector General visit. As a Service-Disabled Veteran-Owned Small Business, Trainovate ships the platform and the program in a single package — built from the start for DoD, VA, and civilian agency requirements.",
    challenges: [
      {
        t: "Section 508 from the first pixel",
        b: "Most LMS vendors retrofit accessibility. Trainovate is Section 508 / WCAG 2.1 AA native — every component, every interaction, by default.",
      },
      {
        t: "Set-aside contracting eligibility",
        b: "SDVOSB / DVOSB designation makes Trainovate eligible for veteran-set-aside vehicles. NAICS 611430 primary plus full secondary stack.",
      },
      {
        t: "Credentialing for the IG visit",
        b: "Audit trails generated by Soteria are produced-on-demand for IG inspections, FAR/DFARS reviews, and customer agency oversight.",
      },
    ],
    programs: [
      {
        t: "Soteria FIELD SaaS — federal posture",
        b: "Multi-tenant SaaS with role-based access, SSO, and audit-trail evidence layer designed for federal workforce governance.",
      },
      {
        t: "Mission-readiness training",
        b: "AI-powered, immersive, and microlearning content built for civilian and uniformed federal workforces.",
      },
      {
        t: "SDVOSB teaming + capability statements",
        b: "Available for prime / sub teaming across the federal pipeline.",
      },
    ],
    outcomes: [
      "Section 508 + WCAG 2.1 AA compliance",
      "SDVOSB set-aside contracting access",
      "Always-current credentialing for the workforce",
      "IG- and FAR/DFARS-ready audit posture",
    ],
    keywords: [
      "government workforce training",
      "federal LMS",
      "SDVOSB training company",
      "Section 508 training software",
      "DoD workforce training",
      "VA training programs",
      "NIST 800-171 training",
    ],
  },
  {
    slug: "healthcare-emergency-response",
    index: "07",
    name: "Healthcare & Emergency Response",
    shortName: "Healthcare & EMS",
    tagline: "Clinically rigorous. Operationally fast.",
    body:
      "From hospital systems to first-responder agencies, training has to be both clinically rigorous and operationally fast. We build microlearning for protocol updates, immersive 3D scenarios for high-acuity skills, and instrumented competency tracking across rotating workforces.",
    capabilities: ["Protocol microlearning", "Immersive 3D scenarios", "Competency tracking"],
    frameworks: ["TJC standards", "OSHA 1910.1030", "NIMS / ICS", "HIPAA"],
    signal: { stat: "Rotating crews", label: "Competency tracked across shifts" },
    stockKey: "field.healthcare",
    seoTitle: "Healthcare & Emergency Response Training | Protocol Microlearning + 3D",
    seoDescription:
      "Healthcare and emergency response training that's clinically rigorous and operationally fast. Protocol microlearning, immersive 3D scenarios for high-acuity skills, and the Soteria FIELD SaaS LMS — for hospitals, EMS, fire, and emergency management.",
    intro:
      "Healthcare and emergency response training has two simultaneous demands — clinical rigor and operational speed. A protocol update can hit the floor before the formal training cycle does. A high-acuity skill has to be muscle memory, not theory. Trainovate builds microlearning for protocol changes, immersive 3D scenarios for high-acuity practice, and competency tracking that follows the workforce across rotating shifts.",
    challenges: [
      {
        t: "Protocol changes that need to land tomorrow",
        b: "Microlearning-pushed protocol updates that hit every clinician's device the same day they're published.",
      },
      {
        t: "Skills that decay between calls",
        b: "Immersive 3D and VR rehearsal of intubation, trauma response, and other low-frequency / high-acuity skills.",
      },
      {
        t: "Rotating shifts and per-diem staff",
        b: "Competency tracked at the individual level across rotations, agencies, and per-diem contracts.",
      },
    ],
    programs: [
      {
        t: "Protocol microlearning",
        b: "Pushed updates aligned to TJC, NIMS / ICS, and bloodborne-pathogen requirements.",
      },
      {
        t: "Immersive 3D / VR clinical scenarios",
        b: "High-acuity skills rehearsed in a safe environment.",
      },
      {
        t: "Competency tracking across rotations",
        b: "Soteria FIELD tracks skill currency at the individual level across shifts, agencies, and credentials.",
      },
    ],
    outcomes: [
      "Faster protocol adoption",
      "Skill currency on low-frequency / high-acuity tasks",
      "Single competency record across rotations",
      "TJC- and HIPAA-aligned audit posture",
    ],
    keywords: [
      "healthcare training software",
      "emergency response training",
      "EMS training LMS",
      "hospital protocol training",
      "immersive clinical training",
      "TJC compliance training",
      "OSHA bloodborne pathogens training",
    ],
  },
  {
    slug: "corporate-workforce-training",
    index: "08",
    name: "Corporate Workforce Training",
    shortName: "Corporate Workforce",
    tagline: "Modernize the LMS-as-storage-shelf.",
    body:
      "Compliance, onboarding, leadership development, and skill-building — modernized. We replace the LMS-as-storage-shelf with a platform that adapts to each learner, ships content built around real workflows, and gives L&D teams the analytics they have been promised for a decade.",
    capabilities: ["Adaptive learning paths", "Onboarding programs", "L&D analytics"],
    frameworks: ["xAPI 1.0.3", "SCORM 1.2 / 2004", "WCAG 2.1 AA", "ISO 30414"],
    signal: { stat: "Adaptive", label: "Curricula reshape around the learner" },
    stockKey: "field.corporate",
    seoTitle: "Corporate Workforce Training | AI-Driven LMS, Onboarding & L&D Analytics",
    seoDescription:
      "Modern corporate workforce training built on AI-driven adaptive learning, microlearning, and the Soteria FIELD SaaS LMS. Onboarding, compliance, leadership development, and L&D analytics — for enterprise teams.",
    intro:
      "Corporate L&D teams have been promised analytics for a decade and are still stuck with attendance reports. Trainovate replaces the LMS-as-storage-shelf with an AI-driven platform that adapts to each learner, ships content built around the actual workflow, and gives L&D the operational signal they need to prove training is working.",
    challenges: [
      {
        t: "Onboarding that takes 90 days",
        b: "Adaptive learning paths get new hires to operational competency in weeks, not quarters.",
      },
      {
        t: "Compliance training nobody finishes",
        b: "Microlearning beats the 60-minute compliance module on every retention metric.",
      },
      {
        t: "L&D analytics that are just attendance",
        b: "xAPI evidence enables real engagement, retention, and competency analytics — by team, role, and individual.",
      },
    ],
    programs: [
      {
        t: "Adaptive onboarding programs",
        b: "Role-shaped onboarding paths that adjust to each new hire's prior knowledge and pace.",
      },
      {
        t: "Compliance microlearning",
        b: "Anti-harassment, ethics, security awareness, and required compliance training — modernized.",
      },
      {
        t: "L&D analytics on the LRS",
        b: "Dashboards that roll up by team, role, and individual — built on xAPI evidence rather than attendance.",
      },
    ],
    outcomes: [
      "Shorter time-to-productivity for new hires",
      "Higher compliance training completion + retention",
      "Real L&D analytics, not attendance reports",
      "Adaptive learning that compounds over time",
    ],
    keywords: [
      "corporate workforce training",
      "AI-powered LMS",
      "adaptive learning platform",
      "employee onboarding software",
      "L&D analytics platform",
      "enterprise LMS",
      "workforce performance analytics",
    ],
  },
];

export function getIndustry(slug: string): Industry | undefined {
  return industries.find((i) => i.slug === slug);
}
