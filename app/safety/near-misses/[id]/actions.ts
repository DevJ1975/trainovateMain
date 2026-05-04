"use server";

import { revalidatePath } from "next/cache";
import {
  addContributingFactor,
  addCorrectiveAction,
  completeCorrectiveAction,
  setStatus,
} from "@/lib/near-miss/store";
import {
  CONTRIBUTING_FACTOR_TYPES,
  ContributingFactorType,
  REPORT_STATUSES,
  ReportStatus,
} from "@/lib/near-miss/types";

const FACTOR_TYPES = new Set(CONTRIBUTING_FACTOR_TYPES.map((t) => t.id));
const STATUSES = new Set<string>(REPORT_STATUSES);
const DEFAULT_ACTOR = "Safety lead";

const MAX_NOTE = 1_000;
const MAX_ACTION_DESCRIPTION = 1_000;
const MAX_OWNER_NAME = 120;

function getString(fd: FormData, key: string): string {
  const v = fd.get(key);
  return typeof v === "string" ? v.trim() : "";
}

function refreshFor(id: string) {
  revalidatePath("/safety/near-misses");
  revalidatePath(`/safety/near-misses/${id}`);
}

export async function changeStatus(id: string, formData: FormData) {
  const status = getString(formData, "status");
  if (!STATUSES.has(status)) throw new Error("Invalid status");
  setStatus(id, status as ReportStatus, DEFAULT_ACTOR);
  refreshFor(id);
}

export async function addFactor(id: string, formData: FormData) {
  const type = getString(formData, "type");
  const note = getString(formData, "note");
  if (!FACTOR_TYPES.has(type as ContributingFactorType)) {
    throw new Error("Invalid factor type");
  }
  if (note.length < 3 || note.length > MAX_NOTE) {
    throw new Error(`Note must be 3-${MAX_NOTE} characters`);
  }
  addContributingFactor(id, type as ContributingFactorType, note, DEFAULT_ACTOR);
  refreshFor(id);
}

export async function addAction(id: string, formData: FormData) {
  const description = getString(formData, "description");
  const ownerName = getString(formData, "ownerName").slice(0, MAX_OWNER_NAME);
  const dueAtRaw = getString(formData, "dueAt");

  if (description.length < 3 || description.length > MAX_ACTION_DESCRIPTION) {
    throw new Error(`Description must be 3-${MAX_ACTION_DESCRIPTION} characters`);
  }
  if (ownerName.length < 1) throw new Error("Owner required");

  let dueAt: string | null = null;
  if (dueAtRaw) {
    const t = new Date(dueAtRaw).getTime();
    if (!Number.isFinite(t)) throw new Error("Invalid due date");
    dueAt = new Date(t).toISOString();
  }

  addCorrectiveAction(id, { description, ownerName, dueAt }, DEFAULT_ACTOR);
  refreshFor(id);
}

export async function completeAction(id: string, formData: FormData) {
  const actionId = getString(formData, "actionId");
  if (!actionId) throw new Error("actionId required");
  completeCorrectiveAction(id, actionId, DEFAULT_ACTOR);
  refreshFor(id);
}
