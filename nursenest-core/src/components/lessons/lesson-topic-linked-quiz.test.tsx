import assert from "node:assert/strict";
import * as React from "react";
import { describe, it } from "node:test";
import { renderToStaticMarkup } from "react-dom/server";
import type { PathwayLessonQuizItem } from "@/lib/lessons/pathway-lesson-types";
import { LessonTopicLinkedQuiz } from "@/components/lessons/lesson-topic-linked-quiz";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";

const mockPathway = {
  id: "us_rn_nclex",
  shortName: "NCLEX-RN",
  countryCode: "US",
} as unknown as ExamPathwayDefinition;

describe("LessonTopicLinkedQuiz", () => {
  it("does not render a passive numbered stem list (<ol> of previews)", () => {
    const items: PathwayLessonQuizItem[] = [
      {
        question: "Sample stem for lesson topic?",
        options: ["A one", "B two", "C three"],
        correct: 1,
        rationale: "Because B is correct for the topic.",
      },
    ];
    const html = renderToStaticMarkup(
      <LessonTopicLinkedQuiz
        pathway={mockPathway}
        lessonTopic="Fluid balance"
        topicSlug="fluid-balance"
        items={items}
        fullAccess
        userId=""
        lessonId="pathway:us_rn_nclex:lesson-1"
        pathwayId="us_rn_nclex"
      />,
    );
    assert.equal(html.includes("<ol"), false);
    assert.match(html, /lesson-topic-linked-quiz/);
    assert.match(html, /Check answer/);
    assert.equal(html.includes("Because B is correct"), false);
  });

  it("exposes interactive quiz surface for bank-backed rows", () => {
    const items: PathwayLessonQuizItem[] = [
      {
        question: "Q?",
        options: ["x", "y"],
        correct: 0,
        examQuestionId: "qqqqqqqqqqqqqqqq",
      },
    ];
    const html = renderToStaticMarkup(
      <LessonTopicLinkedQuiz
        pathway={mockPathway}
        lessonTopic="T"
        items={items}
        fullAccess
        userId=""
        lessonId="lesson"
        pathwayId="us_rn_nclex"
      />,
    );
    assert.match(html, /role="radiogroup"/);
  });
});
