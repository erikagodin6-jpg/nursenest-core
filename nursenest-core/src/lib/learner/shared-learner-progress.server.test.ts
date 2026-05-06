/**
 * Run: `node --import tsx --test src/lib/learner/shared-learner-progress.server.test.ts`
 */
import "../../../scripts/stub-server-only.cjs";
import assert from "node:assert/strict";
import { afterEach, describe, it, mock } from "node:test";
import { emptyPerformanceProfile } from "@/lib/cat/performance-tracker";
import { prisma } from "@/lib/db";
import {
  extractPerformanceProfileFromAdaptiveJson,
  loadSharedLearnerProgressBundle,
  mergePerformanceProfilesPreferringMoreAttempts,
  mergedPerformanceFromLatestAdaptiveRows,
} from "@/lib/learner/shared-learner-progress.server";

const userId = "usr_shared_progress_phase5d";

afterEach(() => {
  mock.restoreAll();
});

describe("shared learner progress (pure)", () => {
  it("mergePerformanceProfilesPreferringMoreAttempts picks richer bySystem totals", () => {
    const a = emptyPerformanceProfile();
    const b = emptyPerformanceProfile();
    a.bySystem = {
      cardio: { attempted: 2, correct: 1, accuracy: 0.5, recentAccuracy: 0.5, weightedAccuracy: 0.5, uniqueQuestionsSeen: 2 },
    };
    b.bySystem = {
      cardio: { attempted: 10, correct: 5, accuracy: 0.5, recentAccuracy: 0.5, weightedAccuracy: 0.5, uniqueQuestionsSeen: 10 },
    };
    const out = mergePerformanceProfilesPreferringMoreAttempts(a, b);
    assert.equal(out.bySystem.cardio?.attempted, 10);
  });

  it("mergedPerformanceFromLatestAdaptiveRows reads _v:1 performance JSON only", () => {
    const light = { _v: 1 as const, performance: emptyPerformanceProfile() };
    light.performance.bySystem = {
      neuro: { attempted: 1, correct: 0, accuracy: 0, recentAccuracy: 0, weightedAccuracy: 0, uniqueQuestionsSeen: 1 },
    };
    const heavy = { _v: 1 as const, performance: emptyPerformanceProfile() };
    heavy.performance.bySystem = {
      neuro: { attempted: 9, correct: 4, accuracy: 0.44, recentAccuracy: 0.44, weightedAccuracy: 0.44, uniqueQuestionsSeen: 9 },
    };
    const merged = mergedPerformanceFromLatestAdaptiveRows({
      practiceAdaptiveState: light,
      examAdaptiveState: heavy,
    });
    assert.equal(merged.bySystem.neuro?.attempted, 9);
  });

  it("extractPerformanceProfileFromAdaptiveJson rejects unknown _v", () => {
    assert.equal(extractPerformanceProfileFromAdaptiveJson({ _v: 2, performance: {} }), null);
  });
});

describe("shared learner progress (Prisma mocked)", () => {
  it("loadSharedLearnerProgressBundle surfaces lesson + flashcard rows in recentActivity (no question stems)", async () => {
    const t = new Date("2026-01-10T12:00:00.000Z");
    mock.method(prisma.userTopicStat, "findMany", async () => [
      {
        topic: "fluid_balance",
        correctCount: 1,
        wrongCount: 2,
        wrongStreak: 1,
        lastAttemptAt: t,
      },
    ]);
    mock.method(prisma.practiceTest, "findFirst", async () => ({ adaptiveState: null }));
    mock.method(prisma.examSession, "findFirst", async () => ({ adaptiveState: null }));
    mock.method(prisma.progress, "findMany", async () => [
      { lessonId: "les_1", updatedAt: t, completed: true },
    ]);
    mock.method(prisma.practiceTest, "findMany", async () => []);
    mock.method(prisma.examSession, "findMany", async () => []);
    mock.method(prisma.examAttempt, "findMany", async () => []);
    mock.method(prisma.flashcardStudySession, "findMany", async () => [
      { updatedAt: new Date("2026-01-10T13:00:00.000Z"), deckId: "deck_flashcards_abc" },
    ]);

    const bundle = await loadSharedLearnerProgressBundle(userId);
    assert.ok(bundle);
    const kinds = bundle!.recentActivity.map((r) => r.kind).sort();
    assert.ok(kinds.includes("lesson_progress"));
    assert.ok(kinds.includes("flashcard_session"));
    assert.ok(bundle!.recentActivity.every((r) => !r.label.toLowerCase().includes("stem")));
    assert.equal(bundle!.topicRows[0]?.topic, "fluid_balance");
  });

  it("loadSharedLearnerProgressBundle returns empty-safe topic + activity when DB slices are empty", async () => {
    mock.method(prisma.userTopicStat, "findMany", async () => []);
    mock.method(prisma.practiceTest, "findFirst", async () => null);
    mock.method(prisma.examSession, "findFirst", async () => null);
    mock.method(prisma.progress, "findMany", async () => []);
    mock.method(prisma.practiceTest, "findMany", async () => []);
    mock.method(prisma.examSession, "findMany", async () => []);
    mock.method(prisma.examAttempt, "findMany", async () => []);
    mock.method(prisma.flashcardStudySession, "findMany", async () => []);

    const bundle = await loadSharedLearnerProgressBundle(userId);
    assert.ok(bundle);
    assert.equal(bundle!.topicRows.length, 0);
    assert.equal(bundle!.recentActivity.length, 0);
  });

  it("two calls with same userId see identical mergedPerformanceProfile when mocks are stable (mobile = same store)", async () => {
    mock.method(prisma.userTopicStat, "findMany", async () => []);
    mock.method(prisma.practiceTest, "findFirst", async () => ({
      adaptiveState: { _v: 1, performance: emptyPerformanceProfile() },
    }));
    mock.method(prisma.examSession, "findFirst", async () => null);
    mock.method(prisma.progress, "findMany", async () => []);
    mock.method(prisma.practiceTest, "findMany", async () => []);
    mock.method(prisma.examSession, "findMany", async () => []);
    mock.method(prisma.examAttempt, "findMany", async () => []);
    mock.method(prisma.flashcardStudySession, "findMany", async () => []);

    const a = await loadSharedLearnerProgressBundle(userId);
    const b = await loadSharedLearnerProgressBundle(userId);
    assert.deepEqual(a?.mergedPerformanceProfile, b?.mergedPerformanceProfile);
  });
});
