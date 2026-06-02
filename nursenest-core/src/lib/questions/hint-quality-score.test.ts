import assert from "node:assert/strict";
import test from "node:test";

import { scoreHintQuality } from "@/lib/questions/hint-quality-score";

test("rejects answer option letters", () => {
  const result = scoreHintQuality({
    id: "letter-leak",
    hint: "Review option B before answering.",
    stem: "A client is short of breath. What should the nurse do first?",
    correctAnswer: "Apply oxygen and assess respiratory status.",
    pathway: "RN",
  });

  assert.equal(result.score, 1);
  assert.equal(result.gate, "hard_fail");
  assert.ok(result.issues.includes("answer_option_leakage"));
});

test("rejects answer wording leakage", () => {
  const result = scoreHintQuality({
    id: "answer-word-leak",
    hint: "The correct answer focuses on oxygen and respiratory assessment.",
    stem: "A client with COPD reports worsening shortness of breath. What action should the nurse take first?",
    correctAnswer: "Apply oxygen and assess respiratory status.",
    pathway: "RN",
  });

  assert.equal(result.score, 1);
  assert.ok(result.issues.includes("answer_wording_leakage"));
});

test("rejects generic hints", () => {
  const result = scoreHintQuality({
    id: "generic",
    hint: "Think carefully.",
    stem: "A client has fever, hypotension, and new confusion. Which finding is most concerning?",
    correctAnswer: "New confusion with hypotension",
    pathway: "RN",
  });

  assert.equal(result.score, 2);
  assert.ok(result.issues.includes("generic_hint"));
});

test("rejects unsafe scope hints", () => {
  const result = scoreHintQuality({
    id: "unsafe-scope",
    hint: "Consider whether the nurse should independently prescribe a higher medication dose.",
    stem: "A client reports uncontrolled pain after surgery. What should the RN do next?",
    correctAnswer: "Reassess pain and notify the provider using facility policy.",
    pathway: "RN",
  });

  assert.equal(result.score, 1);
  assert.ok(result.issues.includes("unsafe_scope_prompt"));
});

test("ECG hints require an interpretation framework", () => {
  const weak = scoreHintQuality({
    id: "ecg-weak",
    hint: "Think about the patient's safety.",
    stem: "A telemetry strip shows an irregular rhythm. Which interpretation is most accurate?",
    correctAnswer: "Atrial fibrillation",
    pathway: "ECG",
  });
  const strong = scoreHintQuality({
    id: "ecg-strong",
    hint: "Use rate, regularity, P waves, PR interval, and QRS width before deciding what the rhythm means.",
    stem: "A telemetry strip shows an irregular rhythm. Which interpretation is most accurate?",
    correctAnswer: "Atrial fibrillation",
    pathway: "ECG",
  });

  assert.ok(weak.issues.includes("missing_ecg_framework"));
  assert.equal(strong.score, 5);
});

test("Lab hints require pattern or trend framing", () => {
  const result = scoreHintQuality({
    id: "lab-trend",
    hint: "Compare whether the abnormal value is isolated or part of a worsening trend before choosing the next action.",
    stem: "A client's creatinine has increased over three days. Which nursing concern is most important?",
    correctAnswer: "Worsening renal function",
    pathway: "LABS",
  });

  assert.equal(result.score, 5);
});

test("Medication math hints require unit setup", () => {
  const result = scoreHintQuality({
    id: "med-math",
    hint: "Set up the units first, convert the dose, and check whether the final mL amount is clinically reasonable.",
    stem: "A medication order requires converting mg to mL. What volume should be administered?",
    correctAnswer: "2 mL",
    pathway: "MEDICATION_MATH",
  });

  assert.equal(result.score, 5);
});

test("Pharmacology hints require safety or monitoring framing", () => {
  const result = scoreHintQuality({
    id: "pharm",
    hint: "Before administration, consider contraindications, monitoring needs, and which adverse effect would require holding or reporting.",
    stem: "A client taking a beta blocker has dizziness and bradycardia. What should the nurse do next?",
    correctAnswer: "Hold the medication and notify the provider per policy.",
    pathway: "PHARMACOLOGY",
  });

  assert.equal(result.score, 5);
});
