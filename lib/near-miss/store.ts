import { randomUUID } from "node:crypto";
import { and, asc, desc, eq, sql } from "drizzle-orm";
import { ensureMigrated, getDb, getSqlite } from "./db/client";
import { dispatch } from "./notifications";
import {
  attachments,
  contributingFactors,
  correctiveActions,
  meta,
  nearMissReports,
  reportEvents,
} from "./db/schema";
import {
  Attachment,
  AttachmentKind,
  ContributingFactor,
  ContributingFactorType,
  CorrectiveAction,
  HazardCategoryId,
  NearMissReport,
  NearMissReportSummary,
  ReportEvent,
  ReportEventKind,
  ReportStatus,
  Severity,
} from "./types";

/**
 * Drizzle + SQLite repository. Same exports as the Phase 0 in-memory store —
 * call sites in app/ are unchanged. Swap the dialect and connection in
 * lib/near-miss/db/client.ts to move to Postgres in production.
 */

function nowIso() {
  return new Date().toISOString();
}

function nextReference(): string {
  const sqlite = getSqlite();
  const row = sqlite
    .prepare(
      "UPDATE near_miss_meta SET value = value + 1 WHERE key = 'ref_counter' RETURNING value",
    )
    .get() as { value: number } | undefined;
  if (!row) throw new Error("ref_counter row missing");
  const yy = new Date().getFullYear().toString().slice(-2);
  return `NM-${yy}-${row.value.toString().padStart(4, "0")}`;
}

function appendEvent(
  reportId: string,
  kind: ReportEventKind,
  actorName: string,
  payload?: Record<string, unknown>,
): ReportEvent {
  const event: ReportEvent = {
    id: randomUUID(),
    kind,
    actorName,
    at: nowIso(),
    payload,
  };
  getDb()
    .insert(reportEvents)
    .values({
      id: event.id,
      reportId,
      kind: event.kind,
      actorName: event.actorName,
      at: event.at,
      payload: payload ? JSON.stringify(payload) : null,
    })
    .run();
  getDb()
    .update(nearMissReports)
    .set({ updatedAt: event.at })
    .where(eq(nearMissReports.id, reportId))
    .run();
  return event;
}

function transitionStatus(
  reportId: string,
  currentStatus: ReportStatus,
  to: ReportStatus,
  actorName: string,
): ReportStatus {
  if (currentStatus === to) return currentStatus;
  getDb()
    .update(nearMissReports)
    .set({ status: to })
    .where(eq(nearMissReports.id, reportId))
    .run();
  appendEvent(reportId, "status_changed", actorName, {
    from: currentStatus,
    to,
  });
  const fresh = getReport(reportId);
  if (fresh) {
    dispatch({ kind: "status_changed", report: fresh, from: currentStatus, to });
  }
  return to;
}

type ReportRow = typeof nearMissReports.$inferSelect;
type FactorRow = typeof contributingFactors.$inferSelect;
type ActionRow = typeof correctiveActions.$inferSelect;
type EventRow = typeof reportEvents.$inferSelect;

function rowToFactor(row: FactorRow): ContributingFactor {
  return {
    id: row.id,
    type: row.type as ContributingFactorType,
    note: row.note,
  };
}

function rowToAction(row: ActionRow): CorrectiveAction {
  return {
    id: row.id,
    description: row.description,
    ownerName: row.ownerName,
    dueAt: row.dueAt,
    status: row.status as CorrectiveAction["status"],
    completedAt: row.completedAt,
    createdAt: row.createdAt,
  };
}

function rowToEvent(row: EventRow): ReportEvent {
  return {
    id: row.id,
    kind: row.kind as ReportEventKind,
    actorName: row.actorName,
    at: row.at,
    payload: row.payload ? (JSON.parse(row.payload) as Record<string, unknown>) : undefined,
  };
}

