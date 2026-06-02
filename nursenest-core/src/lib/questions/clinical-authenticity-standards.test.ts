import assert from "node:assert/strict";
import test from "node:test";

import { evaluateClinicalAuthenticity } from "./clinical-authenticity-standards";

test("passes a clinically authentic nursing item", () => {
  const result = evaluateClinicalAuthenticity({
    tier: "RN",
    stem:
      "During morning shift report, a nurse receives four clients. Which client should the nurse assess first?",
    options: [
      "A client with heart failure who reports new shortness of breath and has SpO2 86% on 2 L/min oxygen",
      "A client 1 day postoperative requesting help ordering breakfast",
      "A client with diabetes whose glucose was 7.8 mmol/L before breakfast",
      "A client awaiting discharge teaching after cataract surgery",
    ],
    rationale:
      "New dyspnea with hypoxemia is the most urgent bedside cue. The nurse should assess breathing and escalate before addressing stable teaching or routine comfort needs.",
    clinicalReasoning:
      "This is realistic prioritization: compare stability, recognize oxygenation risk, and choose the first assessment that protects safety.",
  });

  assert.equal(result.pass, true);
  assert.equal(result.issues.length, 0);
});

test("rejects robotic textbook-only question wording", () => {
  const result = evaluateClinicalAuthenticity({
    tier: "RN",
    stem:
      "Clinical recall: Which finding or action best reflects the clinical principle being reviewed for respiratory care?",
    options: [
      "Assess oxygen saturation",
      "Document later",
      "Teach general wellness",
      "Review the material",
    ],
    rationale:
      "This educational scenario demonstrates knowledge of the topic as it relates to nursing care.",
  });

  assert.equal(result.pass, false);
  assert.ok(result.issues.some((issue) => issue.code === "ROBOTIC_OR_TEXTBOOK_PHRASE"));
  assert.ok(result.issues.some((issue) => issue.code === "MISSING_BEDSIDE_CONTEXT"));
});

test("flags unnatural dialogue and exaggerated scenarios", () => {
  const result = evaluateClinicalAuthenticity({
    tier: "RPN",
    stem:
      'A resident suddenly has all vital signs crashing and states "I understand the teaching because my disease process is unstable." What should the nurse do?',
    options: [
      "Assess the resident and report the change",
      "Ignore the statement",
      "Give a lecture",
      "Wait until tomorrow",
    ],
    rationale:
      "The nurse should respond to instability, but the scenario and dialogue are not believable.",
  });

  assert.equal(result.pass, false);
  assert.ok(result.issues.some((issue) => issue.code === "UNNATURAL_DIALOGUE"));
  assert.ok(result.issues.some((issue) => issue.code === "EXAGGERATED_SCENARIO"));
});
