import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { canonicalStringify, contentIntegritySha256 } from "@/lib/content-pipeline/content-integrity";

describe("content-integrity", () => {
  it("canonicalStringify is key-order invariant", () => {
    const a = { z: 1, a: { m: 2, b: 3 } };
    const b = { a: { b: 3, m: 2 }, z: 1 };
    assert.equal(canonicalStringify(a), canonicalStringify(b));
  });

  it("contentIntegritySha256 is stable for same logical payload", () => {
    const h1 = contentIntegritySha256({ exam: "nclex", stem: "x" });
    const h2 = contentIntegritySha256({ stem: "x", exam: "nclex" });
    assert.equal(h1, h2);
  });
});
