import { afterEach, describe, expect, it } from "vitest";
import { _reset, consume } from "./rate-limit";

afterEach(() => _reset());

describe("consume", () => {
  it("returns allowed=true with decreasing remaining within the window", () => {
    const a = consume("k", 3, 1000, 0);
    const b = consume("k", 3, 1000, 100);
    const c = consume("k", 3, 1000, 200);
    expect(a).toMatchObject({ allowed: true, remaining: 2 });
    expect(b).toMatchObject({ allowed: true, remaining: 1 });
    expect(c).toMatchObject({ allowed: true, remaining: 0 });
  });

  it("rejects with retryAfterSec once the bucket is drained", () => {
    consume("k", 1, 1000, 0);
    const blocked = consume("k", 1, 1000, 100);
    expect(blocked.allowed).toBe(false);
    expect(blocked.retryAfterSec).toBeGreaterThan(0);
    expect(blocked.resetAt).toBe(1000);
  });

  it("refills after the window resets", () => {
    consume("k", 1, 1000, 0);
    const blocked = consume("k", 1, 1000, 500);
    expect(blocked.allowed).toBe(false);

    const later = consume("k", 1, 1000, 1500);
    expect(later.allowed).toBe(true);
    expect(later.remaining).toBe(0);
  });

  it("isolates buckets per key", () => {
    consume("alice", 1, 1000, 0);
    const bob = consume("bob", 1, 1000, 0);
    expect(bob).toMatchObject({ allowed: true, remaining: 0 });
  });
});
