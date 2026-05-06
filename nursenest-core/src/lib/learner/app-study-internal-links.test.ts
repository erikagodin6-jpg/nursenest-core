import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  buildAppFlashcardsTopicHref,
  buildAppLessonsReviewLessonHref,
  buildAppPracticeTestsTopicHref,
} from "@/lib/learner/app-study-internal-links";

describe("app-study-internal-links", () => {
  it("includes pathwayId and topic on flashcards hub href", () => {
    const href = buildAppFlashcardsTopicHref("ca-rn-nclex-rn", "Fluid-Balance");
    assert.ok(href.includes("pathwayId="));
    assert.ok(href.includes("topic="));
    assert.ok(href.startsWith("/app/flashcards?"));
    assert.ok(href.includes(encodeURIComponent("fluid-balance")));
  });

  it("includes pathwayId and topic on practice-tests hub href", () => {
    const href = buildAppPracticeTestsTopicHref("nclex-rn", "cardiac");
    assert.ok(href.startsWith("/app/practice-tests?"));
    assert.ok(href.includes("pathwayId="));
    assert.ok(href.includes("topic="));
  });

  it("builds lessons hub review href with lessonSlug", () => {
    const href = buildAppLessonsReviewLessonHref("ca-rn-nclex-rn", "lesson-one");
    assert.ok(href.startsWith("/app/lessons?"));
    assert.ok(href.includes("lessonSlug="));
    assert.ok(href.includes("pathwayId="));
  });
});
