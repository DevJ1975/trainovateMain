import { ReportStatus, Severity } from "./types";

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

export function relativeTime(iso: string): string {
  const t = new Date(iso).getTime();
  if (!Number.isFinite(t)) return "—";

  const ms = Date.now() - t;
  if (ms < 0) {
    // Future — clock skew or scheduled item.
    const future = -ms;
    if (future < 60_000) return "in <1m";
    const min = Math.round(future / 60_000);
    if (min < 60) return `in ${min}m`;
    const hr = Math.round(min / 60);
    if (hr < 24) return `in ${hr}h`;
    return new Date(iso).toLocaleDateString();
  }

  const sec = Math.round(ms / 1000);
  if (sec < 5) return "just now";
  if (sec < 60) return `${sec}s ago`;
  const min = Math.round(sec / 60);
  if (min < 60) return `${min}m ago`;
  const hr = Math.round(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const d = Math.round(hr / 24);
  if (d < 30) return `${d}d ago`;
  return new Date(iso).toLocaleDateString();
}
