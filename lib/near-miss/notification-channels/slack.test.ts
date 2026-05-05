import { describe, expect, it, vi } from "vitest";
import { formatPayload, slackChannel } from "./slack";
import type { NearMissReport } from "../types";

const baseReport: NearMissReport = {
  id: "r1",
  reference: "NM-26-0007",
  orgId: "demo-org",
  siteId: "plant-1",
  reporterName: "Sam Okafor",
  receiptCode: null,
  anonymous: false,
  occurredAt: "2026-05-05T10:00:00Z",
  reportedAt: "2026-05-05T10:05:00Z",
  locationText: "Loading bay 3",
  hazardCategory: "slip_trip",
  description: "Hydraulic oil leak from forklift left a slick patch.",
  severityPotential: "high",
  status: "new",
  contributingFactors: [],
  correctiveActions: [],
  events: [],
  createdAt: "2026-05-05T10:05:00Z",
  updatedAt: "2026-05-05T10:05:00Z",
};

describe("slackChannel.shouldHandle", () => {
  const fetchImpl = vi.fn().mockResolvedValue(new Response(null, { status: 200 }));
  const ch = slackChannel({ webhookUrl: "https://hooks.slack.com/x", fetchImpl });

  it("includes high/critical report_created by default", () => {
    expect(
      ch.shouldHandle({ kind: "report_created", report: { ...baseReport, severityPotential: "high" } }),
    ).toBe(true);
    expect(
      ch.shouldHandle({ kind: "report_created", report: { ...baseReport, severityPotential: "critical" } }),
    ).toBe(true);
  });

  it("excludes low/medium report_created by default", () => {
    expect(
      ch.shouldHandle({ kind: "report_created", report: { ...baseReport, severityPotential: "low" } }),
    ).toBe(false);
    expect(
      ch.shouldHandle({ kind: "report_created", report: { ...baseReport, severityPotential: "medium" } }),
    ).toBe(false);
  });

  it("respects minSeverity override", () => {
    const lower = slackChannel({
      webhookUrl: "https://hooks.slack.com/x",
      minSeverity: "medium",
      fetchImpl,
    });
    expect(
      lower.shouldHandle({
        kind: "report_created",
        report: { ...baseReport, severityPotential: "medium" },
      }),
    ).toBe(true);
    expect(
      lower.shouldHandle({
        kind: "report_created",
        report: { ...baseReport, severityPotential: "low" },
      }),
    ).toBe(false);
  });

  it("includes status_changed events regardless of severity", () => {
    expect(
      ch.shouldHandle({
        kind: "status_changed",
        report: { ...baseReport, severityPotential: "low" },
        from: "new",
        to: "triaged",
      }),
    ).toBe(true);
  });

  it("excludes action_assigned (those belong on email/SMS)", () => {
    expect(
      ch.shouldHandle({
        kind: "action_assigned",
        report: baseReport,
        ownerName: "Marcus Webb",
        description: "Fix the line",
      }),
    ).toBe(false);
  });
});

describe("formatPayload", () => {
  it("includes reference, severity, hazard, location, reporter for report_created", () => {
    const p = formatPayload(
      { kind: "report_created", report: baseReport },
      "https://app.example.com",
    );
    const text = JSON.stringify(p);
    expect(text).toContain("NM-26-0007");
    expect(text).toContain("Loading bay 3");
    expect(text).toContain("Slip / trip / fall");
    expect(text).toContain("Sam Okafor");
    expect(text).toContain("https://app.example.com/safety/near-misses/r1");
  });

  it("masks reporter as 'Anonymous reporter' for anonymous reports", () => {
    const p = formatPayload(
      {
        kind: "report_created",
        report: { ...baseReport, anonymous: true, reporterName: null },
      },
      "https://app.example.com",
    );
    expect(JSON.stringify(p)).toContain("Anonymous reporter");
    expect(JSON.stringify(p)).not.toContain("Sam Okafor");
  });

  it("uses danger button style only for critical severity", () => {
    const high = formatPayload(
      { kind: "report_created", report: { ...baseReport, severityPotential: "high" } },
      "https://x",
    );
    const critical = formatPayload(
      { kind: "report_created", report: { ...baseReport, severityPotential: "critical" } },
      "https://x",
    );
    expect(JSON.stringify(high)).toContain('"style":"primary"');
    expect(JSON.stringify(critical)).toContain('"style":"danger"');
  });

  it("omits the link button when no baseUrl provided", () => {
    const p = formatPayload({ kind: "report_created", report: baseReport });
    expect(JSON.stringify(p)).not.toContain("actions");
  });

  it("formats status_changed compactly with old → new", () => {
    const p = formatPayload(
      {
        kind: "status_changed",
        report: baseReport,
        from: "new",
        to: "triaged",
      },
      "https://app.example.com",
    );
    const text = JSON.stringify(p);
    expect(text).toContain("NM-26-0007");
    expect(text).toContain("`new`");
    expect(text).toContain("`triaged`");
  });

  it("truncates very long descriptions", () => {
    const longDesc = "x".repeat(2_000);
    const p = formatPayload({
      kind: "report_created",
      report: { ...baseReport, description: longDesc },
    });
    const text = JSON.stringify(p);
    expect(text).toContain("…");
    // Should not contain the full 2000-char string.
    expect(text.includes("x".repeat(700))).toBe(false);
  });
});

describe("slackChannel.send", () => {
  it("POSTs JSON to the webhook URL", async () => {
    const fetchImpl = vi.fn().mockResolvedValue(new Response(null, { status: 200 }));
    const ch = slackChannel({
      webhookUrl: "https://hooks.slack.com/services/T/B/X",
      fetchImpl,
    });
    await ch.send({ kind: "report_created", report: baseReport });

    expect(fetchImpl).toHaveBeenCalledOnce();
    const [url, init] = fetchImpl.mock.calls[0] as [string, RequestInit];
    expect(url).toBe("https://hooks.slack.com/services/T/B/X");
    expect(init.method).toBe("POST");
    expect((init.headers as Record<string, string>)["content-type"]).toBe(
      "application/json",
    );
    expect(JSON.parse(init.body as string)).toMatchObject({
      text: expect.stringContaining("NM-26-0007"),
      blocks: expect.any(Array),
    });
  });

  it("aborts when the webhook is too slow (timeout)", async () => {
    const fetchImpl = vi.fn().mockImplementation(
      (_url: string, init: RequestInit) =>
        new Promise<Response>((_resolve, reject) => {
          init.signal?.addEventListener("abort", () =>
            reject(new Error("aborted")),
          );
        }),
    );
    const ch = slackChannel({
      webhookUrl: "https://hooks.slack.com/x",
      fetchImpl,
      timeoutMs: 30,
    });
    await expect(
      ch.send({ kind: "report_created", report: baseReport }),
    ).rejects.toThrow();
  });
});
