import assert from "node:assert/strict";
import { describe, it } from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import type { SataQuestionPayload, ExamMicroQuestionPayload } from "@/lib/flashcards/flashcard-exam-style";
import { FlashcardStudyQuestionStack } from "@/components/flashcards/flashcard-study-question-stack";

const SATA: SataQuestionPayload = {
  itemKind: "SATA",
  questionStem: "Which findings indicate infection?",
  answerOptions: [
    { letter: "A", text: "Fever" },
    { letter: "B", text: "Bradycardia" },
    { letter: "C", text: "Leukocytosis" },
    { letter: "D", text: "Erythema" },
  ],
  correctLetters: ["A", "C", "D"],
  rationaleCorrect: "Fever, leukocytosis, and erythema are classic infection signs.",
  rationaleByLetter: [
    { letter: "A", rationale: "Fever is a hallmark sign.", correct: true },
    { letter: "B", rationale: "Bradycardia is not typical of infection.", correct: false },
    { letter: "C", rationale: "Leukocytosis indicates immune activation.", correct: true },
    { letter: "D", rationale: "Erythema marks local inflammation.", correct: true },
  ],
};

const MCQ: ExamMicroQuestionPayload = {
  itemKind: "MCQ" as import("@prisma/client").FlashcardItemKind,
  questionStem: "A patient is hypoxic. Priority action?",
  answerOptions: [
    { letter: "A", text: "Administer supplemental oxygen" },
    { letter: "B", text: "Call a code" },
    { letter: "C", text: "Document findings" },
    { letter: "D", text: "Reassess in one hour" },
  ],
  correctLetter: "A",
  rationaleCorrect: "Oxygen directly addresses hypoxia.",
  rationaleIncorrect: [
    { letter: "B", rationale: "No indication for code." },
    { letter: "C", rationale: "Documentation is not priority." },
    { letter: "D", rationale: "Delay worsens hypoxia." },
  ],
};

const BASE_PROPS = {
  sessionModeLabel: "Study",
  prompt: "Which findings indicate infection?",
  answer: "A, C, D",
};

describe("FlashcardStudyQuestionStack — SATA submit button", () => {
  it("renders Submit Answer button for SATA when not revealed and onReveal provided", () => {
    const html = renderToStaticMarkup(
      <FlashcardStudyQuestionStack
        {...BASE_PROPS}
        examMicroQuestion={SATA}
        revealed={false}
        onReveal={() => {}}
      />,
    );
    assert.match(html, /data-testid="sata-reveal-btn"/);
    assert.match(html, /Submit Answer/);
  });

  it("does not render Submit Answer button when already revealed", () => {
    const html = renderToStaticMarkup(
      <FlashcardStudyQuestionStack
        {...BASE_PROPS}
        examMicroQuestion={SATA}
        revealed={true}
        onReveal={() => {}}
      />,
    );
    assert.doesNotMatch(html, /data-testid="sata-reveal-btn"/);
  });

  it("does not render Submit Answer button when onReveal is absent (non-interactive)", () => {
    const html = renderToStaticMarkup(
      <FlashcardStudyQuestionStack
        {...BASE_PROPS}
        examMicroQuestion={SATA}
        revealed={false}
      />,
    );
    assert.doesNotMatch(html, /data-testid="sata-reveal-btn"/);
  });

  it("MCQ card does not receive a SATA reveal button", () => {
    const html = renderToStaticMarkup(
      <FlashcardStudyQuestionStack
        {...BASE_PROPS}
        prompt="A patient is hypoxic. Priority action?"
        answer="A"
        examMicroQuestion={MCQ}
        revealed={false}
        onReveal={() => {}}
      />,
    );
    assert.doesNotMatch(html, /data-testid="sata-reveal-btn"/);
  });

  it("plain card (no examMicroQuestion) does not get SATA reveal button", () => {
    const html = renderToStaticMarkup(
      <FlashcardStudyQuestionStack
        {...BASE_PROPS}
        revealed={false}
        onReveal={() => {}}
      />,
    );
    assert.doesNotMatch(html, /data-testid="sata-reveal-btn"/);
  });
});

