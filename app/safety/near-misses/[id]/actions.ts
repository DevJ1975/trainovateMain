"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth/session";
import {
  addReportComment,
  addReportCorrectiveAction,
  addReportFactor,
  changeReportStatus,
  completeReportCorrectiveAction,
  type Actor,
  type UseCaseResult,
} from "@/lib/near-miss/use-cases";

function getString(fd: FormData, key: string): string {
  const v = fd.get(key);
  return typeof v === "string" ? v.trim() : "";
}

function actor(): Actor {
  const u = getCurrentUser();
  if (!u) throw new Error("Not authenticated");
  return { name: u.name };
}

function refreshFor(id: string) {
  revalidatePath("/safety/near-misses");
  revalidatePath(`/safety/near-misses/${id}`);
}

/**
 * Translate a use-case failure into an Error the safety route's
 * error.tsx boundary can render. Actions don't have a JSON envelope
 * to return field errors into — for that, use the HTTP routes.
 */
function unwrap<T>(r: UseCaseResult<T>): T {
  if (r.ok) return r.value;
  throw new Error(r.error);
}

export async function changeStatus(id: string, formData: FormData) {
  unwrap(
    changeReportStatus({
      reportId: id,
      status: getString(formData, "status"),
      actor: actor(),
    }),
  );
  refreshFor(id);
}

export async function addFactor(id: string, formData: FormData) {
  unwrap(
    addReportFactor({
      reportId: id,
      type: getString(formData, "type"),
      note: getString(formData, "note"),
      actor: actor(),
    }),
  );
  refreshFor(id);
}

export async function addAction(id: string, formData: FormData) {
  unwrap(
    addReportCorrectiveAction({
      reportId: id,
      description: getString(formData, "description"),
      ownerName: getString(formData, "ownerName"),
      dueAt: getString(formData, "dueAt") || null,
      actor: actor(),
    }),
  );
  refreshFor(id);
}

export async function completeAction(id: string, formData: FormData) {
  unwrap(
    completeReportCorrectiveAction({
      reportId: id,
      actionId: getString(formData, "actionId"),
      actor: actor(),
    }),
  );
  refreshFor(id);
}

export async function addCommentAction(id: string, formData: FormData) {
  unwrap(
    addReportComment({
      reportId: id,
      text: getString(formData, "text"),
      actor: actor(),
    }),
  );
  refreshFor(id);
}
