export type Industry = {
  slug: string;
  index: string;
  name: string;
  shortName: string;
  tagline: string;
  body: string;
  capabilities: string[];
  frameworks: string[];
  signal: { stat: string; label: string };
  stockKey: string;
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
  },
];
