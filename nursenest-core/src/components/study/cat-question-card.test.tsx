import assert from "node:assert/strict";
import { describe, it } from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { AnswerOptionRow, QuestionCard } from "@/components/study/cat-question-card";

describe("QuestionCard (CAT)", () => {
  it("exam stacked layout exposes scroll region, exam stack class, and anchored footer", () => {
    const html = renderToStaticMarkup(
      <QuestionCard
        stem="Stem"
        examStackedLayout
        footerSlot={<button type="button">Next</button>}
      >
        <p>Child</p>
      </QuestionCard>,
    );
    assert.match(html, /nn-cat-question-card--exam-stack/);
    assert.match(html, /id="nn-cat-exam-scroll-region"/);
    assert.match(html, /nn-cat-question-card__exam-footer--anchored/);
    assert.match(html, /nn-cat-question-card__exam-scroll/);
  });

  it("study layout does not use exam-only stack classes", () => {
    const html = renderToStaticMarkup(
      <QuestionCard stem="Stem" examStackedLayout={false}>
        <p>Child</p>
      </QuestionCard>,
    );
    assert.doesNotMatch(html, /nn-cat-question-card--exam-stack/);
    assert.doesNotMatch(html, /nn-cat-exam-scroll-region/);
    assert.doesNotMatch(html, /nn-cat-question-card__exam-footer--anchored/);
  });

  it("exam stacked flag without footerSlot falls back to study card (no exam chrome or scroll padding)", () => {
    const html = renderToStaticMarkup(
      <QuestionCard stem="Stem" examStackedLayout>
        <p>Child</p>
      </QuestionCard>,
    );
    assert.doesNotMatch(html, /nn-cat-question-card--exam-stack/);
    assert.doesNotMatch(html, /nn-cat-exam-scroll-region/);
  });
});

describe("AnswerOptionRow (MCQ/SATA a11y + reveal)", () => {
  it("does not emit correctness sr-only copy for default or selected (button)", () => {
    for (const state of ["default", "selected"] as const) {
      const html = renderToStaticMarkup(
        <AnswerOptionRow letter="A" text="Option body" state={state} onClick={() => {}} />,
      );
      assert.doesNotMatch(html, /Correct answer/);
      assert.doesNotMatch(html, /Incorrect/);
      assert.match(html, /nn-cat-opt__letter/);
      assert.doesNotMatch(html, /nn-cat-opt__letter[^>]*aria-hidden/);
    }
  });

  it("emits sr-only correctness only for correct / incorrect (button)", () => {
    const correctHtml = renderToStaticMarkup(
      <AnswerOptionRow letter="B" text="Right" state="correct" disabled onClick={() => {}} />,
    );
    assert.match(correctHtml, /Correct answer/);
    const incorrectHtml = renderToStaticMarkup(
      <AnswerOptionRow letter="C" text="Wrong" state="incorrect" disabled onClick={() => {}} />,
    );
    assert.match(incorrectHtml, /Incorrect\./);
  });

  it("checkbox variant matches button sr-only rules", () => {
    const neutral = renderToStaticMarkup(
      <AnswerOptionRow
        letter="D"
        text="SATA row"
        state="selected"
        isCheckbox
        checked
        onChange={() => {}}
      />,
    );
    assert.doesNotMatch(neutral, /Correct answer/);
    assert.doesNotMatch(neutral, /Incorrect/);
    const revealed = renderToStaticMarkup(
      <AnswerOptionRow letter="D" text="SATA row" state="correct" disabled isCheckbox checked onChange={() => {}} />,
    );
    assert.match(revealed, /Correct answer/);
  });
});
