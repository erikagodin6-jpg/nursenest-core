import assert from "node:assert/strict";
import { describe, it } from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { QuestionCard } from "@/components/study/cat-question-card";

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
