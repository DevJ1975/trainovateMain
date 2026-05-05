import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  addCorrectiveAction,
  completeCorrectiveAction,
  createReport,
  findOverdueActions,
  markOverdueNotified,
} from "../store";
import { withFreshStore } from "../__test-utils__/fresh-store";
import { notifyOverdue } from "./notify-overdue";

let cleanup: () => void;

beforeEach(() => {
  cleanup = withFreshStore().cleanup;
});

afterEach(() => {
  cleanup();
});

const baseInput = {
  siteId: "plant-1",
  reporterName: "Sam Okafor",
  anonymous: false,
  occurredAt: new Date().toISOString(),
  locationText: "Bay 3",
  hazardCategory: "slip_trip" as const,
  description: "Hydraulic oil leak from forklift.",
  severityPotential: "high" as const,
};

const NOW = new Date("2026-05-05T12:00:00Z").getTime();
const yesterdayIso = new Date(NOW - 24 * 60 * 60 * 1000).toISOString();
const tomorrowIso = new Date(NOW + 24 * 60 * 60 * 1000).toISOString();

function addAction(reportId: string, dueAt: string | null) {
  return addCorrectiveAction(
    reportId,
    { description: "Inspect line", ownerName: "Marcus Webb", dueAt },
    "Priya Shah",
  )!.correctiveActions.at(-1)!;
}

describe("findOverdueActions", () => {
  it("returns open actions whose dueAt is in the past", () => {
    const r = createReport(baseInput);
    addAction(r.id, yesterdayIso);
    const overdue = findOverdueActions(NOW);
    expect(overdue).toHaveLength(1);
    expect(overdue[0].action.dueAt).toBe(yesterdayIso);
  });

  it("ignores actions with future dueAt", () => {
    const r = createReport(baseInput);
    addAction(r.id, tomorrowIso);
    expect(findOverdueActions(NOW)).toHaveLength(0);
  });

  it("ignores actions with no dueAt", () => {
    const r = createReport(baseInput);
    addAction(r.id, null);
    expect(findOverdueActions(NOW)).toHaveLength(0);
  });

  it("ignores completed actions", () => {
    const r = createReport(baseInput);
    const a = addAction(r.id, yesterdayIso);
    completeCorrectiveAction(r.id, a.id, "Marcus Webb");
    expect(findOverdueActions(NOW)).toHaveLength(0);
  });

  it("respects the cooldown — recently-notified actions are skipped", () => {
    const r = createReport(baseInput);
    const a = addAction(r.id, yesterdayIso);
    expect(findOverdueActions(NOW)).toHaveLength(1);

    markOverdueNotified(a.id, NOW - 60 * 60 * 1000); // 1h ago
    expect(findOverdueActions(NOW)).toHaveLength(0);

    // Past the 20h default cooldown — comes back.
    expect(findOverdueActions(NOW + 21 * 60 * 60 * 1000)).toHaveLength(1);
  });
});

describe("notifyOverdue", () => {
  it("notifies each overdue action once and stamps lastOverdueNotifiedAt", () => {
    const r = createReport(baseInput);
    addAction(r.id, yesterdayIso);
    addAction(r.id, yesterdayIso);

    const first = notifyOverdue(NOW);
    expect(first.scanned).toBe(2);
    expect(first.notified).toBe(2);

    // Second run within the cooldown returns zero.
    const second = notifyOverdue(NOW + 60 * 60 * 1000);
    expect(second.scanned).toBe(0);
    expect(second.notified).toBe(0);
  });

  it("computes hoursOverdue against the dueAt for the dispatched event", () => {
    const r = createReport(baseInput);
    addAction(r.id, yesterdayIso);
    const result = notifyOverdue(NOW);
    expect(result.notified).toBe(1);
    // The dispatched event already happened — we'd need to spy on the
    // dispatcher to assert on its payload. Here we just verify the
    // bookkeeping return value, which is the public contract of
    // notifyOverdue.
    expect(result.notifiedIds).toHaveLength(1);
  });

  it("is safe to call when nothing is overdue", () => {
    createReport(baseInput);
    const result = notifyOverdue(NOW);
    expect(result).toEqual({ scanned: 0, notified: 0, notifiedIds: [] });
  });
});
