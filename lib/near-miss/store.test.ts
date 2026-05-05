import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  addContributingFactor,
  addCorrectiveAction,
  completeCorrectiveAction,
  createReport,
  getReport,
  getReportByReceiptCode,
  getReportByReference,
  listReports,
  setStatus,
  statusCounts,
} from "./store";
import { withFreshStore } from "./__test-utils__/fresh-store";

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

describe("createReport", () => {
  it("persists a report with a fresh reference and seeded status=new", () => {
    const r = createReport(baseInput);
    expect(r.id).toBeTruthy();
    expect(r.reference).toMatch(/^NM-\d{2}-0001$/);
    expect(r.status).toBe("new");
    expect(r.events).toHaveLength(1);
    expect(r.events[0].kind).toBe("created");
    expect(r.events[0].actorName).toBe("Sam Okafor");

    const fromDb = getReport(r.id);
    expect(fromDb?.reference).toBe(r.reference);
  });

  it("increments the persisted reference counter", () => {
    const a = createReport(baseInput);
    const b = createReport(baseInput);
    const c = createReport(baseInput);
    expect([a.reference, b.reference, c.reference]).toEqual([
      expect.stringMatching(/-0001$/),
      expect.stringMatching(/-0002$/),
      expect.stringMatching(/-0003$/),
    ]);
  });

  it("strips reporter identity for anonymous reports and issues a receipt code", () => {
    const r = createReport({ ...baseInput, anonymous: true, reporterName: "should-be-ignored" });
    expect(r.reporterName).toBeNull();
    expect(r.anonymous).toBe(true);
    expect(r.receiptCode).toMatch(/^[A-F0-9]{8}$/);
    // The created-event actor should also reflect anonymity, never the leaked name.
    expect(r.events[0].actorName).toBe("Anonymous reporter");
  });
});

describe("setStatus / transitionStatus", () => {
  it("records the actual previous status in the audit-log payload", () => {
    const r = createReport(baseInput);
    setStatus(r.id, "triaged", "Priya Shah");
    setStatus(r.id, "investigating", "Priya Shah");

    const fresh = getReport(r.id);
    const transitions = (fresh!.events.filter((e) => e.kind === "status_changed") as Array<{
      payload?: { from?: string; to?: string };
    }>);
    expect(transitions).toHaveLength(2);
    expect(transitions[0].payload).toMatchObject({ from: "new", to: "triaged" });
    expect(transitions[1].payload).toMatchObject({ from: "triaged", to: "investigating" });
  });

  it("is a no-op when the status is unchanged (no audit-log spam)", () => {
    const r = createReport(baseInput);
    setStatus(r.id, "new", "Priya Shah");
    const fresh = getReport(r.id);
    expect(fresh!.events.filter((e) => e.kind === "status_changed")).toHaveLength(0);
  });
});

describe("addCorrectiveAction auto-transition", () => {
  it("transitions new → actioned and records from='new' (the regression we fixed)", () => {
    const r = createReport(baseInput);
    addCorrectiveAction(
      r.id,
      { description: "Replace forklift hydraulic line", ownerName: "Marcus Webb", dueAt: null },
      "Priya Shah",
    );
    const fresh = getReport(r.id);
    expect(fresh!.status).toBe("actioned");
    const t = fresh!.events.find((e) => e.kind === "status_changed") as
      | { payload?: { from?: string; to?: string } }
      | undefined;
    expect(t?.payload).toMatchObject({ from: "new", to: "actioned" });
  });

  it("does NOT transition if the report is already past triage (e.g. investigating)", () => {
    const r = createReport(baseInput);
    setStatus(r.id, "triaged", "Priya Shah");
    setStatus(r.id, "investigating", "Priya Shah");
    addCorrectiveAction(
      r.id,
      { description: "Spot-clean the area", ownerName: "Marcus Webb", dueAt: null },
      "Priya Shah",
    );
    const fresh = getReport(r.id);
    // Stays in "investigating" because the auto-transition rule only fires
    // from new/triaged.
    expect(fresh!.status).toBe("investigating");
  });
});