function assemble(row: ReportRow): NearMissReport {
  const db = getDb();
  const factors = db
    .select()
    .from(contributingFactors)
    .where(eq(contributingFactors.reportId, row.id))
    .all();
  const actions = db
    .select()
    .from(correctiveActions)
    .where(eq(correctiveActions.reportId, row.id))
    .orderBy(asc(correctiveActions.createdAt))
    .all();
  const events = db
    .select()
    .from(reportEvents)
    .where(eq(reportEvents.reportId, row.id))
    .orderBy(asc(reportEvents.at))
    .all();

  return {
    id: row.id,
    reference: row.reference,
    orgId: row.orgId,
    siteId: row.siteId,
    reporterName: row.reporterName,
    receiptCode: row.receiptCode,
    anonymous: row.anonymous,
    occurredAt: row.occurredAt,
    reportedAt: row.reportedAt,
    locationText: row.locationText,
    hazardCategory: row.hazardCategory as HazardCategoryId,
    description: row.description,
    severityPotential: row.severityPotential as Severity,
    status: row.status as ReportStatus,
    contributingFactors: factors.map(rowToFactor),
    correctiveActions: actions.map(rowToAction),
    events: events.map(rowToEvent),
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

function rowToSummary(row: ReportRow): NearMissReportSummary {
  return {
    id: row.id,
    reference: row.reference,
    status: row.status as ReportStatus,
    hazardCategory: row.hazardCategory as HazardCategoryId,
    locationText: row.locationText,
    anonymous: row.anonymous,
    reporterName: row.reporterName,
    reportedAt: row.reportedAt,
    severityPotential: row.severityPotential as Severity,
  };
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
  ensureMigrated();
  const sqlite = getSqlite();

  const id = randomUUID();
  const now = nowIso();
  const reporterName = input.anonymous ? null : input.reporterName;
  const receiptCode = input.anonymous
    ? randomUUID().slice(0, 8).toUpperCase()
    : null;

  const tx = sqlite.transaction(() => {
    const reference = nextReference();
    getDb()
      .insert(nearMissReports)
      .values({
        id,
        reference,
        orgId: input.orgId ?? "demo-org",
        siteId: input.siteId,
        reporterName,
        receiptCode,
        anonymous: input.anonymous,
        occurredAt: input.occurredAt,
        reportedAt: now,
        locationText: input.locationText,
        hazardCategory: input.hazardCategory,
        description: input.description,
        severityPotential: input.severityPotential,
        status: "new",
        createdAt: now,
        updatedAt: now,
      })
      .run();
    appendEvent(id, "created", reporterName ?? "Anonymous reporter", {
      severityPotential: input.severityPotential,
    });
    return reference;
  });
  tx();

  const report = mustGetReport(id);
  dispatch({ kind: "report_created", report });
  return report;
}

export function listReports(): NearMissReportSummary[] {
  ensureMigrated();
  const rows = getDb()
    .select()
    .from(nearMissReports)
    .orderBy(desc(nearMissReports.createdAt))
    .all();
  return rows.map(rowToSummary);
}

export function statusCounts(): Record<ReportStatus, number> {
  ensureMigrated();
  const rows = getDb()
    .select({
      status: nearMissReports.status,
      count: sql<number>`count(*)`,
    })
    .from(nearMissReports)
    .groupBy(nearMissReports.status)
    .all();
  const out: Record<string, number> = {};
  for (const r of rows) out[r.status] = Number(r.count);
  return out as Record<ReportStatus, number>;
}

export function getReport(id: string): NearMissReport | undefined {
  ensureMigrated();
  const row = getDb()
    .select()
    .from(nearMissReports)
    .where(eq(nearMissReports.id, id))
    .get();
  return row ? assemble(row) : undefined;
}

function mustGetReport(id: string): NearMissReport {
  const r = getReport(id);
  if (!r) throw new Error(`Report ${id} not found`);
  return r;
}

export function getReportByReference(
  reference: string,
): NearMissReport | undefined {
  ensureMigrated();
  const row = getDb()
    .select()
    .from(nearMissReports)
    .where(eq(nearMissReports.reference, reference))
    .get();
  return row ? assemble(row) : undefined;
}

export function getReportByReceiptCode(
  code: string,
): NearMissReport | undefined {
  ensureMigrated();
  const normalized = code.trim().toUpperCase();
  if (!normalized) return undefined;
  const row = getDb()
    .select()
    .from(nearMissReports)
    .where(
      and(
        eq(nearMissReports.receiptCode, normalized),
        eq(nearMissReports.anonymous, true),
      ),
    )
    .get();
  return row ? assemble(row) : undefined;
}

export function setStatus(
  id: string,
  status: ReportStatus,
  actorName: string,
): NearMissReport | undefined {
  ensureMigrated();
  const row = getDb()
    .select()
    .from(nearMissReports)
    .where(eq(nearMissReports.id, id))
    .get();
  if (!row) return undefined;
  transitionStatus(id, row.status as ReportStatus, status, actorName);
  return mustGetReport(id);
}

export function addContributingFactor(
  id: string,
  type: ContributingFactorType,
  note: string,
  actorName: string,
): NearMissReport | undefined {
  ensureMigrated();
  const sqlite = getSqlite();
  const row = getDb()
    .select()
    .from(nearMissReports)
    .where(eq(nearMissReports.id, id))
    .get();
  if (!row) return undefined;

  const factorId = randomUUID();
  const tx = sqlite.transaction(() => {
    getDb()
      .insert(contributingFactors)
      .values({ id: factorId, reportId: id, type, note })
      .run();
    appendEvent(id, "factor_added", actorName, { type, note });
  });
  tx();
  return mustGetReport(id);
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
  ensureMigrated();
  const sqlite = getSqlite();
  const row = getDb()
    .select()
    .from(nearMissReports)
    .where(eq(nearMissReports.id, id))
    .get();
  if (!row) return undefined;

  const actionId = randomUUID();
  const createdAt = nowIso();
  const currentStatus = row.status as ReportStatus;

  const tx = sqlite.transaction(() => {
    getDb()
      .insert(correctiveActions)
      .values({
        id: actionId,
        reportId: id,
        description: input.description,
        ownerName: input.ownerName,
        dueAt: input.dueAt,
        status: "open",
        completedAt: null,
        createdAt,
      })
      .run();
    appendEvent(id, "action_added", actorName, {
      actionId,
      description: input.description,
    });
    if (currentStatus === "new" || currentStatus === "triaged") {
      transitionStatus(id, currentStatus, "actioned", actorName);
    }
  });
  tx();
  const fresh = mustGetReport(id);
  dispatch({
    kind: "action_assigned",
    report: fresh,
    ownerName: input.ownerName,
    description: input.description,
  });
  return fresh;
}

export function completeCorrectiveAction(
  reportId: string,
  actionId: string,
  actorName: string,
): NearMissReport | undefined {
  ensureMigrated();
  const action = getDb()
    .select()
    .from(correctiveActions)
    .where(eq(correctiveActions.id, actionId))
    .get();
  if (!action || action.reportId !== reportId) return undefined;
  if (action.status === "done") return getReport(reportId);

  const sqlite = getSqlite();
  const tx = sqlite.transaction(() => {
    getDb()
      .update(correctiveActions)
      .set({ status: "done", completedAt: nowIso() })
      .where(eq(correctiveActions.id, actionId))
      .run();
    appendEvent(reportId, "action_completed", actorName, { actionId });
  });
  tx();
  return getReport(reportId);
}

export interface AddAttachmentInput {
  kind: AttachmentKind;
  storageKey: string;
  contentType: string;
  sizeBytes: number;
}

export function addAttachment(
  reportId: string,
  input: AddAttachmentInput,
): Attachment {
  ensureMigrated();
  const row = {
    id: randomUUID(),
    reportId,
    kind: input.kind,
    storageKey: input.storageKey,
    contentType: input.contentType,
    sizeBytes: input.sizeBytes,
    createdAt: nowIso(),
  };
  getDb().insert(attachments).values(row).run();
  return row;
}

export function listAttachments(reportId: string): Attachment[] {
  ensureMigrated();
  const rows = getDb()
    .select()
    .from(attachments)
    .where(eq(attachments.reportId, reportId))
    .orderBy(asc(attachments.createdAt))
    .all();
  return rows.map((r) => ({
    id: r.id,
    reportId: r.reportId,
    kind: r.kind as AttachmentKind,
    storageKey: r.storageKey,
    contentType: r.contentType,
    sizeBytes: r.sizeBytes,
    createdAt: r.createdAt,
  }));
}

export function getAttachment(id: string): Attachment | undefined {
  ensureMigrated();
  const row = getDb()
    .select()
    .from(attachments)
    .where(eq(attachments.id, id))
    .get();
  if (!row) return undefined;
  return {
    id: row.id,
    reportId: row.reportId,
    kind: row.kind as AttachmentKind,
    storageKey: row.storageKey,
    contentType: row.contentType,
    sizeBytes: row.sizeBytes,
    createdAt: row.createdAt,
  };
}

/**
 * Idempotent demo seed. No-op if any reports exist. Real production use never
 * calls this — it's a dev convenience for the empty-DB case.
 */
export function seedDemoData() {
  ensureMigrated();
  const existing = getDb()
    .select({ count: sql<number>`count(*)` })
    .from(nearMissReports)
    .get();
  if (existing && Number(existing.count) > 0) return;

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

// Re-export the meta table for tests/scripts that may need it.
export { meta as _metaTable };
