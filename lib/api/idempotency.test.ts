import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { withIdempotency } from "./idempotency";
import { withFreshStore } from "@/lib/near-miss/__test-utils__/fresh-store";

let cleanup: () => void;

beforeEach(() => {
  cleanup = withFreshStore().cleanup;
});

afterEach(() => {
  cleanup();
});

describe("withIdempotency", () => {
  it("runs the handler exactly once for repeated identical calls", async () => {
    const handler = vi.fn(async () => ({ status: 201, body: { id: "abc" } }));

    const a = await withIdempotency("submit", "k1", '{"x":1}', handler);
    const b = await withIdempotency("submit", "k1", '{"x":1}', handler);

    expect(handler).toHaveBeenCalledTimes(1);
    expect(a).toMatchObject({ kind: "fresh", status: 201, body: { id: "abc" } });
    expect(b).toMatchObject({ kind: "replay", status: 201, body: { id: "abc" } });
  });

  it("replays the original status code (e.g. 400 validation) too", async () => {
    const handler = vi.fn(async () => ({
      status: 400,
      body: { error: "Validation failed", fieldErrors: { description: "too short" } },
    }));

    const a = await withIdempotency("submit", "k1", '{"x":1}', handler);
    const b = await withIdempotency("submit", "k1", '{"x":1}', handler);

    expect(handler).toHaveBeenCalledTimes(1);
    expect(a).toMatchObject({ kind: "fresh", status: 400 });
    expect(b).toMatchObject({ kind: "replay", status: 400 });
  });

  it("returns conflict when same key sees a different body hash", async () => {
    const handler = vi.fn(async () => ({ status: 201, body: { id: "abc" } }));

    await withIdempotency("submit", "k1", '{"x":1}', handler);
    const second = await withIdempotency("submit", "k1", '{"x":2}', handler);

    expect(handler).toHaveBeenCalledTimes(1);
    expect(second).toEqual({ kind: "conflict" });
  });

  it("isolates by scope — same key in two scopes is independent", async () => {
    const handler = vi.fn(async () => ({ status: 201, body: { id: "abc" } }));

    const a = await withIdempotency("submit", "k1", '{"x":1}', handler);
    const b = await withIdempotency("comment", "k1", '{"x":1}', handler);

    expect(handler).toHaveBeenCalledTimes(2);
    expect(a.kind).toBe("fresh");
    expect(b.kind).toBe("fresh");
  });

  it("treats missing key as no-op (handler always runs, no caching)", async () => {
    const handler = vi.fn(async () => ({ status: 201, body: { id: "abc" } }));

    await withIdempotency("submit", null, '{"x":1}', handler);
    await withIdempotency("submit", null, '{"x":1}', handler);
    await withIdempotency("submit", undefined, '{"x":1}', handler);

    expect(handler).toHaveBeenCalledTimes(3);
  });

  it("treats malformed key as no-op rather than poisoning the cache", async () => {
    const handler = vi.fn(async () => ({ status: 201, body: { id: "abc" } }));

    const out = await withIdempotency("submit", "has spaces and !@#", '{"x":1}', handler);

    expect(out.kind).toBe("fresh");
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it("doesn't cache thrown errors — re-runs on retry", async () => {
    let throwOnce = true;
    const handler = vi.fn(async () => {
      if (throwOnce) {
        throwOnce = false;
        throw new Error("boom");
      }
      return { status: 201, body: { id: "abc" } };
    });

    await expect(withIdempotency("submit", "k1", '{"x":1}', handler)).rejects.toThrow("boom");
    const second = await withIdempotency("submit", "k1", '{"x":1}', handler);
    expect(second.kind).toBe("fresh");
    expect(handler).toHaveBeenCalledTimes(2);
  });
});
