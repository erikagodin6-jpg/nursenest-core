import assert from "node:assert/strict";
import test from "node:test";

import { QuestionType } from "@prisma/client";

import { validateQuestionPayload } from "@/lib/content/question-schema";

test("validateQuestionPayload accepts valid bowtie payloads without weakening MCQ", () => {
  const options = {
    format: "bowtie",
    bank: [
      { id: "condition", label: "Condition" },
      { id: "intervention", label: "Intervention" },
      { id: "monitoring", label: "Monitoring" },
    ],
  };
  const answerKey = {
    correctMapping: {
      condition: "condition",
      intervention: "intervention",
      monitoring: "monitoring",
    },
  };

  assert.equal(validateQuestionPayload("NGN_BOWTIE" as QuestionType, options, answerKey), null);
  assert.match(validateQuestionPayload(QuestionType.MCQ, options, answerKey) ?? "", /Expected array|Invalid/i);
});

test("validateQuestionPayload rejects invalid bowtie mapping", () => {
  const result = validateQuestionPayload(
    "BOWTIE" as QuestionType,
    {
      format: "bowtie",
      bank: [
        { id: "condition", label: "Condition" },
        { id: "intervention", label: "Intervention" },
        { id: "monitoring", label: "Monitoring" },
      ],
    },
    {
      correctMapping: {
        condition: "condition",
        intervention: "missing",
        monitoring: "monitoring",
      },
    },
  );
  assert.match(result ?? "", /not present in bowtie bank/);
});
