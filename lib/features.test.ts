import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { _resetFeatures, features, publicFeatures } from "./features";

const FLAGS = [
  "NM_FEATURE_COMMENTS",
  "NM_FEATURE_CSV_EXPORT",
  "NM_FEATURE_IDEMPOTENCY",
  "NM_FEATURE_OVERDUE_CRON",
  "NM_FEATURE_WEB_OFFLINE_QUEUE",
  "NM_FEATURE_MOBILE_OFFLINE_QUEUE",
  "NM_FEATURE_PHOTO_ATTACHMENTS",
] as const;

const original: Record<string, string | undefined> = {};

beforeEach(() => {
  for (const k of FLAGS) original[k] = process.env[k];
  for (const k of FLAGS) delete process.env[k];
  _resetFeatures();
});

afterEach(() => {
  for (const k of FLAGS) {
    if (original[k] === undefined) delete process.env[k];
    else process.env[k] = original[k];
  }
  _resetFeatures();
});

describe("features()", () => {
  it("defaults every flag to ON", () => {
    expect(features()).toMatchObject({
      comments: true,
      csvExport: true,
      idempotency: true,
      overdueCron: true,
      webOfflineQueue: true,
      mobileOfflineQueue: true,
      photoAttachments: true,
    });
  });

  it("turns a flag off when the env var is set to false", () => {
    process.env.NM_FEATURE_COMMENTS = "false";
    process.env.NM_FEATURE_CSV_EXPORT = "0";
    process.env.NM_FEATURE_IDEMPOTENCY = "off";
    _resetFeatures();
    const f = features();
    expect(f.comments).toBe(false);
    expect(f.csvExport).toBe(false);
    expect(f.idempotency).toBe(false);
    // Untouched flags stay on.
    expect(f.overdueCron).toBe(true);
  });

  it("accepts truthy spellings", () => {
    process.env.NM_FEATURE_COMMENTS = "TRUE";
    process.env.NM_FEATURE_CSV_EXPORT = "Yes";
    process.env.NM_FEATURE_IDEMPOTENCY = "on";
    _resetFeatures();
    const f = features();
    expect(f.comments).toBe(true);
    expect(f.csvExport).toBe(true);
    expect(f.idempotency).toBe(true);
  });

  it("uses the default for unknown values and warns (non-fatal)", () => {
    process.env.NM_FEATURE_COMMENTS = "maybe";
    _resetFeatures();
    expect(features().comments).toBe(true); // default
  });
});

describe("publicFeatures()", () => {
  it("returns only the client-safe subset", () => {
    const p = publicFeatures();
    expect(Object.keys(p).sort()).toEqual([
      "comments",
      "csvExport",
      "mobileOfflineQueue",
      "photoAttachments",
      "webOfflineQueue",
    ]);
  });

  it("excludes server-only flags like idempotency and overdueCron", () => {
    const p = publicFeatures();
    expect(p).not.toHaveProperty("idempotency");
    expect(p).not.toHaveProperty("overdueCron");
  });
});
