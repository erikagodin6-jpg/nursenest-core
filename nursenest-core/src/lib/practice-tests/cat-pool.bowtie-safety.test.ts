import assert from "node:assert/strict";
import test from "node:test";

import { isCompleteCatQuestionRow, NON_ECG_PRACTICE_EXAM_WHERE } from "@/lib/practice-tests/cat-pool";

test("isCompleteCatQuestionRow rejects random object answers for non-bowtie rows", () => {
  assert.equal(
    isCompleteCatQuestionRow({
      questionType: "multiple_choice",
      stem: "A complete stem",
      options: ["A", "B"],
      correctAnswer: { arbitrary: "object" },
      rationale: "A rationale",
    }),
    false,
  );
});

test("isCompleteCatQuestionRow accepts valid bowtie object answers", () => {
  assert.equal(
    isCompleteCatQuestionRow({
      questionType: "NGN_BOWTIE",
      stem: "A complete stem",
      options: {
        format: "bowtie",
        bank: [
          { id: "condition", label: "Condition" },
          { id: "intervention", label: "Intervention" },
          { id: "monitoring", label: "Monitoring" },
        ],
      },
      correctAnswer: {
        correctMapping: {
          condition: "condition",
          intervention: "intervention",
          monitoring: "monitoring",
        },
      },
      rationale: "A rationale",
    }),
    true,
  );
});

test("regular practice/CAT pool excludes ECG-formatted and ECG-tagged rows", () => {
  assert.deepEqual(NON_ECG_PRACTICE_EXAM_WHERE, {
    NOT: [{ questionFormat: "ecg_video" }, { tags: { has: "ecg-video" } }],
  });
});
