import assert from "node:assert/strict";
import test from "node:test";

import { validateBowtieQuestionPayload } from "@/lib/questions/bowtie-question-schema";

const validOptions = {
  format: "bowtie",
  bank: [
    { id: "condition_a", label: "Reduced cardiac output" },
    { id: "intervention_a", label: "Place on telemetry" },
    { id: "monitoring_a", label: "Monitor blood pressure" },
  ],
};

const validCorrectAnswer = {
  correctMapping: {
    condition: "condition_a",
    intervention: "intervention_a",
    monitoring: "monitoring_a",
  },
};

test("validateBowtieQuestionPayload accepts valid bowtie import shape", () => {
  const result = validateBowtieQuestionPayload({
    questionType: "NGN_BOWTIE",
    stem: "A patient has clinical findings requiring a bowtie decision.",
    options: validOptions,
    correctAnswer: validCorrectAnswer,
    rationale: "The selected findings align with the priority condition and monitoring needs.",
    topic: "Clinical Judgment",
    exam: "NCLEX-RN",
    publishMode: true,
  });
  assert.equal(result.ok, true);
});

test("validateBowtieQuestionPayload rejects mapping ids missing from bank", () => {
  const result = validateBowtieQuestionPayload({
    questionType: "BOWTIE",
    stem: "A patient has clinical findings requiring a bowtie decision.",
    options: validOptions,
    correctAnswer: {
      correctMapping: {
        condition: "condition_a",
        intervention: "not_in_bank",
        monitoring: "monitoring_a",
      },
    },
    rationale: "The selected findings align with the priority condition and monitoring needs.",
    bodySystem: "Cardiovascular",
    exam: "NCLEX-RN",
    publishMode: true,
  });
  assert.equal(result.ok, false);
  assert.ok(result.errors.some((error) => error.includes("not present in bowtie bank")));
});

test("validateBowtieQuestionPayload rejects malformed non-bowtie type", () => {
  const result = validateBowtieQuestionPayload({
    questionType: "MCQ",
    stem: "A patient has clinical findings requiring a bowtie decision.",
    options: validOptions,
    correctAnswer: validCorrectAnswer,
    rationale: "The selected findings align with the priority condition and monitoring needs.",
    topic: "Clinical Judgment",
    exam: "NCLEX-RN",
    publishMode: true,
  });
  assert.equal(result.ok, false);
  assert.ok(result.errors.some((error) => error.includes("not bowtie-compatible")));
});
