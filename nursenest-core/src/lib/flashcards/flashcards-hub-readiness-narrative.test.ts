import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { buildFlashcardsReadinessNarrative } from "@/lib/flashcards/flashcards-hub-readiness-narrative";

describe("buildFlashcardsReadinessNarrative", () => {
  it("uses confidence-forward copy at high mastery", () => {
    const n = buildFlashcardsReadinessNarrative({
      dueToday: 2,
      overdue: 0,
      lapsingCards: 0,
      newCards: 10,
      streak: 4,
      masteryPct: 80,
    });
    assert.match(n.headline, /exam-ready/i);
    assert.equal(n.tone, "success");
    assert.ok(n.streakLabel?.includes("4-day"));
  });

  it("prioritizes overdue reinforcement", () => {
    const n = buildFlashcardsReadinessNarrative({
      dueToday: 1,
      overdue: 5,
      lapsingCards: 2,
      newCards: 0,
      streak: 1,
      masteryPct: 60,
    });
    assert.match(n.headline, /Spaced repetition/i);
    assert.ok(n.dueLabel?.includes("overdue"));
  });
});
