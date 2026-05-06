/**
 * Linked-learning signal wiring for {@link PathwayLessonActions} (marketing + app lesson footers).
 *
 * Run: `npx tsx --test src/components/lessons/pathway-lesson-actions-linked-signals.test.tsx`
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { PathwayLessonActions } from "@/components/lessons/pathway-lesson-actions";
import type { PathwayLessonLinkedLearningSignals } from "@/lib/lessons/pathway-lesson-types";

function countDataTestId(html: string, testId: string): number {
  return html.split(`data-testid="${testId}"`).length - 1;
}

function renderActions(
  signals: PathwayLessonLinkedLearningSignals,
  opts?: { catAdaptiveAvailable?: boolean; linkMode?: "marketing" | "learner" },
) {
  const catAdaptiveAvailable = opts?.catAdaptiveAvailable ?? true;
  const linkMode = opts?.linkMode ?? "learner";
  /** `useMarketingI18n` falls back without a provider — sufficient for markup / data-testid assertions. */
  return renderToStaticMarkup(
    <PathwayLessonActions
      pathwayId="us-rn-nclex-rn"
      lessonSlug="sample-lesson"
      topicCode={signals.bidirectionalTopicKey}
      topicLabel="Sample topic"
      userId="user_test"
      canMarkComplete
      initialProgress="not_started"
      catAdaptiveAvailable={catAdaptiveAvailable}
      linkedLearningSignals={signals}
      linkMode={linkMode}
    />,
  );
}

