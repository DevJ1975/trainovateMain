/**
 * Platform-agnostic types for the near-miss reporting domain.
 *
 * This file is consumed by both the Next.js app and any React Native /
 * Expo client. Keep it free of:
 *   - Node-only imports (node:*, fs, crypto)
 *   - DOM types
 *   - Tailwind / CSS class strings
 *
 * If you need a server-only or web-only helper, put it in lib/near-miss
 * (server) or app/ (web) instead.
 */

import {
  ContributingFactorType,
  HazardCategoryId,
  ReportStatus,
  Severity,
} from "./constants";

export interface ContributingFactor {
  id: string;
  type: ContributingFactorType;
  note: string;
}

export type AttachmentKind = "photo";

export interface Attachment {
  id: string;
  reportId: string;
  kind: AttachmentKind;
  storageKey: string;
  contentType: string;
  sizeBytes: number;
  createdAt: string;
}

export interface CorrectiveAction {
  id: string;
  description: string;
  ownerName: string;
  dueAt: string | null;
  status: "open" | "in_progress" | "done";
  completedAt: string | null;
  createdAt: string;
}

export type ReportEventKind =
  | "created"
  | "triaged"
  | "status_changed"
  | "factor_added"
  | "action_added"
  | "action_completed"
  | "commented";

export interface ReportEvent {
  id: string;
  kind: ReportEventKind;
  actorName: string;
  at: string;
  payload?: Record<string, unknown>;
}

export interface NearMissReport {
  id: string;
  reference: string;
  orgId: string;
  siteId: string;
  reporterName: string | null;
  receiptCode: string | null;
  anonymous: boolean;
  occurredAt: string;
  reportedAt: string;
  locationText: string;
  hazardCategory: HazardCategoryId;
  description: string;
  severityPotential: Severity;
  status: ReportStatus;
  contributingFactors: ContributingFactor[];
  correctiveActions: CorrectiveAction[];
  events: ReportEvent[];
  createdAt: string;
  updatedAt: string;
}

export type NearMissReportSummary = Pick<
  NearMissReport,
  | "id"
  | "reference"
  | "status"
  | "hazardCategory"
  | "locationText"
  | "anonymous"
  | "reporterName"
  | "reportedAt"
  | "severityPotential"
>;

export type {
  ContributingFactorType,
  HazardCategoryId,
  ReportStatus,
  Severity,
} from "./constants";
