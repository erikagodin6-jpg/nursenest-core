import assert from "node:assert/strict";
import test from "node:test";

import { flashcardLearnerExamPoolWhereSql, flashcardLearnerExamQualityGatesSql } from "@/lib/flashcards/flashcard-learner-exam-pool-sql";
import { getExamPathwayById } from "@/lib/exam-pathways/exam-pathways-catalog";
import type { AccessScope } from "@/lib/entitlements/resolve-entitlement";

test("quality gates SQL references correct_answer jsonb and flashcard format exclusions", () => {
  const q = flashcardLearnerExamQualityGatesSql().strings.join("");
  assert.match(q, /jsonb_typeof/i);
  assert.match(q, /question_format/i);
  assert.match(q, /ecg-video/i);
});

test("learner pool SQL uses study_link_pathway_id OR and normalized pathway scope fragment", () => {
  const pathway = getExamPathwayById("us-rn-nclex-rn");
  assert.ok(pathway);
  const scope: AccessScope = {
    hasAccess: true,
    tier: "RN",
    country: "US",
  };
  const sql = flashcardLearnerExamPoolWhereSql(scope, pathway).strings.join("\n");
  assert.match(sql, /study_link_pathway_id/i);
  assert.match(sql, /regexp_replace/i);
  assert.match(sql, /coalesce\(exam/i);
});
