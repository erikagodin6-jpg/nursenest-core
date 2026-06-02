import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { orderingSequencesForCategories } from "@/lib/study-tools/clinical-ordering-sequences";

describe("clinical ordering sequences", () => {
  it("returns full library when no categories selected", () => {
    const all = orderingSequencesForCategories([]);
    assert.ok(all.length >= 3);
  });

  it("filters by canonical tags", () => {
    const neuro = orderingSequencesForCategories(["neurological"]);
    assert.ok(neuro.every((s) => s.canonicalTags.includes("neurological")));
  });
});
