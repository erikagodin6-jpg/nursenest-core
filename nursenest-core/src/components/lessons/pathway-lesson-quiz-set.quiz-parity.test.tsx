import assert from "node:assert/strict";
import * as React from "react";
import { describe, it } from "node:test";
import { renderToStaticMarkup } from "react-dom/server";
import type { LessonBankQuizItem } from "@/lib/lessons/exam-question-to-lesson-quiz-item";
import type { PathwayLessonQuizItem } from "@/lib/lessons/pathway-lesson-types";
import { PathwayLessonQuizSet } from "@/components/lessons/pathway-lesson-quiz-set";

describe("PathwayLessonQuizSet explicit vs catalog parity", () => {
  it("renders bank-backed explicit items with the same stem/option shell as catalog MCQs", () => {
    const catalog: PathwayLessonQuizItem[] = [
      { question: "Catalog stem?", options: ["A1", "A2"], correct: 0, rationale: "Cat rationale." },
    ];
    const bankBacked: LessonBankQuizItem[] = [
      {
        examQuestionId: "bbbbbbbbbbbbbbbb",
        question: "Bank stem?",
        options: ["B1", "B2"],
        correct: 1,
        rationale: "Bank rationale.",
      },
    ];
    const htmlCatalog = renderToStaticMarkup(
      <PathwayLessonQuizSet variant="pre" title="Pre" items={catalog} fullAccess subtitle="S" />,
    );
    const htmlBank = renderToStaticMarkup(
      <PathwayLessonQuizSet variant="pre" title="Pre" items={bankBacked} fullAccess subtitle="S" />,
    );
    assert.match(htmlCatalog, /Catalog stem\?/);
    assert.match(htmlCatalog, /A1/);
    assert.match(htmlBank, /Bank stem\?/);
    assert.match(htmlBank, /B1/);
    assert.match(htmlCatalog, /list-none/);
    assert.match(htmlBank, /list-none/);
  });
});
