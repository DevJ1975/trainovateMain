import { ReportStatus, Severity } from "@/shared/near-miss/types";

export { relativeTime } from "@/shared/near-miss/format";

/**
 * Tailwind badge class helpers — web-only. Mobile clients should compute
 * their own colors against the theme palette.
 */

export function statusBadgeClass(status: ReportStatus): string {
  switch (status) {
    case "new":
      return "border-flare/40 bg-flare/10 text-flare";
    case "triaged":
      return "border-cobalt/40 bg-cobalt/10 text-cobalt";
    case "investigating":
      return "border-cobalt/40 bg-cobalt/10 text-cobalt";
    case "actioned":
      return "border-bone/30 bg-bone/5 text-bone/85";
    case "closed":
      return "border-bone/15 bg-bone/5 text-bone/55";
  }
}

export function severityBadgeClass(severity: Severity): string {
  switch (severity) {
    case "low":
      return "border-bone/20 bg-bone/5 text-bone/70";
    case "medium":
      return "border-bone/30 bg-bone/5 text-bone/85";
    case "high":
      return "border-flare/40 bg-flare/10 text-flare";
    case "critical":
      return "border-flare/60 bg-flare/15 text-flare";
  }
}