describe("FlashcardStudyQuestionStack — SATA rationale gating", () => {
  it("SATA rationale text is NOT in DOM before reveal", () => {
    const html = renderToStaticMarkup(
      <FlashcardStudyQuestionStack
        {...BASE_PROPS}
        examMicroQuestion={SATA}
        revealed={false}
        onReveal={() => {}}
      />,
    );
    // Per-option rationale strings must not appear before reveal
    assert.doesNotMatch(html, /hallmark sign/);
    assert.doesNotMatch(html, /immune activation/);
    assert.doesNotMatch(html, /local inflammation/);
    // Reveal panel must not be in the DOM
    assert.doesNotMatch(html, /data-nn-premium-flashcard-reveal/);
  });

  it("SATA rationale text IS in DOM after reveal", () => {
    const html = renderToStaticMarkup(
      <FlashcardStudyQuestionStack
        {...BASE_PROPS}
        examMicroQuestion={SATA}
        revealed={true}
        onReveal={() => {}}
      />,
    );
    assert.match(html, /data-nn-premium-flashcard-reveal/);
  });
});

describe("FlashcardStudyQuestionStack — MCQ rationale placement", () => {
  it("keeps the full correct-answer rationale in the right panel only", () => {
    const html = renderToStaticMarkup(
      <FlashcardStudyQuestionStack
        {...BASE_PROPS}
        prompt="A patient is hypoxic. Priority action?"
        answer="A"
        examMicroQuestion={MCQ}
        revealed={true}
        onReveal={() => {}}
      />,
    );

    assert.equal(html.match(/Oxygen directly addresses hypoxia/g)?.length, 1);
    assert.doesNotMatch(html, /Correct answer<\/span>/);
  });
});

describe("FlashcardStudyQuestionStack — data-nn-revealed attribute", () => {
  it("data-nn-revealed is '0' when not revealed", () => {
    const html = renderToStaticMarkup(
      <FlashcardStudyQuestionStack
        {...BASE_PROPS}
        examMicroQuestion={SATA}
        revealed={false}
        onReveal={() => {}}
      />,
    );
    assert.match(html, /data-nn-revealed="0"/);
    assert.doesNotMatch(html, /data-nn-revealed="1"/);
  });

  it("data-nn-revealed is '1' when revealed", () => {
    const html = renderToStaticMarkup(
      <FlashcardStudyQuestionStack
        {...BASE_PROPS}
        examMicroQuestion={SATA}
        revealed={true}
        onReveal={() => {}}
      />,
    );
    assert.match(html, /data-nn-revealed="1"/);
  });
});

describe("FlashcardStudyQuestionStack — adaptive case simulation", () => {
  it("renders evolving bedside case data inside the canonical learner card", () => {
    const html = renderToStaticMarkup(
      <FlashcardStudyQuestionStack
        {...BASE_PROPS}
        prompt="An older client develops new confusion and hypotension."
        answer="Escalate possible sepsis."
        examMicroQuestion={MCQ}
        revealed={false}
        adaptiveCaseSimulation={{
          id: "adaptive-case-test",
          title: "Evolving infection case",
          focus: "Cue clustering and escalation",
          patientSummary: "An older client develops new confusion and hypotension.",
          teachingPoint: "Use trends and cue clusters to escalate early.",
          stages: [
            {
              id: "baseline",
              timeLabel: "0700",
              title: "Initial cue",
              narrative: "The client is newly confused.",
              vitals: [{ label: "HR", value: "110", unit: "/min", flag: "watch" }],
            },
          ],
          decisions: [
            {
              id: "escalate",
              label: "Escalate with SBAR",
              priorityLevel: "optimal",
              responseTitle: "Priority recognized",
              response: "Escalation protects safety.",
            },
          ],
        }}
      />,
    );

    assert.match(html, /data-testid="adaptive-case-simulation"/);
    assert.match(html, /Adaptive NGN case/);
    assert.match(html, /Evolving infection case/);
    assert.match(html, /Escalate with SBAR/);
  });
});
