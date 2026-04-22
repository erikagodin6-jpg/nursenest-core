import assert from "node:assert/strict";
import * as React from "react";
import { describe, it } from "node:test";
import { renderToStaticMarkup } from "react-dom/server";
import type { PathwayLessonQuizItem } from "@/lib/lessons/pathway-lesson-types";
import { LessonAssessmentQuiz } from "@/components/lessons/lesson-assessment-quiz";

describe("LessonAssessmentQuiz UI contract guard", () => {
  it("silently drops malformed items before render (study loop / bank shell)", () => {
    const mixed: PathwayLessonQuizItem[] = [
      { question: "", options: ["a", "b"], correct: 0 },
      { question: "Loop ok?", options: ["m", "n"], correct: 1 },
    ];
    const html = renderToStaticMarkup(
      <LessonAssessmentQuiz items={mixed} onComplete={() => {}} submitLabel="Submit" />,
    );
    assert.match(html, /Loop ok\?/);
  });
});
