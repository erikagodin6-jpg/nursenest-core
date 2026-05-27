import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  classifyQuestionDifficultyScope,
  parseQuestionDifficultyScopeMode,
  QUESTION_DIFFICULTY_SCOPE_STANDARD_MAX_DIFFICULTY,
  questionDifficultyScopeSqlForMode,
  questionDifficultyScopeWhereForMode,
  standardExamPrepQuestionScopeWhere,
} from "./difficulty-scope-filter";

describe("question difficulty/scope filtering", () => {
  it("classifies foundational and clinical-judgment rows as standard exam prep", () => {
    assert.deepEqual(
      classifyQuestionDifficultyScope({
        difficulty: 2,
        topic: "COPD",
        stem: "A client with COPD reports increased dyspnea. Which nursing action is priority?",
      }).audience,
      "standard_exam_prep",
    );
    assert.equal(
      classifyQuestionDifficultyScope({
        difficulty: 4,
        topic: "Sepsis recognition",
        stem: "A client has new confusion, tachypnea, and hypotension.",
      }).difficultyTier,
      "tier2_clinical_judgment",
    );
  });

  it("classifies ICU, ventilator, hemodynamic, and difficulty-5 rows as advanced review", () => {
    const advanced = [
      classifyQuestionDifficultyScope({ difficulty: 5, topic: "Prioritization" }),
      classifyQuestionDifficultyScope({ difficulty: 3, tags: ["icu"] }),
      classifyQuestionDifficultyScope({ difficulty: 3, stem: "A mechanically ventilated client has a high-pressure alarm." }),
      classifyQuestionDifficultyScope({ difficulty: 3, subtopic: "invasive hemodynamic monitoring" }),
      classifyQuestionDifficultyScope({ difficulty: 3, stem: "The nurse is asked to titrate norepinephrine based on arterial line readings." }),
      classifyQuestionDifficultyScope({ difficulty: 3, stem: "A client receiving CRRT and ECMO has a sudden circuit alarm." }),
    ];

    for (const item of advanced) {
      assert.equal(item.difficultyTier, "tier3_advanced");
      assert.notEqual(item.audience, "standard_exam_prep");
    }
  });

  it("keeps broad entry-level NCLEX safety items in standard prep", () => {
    const standard = classifyQuestionDifficultyScope({
      difficulty: 3,
      topic: "Respiratory distress",
      stem:
        "A client with pneumonia has new confusion and an oxygen saturation of 86%. Which action should the nurse take first?",
      tags: ["prioritization", "safety"],
    });

    assert.equal(standard.audience, "standard_exam_prep");
    assert.equal(standard.scope, "nclex");
  });

  it("defaults unknown scope params to standard exam prep", () => {
    assert.equal(parseQuestionDifficultyScopeMode(null), "standard_exam_prep");
    assert.equal(parseQuestionDifficultyScopeMode(""), "standard_exam_prep");
    assert.equal(parseQuestionDifficultyScopeMode("advanced_review"), "advanced_review");
    assert.equal(parseQuestionDifficultyScopeMode("tier3"), "advanced_review");
    assert.equal(parseQuestionDifficultyScopeMode("all"), "all");
  });

  it("builds Prisma filters for standard and advanced modes", () => {
    assert.equal(QUESTION_DIFFICULTY_SCOPE_STANDARD_MAX_DIFFICULTY, 4);
    assert.deepEqual(questionDifficultyScopeWhereForMode("standard_exam_prep"), standardExamPrepQuestionScopeWhere());
    assert.equal(questionDifficultyScopeWhereForMode("all"), null);
    assert.ok(questionDifficultyScopeWhereForMode("advanced_review"));
  });

  it("builds SQL fragments for each mode without requiring schema changes", () => {
    assert.ok(questionDifficultyScopeSqlForMode("standard_exam_prep"));
    assert.ok(questionDifficultyScopeSqlForMode("advanced_review"));
    assert.ok(questionDifficultyScopeSqlForMode("all"));
  });
});
