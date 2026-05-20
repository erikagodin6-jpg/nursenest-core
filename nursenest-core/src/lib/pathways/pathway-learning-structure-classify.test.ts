import assert from "node:assert/strict";
import test from "node:test";
import { classifyLearningTopic } from "@/lib/pathways/pathway-learning-structure";

test("renal keywords win over prioritization / fundamentals-style copy", () => {
  assert.equal(
    classifyLearningTopic("fundamentals prioritization acute kidney injury triage", "us-rn-nclex-rn").categoryId,
    "renal_genitourinary",
  );
  assert.equal(classifyLearningTopic("kidney transplant immunosuppression overview", null).categoryId, "renal_genitourinary");
});

test("infection-control basics map to immune / infectious (clinical domain)", () => {
  assert.equal(
    classifyLearningTopic("hand hygiene and standard precautions in clinical practice", null).categoryId,
    "immune_infectious",
  );
});
