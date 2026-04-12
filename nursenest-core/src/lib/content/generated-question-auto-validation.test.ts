/**
 * Run: `npx tsx --test src/lib/content/generated-question-auto-validation.test.ts`
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { QuestionType } from "@prisma/client";
import { validateNormalizedQuestion } from "./ai-draft-validation";
import {
  NEAR_DUP_JACCARD_THRESHOLD,
  normalizeGeneratedStemForNearDupList,
  stemBigramJaccard,
  validateGeneratedQuestionAuto,
  type GeneratedQuestionDraftShape,
} from "./generated-question-auto-validation";

function baseGood(): GeneratedQuestionDraftShape {
  return {
    stem: "A 68-year-old patient with COPD reports worsening dyspnea. Vitals: RR 28, SpO2 88% on room air. Which action should the nurse take first?",
    rationale:
      "Because hypoxemia with increased work of breathing is an immediate safety concern, the nurse should prioritize improving oxygenation per provider orders and assessment protocols. Therefore supplemental oxygen and reassessment come before deferrable tasks.",
    options: [
      "Apply prescribed supplemental oxygen and reassess",
      "Schedule outpatient pulmonary rehab only",
      "Obtain a routine CBC in 4 hours",
      "Discharge with oral antibiotics",
    ],
    answerKey: ["Apply prescribed supplemental oxygen and reassess"],
    questionType: QuestionType.MCQ,
    topicTag: "respiratory",
  };
}

describe("validateGeneratedQuestionAuto", () => {
  it("passes a realistic clinical MCQ with full tags", () => {
    const r = validateGeneratedQuestionAuto(baseGood(), {
      expectedTags: { tier: "rn", exam: "NCLEX_RN", topic: "Airway" },
    });
    assert.equal(r.passed, true);
    assert.equal(r.rejectionReasons.length, 0);
  });

  it("rejects: fewer than four options (structure)", () => {
    const q = {
      ...baseGood(),
      options: ["A", "B", "C"],
      answerKey: ["A"],
    };
    const r = validateGeneratedQuestionAuto(q, {
      expectedTags: { tier: "rn", exam: "NCLEX_RN", topic: "x" },
    });
    assert.equal(r.passed, false);
    assert.ok(r.rejectionReasons.some((x) => x.includes("four answer choices")));
  });

  it("rejects: banned distractor pattern", () => {
    const q = {
      ...baseGood(),
      options: ["Correct action", "All of the above", "Another", "None of the above"],
    };
    const r = validateGeneratedQuestionAuto(q, {
      expectedTags: { tier: "rn", exam: "NCLEX_RN", topic: "x" },
    });
    assert.equal(r.passed, false);
    assert.ok(r.rejectionReasons.some((x) => x.toLowerCase().includes("banned")));
  });

  it("rejects: definition-only / no patient context", () => {
    const q: GeneratedQuestionDraftShape = {
      stem: "Which of the following defines the term therapeutic communication?",
      rationale:
        "Therapeutic communication uses purposeful techniques to support the client. This is important because it builds trust.",
      options: ["Technique A", "Technique B", "Technique C", "Technique D"],
      answerKey: ["Technique A"],
      questionType: QuestionType.MCQ,
      topicTag: "fundamentals",
    };
    const r = validateGeneratedQuestionAuto(q, {
      expectedTags: { tier: "rn", exam: "NCLEX_RN", topic: "communication" },
    });
    assert.equal(r.passed, false);
    assert.ok(
      r.rejectionReasons.some(
        (x) => x.includes("Clinical realism") || x.includes("textbook definition"),
      ),
    );
  });

  it("rejects: rationale too short", () => {
    const q = { ...baseGood(), rationale: "A is correct." };
    const r = validateGeneratedQuestionAuto(q, {
      expectedTags: { tier: "rn", exam: "NCLEX_RN", topic: "x" },
    });
    assert.equal(r.passed, false);
    assert.ok(r.rejectionReasons.some((x) => x.includes("rationale")));
  });

  it("rejects: SATA with only one correct", () => {
    const q: GeneratedQuestionDraftShape = {
      ...baseGood(),
      questionType: QuestionType.SATA,
      answerKey: ["Apply prescribed supplemental oxygen and reassess"],
    };
    const r = validateGeneratedQuestionAuto(q, {
      expectedTags: { tier: "rn", exam: "NCLEX_RN", topic: "x" },
    });
    assert.equal(r.passed, false);
    assert.ok(r.rejectionReasons.some((x) => x.includes("SATA")));
  });

  it("rejects: near-duplicate stem vs prior batch stems", () => {
    const a = baseGood();
    const b = {
      ...a,
      stem: `${a.stem} Additionally the nurse reviews the chart.`,
    };
    const r = validateGeneratedQuestionAuto(a, {
      priorNormalizedStems: [normalizeGeneratedStemForNearDupList(b.stem)],
    });
    assert.equal(r.passed, false);
    assert.ok(r.rejectionReasons.some((x) => x.includes("similar")));
  });

  it("rejects: required subtopic missing from tags/stem", () => {
    const r = validateGeneratedQuestionAuto(baseGood(), {
      expectedTags: {
        tier: "rn",
        exam: "NCLEX_RN",
        topic: "Airway",
        subtopic: "must-appear-xyz-unique",
      },
    });
    assert.equal(r.passed, false);
    assert.ok(r.rejectionReasons.some((x) => x.includes("subtopic")));
  });
});

describe("stemBigramJaccard", () => {
  it("scores 1 for identical stems", () => {
    const s = "The nurse assesses a patient with chest pain and orders an EKG per protocol.";
    assert.equal(stemBigramJaccard(s, s), 1);
  });

  it("scores lower when the clinical scenario diverges", () => {
    const s1 = "The nurse assesses a patient with chest pain and orders an EKG per protocol.";
    const s2 = "The nurse teaches a new parent about newborn cord care and hand hygiene.";
    const j = stemBigramJaccard(s1, s2);
    assert.ok(j < NEAR_DUP_JACCARD_THRESHOLD, `expected below ${NEAR_DUP_JACCARD_THRESHOLD}, got ${j}`);
  });
});

describe("validateNormalizedQuestion integrates auto layer", () => {
  it("returns autoValidation and merges failures into errors", () => {
    const dup = new Set<string>();
    const bad = {
      ...baseGood(),
      options: ["A", "B"],
      answerKey: ["A"],
    };
    const v = validateNormalizedQuestion(bad, {
      duplicateStemHashes: dup,
      expectedTags: { tier: "rn", exam: "NCLEX_RN", topic: "t" },
    });
    assert.equal(v.ok, false);
    assert.equal(v.autoValidation?.passed, false);
    assert.ok(v.errors.length > 0);
  });
});
