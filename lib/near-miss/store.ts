import { randomUUID } from "node:crypto";
import {
  ContributingFactor,
  ContributingFactorType,
  CorrectiveAction,
  HazardCategoryId,
  NearMissReport,
  ReportEvent,
  ReportEventKind,
  ReportStatus,
  Severity,
} from "./types";

/**
 * Phase 0 in-memory store. Process-local; cleared on restart. Real persistence
 * (Postgres + S3 for attachments) lands in Phase 1.
 */

type Store = {
  reports: Map<string, NearMissReport>;
  counter: number;
};

const globalForStore = globalThis as unknown as { __nearMissStore?: Store };

const store: Store =
  globalForStore.__nearMissStore ??
  (globalForStore.__nearMissStore = { reports: new Map(), counter: 0 });

function nowIso() {
  return new Date().toISOString();
}

function nextReference() {
  store.counter += 1;
  const yy = new Date().getFullYear().toString().slice(-2);
  return `NM-${yy}-${store.counter.toString().padStart(4, "0")}`;
}

function appendEvent(
  report: NearMissReport,
  kind: ReportEventKind,
  actorName: string,
  payload?: Record<string, unknown>,
) {
  const event: ReportEvent = {
    id: randomUUID(),
    kind,
    actorName,
    at: nowIso(),
    payload,
  };
  report.events.push(event);
  report.updatedAt = event.at;
}

export interface CreateReportInput {
  orgId?: string;
  siteId: string;
  reporterName: string | null;
  anonymous: boolean;
  occurredAt: string;
  locationText: string;
  hazardCategory: HazardCategoryId;
  description: string;
  severityPotential: Severity;
}

export function createReport(input: CreateReportInput): NearMissReport {
  const id = randomUUID();
  const now = nowIso();
  const reporterName = input.anonymous ? null : input.reporterName;
  const report: NearMissReport = {
    id,
    reference: nextReference(),
    orgId: input.orgId ?? "demo-org",
    siteId: input.siteId,
    reporterName,
    receiptCode: input.anonymous ? randomUUID().slice(0, 8).toUpperCase() : null,
    anonymous: input.anonymous,
    occurredAt: input.occurredAt,
    reportedAt: now,
    locationText: input.locationText,
    hazardCategory: input.hazardCategory,
    description: input.description,
    severityPotential: input.severityPotential,
    status: "new",
    contributingFactors: [],
    correctiveActions: [],
    events: [],
    createdAt: now,
    updatedAt: now,
  };
  appendEvent(report, "created", reporterName ?? "Anonymous reporter", {
    severityPotential: input.severityPotential,
  });
  store.reports.set(id, report);
  return report;
}

export function listReports(): NearMissReport[] {
  return [...store.reports.values()].sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt),
  );
}

export function getReport(id: string): NearMissReport | undefined {
  return store.reports.get(id);
}

export function getReportByReference(
  reference: string,
): NearMissReport | undefined {
  for (const r of store.reports.values()) {
    if (r.reference === reference) return r;
  }
  return undefined;
}

export function setStatus(
  id: string,
  status: ReportStatus,
  actorName: string,
): NearMissReport | undefined {
  const report = store.reports.get(id);
  if (!report) return undefined;
  if (report.status === status) return report;
  const previous = report.status;
  report.status = status;
  appendEvent(report, "status_changed", actorName, { from: previous, to: status });
  return report;
}

export function addContributingFactor(
  id: string,
  type: ContributingFactorType,
  note: string,
  actorName: string,
): NearMissReport | undefined {
  const report = store.reports.get(id);
  if (!report) return undefined;
  const factor: ContributingFactor = { id: randomUUID(), type, note };
  report.contributingFactors.push(factor);
  appendEvent(report, "factor_added", actorName, { type, note });
  return report;
}

export interface AddCorrectiveActionInput {
  description: string;
  ownerName: string;
  dueAt: string | null;
}

export function addCorrectiveAction(
  id: string,
  input: AddCorrectiveActionInput,
  actorName: string,
): NearMissReport | undefined {
  const report = store.reports.get(id);
  if (!report) return undefined;
  const action: CorrectiveAction = {
    id: randomUUID(),
    description: input.description,
    ownerName: input.ownerName,
    dueAt: input.dueAt,
    status: "open",
    completedAt: null,
    createdAt: nowIso(),
  };
  report.correctiveActions.push(action);
  appendEvent(report, "action_added", actorName, {
    actionId: action.id,
    description: action.description,
  });
  if (report.status === "new" || report.status === "triaged") {
    report.status = "actioned";
    appendEvent(report, "status_changed", actorName, {
      from: "triaged",
      to: "actioned",
    });
  }
  return report;
}

export function completeCorrectiveAction(
  reportId: string,
  actionId: string,
  actorName: string,
): NearMissReport | undefined {
  const report = store.reports.get(reportId);
  if (!report) return undefined;
  const action = report.correctiveActions.find((a) => a.id === actionId);
  if (!action || action.status === "done") return report;
  action.status = "done";
  action.completedAt = nowIso();
  appendEvent(report, "action_completed", actorName, { actionId });
  return report;
}

export function seedDemoData() {
  if (store.reports.size > 0) return;
  const r1 = createReport({
    siteId: "plant-1",
    reporterName: "Sam Okafor",
    anonymous: false,
    occurredAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
    locationText: "Loading bay 3, near pallet stack",
    hazardCategory: "slip_trip",
    description:
      "Hydraulic oil leak from forklift left a slick patch by the bay door. Walked through it before it was flagged — caught the wall, no fall.",
    severityPotential: "high",
  });
  setStatus(r1.id, "triaged", "Priya Shah");
  addContributingFactor(
    r1.id,
    "equipment",
    "Forklift #4 hydraulic line was due for inspection 2 weeks ago.",
    "Priya Shah",
  );

  createReport({
    siteId: "plant-1",
    reporterName: null,
    anonymous: true,
    occurredAt: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
    locationText: "Line 2 control panel",
    hazardCategory: "electrical",
    description:
      "Exposed wiring on the panel side cover — cover screws missing. Saw it during shift handover.",
    severityPotential: "critical",
  });
}
