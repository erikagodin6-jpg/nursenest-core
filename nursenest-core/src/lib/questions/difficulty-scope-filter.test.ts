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
        difficulty: 5,
        topic: "Sepsis recognition",
        stem: "A client has new confusion, tachypnea, and hypotension.",
      }).difficultyTier,
      "tier3_advanced",
    );
    assert.equal(
      classifyQuestionDifficultyScope({
        difficulty: 5,
        topic: "Sepsis recognition",
        stem: "A client has new confusion, tachypnea, and hypotension.",
      }).audience,
      "standard_exam_prep",
    );
  });

  it("classifies ICU, ventilator, BiPAP, and hemodynamic rows as specialty review", () => {
    const advanced = [
      classifyQuestionDifficultyScope({ difficulty: 3, tags: ["icu"] }),
      classifyQuestionDifficultyScope({ difficulty: 3, stem: "A mechanically ventilated client has a high-pressure alarm." }),
      classifyQuestionDifficultyScope({ difficulty: 3, stem: "If plateau pressure increases while peak pressure remains similar, what changed?" }),
      classifyQuestionDifficultyScope({ difficulty: 3, stem: "The provider changes BiPAP IPAP and EPAP pressure settings." }),
      classifyQuestionDifficultyScope({ difficulty: 3, stem: "The ICU nurse adjusts PEEP after reviewing ventilator waveform interpretation." }),
      classifyQuestionDifficultyScope({ difficulty: 3, topic: "Lung compliance and airway resistance" }),
      classifyQuestionDifficultyScope({ difficulty: 3, subtopic: "invasive hemodynamic monitoring" }),
      classifyQuestionDifficultyScope({ difficulty: 3, stem: "The nurse is asked to titrate norepinephrine based on arterial line readings." }),
      classifyQuestionDifficultyScope({ difficulty: 3, stem: "A client receiving propofol infusion needs sedation titration." }),
      classifyQuestionDifficultyScope({ difficulty: 3, stem: "A client receiving CRRT and ECMO has a sudden circuit alarm." }),
    ];

    for (const item of advanced) {
      assert.equal(item.difficultyTier, "tier3_advanced");
      assert.notEqual(item.audience, "standard_exam_prep");
      assert.equal(item.governance.isFoundationalSafe, false);
      assert.ok(item.governance.excludedStreams.includes("RN"));
      assert.ok(item.governance.excludedStreams.includes("RPN"));
      assert.ok(item.governance.allowedStreams.includes("CRITICAL_CARE"));
    }
  });

  it("routes provider-level decision making to NP rather than foundational RN or PN", () => {
    const provider = classifyQuestionDifficultyScope({
      difficulty: 4,
      topic: "Differential diagnosis",
      stem: "Which differential diagnosis and initial medication plan should the nurse practitioner select?",
      tags: ["provider-level"],
    });

    assert.equal(provider.governance.profession, "nurse_practitioner");
    assert.deepEqual(provider.governance.allowedStreams, ["NP"]);
    assert.ok(provider.governance.excludedStreams.includes("NCLEX_RN"));
    assert.ok(provider.governance.excludedStreams.includes("NCLEX_PN"));
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
    assert.equal(standard.governance.isFoundationalSafe, true);
    assert.ok(standard.governance.allowedStreams.includes("RN"));
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
