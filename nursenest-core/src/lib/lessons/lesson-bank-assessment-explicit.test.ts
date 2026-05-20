import test from "node:test";
import assert from "node:assert/strict";
import type { PathwayLessonQuizItem } from "@/lib/lessons/pathway-lesson-types";
import { preferExplicitAssessmentSide } from "@/lib/lessons/lesson-assessment-explicit-pure";
import { sanitizeQuestionIdArray, sanitizeQuestionIdArrayWithDiagnostics } from "@/lib/lessons/pathway-lesson-catalog-sync";

const mergedPre: PathwayLessonQuizItem[] = [
  { question: "Catalog?", options: ["x", "y"], correct: 0 },
];

test("preferExplicitAssessmentSide uses explicit when non-empty", () => {
  const explicit: PathwayLessonQuizItem[] = [{ question: "Bank?", options: ["a", "b"], correct: 1 }];
  assert.deepEqual(preferExplicitAssessmentSide(explicit, mergedPre), explicit);
});

test("preferExplicitAssessmentSide falls back when explicit null or empty", () => {
  assert.deepEqual(preferExplicitAssessmentSide(null, mergedPre), mergedPre);
  assert.deepEqual(preferExplicitAssessmentSide([], mergedPre), mergedPre);
});

test("sanitizeQuestionIdArray dedupes and preserves first-seen order", () => {
  const a = "aaaaaaaaaaaaaaaa";
  const b = "bbbbbbbbbbbbbbbb";
  const out = sanitizeQuestionIdArray([a, b, a, `  ${b}  `, "short"]);
  assert.deepEqual(out, [a, b]);
});

test("sanitizeQuestionIdArray rejects malformed entries", () => {
  assert.equal(sanitizeQuestionIdArray(["nope", null, 3, ""]), undefined);
});

test("sanitizeQuestionIdArrayWithDiagnostics records malformed and duplicate positions", () => {
  const a = "aaaaaaaaaaaaaaaa";
  const { ids, dropped } = sanitizeQuestionIdArrayWithDiagnostics([a, "bad", a, "nope"]);
  assert.deepEqual(ids, [a]);
  assert.ok(dropped.some((d) => d.reason === "duplicate"));
  assert.ok(dropped.some((d) => d.reason === "malformed"));
});
