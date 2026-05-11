import assert from "node:assert/strict";
import test from "node:test";
import { getExamPathwayById } from "@/lib/exam-pathways/exam-product-registry";
import { pathwayVisibleForLearnerChrome } from "@/lib/learner/load-learner-shell-pathway-metadata";

test("pathwayVisibleForLearnerChrome rejects hidden admissions pathways", () => {
  const hidden = getExamPathwayById("us-allied-hesi-a2");
  assert.ok(hidden);
  assert.equal(pathwayVisibleForLearnerChrome(hidden), false);
});

test("pathwayVisibleForLearnerChrome keeps published nursing pathways visible", () => {
  const visible = getExamPathwayById("us-rn-nclex-rn");
  assert.ok(visible);
  assert.equal(pathwayVisibleForLearnerChrome(visible), true);
});
