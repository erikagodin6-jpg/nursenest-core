import assert from "node:assert/strict";
import test from "node:test";
import {
  coerceBowtieDraftAnswer,
  isBowtieAnswerComplete,
  isBowtieQuestionType,
  parseBowtieCorrectMapping,
  parseBowtieUserMapping,
  tryNormalizeBowtiePayload,
} from "@/lib/questions/bowtie-adapter";

test("tryNormalizeBowtiePayload: valid bowtie options + Bowtie type", () => {
  const payload = tryNormalizeBowtiePayload(
    "Bowtie",
    "A patient reports acute chest pressure.",
    {
      format: "bowtie",
      bank: [
        { id: "a", text: "STEMI" },
        { id: "b", text: "Obtain ECG" },
        { id: "c", text: "Troponin" },
        { id: "d", text: "Distractor" },
      ],
    },
  );
  assert.ok(payload);
  assert.equal(payload!.bank.length, 4);
  assert.match(payload!.scenario, /chest pressure/);
});

test("tryNormalizeBowtiePayload: Trend alias type", () => {
  const payload = tryNormalizeBowtiePayload(
    "Trend",
    "Stem text",
    {
      bank: ["one", "two", "three"],
    },
  );
  assert.ok(payload);
});

test("tryNormalizeBowtiePayload: invalid — MCQ type", () => {
  const payload = tryNormalizeBowtiePayload(
    "MCQ",
    "Stem",
    {
      format: "bowtie",
      bank: [
        { id: "a", text: "A" },
        { id: "b", text: "B" },
        { id: "c", text: "C" },
      ],
    },
  );
  assert.equal(payload, null);
});

test("tryNormalizeBowtiePayload: invalid — array options", () => {
  assert.equal(
    tryNormalizeBowtiePayload("Bowtie", "Stem", ["a", "b", "c", "d"]),
    null,
  );
});

test("parseBowtieCorrectMapping + user mapping grading shape", () => {
  const correct = parseBowtieCorrectMapping({
    correctMapping: { condition: "a", intervention: "b", monitoring: "c" },
  });
  assert.deepEqual(correct, { condition: "a", intervention: "b", monitoring: "c" });
  const u = parseBowtieUserMapping({
    type: "bowtie",
    mapping: { condition: "a", intervention: "b", monitoring: "c" },
  });
  assert.deepEqual(u, correct);
});

test("isBowtieAnswerComplete", () => {
  assert.equal(
    isBowtieAnswerComplete({
      type: "bowtie",
      mapping: { condition: "a", intervention: "b", monitoring: "c" },
    }),
    true,
  );
  assert.equal(
    isBowtieAnswerComplete({
      type: "bowtie",
      mapping: { condition: "", intervention: "b", monitoring: "c" },
    }),
    false,
  );
});

test("coerceBowtieDraftAnswer tolerates partial mapping", () => {
  const d = coerceBowtieDraftAnswer({
    type: "bowtie",
    mapping: { condition: "x", intervention: "", monitoring: "" },
  });
  assert.equal(d.condition, "x");
  assert.equal(d.intervention, "");
});

test("isBowtieQuestionType", () => {
  assert.equal(isBowtieQuestionType("Bowtie"), true);
  assert.equal(isBowtieQuestionType("bowtie_items"), true);
  assert.equal(isBowtieQuestionType("Trend"), true);
  assert.equal(isBowtieQuestionType("MCQ"), false);
});
