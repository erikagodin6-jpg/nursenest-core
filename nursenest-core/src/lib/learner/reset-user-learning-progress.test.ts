/**
 * Run: `NODE_ENV=test node --import tsx --test src/lib/learner/reset-user-learning-progress.test.ts`
 */
import "../../../../scripts/stub-server-only.cjs";
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { Prisma, type PrismaClient } from "@prisma/client";
import { resetUserLearningProgress } from "@/lib/learner/reset-user-learning-progress";

const UID = "user_reset_prog_test_1";

describe("resetUserLearningProgress", () => {
  it("throws for short user id", async () => {
    const db = { $transaction: async () => {} } as unknown as PrismaClient;
    await assert.rejects(() => resetUserLearningProgress(db, "short"), /invalid userId/);
  });

  it("scopes every delete to the session user and clears progress counters without touching subscriptions", async () => {
    const ops: string[] = [];
    const del =
      (model: string, key: "userId" | "user_id") =>
      async ({ where }: { where: Record<string, string> }) => {
        assert.equal(where[key], UID);
        ops.push(`${model}.deleteMany`);
        return { count: 0 };
      };

    const tx = {
      examSession: { deleteMany: del("examSession", "userId") },
      examAttempt: { deleteMany: del("examAttempt", "userId") },
      practiceTest: { deleteMany: del("practiceTest", "userId") },
      progress: { deleteMany: del("progress", "userId") },
      flashcardProgress: { deleteMany: del("flashcardProgress", "userId") },
      flashcardStudySession: { deleteMany: del("flashcardStudySession", "userId") },
      flashcardUserStats: {
        delete: async ({ where }: { where: { userId: string } }) => {
          assert.equal(where.userId, UID);
          ops.push("flashcardUserStats.delete");
          return {};
        },
      },
      verifiedStudyCardProgress: { deleteMany: del("verifiedStudyCardProgress", "userId") },
      examQuestionPracticeAnswerAttempt: { deleteMany: del("examQuestionPracticeAnswerAttempt", "userId") },
      ecgVideoQuestionPracticeAnswerAttempt: { deleteMany: del("ecgVideoQuestionPracticeAnswerAttempt", "userId") },
      userTopicStat: { deleteMany: del("userTopicStat", "userId") },
      userRemediationEvent: { deleteMany: del("userRemediationEvent", "userId") },
      userRemediationQueue: { deleteMany: del("userRemediationQueue", "userId") },
      baselineAssessmentAttempt: { deleteMany: del("baselineAssessmentAttempt", "userId") },
      clinicalScenarioSimulationRun: { deleteMany: del("clinicalScenarioSimulationRun", "userId") },
      accuracy_trends: { deleteMany: del("accuracy_trends", "user_id") },
      analytics_events: { deleteMany: del("analytics_events", "user_id") },
      custom_practice_sessions: { deleteMany: del("custom_practice_sessions", "user_id") },
      exam_attempts: { deleteMany: del("exam_attempts", "user_id") },
      exam_followup_responses: { deleteMany: del("exam_followup_responses", "user_id") },
      lesson_bookmarks: { deleteMany: del("lesson_bookmarks", "user_id") },
      practice_recommendations: { deleteMany: del("practice_recommendations", "user_id") },
      readiness_history: { deleteMany: del("readiness_history", "user_id") },
      spaced_repetition_cards: { deleteMany: del("spaced_repetition_cards", "user_id") },
      student_study_profiles: { deleteMany: del("student_study_profiles", "user_id") },
      study_milestones: { deleteMany: del("study_milestones", "user_id") },
      study_plan_schedule: { deleteMany: del("study_plan_schedule", "user_id") },
      test_bank_progress: { deleteMany: del("test_bank_progress", "user_id") },
      topic_mastery_scores: { deleteMany: del("topic_mastery_scores", "user_id") },
      unified_question_history: { deleteMany: del("unified_question_history", "user_id") },
      weak_area_alerts: { deleteMany: del("weak_area_alerts", "user_id") },
      flashcard_preview_usage: { deleteMany: del("flashcard_preview_usage", "user_id") },
      exam_planner_settings: {
        updateMany: async ({ where, data }: { where: { user_id: string }; data: Record<string, unknown> }) => {
          assert.equal(where.user_id, UID);
          assert.deepEqual(data.generated_plan, Prisma.JsonNull);
          assert.equal(data.planner_last_updated, null);
          ops.push("exam_planner_settings.updateMany");
          return { count: 0 };
        },
      },
      user: {
        update: async ({ where, data }: { where: { id: string }; data: Record<string, unknown> }) => {
          assert.equal(where.id, UID);
          assert.equal(data.freeQuestionViews, 0);
          assert.equal(data.bankQuestionsGradedCount, 0);
          assert.deepEqual(data.baselineAssessmentSummary, Prisma.JsonNull);
          assert.ok(!("email" in data));
          assert.ok(!("tier" in data));
          assert.ok(!("subscriptions" in data));
          ops.push("User.update");
          return {};
        },
      },
    };

    const db = {
      $transaction: async (fn: (t: typeof tx) => Promise<void>) => {
        await fn(tx);
      },
    } as unknown as PrismaClient;

    const out = await resetUserLearningProgress(db, UID);
    assert.deepEqual(out, { ok: true });
    assert.ok(ops.includes("progress.deleteMany"));
    assert.ok(ops.includes("practiceTest.deleteMany"));
    assert.ok(ops.includes("examSession.deleteMany"));
    assert.ok(ops.includes("User.update"));
    assert.ok(ops.includes("exam_planner_settings.updateMany"));
    assert.ok(!ops.some((o) => o.startsWith("subscription")));
  });
});