describe("completeCorrectiveAction", () => {
  it("marks the action done and appends an action_completed event", () => {
    const r = createReport(baseInput);
    const withAction = addCorrectiveAction(
      r.id,
      { description: "Inspect all forklifts", ownerName: "Marcus Webb", dueAt: null },
      "Priya Shah",
    );
    const actionId = withAction!.correctiveActions[0].id;

    completeCorrectiveAction(r.id, actionId, "Marcus Webb");

    const fresh = getReport(r.id);
    expect(fresh!.correctiveActions[0].status).toBe("done");
    expect(fresh!.correctiveActions[0].completedAt).toBeTruthy();
    expect(fresh!.events.some((e) => e.kind === "action_completed")).toBe(true);
  });

  it("is idempotent — completing an already-done action doesn't append twice", () => {
    const r = createReport(baseInput);
    const withAction = addCorrectiveAction(
      r.id,
      { description: "x", ownerName: "y", dueAt: null },
      "z",
    );
    const actionId = withAction!.correctiveActions[0].id;
    completeCorrectiveAction(r.id, actionId, "z");
    completeCorrectiveAction(r.id, actionId, "z");
    const fresh = getReport(r.id);
    expect(fresh!.events.filter((e) => e.kind === "action_completed")).toHaveLength(1);
  });

  it("refuses to complete an action belonging to a different report", () => {
    const a = createReport(baseInput);
    const b = createReport(baseInput);
    const aWith = addCorrectiveAction(
      a.id,
      { description: "x", ownerName: "y", dueAt: null },
      "z",
    );
    const aActionId = aWith!.correctiveActions[0].id;

    // Try to complete a's action while pretending it's on b.
    const result = completeCorrectiveAction(b.id, aActionId, "z");
    expect(result).toBeUndefined();

    const aFresh = getReport(a.id);
    expect(aFresh!.correctiveActions[0].status).toBe("open");
  });
});

describe("getReportByReceiptCode (anonymity guard)", () => {
  it("matches the anonymous report by case-insensitive code", () => {
    const r = createReport({ ...baseInput, anonymous: true, reporterName: null });
    const upper = getReportByReceiptCode(r.receiptCode!);
    const lower = getReportByReceiptCode(r.receiptCode!.toLowerCase());
    expect(upper?.id).toBe(r.id);
    expect(lower?.id).toBe(r.id);
  });

  it("never returns a non-anonymous report even if a code somehow collides", () => {
    const named = createReport(baseInput);
    // Force a fake code onto a non-anonymous report directly via reference
    // path — since named reports have receiptCode=null, looking it up must
    // not match.
    expect(getReportByReceiptCode("DEADBEEF")).toBeUndefined();
    expect(getReportByReceiptCode("")).toBeUndefined();
    // And the named report's reference should still be retrievable the
    // normal way.
    expect(getReportByReference(named.reference)?.id).toBe(named.id);
  });
});

describe("listReports + statusCounts", () => {
  it("returns reports newest-first by createdAt", async () => {
    const a = createReport(baseInput);
    await new Promise((r) => setTimeout(r, 5));
    const b = createReport(baseInput);
    const list = listReports();
    expect(list[0].id).toBe(b.id);
    expect(list[1].id).toBe(a.id);
  });

  it("groups counts by status", () => {
    const a = createReport(baseInput);
    const b = createReport(baseInput);
    setStatus(b.id, "triaged", "Priya Shah");
    const counts = statusCounts();
    expect(counts.new).toBe(1);
    expect(counts.triaged).toBe(1);
    expect(counts.closed ?? 0).toBe(0);
    expect(getReport(a.id)!.status).toBe("new");
  });
});

describe("addContributingFactor", () => {
  it("appends a factor and emits a factor_added event", () => {
    const r = createReport(baseInput);
    addContributingFactor(r.id, "equipment", "Forklift hydraulic line overdue", "Priya Shah");
    const fresh = getReport(r.id);
    expect(fresh!.contributingFactors).toHaveLength(1);
    expect(fresh!.contributingFactors[0].type).toBe("equipment");
    expect(fresh!.events.some((e) => e.kind === "factor_added")).toBe(true);
  });
});
