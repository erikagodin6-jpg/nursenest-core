import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  orderFlashcardsForAdaptiveSession,
  shuffleFlashcardQueueWithinDueBands,
  type AdaptiveProgressLite,
  type ProgressLite,
} from "@/lib/flashcards/study-queue";

describe("shuffleFlashcardQueueWithinDueBands", () => {
  const now = new Date("2026-01-15T12:00:00.000Z");
  const past = new Date("2026-01-01T12:00:00.000Z");
  const future = new Date("2027-01-01T12:00:00.000Z");

  it("keeps due before not-due and varies order per salt within bands", () => {
    const queueIds = ["a", "b", "c", "d", "e", "f"];
    const progress = new Map<string, ProgressLite>([
      ["a", { nextReviewAt: past, repetitions: 1 }],
      ["b", { nextReviewAt: past, repetitions: 1 }],
      ["c", { nextReviewAt: future, repetitions: 1 }],
      ["d", { nextReviewAt: future, repetitions: 1 }],
      ["e", { nextReviewAt: future, repetitions: 1 }],
      ["f", { nextReviewAt: past, repetitions: 1 }],
    ]);
    const s1 = shuffleFlashcardQueueWithinDueBands(queueIds, progress, now, "salt-11111111-1111-4111-8111-111111111111");
    const s2 = shuffleFlashcardQueueWithinDueBands(queueIds, progress, now, "salt-22222222-2222-4222-8222-222222222222");
    const dueSet = new Set(["a", "b", "f"]);
    const notDueSet = new Set(["c", "d", "e"]);
    const firstDueBlock = s1.filter((id) => dueSet.has(id));
    const secondBlock = s1.filter((id) => notDueSet.has(id));
    assert.equal(firstDueBlock.length, 3);
    assert.deepEqual(new Set(s1), new Set(queueIds));
    assert.ok(firstDueBlock.every((id) => dueSet.has(id)));
    assert.ok(secondBlock.every((id) => notDueSet.has(id)));
    assert.notDeepEqual(s1, s2);
  });

  it("is stable for the same salt", () => {
    const queueIds = ["x", "y"];
    const progress = new Map<string, ProgressLite>([
      ["x", { nextReviewAt: null, repetitions: 0 }],
      ["y", { nextReviewAt: null, repetitions: 0 }],
    ]);
    const salt = "stable-salt-00000000-0000-4000-8000-000000000001";
    assert.deepEqual(
      shuffleFlashcardQueueWithinDueBands(queueIds, progress, now, salt),
      shuffleFlashcardQueueWithinDueBands(queueIds, progress, now, salt),
    );
  });
});

describe("orderFlashcardsForAdaptiveSession", () => {
  const now = new Date("2026-01-15T12:00:00.000Z");
  const oneHourAgo = new Date("2026-01-15T11:00:00.000Z");
  const old = new Date("2025-12-15T12:00:00.000Z");
  const future = new Date("2026-02-15T12:00:00.000Z");

  it("prioritizes unseen, due, and weak cards before recently reviewed mastered cards", () => {
    const rows = [{ id: "mastered-recent" }, { id: "new-card" }, { id: "weak-due" }, { id: "old-due" }];
    const progress = new Map<string, AdaptiveProgressLite>([
      [
        "mastered-recent",
        { nextReviewAt: future, repetitions: 8, lastReviewedAt: oneHourAgo, lastQuality: 5, lapses: 0 },
      ],
      ["weak-due", { nextReviewAt: old, repetitions: 2, lastReviewedAt: old, lastQuality: 1, lapses: 1 }],
      ["old-due", { nextReviewAt: old, repetitions: 3, lastReviewedAt: old, lastQuality: 4, lapses: 0 }],
    ]);

    const ordered = orderFlashcardsForAdaptiveSession(rows, progress, now, "adaptive-salt-00000000");
    assert.equal(ordered[0]?.id, "new-card");
    assert.ok(
      ordered.findIndex((row) => row.id === "mastered-recent") > ordered.findIndex((row) => row.id === "weak-due"),
    );
  });

  it("is stable for the same salt and varies tie order across salts", () => {
    const rows = [{ id: "a" }, { id: "b" }, { id: "c" }, { id: "d" }];
    const progress = new Map<string, AdaptiveProgressLite>();
    const first = orderFlashcardsForAdaptiveSession(rows, progress, now, "salt-a-00000000");
    const again = orderFlashcardsForAdaptiveSession(rows, progress, now, "salt-a-00000000");
    const second = orderFlashcardsForAdaptiveSession(rows, progress, now, "salt-b-00000000");
    assert.deepEqual(first, again);
    assert.notDeepEqual(first.map((row) => row.id), second.map((row) => row.id));
  });
});
