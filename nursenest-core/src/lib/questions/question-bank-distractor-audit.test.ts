import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { pharmacyTechnicianQuestions } from "@/content/questions/allied-pharmacy-technician";
import { cnplePracticalNursingNgnExpansionQuestions } from "@/content/questions/cnple-practical-nursing-ngn-expansion";
import { nclexTier1FoundationalQuestions } from "@/content/questions/nclex-tier1-foundational-questions";
import { nclexTier2ClinicalJudgmentQuestions } from "@/content/questions/nclex-tier2-clinical-judgment-questions";
import { nclexTier3AdvancedReviewQuestions } from "@/content/questions/nclex-tier3-advanced-review-questions";
import {
  auditQuestionBankDistractors,
  optionRationaleMap,
  type QuestionBankDistractorAuditItem,
} from "@/lib/questions/question-bank-distractor-audit";

function nursingMcqItems(
  questions: readonly {
    id: string;
    stem: string;
    options: readonly { id: string; text: string; correct: boolean; rationale: string }[];
    correctAnswer: unknown;
  }[],
  tier: "RN" | "RPN",
  minimumDistractors = 3,
): QuestionBankDistractorAuditItem[] {
  return questions.map((question) => ({
    id: question.id,
    input: {
      tier,
      stem: question.stem,
      options: question.options,
      correctAnswer: question.correctAnswer,
      distractorRationales: optionRationaleMap(question.options),
      minimumDistractors,
    },
  }));
}

function pharmacyTechnicianItems(): QuestionBankDistractorAuditItem[] {
  return pharmacyTechnicianQuestions.map((question) => {
    const wrongIndexes = [0, 1, 2, 3].filter((index) => index !== question.correctIndex);
    return {
      id: question.id,
      input: {
        tier: "ALLIED",
        stem: question.stem,
        options: question.options.map((text, index) => ({
          id: String.fromCharCode(65 + index),
          text,
          correct: index === question.correctIndex,
        })),
        correctAnswer: String.fromCharCode(65 + question.correctIndex),
        distractorRationales: Object.fromEntries(
          question.incorrectRationales.map((rationale, index) => [
            String.fromCharCode(65 + wrongIndexes[index]!),
            rationale,
          ]),
        ),
      },
    };
  });
}

describe("question bank distractor quality audit", () => {
  it("keeps active single-best nursing banks free of obvious throwaway distractors", () => {
    const audit = auditQuestionBankDistractors([
      ...nursingMcqItems(nclexTier1FoundationalQuestions, "RN"),
      ...nursingMcqItems(nclexTier2ClinicalJudgmentQuestions, "RN"),
      ...nursingMcqItems(nclexTier3AdvancedReviewQuestions, "RN"),
      ...nursingMcqItems(
        cnplePracticalNursingNgnExpansionQuestions.filter((question) => question.questionType === "prioritization"),
        "RPN",
      ),
    ]);

    assert.deepEqual(audit.failures, []);
  });

  it("audits SATA and bow-tie banks without requiring exactly one correct option", () => {
    const audit = auditQuestionBankDistractors(
      nursingMcqItems(
        cnplePracticalNursingNgnExpansionQuestions.filter((question) =>
          question.questionType === "sata" || question.questionType === "bowtie"
        ),
        "RPN",
        2,
      ),
    );

    assert.deepEqual(audit.failures, []);
  });

  it("keeps allied health pharmacy technician distractors clinically plausible and teaching-rich", () => {
    const audit = auditQuestionBankDistractors(pharmacyTechnicianItems());
    assert.deepEqual(audit.failures, []);
  });
});
