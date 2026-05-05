import { sqliteTable, text, integer, index } from "drizzle-orm/sqlite-core";

export const nearMissReports = sqliteTable(
  "near_miss_reports",
  {
    id: text("id").primaryKey(),
    reference: text("reference").notNull().unique(),
    orgId: text("org_id").notNull(),
    siteId: text("site_id").notNull(),
    reporterName: text("reporter_name"),
    receiptCode: text("receipt_code"),
    anonymous: integer("anonymous", { mode: "boolean" }).notNull(),
    occurredAt: text("occurred_at").notNull(),
    reportedAt: text("reported_at").notNull(),
    locationText: text("location_text").notNull(),
    hazardCategory: text("hazard_category").notNull(),
    description: text("description").notNull(),
    severityPotential: text("severity_potential").notNull(),
    status: text("status").notNull(),
    createdAt: text("created_at").notNull(),
    updatedAt: text("updated_at").notNull(),
  },
  (t) => ({
    byOrgStatus: index("idx_nmr_org_status").on(t.orgId, t.status),
    byReceiptCode: index("idx_nmr_receipt_code").on(t.receiptCode),
    byCreatedAt: index("idx_nmr_created_at").on(t.createdAt),
  }),
);

export const contributingFactors = sqliteTable(
  "contributing_factors",
  {
    id: text("id").primaryKey(),
    reportId: text("report_id")
      .notNull()
      .references(() => nearMissReports.id, { onDelete: "cascade" }),
    type: text("type").notNull(),
    note: text("note").notNull(),
  },
  (t) => ({ byReport: index("idx_cf_report").on(t.reportId) }),
);

export const correctiveActions = sqliteTable(
  "corrective_actions",
  {
    id: text("id").primaryKey(),
    reportId: text("report_id")
      .notNull()
      .references(() => nearMissReports.id, { onDelete: "cascade" }),
    description: text("description").notNull(),
    ownerName: text("owner_name").notNull(),
    dueAt: text("due_at"),
    status: text("status").notNull(),
    completedAt: text("completed_at"),
    createdAt: text("created_at").notNull(),
    /**
     * Idempotency for the overdue-nudge cron — set every time we fire
     * an `action_overdue` notification for this row. The cron skips
     * actions notified within OVERDUE_REMINDER_COOLDOWN_HOURS.
     */
    lastOverdueNotifiedAt: text("last_overdue_notified_at"),
  },
  (t) => ({
    byReport: index("idx_ca_report").on(t.reportId),
    byDue: index("idx_ca_due").on(t.status, t.dueAt),
  }),
);

export const reportEvents = sqliteTable(
  "report_events",
  {
    id: text("id").primaryKey(),
    reportId: text("report_id")
      .notNull()
      .references(() => nearMissReports.id, { onDelete: "cascade" }),
    kind: text("kind").notNull(),
    actorName: text("actor_name").notNull(),
    at: text("at").notNull(),
    payload: text("payload"),
  },
  (t) => ({
    byReportAt: index("idx_re_report_at").on(t.reportId, t.at),
  }),
);

export const attachments = sqliteTable(
  "attachments",
  {
    id: text("id").primaryKey(),
    reportId: text("report_id")
      .notNull()
      .references(() => nearMissReports.id, { onDelete: "cascade" }),
    kind: text("kind").notNull(),
    storageKey: text("storage_key").notNull(),
    contentType: text("content_type").notNull(),
    sizeBytes: integer("size_bytes").notNull(),
    createdAt: text("created_at").notNull(),
  },
  (t) => ({ byReport: index("idx_att_report").on(t.reportId) }),
);

export const meta = sqliteTable("near_miss_meta", {
  key: text("key").primaryKey(),
  value: integer("value").notNull(),
});

/**
 * Per-key dedupe cache for retried POSTs (Stripe-style Idempotency-Key).
 * Same key + same body within TTL → cached response is replayed. Same
 * key + different body → 409 (clients must change keys when content
 * changes). Janitor pass on each write drops rows older than TTL.
 */
export const idempotencyKeys = sqliteTable(
  "idempotency_keys",
  {
    key: text("key").primaryKey(),
    scope: text("scope").notNull(),
    requestHash: text("request_hash").notNull(),
    responseStatus: integer("response_status").notNull(),
    responseBody: text("response_body").notNull(),
    createdAt: text("created_at").notNull(),
  },
  (t) => ({ byCreatedAt: index("idx_idemp_created_at").on(t.createdAt) }),
);
