import { describe, expect, it } from "vitest";
import { toCsv, toCsvRow } from "./csv";

describe("toCsvRow", () => {
  it("emits raw cells when no escaping is needed", () => {
    expect(toCsvRow(["a", 1, true, "z"])).toBe("a,1,true,z");
  });

  it("quotes cells containing commas, quotes, or newlines", () => {
    expect(toCsvRow(["hello, world", 'she said "hi"', "line1\nline2"])).toBe(
      '"hello, world","she said ""hi""","line1\nline2"',
    );
  });

  it("emits empty strings for null and undefined", () => {
    expect(toCsvRow([null, undefined, "x"])).toBe(",,x");
  });
});

describe("toCsv", () => {
  it("joins with CRLF and trailing newline (RFC 4180)", () => {
    const out = toCsv(["a", "b"], [
      [1, 2],
      [3, 4],
    ]);
    expect(out).toBe("a,b\r\n1,2\r\n3,4\r\n");
  });

  it("survives the worst-case description (commas, quotes, embedded newlines)", () => {
    const out = toCsv(
      ["reference", "description"],
      [["NM-26-0001", 'A "complex" entry, with\nmultiple lines']],
    );
    expect(out).toBe(
      'reference,description\r\nNM-26-0001,"A ""complex"" entry, with\nmultiple lines"\r\n',
    );
  });
});
