export const HAZARD_CATEGORIES = [
  { id: "slip_trip", label: "Slip / trip / fall" },
  { id: "struck_by", label: "Struck by object" },
  { id: "caught_in", label: "Caught in / between" },
  { id: "electrical", label: "Electrical" },
  { id: "fire_explosion", label: "Fire / explosion" },
  { id: "chemical", label: "Chemical / hazmat" },
  { id: "ergonomic", label: "Ergonomic / lifting" },
  { id: "ppe", label: "Missing or improper PPE" },
  { id: "vehicle", label: "Vehicle / mobile equipment" },
  { id: "environment", label: "Environmental (heat, noise, air)" },
  { id: "process", label: "Process / procedure" },
  { id: "other", label: "Other" },
] as const;

export type HazardCategoryId = (typeof HAZARD_CATEGORIES)[number]["id"];

export const SEVERITY_LEVELS = [
  { id: "low", label: "Low — minor first aid potential" },
  { id: "medium", label: "Medium — recordable injury potential" },
  { id: "high", label: "High — lost-time injury potential" },
  { id: "critical", label: "Critical — fatality / serious harm potential" },
] as const;

export type Severity = (typeof SEVERITY_LEVELS)[number]["id"];

export const REPORT_STATUSES = [
  "new",
  "triaged",
  "investigating",
  "actioned",
  "closed",
] as const;

export type ReportStatus = (typeof REPORT_STATUSES)[number];

export const CONTRIBUTING_FACTOR_TYPES = [
  { id: "human", label: "Human factor" },
  { id: "equipment", label: "Equipment" },
  { id: "environment", label: "Environment" },
  { id: "process", label: "Process / procedure" },
] as const;

export type ContributingFactorType =
  (typeof CONTRIBUTING_FACTOR_TYPES)[number]["id"];

export function hazardLabel(id: HazardCategoryId): string {
  return HAZARD_CATEGORIES.find((c) => c.id === id)?.label ?? id;
}

export function severityLabel(id: Severity): string {
  return SEVERITY_LEVELS.find((s) => s.id === id)?.label ?? id;
}
