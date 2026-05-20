import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { shouldRefreshServerAfterPathwayLessonProgress } from "@/lib/lessons/pathway-lesson-progress-refresh";

describe("shouldRefreshServerAfterPathwayLessonProgress", () => {
  it("does not refresh learner flashcards hub or custom session (avoids RSC remount / fetch storms)", () => {
    assert.equal(shouldRefreshServerAfterPathwayLessonProgress("/app/flashcards"), false);
    assert.equal(shouldRefreshServerAfterPathwayLessonProgress("/app/flashcards?pathwayId=ca-rn-nclex-rn"), false);
    assert.equal(shouldRefreshServerAfterPathwayLessonProgress("/app/flashcards/custom"), false);
    assert.equal(
      shouldRefreshServerAfterPathwayLessonProgress("/app/flashcards/custom?pathwayId=us-rn-nclex-rn&includeCards=1"),
      false,
    );
    assert.equal(shouldRefreshServerAfterPathwayLessonProgress("/app/flashcards/weak-areas"), false);
  });

  it("does not refresh question bank or practice test runner shells", () => {
    assert.equal(shouldRefreshServerAfterPathwayLessonProgress("/app/questions"), false);
    assert.equal(shouldRefreshServerAfterPathwayLessonProgress("/app/questions?pathwayId=ca-rn-nclex-rn"), false);
    assert.equal(shouldRefreshServerAfterPathwayLessonProgress("/app/practice-tests/start"), false);
    assert.equal(shouldRefreshServerAfterPathwayLessonProgress("/app/practice-tests"), false);
    assert.equal(
      shouldRefreshServerAfterPathwayLessonProgress("/app/practice-tests?pathwayId=ca-rn-nclex-rn"),
      false,
    );
    assert.equal(shouldRefreshServerAfterPathwayLessonProgress("/app/practice-exams"), false);
    assert.equal(
      shouldRefreshServerAfterPathwayLessonProgress("/app/practice-exams?pathwayId=ca-rn-nclex-rn"),
      false,
    );
  });

  it("does not refresh /app/lessons/[slug] detail (client-driven progress there)", () => {
    assert.equal(shouldRefreshServerAfterPathwayLessonProgress("/app/lessons/acid-base-101"), false);
  });

  it("still refreshes /app/lessons hub, topics index, /app home, and marketing lesson hubs", () => {
    assert.equal(shouldRefreshServerAfterPathwayLessonProgress("/app/lessons"), true);
    assert.equal(shouldRefreshServerAfterPathwayLessonProgress("/app/lessons?pathwayId=ca-rn-nclex-rn"), true);
    assert.equal(shouldRefreshServerAfterPathwayLessonProgress("/app/lessons/topics/cardiovascular"), true);
    assert.equal(shouldRefreshServerAfterPathwayLessonProgress("/app"), true);
    assert.equal(shouldRefreshServerAfterPathwayLessonProgress("/us/rn/nclex/lessons"), true);
  });
});
