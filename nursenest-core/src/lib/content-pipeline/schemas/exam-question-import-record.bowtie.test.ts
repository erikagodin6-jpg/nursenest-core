import assert from "node:assert/strict";
import test from "node:test";

import { examQuestionImportRecordSchema } from "@/lib/content-pipeline/schemas/exam-question-import-record";

test("examQuestionImportRecordSchema accepts valid bowtie import record", () => {
  const parsed = examQuestionImportRecordSchema.safeParse({
    stem: "A client has symptoms requiring clinical judgment in a bowtie format.",
    rationale: "This rationale explains why the selected condition, intervention, and monitoring response are correct.",
    options: {
      format: "bowtie",
      bank: [
        { id: "condition", label: "Priority condition" },
        { id: "intervention", label: "Priority intervention" },
        { id: "monitoring", label: "Priority monitoring" },
      ],
    },
    correctAnswer: {
      correctMapping: {
        condition: "condition",
        intervention: "intervention",
        monitoring: "monitoring",
      },
    },
    questionType: "BOWTIE",
    tier: "rn",
    exam: "NCLEX-RN",
    countryCode: "US",
    topic: "Clinical Judgment",
  });
  assert.equal(parsed.success, true);
});

test("examQuestionImportRecordSchema rejects invalid bowtie import record", () => {
  const parsed = examQuestionImportRecordSchema.safeParse({
    stem: "A client has symptoms requiring clinical judgment in a bowtie format.",
    rationale: "This rationale explains why the selected condition, intervention, and monitoring response are correct.",
    options: {
      format: "bowtie",
      bank: [
        { id: "condition", label: "Priority condition" },
        { id: "intervention", label: "Priority intervention" },
        { id: "monitoring", label: "Priority monitoring" },
      ],
    },
    correctAnswer: {
      correctMapping: {
        condition: "condition",
        intervention: "missing",
        monitoring: "monitoring",
      },
    },
    questionType: "BOWTIE",
    tier: "rn",
    exam: "NCLEX-RN",
    countryCode: "US",
    topic: "Clinical Judgment",
  });
  assert.equal(parsed.success, false);
});
