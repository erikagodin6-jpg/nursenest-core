import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { filterPoolRemovingRecentQuestions } from "@/lib/practice-tests/recent-practice-question-ids";
import { shuffleSeeded } from "@/lib/practice-tests/session-seeded-random";
import { practiceRecentSessionLookback } from "@/lib/study/study-diversity-config";

describe("study diversity — recent question exclusion", () => {
  it("applies exclusion when enough items remain after filtering", () => {
    const pool = Array.from({ length: 24 }, (_, i) => ({ id: `id-${i}` }));
    const recent = new Set(["id-0", "id-1", "id-2"]);
    const out = filterPoolRemovingRecentQuestions(pool, recent, 8);
    assert.equal(out.applied, true);
    assert.ok(out.pool.every((p) => !recent.has(p.id)));
    assert.equal(out.pool.length, 21);
  });

  it("skips exclusion (graceful fallback) when the pool would be too small", () => {
    const pool = [
      { id: "a" },
      { id: "b" },
      { id: "c" },
    ];
    const recent = new Set(["a", "b"]);
    const out = filterPoolRemovingRecentQuestions(pool, recent, 8);
    assert.equal(out.applied, false);
    assert.equal(out.skipReason, "pool_too_small_after_recent_exclusion");
    assert.deepEqual(
      out.pool.map((p) => p.id),
      ["a", "b", "c"],
    );
  });
});

describe("study diversity — config", () => {
  it("uses a shorter recent-session lookback for weak mode than default random/targeted", () => {
    assert.ok(practiceRecentSessionLookback("weak") < practiceRecentSessionLookback("random"));
    assert.equal(practiceRecentSessionLookback("random"), practiceRecentSessionLookback("targeted"));
  });

  it("uses a dedicated lookback for missed-review sessions", () => {
    const m = practiceRecentSessionLookback("missed");
    assert.ok(m > 0 && m <= practiceRecentSessionLookback("random"));
  });
});

describe("study diversity — shuffleSeeded", () => {
  it("permutes all elements and is stable per seed", () => {
    const base = ["a", "b", "c", "d", "e"];
    const s1 = shuffleSeeded(base, "seed-one::::::::");
    const s2 = shuffleSeeded(base, "seed-one::::::::");
    const s3 = shuffleSeeded(base, "seed-two::::::::");
    assert.deepEqual(s1, s2);
    assert.deepEqual(new Set(s1), new Set(base));
    assert.notDeepEqual(s1, s3);
  });
});
