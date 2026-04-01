import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { buildNormalizedTeachingPayload } from "@/lib/content-quality/teaching-payload";

function headings(sections: Array<{ heading: string }>): string[] {
  return sections.map((s) => s.heading);
}

describe("buildNormalizedTeachingPayload", () => {
  it("orders core sections as correct → why → distractors → takeaway → exam strategy before supplements", () => {
    const row = {
      stem: "A client reports chest pressure. What is the nurse’s first action?",
      questionType: "MCQ",
      correctAnswer: "B",
      correctAnswerExplanation: "Assess airway, breathing, circulation first.",
      rationale: "Stabilize before further workup.",
      clinicalReasoning: "Stabilize before further workup.",
      keyTakeaway: "Safety and assessment precede diagnosis.",
      examStrategy: "Read stem for urgency cues.",
      distractorRationales: [{ label: "A", text: "Too narrow for first action." }],
    };
    const t = buildNormalizedTeachingPayload(row);
    const h = headings(t.sections);
    const iCorrect = h.indexOf("Correct answer");
    const iWhy = h.indexOf("Why this is correct");
    const iDist = h.indexOf("Why the other options are wrong");
    const iTake = h.indexOf("Clinical takeaway");
    const iExam = h.indexOf("Exam strategy");
    assert.ok(iCorrect < iWhy && iWhy < iDist && iDist < iTake && iTake < iExam);
    assert.ok(!h.includes("Clinical decision logic"));
  });

  it("does not duplicate rationale as a separate section when it matches explanation", () => {
    const row = {
      stem: "Stem",
      questionType: "MCQ",
      correctAnswer: "A",
      correctAnswerExplanation: "Same text.",
      rationale: "Same text.",
      clinicalReasoning: null,
    };
    const t = buildNormalizedTeachingPayload(row);
    const why = t.sections.find((s) => s.heading === "Why this is correct");
    assert.ok(why);
    assert.equal(why!.body, "Same text.");
  });

  it("uses SATA-aware default distractor guidance when JSON distractors are missing", () => {
    const row = {
      stem: "Select all that apply.",
      questionType: "SATA",
      correctAnswer: ["A", "C"],
      correctAnswerExplanation: "A and C meet criteria.",
      rationale: "Others are unsafe or incomplete.",
      distractorRationales: null,
      incorrectAnswerRationale: null,
    };
    const t = buildNormalizedTeachingPayload(row);
    const d = t.sections.find((s) => s.heading === "Why the other options are wrong");
    assert.ok(d?.body.includes("For each option"));
  });

  it("uses prioritization-style exam strategy fallback when type matches", () => {
    const row = {
      stem: "What should the nurse do first?",
      questionType: "PRIORITIZATION_ARTICLE",
      correctAnswer: "Call provider",
      correctAnswerExplanation: "Highest risk first.",
      rationale: "ABC priority.",
      examStrategy: null,
    };
    const t = buildNormalizedTeachingPayload(row);
    const e = t.sections.find((s) => s.heading === "Exam strategy");
    assert.ok(e?.body.includes("ABCs"));
  });
});
