import assert from "node:assert/strict";
import test from "node:test";
import { classifyLearningTopic } from "@/lib/pathways/pathway-learning-structure";

test("renal keywords win over prioritization / fundamentals-style copy", () => {
  assert.equal(
    classifyLearningTopic("fundamentals prioritization acute kidney injury triage", "us-rn-nclex-rn").categoryId,
    "renal-genitourinary",
  );
  assert.equal(classifyLearningTopic("kidney transplant immunosuppression overview", null).categoryId, "renal-genitourinary");
});

test("narrow infection-control fundamentals still map to fundamentals", () => {
  assert.equal(classifyLearningTopic("hand hygiene and standard precautions in clinical practice", null).categoryId, "fundamentals");
});
