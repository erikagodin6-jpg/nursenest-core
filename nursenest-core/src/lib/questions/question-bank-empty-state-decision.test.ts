import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { PathwayQuestionBankSnapshot } from "@/lib/exam-pathways/pathway-question-bank-snapshot";
import { resolveQuestionBankLauncherDecision } from "@/lib/questions/question-bank-empty-state-decision";

function ok(partial: Partial<Extract<PathwayQuestionBankSnapshot, { status: "ok" }>>): PathwayQuestionBankSnapshot {
  return {
    status: "ok",
    publishedQuestionCount: 1,
    visibleQuestionCount: 1,
    activeQuestionCount: 1,
    pathwayScopedCount: 1,
    adaptiveEligibleCount: 1,
    examKeys: [],
    ...partial,
  };
}

describe("question-bank-empty-state-decision", () => {
  it("shows the publishing banner only when the published count is zero", () => {
    const decision = resolveQuestionBankLauncherDecision(
      ok({ publishedQuestionCount: 0, visibleQuestionCount: 0, activeQuestionCount: 0, pathwayScopedCount: 0 }),
      false,
    );

    assert.equal(decision.status, "publishing");
    assert.equal(decision.reason, "published_question_count_zero");
  });

  it("uses an unavailable state when the snapshot cannot verify counts", () => {
    const decision = resolveQuestionBankLauncherDecision({ status: "unavailable" }, false);

    assert.equal(decision.status, "unavailable");
    assert.equal(decision.reason, "question_snapshot_unavailable");
  });

  it("does not show publishing when published questions exist but visible filters exclude them", () => {
    const decision = resolveQuestionBankLauncherDecision(
      ok({ publishedQuestionCount: 12, visibleQuestionCount: 0, activeQuestionCount: 0, pathwayScopedCount: 0 }),
      false,
    );

    assert.equal(decision.status, "unavailable");
    assert.equal(decision.reason, "published_questions_filtered_out");
  });

  it("does not show publishing when published questions exist but the launcher pool is not usable", () => {
    const decision = resolveQuestionBankLauncherDecision(ok({ publishedQuestionCount: 12, visibleQuestionCount: 12 }), false);

    assert.equal(decision.status, "unavailable");
    assert.equal(decision.reason, "session_pool_not_usable_with_published_questions");
  });
});
