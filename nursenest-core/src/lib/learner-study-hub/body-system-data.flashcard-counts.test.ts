import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { getFlashcardCountsByBodySystem } from "@/lib/learner-study-hub/body-system-data";
import { CANONICAL_STUDY_CATEGORIES } from "@/lib/study/normalize-study-category";

describe("getFlashcardCountsByBodySystem", () => {
  it("aggregates RN hub + classifier alias rows into canonical buckets (renal)", () => {
    const rows = [
      { id: "renal_urinary", title: "Renal & Urinary", count: 0 },
      { id: "renal_genitourinary", title: "Renal Genitourinary", count: 15 },
    ];
    const out = getFlashcardCountsByBodySystem("ca-rn-nclex-rn", rows);
    assert.ok(out.renal_urinary >= 15, `expected renal_urinary aggregate, got ${out.renal_urinary}`);
  });

  it("never drops counts into non-rendered keys (overflow rolls into uncategorized)", () => {
    const rows = [{ id: "totally_unknown_builder_bucket_xyz", title: "Mystery", count: 7 }];
    const out = getFlashcardCountsByBodySystem("ca-rn-nclex-rn", rows);
    const sum = CANONICAL_STUDY_CATEGORIES.reduce((s, c) => s + (out[c.id] ?? 0), 0);
    assert.equal(sum, 7);
    assert.ok(out.uncategorized >= 7);
  });
});
