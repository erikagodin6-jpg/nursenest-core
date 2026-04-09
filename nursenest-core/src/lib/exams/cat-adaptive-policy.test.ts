import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { highYieldBoostForPoolRow } from "@/lib/exams/cat-adaptive-policy";
import type { CatPoolRow } from "@/lib/exams/cat-engine";

function row(partial: Partial<CatPoolRow> & Pick<CatPoolRow, "id">): CatPoolRow {
  return {
    id: partial.id,
    difficulty: partial.difficulty ?? 3,
    bodySystem: partial.bodySystem ?? null,
    topic: partial.topic ?? null,
    nclexClientNeedsCategory: partial.nclexClientNeedsCategory,
    nclexClientNeedsSubcategory: partial.nclexClientNeedsSubcategory,
  };
}

describe("highYieldBoostForPoolRow", () => {
  it("returns 0 when no high-yield hints", () => {
    assert.equal(
      highYieldBoostForPoolRow(row({ id: "a", topic: "Misc", bodySystem: "Integumentary" }), "General"),
      0,
    );
  });

  it("adds capped boost for cardio + pharm keywords", () => {
    const b = highYieldBoostForPoolRow(
      row({ id: "b", topic: "Cardiac pharmacology", bodySystem: null }),
      "safe-effective",
    );
    assert.ok(b > 0);
    assert.ok(b <= 12);
  });
});
