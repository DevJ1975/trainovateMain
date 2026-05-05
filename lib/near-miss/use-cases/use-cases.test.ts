import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { createReport } from "@/lib/near-miss/store";
import { withFreshStore } from "@/lib/near-miss/__test-utils__/fresh-store";
import {
  addReportComment,
  addReportCorrectiveAction,
  addReportFactor,
  changeReportStatus,
  completeReportCorrectiveAction,
} from "./index";

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

const ACTOR = { name: "Priya Shah" };

describe("changeReportStatus", () => {
  it("returns the updated report and threads actor name to the audit log", () => {
    const r = createReport(baseInput);
    const result = changeReportStatus({
      reportId: r.id,
      status: "triaged",
      actor: ACTOR,
    });
    expect(result).toMatchObject({ ok: true });
    if (!result.ok) return;
    expect(result.value.status).toBe("triaged");
    const t = result.value.events.find((e) => e.kind === "status_changed") as
      | { actorName: string; payload?: { from?: string; to?: string } }
      | undefined;
    expect(t?.actorName).toBe("Priya Shah");
    expect(t?.payload).toMatchObject({ from: "new", to: "triaged" });
  });

  it("returns 400 for unknown status", () => {
    const r = createReport(baseInput);
    const result = changeReportStatus({
      reportId: r.id,
      status: "frobnicated",
      actor: ACTOR,
    });
    expect(result).toMatchObject({ ok: false, status: 400 });
  });

  it("returns 404 for unknown report id", () => {
    const result = changeReportStatus({
      reportId: "missing",
      status: "triaged",
      actor: ACTOR,
    });
    expect(result).toMatchObject({ ok: false, status: 404 });
  });
});

describe("addReportFactor", () => {
  it("validates the factor type", () => {
    const r = createReport(baseInput);
    const result = addReportFactor({
      reportId: r.id,
      type: "unicorn",
      note: "long enough note for the limit",
      actor: ACTOR,
    });
    expect(result).toMatchObject({ ok: false, status: 400 });
  });

  it("validates note length bounds", () => {
    const r = createReport(baseInput);
    const tooShort = addReportFactor({
      reportId: r.id,
      type: "equipment",
      note: "x",
      actor: ACTOR,
    });
    expect(tooShort).toMatchObject({ ok: false, status: 400 });
  });

  it("appends factor + factor_added event on happy path", () => {
    const r = createReport(baseInput);
    const result = addReportFactor({
      reportId: r.id,
      type: "equipment",
      note: "Forklift hydraulic line was due for inspection",
      actor: ACTOR,
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.value.contributingFactors).toHaveLength(1);
    expect(result.value.events.some((e) => e.kind === "factor_added")).toBe(true);
  });
});

describe("addReportCorrectiveAction", () => {
  it("validates description length and owner presence", () => {
    const r = createReport(baseInput);
    const shortDesc = addReportCorrectiveAction({
      reportId: r.id,
      description: "x",
      ownerName: "Marcus",
      actor: ACTOR,
    });
    expect(shortDesc).toMatchObject({ ok: false, status: 400 });

    const noOwner = addReportCorrectiveAction({
      reportId: r.id,
      description: "Replace forklift hydraulic line",
      ownerName: "",
      actor: ACTOR,
    });
    expect(noOwner).toMatchObject({ ok: false, status: 400 });
  });

  it("rejects malformed dueAt", () => {
    const r = createReport(baseInput);
    const result = addReportCorrectiveAction({
      reportId: r.id,
      description: "Replace forklift hydraulic line",
      ownerName: "Marcus Webb",
      dueAt: "not-a-date",
      actor: ACTOR,
    });
    expect(result).toMatchObject({ ok: false, status: 400 });
  });

  it("inherits the store's auto-transition rule from new → actioned", () => {
    const r = createReport(baseInput);
    const result = addReportCorrectiveAction({
      reportId: r.id,
      description: "Replace forklift hydraulic line",
      ownerName: "Marcus Webb",
      actor: ACTOR,
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.value.status).toBe("actioned");
  });
});

describe("completeReportCorrectiveAction", () => {
  it("returns 400 when actionId is empty", () => {
    const r = createReport(baseInput);
    const result = completeReportCorrectiveAction({
      reportId: r.id,
      actionId: "",
      actor: ACTOR,
    });
    expect(result).toMatchObject({ ok: false, status: 400 });
  });

  it("returns 404 when the action belongs to a different report", () => {
    const a = createReport(baseInput);
    const b = createReport(baseInput);
    const aWithAction = addReportCorrectiveAction({
      reportId: a.id,
      description: "x x x",
      ownerName: "y",
      actor: ACTOR,
    });
    if (!aWithAction.ok) throw new Error("setup failed");
    const aActionId = aWithAction.value.correctiveActions[0].id;

    const result = completeReportCorrectiveAction({
      reportId: b.id,
      actionId: aActionId,
      actor: ACTOR,
    });
    expect(result).toMatchObject({ ok: false, status: 404 });
  });

  it("marks done on the happy path", () => {
    const r = createReport(baseInput);
    const withAction = addReportCorrectiveAction({
      reportId: r.id,
      description: "Replace line",
      ownerName: "Marcus",
      actor: ACTOR,
    });
    if (!withAction.ok) throw new Error("setup failed");
    const actionId = withAction.value.correctiveActions[0].id;

    const result = completeReportCorrectiveAction({
      reportId: r.id,
      actionId,
      actor: ACTOR,
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.value.correctiveActions[0].status).toBe("done");
  });
});

describe("addReportComment", () => {
  it("validates comment length", () => {
    const r = createReport(baseInput);
    const tooShort = addReportComment({
      reportId: r.id,
      text: "",
      actor: ACTOR,
    });
    expect(tooShort).toMatchObject({ ok: false, status: 400 });
  });

  it("appends a commented event with the trimmed text", () => {
    const r = createReport(baseInput);
    const result = addReportComment({
      reportId: r.id,
      text: "  reviewed footage  ",
      actor: ACTOR,
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    const c = result.value.events.find((e) => e.kind === "commented") as
      | { actorName: string; payload?: { text: string } }
      | undefined;
    expect(c?.payload?.text).toBe("reviewed footage");
    expect(c?.actorName).toBe("Priya Shah");
  });

  it("returns 404 for unknown report", () => {
    const result = addReportComment({
      reportId: "missing",
      text: "hi",
      actor: ACTOR,
    });
    expect(result).toMatchObject({ ok: false, status: 404 });
  });
});
