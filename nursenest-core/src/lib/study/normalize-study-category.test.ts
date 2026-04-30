import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  CANONICAL_STUDY_CATEGORIES,
  normalizeStudyCategory,
  normalizeStudyCategoryForDiscoveryTopic,
  normalizeStudyCategoryForExamQuestionRow,
} from "@/lib/study/normalize-study-category";

describe("normalizeStudyCategory", () => {
  it("maps delegation / prioritization / pharmacology / infection without collapsing to uncategorized", () => {
    assert.equal(
      normalizeStudyCategory({ topic: "Delegate appropriate tasks to the UAP" }).id,
      "delegation_assignment",
    );
    assert.equal(normalizeStudyCategory({ topic: "Prioritization: first action for unstable patient" }).id, "prioritization");
    assert.equal(normalizeStudyCategory({ topic: "Insulin and hypoglycemia management" }).id, "pharmacology");
    assert.equal(normalizeStudyCategory({ topic: "Infection control: PPE and isolation precautions" }).id, "immune_infection_control");
  });

  it("maps NCLEX-style client need buckets", () => {
    assert.equal(normalizeStudyCategory({ nclexClientNeedsCategory: "safe-effective" }).id, "fundamentals_safety");
    assert.equal(normalizeStudyCategory({ nclexClientNeedsCategory: "management_of_care" }).id, "prioritization");
    assert.equal(normalizeStudyCategory({ nclexClientNeedsCategory: "pharmacological" }).id, "pharmacology");
  });

  it("maps exam question row-shaped inputs", () => {
    const r = normalizeStudyCategoryForExamQuestionRow({
      bodySystem: "cardiovascular",
      topic: "Heart failure",
      subtopic: null,
      nclexClientNeedsCategory: null,
      pathwayId: "ca-rn-nclex-rn",
    });
    assert.equal(r.id, "cardiovascular");
  });

  it("discovery topic Angina maps to cardiovascular (not uncategorized)", () => {
    const r = normalizeStudyCategoryForDiscoveryTopic("Angina", "ca-rn-nclex-rn");
    assert.equal(r.id, "cardiovascular");
  });

  it("canonical id list includes required clinical buckets", () => {
    const ids = new Set(CANONICAL_STUDY_CATEGORIES.map((c) => c.id));
    for (const need of [
      "delegation_assignment",
      "prioritization",
      "fundamentals_safety",
      "pharmacology",
      "immune_infection_control",
      "lab_values_diagnostics",
      "ethics_legal",
      "uncategorized",
    ]) {
      assert.ok(ids.has(need), `missing ${need}`);
    }
  });
});
