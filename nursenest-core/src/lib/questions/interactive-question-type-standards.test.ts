import assert from "node:assert/strict";
import test from "node:test";

import {
  INTERACTIVE_QUESTION_TYPE_STANDARDS,
  questionTypeStandardFor,
  validateInteractiveQuestionDefinition,
} from "@/lib/questions/interactive-question-type-standards";
import {
  normalizePracticeQuestionType,
  practiceQuestionSupportsImmediateRationale,
  type PracticeQuestionType,
} from "@/lib/practice-tests/practice-question-rendering-engine";

const expectedTypes: PracticeQuestionType[] = [
  "single",
  "multiple",
  "ordered",
  "matrix",
  "bowtie",
  "cloze",
  "hotspot",
  "case-study",
  "chart-review",
  "highlight",
  "trend",
  "extended-matching",
  "multimedia",
  "decision-tree",
  "delegation",
  "triage",
  "medication-safety",
  "communication-documentation",
  "ranking",
  "clinical-judgment",
];

const fullSignals = [
  "partial_correctness",
  "unsafe_pattern_tracking",
  "hesitation_tracking",
  "misconception_tracking",
  "confidence_calibration",
  "adaptive_difficulty",
  "progressive_hints",
  "deep_rationale",
  "touch_accessibility",
] as const;

test("registers a standard for every modern interactive question type", () => {
  assert.deepEqual(Object.keys(INTERACTIVE_QUESTION_TYPE_STANDARDS).sort(), [...expectedTypes].sort());
  for (const type of expectedTypes) {
    const standard = questionTypeStandardFor(type);
    assert.equal(standard.type, type);
    assert.ok(standard.requiredPayload.length > 0);
    assert.ok(standard.allowedScoringRules.length > 0);
    assert.ok(standard.requiredClinicalReasoning.length > 0);
    assert.ok(standard.tierFit.RN);
    assert.ok(standard.tierFit.RPN);
    assert.ok(standard.tierFit.NP);
    assert.ok(standard.tierFit.ALLIED);
  }
});

test("normalizes additional modern exam-style aliases", () => {
  assert.equal(normalizePracticeQuestionType("EHR simulation"), "chart-review");
  assert.equal(normalizePracticeQuestionType("extended matching"), "extended-matching");
  assert.equal(normalizePracticeQuestionType("ECG"), "multimedia");
  assert.equal(normalizePracticeQuestionType("decision tree"), "decision-tree");
  assert.equal(normalizePracticeQuestionType("assignment"), "delegation");
  assert.equal(normalizePracticeQuestionType("first to see"), "triage");
  assert.equal(normalizePracticeQuestionType("high-alert"), "medication-safety");
  assert.equal(normalizePracticeQuestionType("SBAR"), "communication-documentation");
});

test("validates complete chart review payloads for adaptive learning integration", () => {
  const result = validateInteractiveQuestionDefinition({
    type: "chart-review",
    tier: "RN",
    payloadKeys: ["chartTabs", "orders", "labs", "notes", "questionTasks"],
    scoringRule: "multi-part",
    adaptiveSignals: fullSignals,
    rationaleSections: ["why_correct", "why_incorrect", "patient_safety"],
    accessibility: {
      keyboardOperable: true,
      touchTargetSafe: true,
      screenReaderLabels: true,
    },
  });

  assert.equal(result.pass, true);
  assert.equal(result.issues.length, 0);
});

test("rejects interactive formats that do not provide renderer payload, scoring, adaptive signals, rationale, and accessibility", () => {
  const result = validateInteractiveQuestionDefinition({
    type: "bowtie",
    tier: "RN",
    payloadKeys: ["scenario", "conditionOptions"],
    scoringRule: "exact",
    adaptiveSignals: ["confidence_calibration"],
    rationaleSections: ["why_correct"],
    accessibility: {
      keyboardOperable: true,
      touchTargetSafe: false,
      screenReaderLabels: false,
    },
  });

  assert.equal(result.pass, false);
  assert.ok(result.issues.some((issue) => issue.code === "MISSING_REQUIRED_PAYLOAD"));
  assert.ok(result.issues.some((issue) => issue.code === "INVALID_SCORING_RULE"));
  assert.ok(result.issues.some((issue) => issue.code === "MISSING_ADAPTIVE_SIGNAL"));
  assert.ok(result.issues.some((issue) => issue.code === "MISSING_RATIONALE_SUPPORT"));
  assert.ok(result.issues.some((issue) => issue.code === "MISSING_ACCESSIBILITY_SUPPORT"));
});

test("keeps RPN advanced format support scope-safe with a warning instead of a UI fork", () => {
  const result = validateInteractiveQuestionDefinition({
    type: "decision-tree",
    tier: "RPN",
    payloadKeys: ["initialState", "branches", "outcomes", "unsafeChoices"],
    scoringRule: "decision-tree",
    adaptiveSignals: fullSignals,
    rationaleSections: ["why_correct", "why_incorrect", "patient_safety"],
    accessibility: {
      keyboardOperable: true,
      touchTargetSafe: true,
      screenReaderLabels: true,
    },
  });

  assert.equal(result.pass, true);
  assert.ok(result.issues.some((issue) => issue.code === "TIER_SCOPE_WARNING"));
});

test("defers rationale for evolving case and decision-tree simulations", () => {
  assert.equal(practiceQuestionSupportsImmediateRationale("case-study"), false);
  assert.equal(practiceQuestionSupportsImmediateRationale("decision-tree"), false);
  assert.equal(practiceQuestionSupportsImmediateRationale("chart-review"), true);
});
