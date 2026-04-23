import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { filterPoolRemovingRecentQuestions } from "@/lib/practice-tests/recent-practice-question-ids";

describe("filterPoolRemovingRecentQuestions", () => {
  it("filters when enough items remain", () => {
    const pool = [{ id: "a" }, { id: "b" }, { id: "c" }, { id: "d" }, { id: "e" }, { id: "f" }, { id: "g" }, { id: "h" }];
    const recent = new Set(["a", "b"]);
    const r = filterPoolRemovingRecentQuestions(pool, recent, 6);
    assert.equal(r.applied, true);
    assert.equal(r.pool.length, 6);
    assert.ok(!r.pool.some((p) => p.id === "a" || p.id === "b"));
  });

  it("keeps full pool when exclusion would drop below minRemaining", () => {
    const pool = [{ id: "a" }, { id: "b" }, { id: "c" }, { id: "d" }, { id: "e" }, { id: "f" }, { id: "g" }, { id: "h" }];
    const recent = new Set(["a", "b", "c", "d", "e", "f", "g"]);
    const r = filterPoolRemovingRecentQuestions(pool, recent, 8);
    assert.equal(r.applied, false);
    assert.equal(r.skipReason, "pool_too_small_after_recent_exclusion");
    assert.equal(r.pool.length, 8);
  });

  it("uses session question count as minRemaining for linear-style picks", () => {
    const pool = Array.from({ length: 12 }, (_, i) => ({ id: `q${i}` }));
    const recent = new Set(["q0", "q1", "q2", "q3", "q4", "q5", "q6"]);
    const r = filterPoolRemovingRecentQuestions(pool, recent, 5);
    assert.equal(r.applied, true);
    assert.equal(r.pool.length, 5);
  });
});
