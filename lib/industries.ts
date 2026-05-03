export type Industry = {
  slug: string;
  index: string;
  name: string;
  tagline: string;
  pain: string;
  fit: string;
  frameworks: string[];
  signal: { stat: string; label: string };
  stockKey: string;
};

export const industries: Industry[] = [
  {
    slug: "manufacturing",
    index: "01",
    name: "Manufacturing",
    tagline: "Energy control on the line, evidence in the LRS.",
    pain:
      "Multi-site LOTO programs that live in binders. Procedure drift. Audit prep that eats a quarter.",
    fit:
      "Soteria Safeguard standardizes energy-control across plants and ships an xAPI evidence stream the auditor can verify in minutes.",
    frameworks: ["29 CFR 1910.147", "ANSI Z244.1", "ISO 45001", "Cal/OSHA 3314"],
    signal: { stat: "700+", label: "Placards deployed (multi-site CPG)" },
    stockKey: "field.manufacturing",
  },
  {
    slug: "warehousing",
    index: "02",
    name: "Warehousing & Distribution",
    tagline: "Forklift turnover meets training that actually retains.",
    pain:
      "High-turnover associates, powered industrial truck incidents, daily inspection theater nobody trusts.",
    fit:
      "FIELD instruments daily inspections; Learning ships micro-modules timed to the task. CAPA loops close in days, not quarters.",
    frameworks: ["29 CFR 1910.178", "ANSI/ITSDF B56.1", "ISO 45001"],
    signal: { stat: "Offline-first", label: "Inspections sync when back in range" },
    stockKey: "field.warehouse",
  },
  {
    slug: "aviation",
    index: "03",
    name: "Aviation MRO",
    tagline: "Tooling control, sign-offs, and proof.",
    pain:
      "FOD-prone shops, paper-based tool control, and audit trails that depend on the person who happened to be there.",
    fit:
      "Soteria runs the procedural backbone. Every step timestamped, every sign-off attributable, every CAPA closed in the LRS.",
    frameworks: ["FAA Part 145", "AS9110", "ISO 9001", "Section 508"],
    signal: { stat: "100%", label: "Step attribution by default" },
    stockKey: "field.aviation",
  },
  {
    slug: "cannabis",
    index: "04",
    name: "Cannabis Cultivation & Processing",
    tagline: "Operator-grade EHS in a still-maturing regulatory environment.",
    pain:
      "Inconsistent state regs, GMP drift, OSHA exposure for cultivation labor, and a thin layer of qualified safety staff.",
    fit:
      "We bring an EHS program template tuned to cultivation + processing, instrumented through Soteria so leadership sees the same dashboard as the inspector.",
    frameworks: ["29 CFR 1910", "GMP / GACP", "State agricultural codes"],
    signal: { stat: "Multi-state", label: "Program template in production" },
    stockKey: "field.cannabis",
  },
  {
    slug: "energy",
    index: "05",
    name: "Energy · SIMOPS",
    tagline: "High-consequence training that survives contact with reality.",
    pain:
      "Simultaneous operations, contractor sprawl, and the worst kind of incident the moment the pressure is on.",
    fit:
      "Co-Pilot drafts incident narratives in seconds; FIELD logs JSAs and PTW; Learning ships content built around the job, not generic seat-time.",
    frameworks: ["API RP 75", "29 CFR 1910.119 PSM", "ISO 45001"],
    signal: { stat: "AI co-pilot", label: "OSHA 300-form-ready drafts" },
    stockKey: "field.energy",
  },
  {
    slug: "food",
    index: "06",
    name: "Food Processing",
    tagline: "Sanitation, allergens, machine guarding — instrumented.",
    pain:
      "USDA / FDA / SQF audit pressure stacked on top of OSHA, all running on spreadsheets and tribal memory.",
    fit:
      "FIELD digitizes pre-op, sanitation, and machine-guarding inspections. Soteria evidences the program for both regulators and customers.",
    frameworks: ["FSMA", "SQF / BRCGS", "29 CFR 1910.212", "USDA FSIS"],
    signal: { stat: "1 dashboard", label: "EHS + food-safety in a single view" },
    stockKey: "field.food",
  },
];
