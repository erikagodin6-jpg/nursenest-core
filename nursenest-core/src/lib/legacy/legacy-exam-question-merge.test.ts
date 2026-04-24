import assert from "node:assert/strict";
import test from "node:test";

import {
  normalizeCorrectAnswerStrings,
  resolveExamQuestionScope,
} from "@/lib/legacy/legacy-exam-question-merge";

test("resolveExamQuestionScope picks pool exam+tier for CA RN NCLEX pathway", () => {
  const s = resolveExamQuestionScope("ca-rn-nclex-rn");
  assert.ok(!("error" in s));
  if ("error" in s) return;
  assert.equal(s.tier, "rn");
  assert.ok(s.exam.length > 0);
});

test("resolveExamQuestionScope rejects exam outside pathway pool", () => {
  const s = resolveExamQuestionScope("ca-rn-nclex-rn", "NCLEX-PN");
  assert.ok("error" in s);
});

test("normalizeCorrectAnswerStrings MCQ single string", () => {
  const opts = ["A", "B", "C"];
  const r = normalizeCorrectAnswerStrings("B", opts, "MCQ");
  assert.equal(r.ok, true);
  if (r.ok) assert.deepEqual(r.value, ["B"]);
});

test("normalizeCorrectAnswerStrings MCQ by index", () => {
  const opts = ["A", "B", "C"];
  const r = normalizeCorrectAnswerStrings(1, opts, "MCQ");
  assert.equal(r.ok, true);
  if (r.ok) assert.deepEqual(r.value, ["B"]);
});

test("normalizeCorrectAnswerStrings SATA multiple", () => {
  const opts = ["Crackles", "Edema", "Dry mouth", "JVD"];
  const r = normalizeCorrectAnswerStrings(["Crackles", "Edema", "JVD"], opts, "SATA");
  assert.equal(r.ok, true);
  if (r.ok) assert.equal(r.value.length, 3);
});

test("normalizeCorrectAnswerStrings MCQ rejects multiple correct", () => {
  const opts = ["A", "B", "C"];
  const r = normalizeCorrectAnswerStrings(["A", "B"], opts, "MCQ");
  assert.equal(r.ok, false);
});
