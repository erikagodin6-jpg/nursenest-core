import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { hasUsableCatWeakPriorityMap } from "@/lib/practice-tests/cat-session";

describe("hasUsableCatWeakPriorityMap", () => {
  it("accepts modern non-empty numeric priority maps", () => {
    assert.equal(hasUsableCatWeakPriorityMap({ cardiac: 0.73, endocrine: 0.22 }), true);
  });

  it("rejects missing/empty/zero-only maps (legacy configs should fall back)", () => {
    assert.equal(hasUsableCatWeakPriorityMap(undefined), false);
    assert.equal(hasUsableCatWeakPriorityMap({}), false);
    assert.equal(hasUsableCatWeakPriorityMap({ cardiac: 0, endocrine: 0 }), false);
  });
});
