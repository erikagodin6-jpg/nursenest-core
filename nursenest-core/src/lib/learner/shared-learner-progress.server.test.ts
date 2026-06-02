/**
 * Run: `node --import tsx --test src/lib/learner/shared-learner-progress.server.test.ts`
 */
import "../../../scripts/stub-server-only.cjs";
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { emptyPerformanceProfile } from "@/lib/cat/performance-tracker";
import {
  buildSharedRecentActivityRows,
  extractPerformanceProfileFromAdaptiveJson,
  mergePerformanceProfilesPreferringMoreAttempts,
  mergedPerformanceFromLatestAdaptiveRows,
} from "@/lib/learner/shared-learner-progress.server";

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

describe("shared learner progress (simulated DB slices)", () => {
  it("buildSharedRecentActivityRows includes lesson + flashcard kinds (labels are metadata-only)", () => {
    const t = new Date("2026-01-10T12:00:00.000Z");
    const rows = buildSharedRecentActivityRows({
      progActs: [{ lessonId: "les_1", updatedAt: t, completed: true }],
      ptActs: [],
      exSessActs: [],
      attActs: [],
      fcActs: [{ updatedAt: new Date("2026-01-10T13:00:00.000Z"), deckId: "deck_flashcards_abc" }],
    });
    const kinds = rows.map((r) => r.kind).sort();
    assert.ok(kinds.includes("lesson_progress"));
    assert.ok(kinds.includes("flashcard_session"));
    assert.ok(rows.every((r) => !r.label.toLowerCase().includes("stem")));
  });

  it("buildSharedRecentActivityRows returns empty when all slices are empty", () => {
    assert.equal(
      buildSharedRecentActivityRows({
        progActs: [],
        ptActs: [],
        exSessActs: [],
        attActs: [],
        fcActs: [],
      }).length,
      0,
    );
  });

  it("mergedPerformanceFromLatestAdaptiveRows is deterministic for identical inputs (same userId / same store)", () => {
    const raw = { _v: 1 as const, performance: emptyPerformanceProfile() };
    raw.performance.bySystem = {
      cardio: { attempted: 3, correct: 2, accuracy: 0.66, recentAccuracy: 0.66, weightedAccuracy: 0.66, uniqueQuestionsSeen: 3 },
    };
    const a = mergedPerformanceFromLatestAdaptiveRows({ practiceAdaptiveState: raw, examAdaptiveState: null });
    const b = mergedPerformanceFromLatestAdaptiveRows({ practiceAdaptiveState: raw, examAdaptiveState: null });
    assert.deepEqual(a, b);
  });
});
