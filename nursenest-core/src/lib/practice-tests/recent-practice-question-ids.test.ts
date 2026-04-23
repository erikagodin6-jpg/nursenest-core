import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { filterPoolRemovingRecentQuestions } from "@/lib/practice-tests/recent-practice-question-ids";

describe("filterPoolRemovingRecentQuestions", () => {
  const pool = Array.from({ length: 20 }, (_, i) => ({ id: `id-${i}` }));

  it("returns full pool when recent is empty (no-op)", () => {
    const r = filterPoolRemovingRecentQuestions(pool, new Set(), 10);
    assert.equal(r.applied, false);
    assert.equal(r.pool.length, pool.length);
    assert.equal(r.skipReason, undefined);
  });

  it("applies exclusion when enough items remain after removing recent", () => {
    const recent = new Set(["id-0", "id-1", "id-2"]);
    const r = filterPoolRemovingRecentQuestions(pool, recent, 10);
    assert.equal(r.applied, true);
    assert.equal(r.pool.length, 17);
    assert.equal(r.pool.some((p) => recent.has(p.id)), false);
  });

  it("skips exclusion when pool would drop below minRemaining (safeguard)", () => {
    const recent = new Set(pool.map((p) => p.id));
    const r = filterPoolRemovingRecentQuestions(pool, recent, 10);
    assert.equal(r.applied, false);
    assert.equal(r.skipReason, "pool_too_small_after_recent_exclusion");
    assert.equal(r.pool.length, pool.length);
  });

  it("applies exclusion when filtered size still meets minRemaining (edge: min just met)", () => {
    const recent = new Set(["id-0"]);
    const r = filterPoolRemovingRecentQuestions(pool, recent, 19);
    assert.equal(r.applied, true);
    assert.equal(r.pool.length, 19);
  });

  it("handles recent set larger than pool (still skips safely)", () => {
    const tiny = [{ id: "a" }, { id: "b" }];
    const recent = new Set(["x", "y", "z", "a", "b", "extra"]);
    const r = filterPoolRemovingRecentQuestions(tiny, recent, 2);
    assert.equal(r.applied, false);
    assert.equal(r.pool.length, 2);
  });
});