describe("PathwayLessonActions linkedLearningSignals", () => {
  it("renders flashcard CTA when flashcardsLinked is true", () => {
    const signals: PathwayLessonLinkedLearningSignals = {
      bidirectionalTopicKey: "fluid-balance",
      flashcardsLinked: true,
      practiceQuestionsLinked: true,
      catPoolLinked: true,
      adaptiveLearningReadiness: true,
    };
    const html = renderActions(signals);
    assert.match(html, /data-testid="pathway-lesson-linked-cta-flashcards"/);
    assert.match(html, /\/app\/flashcards\?[^"]*topic=fluid-balance/);
  });

  it("renders practice question CTA when practiceQuestionsLinked is true", () => {
    const signals: PathwayLessonLinkedLearningSignals = {
      bidirectionalTopicKey: "cardiac-monitoring",
      flashcardsLinked: true,
      practiceQuestionsLinked: true,
      catPoolLinked: true,
      adaptiveLearningReadiness: true,
    };
    const html = renderActions(signals);
    assert.match(html, /data-testid="pathway-lesson-linked-cta-questions"/);
    assert.match(html, /\/app\/questions\?[^"]*topicCode=cardiac-monitoring/);
  });

  it("renders practice tests CTA when catPoolLinked is true", () => {
    const signals: PathwayLessonLinkedLearningSignals = {
      bidirectionalTopicKey: "respiratory-assessment",
      flashcardsLinked: true,
      practiceQuestionsLinked: true,
      catPoolLinked: true,
      adaptiveLearningReadiness: true,
    };
    const html = renderActions(signals);
    assert.match(html, /data-testid="pathway-lesson-linked-cta-practice-tests"/);
    assert.match(html, /\/app\/practice-tests\?[^"]*topic=respiratory-assessment/);
  });

  it("does not render adaptive CTA when adaptiveLearningReadiness is false", () => {
    const signals: PathwayLessonLinkedLearningSignals = {
      bidirectionalTopicKey: "shallow-topic",
      flashcardsLinked: true,
      practiceQuestionsLinked: true,
      catPoolLinked: true,
      adaptiveLearningReadiness: false,
    };
    const html = renderActions(signals, { catAdaptiveAvailable: true });
    assert.doesNotMatch(html, /data-testid="pathway-lesson-linked-cta-adaptive"/);
    assert.match(html, /data-testid="pathway-lesson-linked-cta-adaptive-disabled"/);
  });

  it("hides flashcard link when flashcardsLinked is false (disabled control)", () => {
    const signals: PathwayLessonLinkedLearningSignals = {
      bidirectionalTopicKey: "no-flash",
      flashcardsLinked: false,
      practiceQuestionsLinked: true,
      catPoolLinked: true,
      adaptiveLearningReadiness: true,
    };
    const html = renderActions(signals);
    assert.doesNotMatch(html, /data-testid="pathway-lesson-linked-cta-flashcards"/);
    assert.match(html, /data-testid="pathway-lesson-linked-cta-flashcards-disabled"/);
  });

  it("renders adaptive CTA only when adaptiveLearningReadiness and catAdaptiveAvailable are true", () => {
    const signals: PathwayLessonLinkedLearningSignals = {
      bidirectionalTopicKey: "adaptive-on",
      flashcardsLinked: true,
      practiceQuestionsLinked: true,
      catPoolLinked: true,
      adaptiveLearningReadiness: true,
    };
    const htmlOn = renderActions(signals, { catAdaptiveAvailable: true });
    assert.equal(countDataTestId(htmlOn, "pathway-lesson-linked-cta-adaptive"), 1);
    assert.equal(countDataTestId(htmlOn, "pathway-lesson-linked-cta-adaptive-disabled"), 0);

    const htmlOff = renderActions(signals, { catAdaptiveAvailable: false });
    assert.equal(countDataTestId(htmlOff, "pathway-lesson-linked-cta-adaptive"), 0);
    assert.equal(countDataTestId(htmlOff, "pathway-lesson-linked-cta-adaptive-disabled"), 1);
  });

  it("does not fall back to legacy practice CTA when practiceQuestionsLinked is false", () => {
    const signals: PathwayLessonLinkedLearningSignals = {
      bidirectionalTopicKey: "no-qb-link",
      flashcardsLinked: true,
      practiceQuestionsLinked: false,
      catPoolLinked: true,
      adaptiveLearningReadiness: true,
    };
    const html = renderActions(signals);
    assert.equal(countDataTestId(html, "pathway-lesson-linked-cta-questions"), 0);
    assert.equal(countDataTestId(html, "pathway-lesson-linked-cta-questions-disabled"), 1);
    assert.equal(countDataTestId(html, "pathway-lesson-cta-practice-topic"), 0);
    assert.doesNotMatch(html, /\/app\/questions\?[^"]*topicCode=no-qb-link/);
  });

  it("does not render active question drill when bidirectionalTopicKey is empty (shallow lesson)", () => {
    const signals: PathwayLessonLinkedLearningSignals = {
      bidirectionalTopicKey: "",
      flashcardsLinked: true,
      practiceQuestionsLinked: true,
      catPoolLinked: true,
      adaptiveLearningReadiness: true,
    };
    const html = renderActions(signals, { catAdaptiveAvailable: true });
    assert.equal(countDataTestId(html, "pathway-lesson-linked-cta-questions"), 0);
    assert.equal(countDataTestId(html, "pathway-lesson-linked-cta-questions-disabled"), 1);
    assert.equal(countDataTestId(html, "pathway-lesson-linked-cta-adaptive"), 0);
    assert.equal(countDataTestId(html, "pathway-lesson-linked-cta-adaptive-disabled"), 1);
  });

  it("exposes each linked CTA test id at most once in markup", () => {
    const signals: PathwayLessonLinkedLearningSignals = {
      bidirectionalTopicKey: "dedupe-topic",
      flashcardsLinked: true,
      practiceQuestionsLinked: true,
      catPoolLinked: true,
      adaptiveLearningReadiness: true,
    };
    const html = renderActions(signals);
    for (const id of [
      "pathway-lesson-linked-cta-questions",
      "pathway-lesson-linked-cta-questions-disabled",
      "pathway-lesson-linked-cta-flashcards",
      "pathway-lesson-linked-cta-flashcards-disabled",
      "pathway-lesson-linked-cta-practice-tests",
      "pathway-lesson-linked-cta-practice-tests-disabled",
      "pathway-lesson-linked-cta-adaptive",
      "pathway-lesson-linked-cta-adaptive-disabled",
    ] as const) {
      assert.ok(countDataTestId(html, id) <= 1, `duplicate data-testid: ${id}`);
    }
  });

  it("wraps study app links for marketing linkMode", () => {
    const signals: PathwayLessonLinkedLearningSignals = {
      bidirectionalTopicKey: "marketing-wrap",
      flashcardsLinked: true,
      practiceQuestionsLinked: true,
      catPoolLinked: true,
      adaptiveLearningReadiness: true,
    };
    const html = renderActions(signals, { linkMode: "marketing" });
    const qOpen = html.indexOf('data-testid="pathway-lesson-linked-cta-questions"');
    assert.ok(qOpen >= 0, "questions link present");
    const slice = html.slice(Math.max(0, qOpen - 120), qOpen + 400);
    const hrefMatch = slice.match(/href="([^"]+)"/);
    assert.ok(hrefMatch, "href on questions control");
    assert.ok(hrefMatch![1].includes("/login"), "questions href uses login wrapper");
    assert.ok(hrefMatch![1].includes("callbackUrl="), "questions href carries callback");
  });
});
