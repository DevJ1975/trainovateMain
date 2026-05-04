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

function refreshFor(id: string) {
  revalidatePath("/safety/near-misses");
  revalidatePath(`/safety/near-misses/${id}`);
}

export async function changeStatus(id: string, formData: FormData) {
  const status = formData.get("status") as string;
  if (!STATUSES.has(status)) throw new Error("Invalid status");
  setStatus(id, status as ReportStatus, DEFAULT_ACTOR);
  refreshFor(id);
}

export async function addFactor(id: string, formData: FormData) {
  const type = formData.get("type") as string;
  const note = ((formData.get("note") as string) ?? "").trim();
  if (!FACTOR_TYPES.has(type as ContributingFactorType)) {
    throw new Error("Invalid factor type");
  }
  if (note.length < 3) throw new Error("Note too short");
  addContributingFactor(id, type as ContributingFactorType, note, DEFAULT_ACTOR);
  refreshFor(id);
}

export async function addAction(id: string, formData: FormData) {
  const description = ((formData.get("description") as string) ?? "").trim();
  const ownerName = ((formData.get("ownerName") as string) ?? "").trim();
  const dueAtRaw = (formData.get("dueAt") as string) || null;
  if (description.length < 3) throw new Error("Description required");
  if (ownerName.length < 1) throw new Error("Owner required");
  const dueAt = dueAtRaw ? new Date(dueAtRaw).toISOString() : null;
  addCorrectiveAction(id, { description, ownerName, dueAt }, DEFAULT_ACTOR);
  refreshFor(id);
}

export async function completeAction(id: string, formData: FormData) {
  const actionId = formData.get("actionId") as string;
  if (!actionId) throw new Error("actionId required");
  completeCorrectiveAction(id, actionId, DEFAULT_ACTOR);
  refreshFor(id);
}
