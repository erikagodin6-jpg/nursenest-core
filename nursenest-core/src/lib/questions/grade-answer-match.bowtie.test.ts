import assert from "node:assert/strict";
import test from "node:test";
import {
  canonicalCorrectKeysForGrade,
  correctAnswerIsConfigured,
  gradeMatches,
} from "@/lib/questions/grade-answer-match";

test("gradeMatches bowtie all-or-nothing", () => {
  const ca = {
    correctMapping: { condition: "c1", intervention: "i1", monitoring: "m1" },
  };
  assert.equal(
    gradeMatches(
      "Bowtie",
      ca,
      { type: "bowtie", mapping: { condition: "c1", intervention: "i1", monitoring: "m1" } },
    ),
    true,
  );
  assert.equal(
    gradeMatches(
      "Bowtie",
      ca,
      { type: "bowtie", mapping: { condition: "c1", intervention: "wrong", monitoring: "m1" } },
    ),
    false,
  );
});

test("correctAnswerIsConfigured accepts bowtie mapping object", () => {
  assert.equal(
    correctAnswerIsConfigured("Bowtie", {
      correctMapping: { condition: "a", intervention: "b", monitoring: "c" },
    }),
    true,
  );
  assert.equal(correctAnswerIsConfigured("Bowtie", {}), false);
});

test("canonicalCorrectKeysForGrade lists three ids", () => {
  const keys = canonicalCorrectKeysForGrade("Bowtie", {
    correctMapping: { condition: "a", intervention: "b", monitoring: "c" },
  });
  assert.deepEqual(keys, ["a", "b", "c"]);
});
