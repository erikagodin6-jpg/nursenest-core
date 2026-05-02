import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  getQuizEmbedForLesson,
  resolveQuizEmbedQuestionsForLessonSlug,
} from "@/lib/lessons/lesson-quiz-embeds";

describe("lesson quiz embed slug resolution", () => {
  it("returns embeds for exact legacy slug", () => {
    const q = resolveQuizEmbedQuestionsForLessonSlug("sepsis");
    assert.ok(q && q.length >= 1);
    assert.equal(getQuizEmbedForLesson("sepsis")?.[0]?.question, q?.[0]?.question);
  });

  it("strips pathway suffix to match catalog-style slugs", () => {
    const exact = getQuizEmbedForLesson("heart-failure");
    const suffixed = resolveQuizEmbedQuestionsForLessonSlug("heart-failure-nclex-rn");
    assert.ok(exact?.length);
    assert.deepEqual(suffixed, exact);
  });
});
