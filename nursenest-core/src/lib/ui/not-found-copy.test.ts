import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { hashPathForIndex, pickNotFoundCopy } from "@/lib/ui/not-found-copy";

describe("not-found-copy", () => {
  it("pickNotFoundCopy is deterministic for the same pathname", () => {
    const a = pickNotFoundCopy("/us/np/fnp/lessons/oops");
    const b = pickNotFoundCopy("/us/np/fnp/lessons/oops");
    assert.deepEqual(a, b);
  });

  it("pickNotFoundCopy ignores query strings via shared normalization", () => {
    const a = pickNotFoundCopy("/missing");
    const b = pickNotFoundCopy("/missing?x=1");
    assert.deepEqual(a, b);
  });

  it("hashPathForIndex is stable for repeated calls", () => {
    assert.equal(hashPathForIndex("/a"), hashPathForIndex("/a"));
  });

  it("malformed input degrades to a stable default path segment", () => {
    const row = pickNotFoundCopy(null);
    assert.ok(row.headline.length > 0);
    assert.ok(row.subtext.length > 0);
  });
});
