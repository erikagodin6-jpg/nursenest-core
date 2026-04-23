/**
 * Mounted interactions for the CAT-aligned practice shell (fixtures mirror
 * `practice-test-runner-client.tsx` non-CAT branches — keep class names + composition aligned).
 */
import "@happy-dom/global-registrator/register";

import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";
import React, { useState } from "react";
import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QuestionCard, AnswerOptionRow } from "@/components/study/cat-question-card";
import { PracticeTestPerItemRationale } from "@/components/study/practice-test-per-item-rationale";

afterEach(() => {
  cleanup();
});

const BOARD_FRAME =
  "nn-cat-exam-board-frame nn-cat-session flex min-h-0 flex-1 flex-col overflow-hidden nn-cat-session--exam-single";
const CONTENT_WELL = "nn-cat-exam-content-well nn-cat-exam-col mx-auto flex min-h-0 w-full max-w-[48.75rem] flex-1 flex-col overflow-hidden";
const FOOTER_OUTER =
  "nn-cat-exam-board-footer flex shrink-0 flex-col border-t border-[color-mix(in_srgb,var(--semantic-info)_22%,var(--semantic-border-soft))]";

function LinearTutorAfterEachFixture() {
  const [selected, setSelected] = useState<string | null>(null);
  const [committed, setCommitted] = useState(false);
  const [item, setItem] = useState(0);
  const correctKey = "a";
  const opts = [
    { key: "a", letter: "A", text: "Correct option" },
    { key: "b", letter: "B", text: "Distractor" },
  ];
  const committedCorrect = selected === correctKey;

  return (
    <div data-testid="linear-tutor-root" className={BOARD_FRAME}>
      <div className={CONTENT_WELL}>
        <QuestionCard
          stem={`Item ${item + 1} stem`}
          examStackedLayout
          examDetachedFooter
          examCategoryLabel="CLINICAL TOPIC"
          examLayoutMeasureKey={`fixture:${item}`}
        >
          <p className="nn-cat-options-label">Select the best answer</p>
          <ul className="nn-cat-opt-list" role="radiogroup" aria-label="Answer choices">
            {opts.map((o) => (
              <li key={o.key}>
                <AnswerOptionRow
                  letter={o.letter}
                  text={o.text}
                  state={
                    !committed
                      ? selected === o.key
                        ? "selected"
                        : "default"
                      : o.key === correctKey
                        ? "correct"
                        : selected === o.key
                          ? "incorrect"
                          : "dim"
                  }
                  disabled={committed}
                  onClick={() => {
                    if (!committed) setSelected(o.key);
                  }}
                />
              </li>
            ))}
          </ul>
          {committed ? (
            <PracticeTestPerItemRationale
              status={committedCorrect ? "correct" : "incorrect"}
              correctKeys={[correctKey]}
              optionDisplayMap={{ a: "Correct option", b: "Distractor" }}
              allOptionKeys={["a", "b"]}
              correctAnswerExplanation="Because this is the keyed correct response."
              rationale={null}
              distractorRationalesMap={{ b: "Not the best choice for this vignette." }}
              keyTakeaway={null}
              relatedLessons={[]}
              confidenceLevel={null}
            />
          ) : null}
        </QuestionCard>
      </div>
      <footer className={FOOTER_OUTER}>
        <div className="mx-auto flex w-full max-w-[48.75rem] items-center justify-between gap-3 px-3 py-2.5 sm:px-4">
          <button type="button" disabled>
            Previous
          </button>
          <p className="m-0 text-center text-xs">progress</p>
          <div className="min-w-[5.5rem] text-right">
            {!committed ? (
              <button type="button" disabled={!selected} onClick={() => setCommitted(true)}>
                Submit answer
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setCommitted(false);
                  setSelected(null);
                  setItem((n) => n + 1);
                }}
              >
                Next item
              </button>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
}

function LinearExamFixture() {
  const [selected, setSelected] = useState<string | null>(null);
  const [committed, setCommitted] = useState(false);
  const correctKey = "a";
  const opts = [
    { key: "a", letter: "A", text: "Alpha" },
    { key: "b", letter: "B", text: "Bravo" },
  ];

  return (
    <div data-testid="linear-exam-root" className={BOARD_FRAME} data-cat-exam-root>
      <div className={CONTENT_WELL}>
        <QuestionCard
          stem="Exam item stem"
          examStackedLayout
          examDetachedFooter
          examCategoryLabel="EXAM"
          examLayoutMeasureKey="fixture-exam"
        >
          <p className="nn-cat-options-label">Select the best answer</p>
          <ul className="nn-cat-opt-list" role="radiogroup" aria-label="Answer choices">
            {opts.map((o) => (
              <li key={o.key}>
                <AnswerOptionRow
                  letter={o.letter}
                  text={o.text}
                  state={
                    !committed
                      ? selected === o.key
                        ? "selected"
                        : "default"
                      : o.key === correctKey
                        ? "correct"
                        : selected === o.key
                          ? "incorrect"
                          : "dim"
                  }
                  disabled={committed}
                  onClick={() => {
                    if (!committed) setSelected(o.key);
                  }}
                />
              </li>
            ))}
          </ul>
        </QuestionCard>
      </div>
      <footer className={FOOTER_OUTER}>
        <div className="mx-auto flex w-full max-w-[48.75rem] items-center justify-between gap-3 px-3 py-2.5 sm:px-4">
          <button type="button" disabled>
            Previous
          </button>
          <p className="m-0 text-center text-xs">1 of 1 answered</p>
          <div className="min-w-[5.5rem] text-right">
            {!committed ? (
              <button type="button" disabled={!selected} onClick={() => setCommitted(true)}>
                Submit answer
              </button>
            ) : (
              <button type="button">Finish test</button>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
}

function LegacyPracticeFixture() {
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState<string | null>("a");

  return (
    <div data-testid="legacy-root" className={BOARD_FRAME}>
      <div className={CONTENT_WELL}>
        <QuestionCard
          stem={`Legacy question ${idx + 1}`}
          examStackedLayout
          examDetachedFooter
          examCategoryLabel="LEGACY TOPIC"
          examLayoutMeasureKey={`legacy:${idx}`}
        >
          <p className="nn-cat-options-label">Select the best answer</p>
          <ul className="nn-cat-opt-list" role="radiogroup" aria-label="Answer choices">
            <li>
              <AnswerOptionRow
                letter="A"
                text="Legacy A"
                state={selected === "a" ? "selected" : "default"}
                onClick={() => setSelected("a")}
              />
            </li>
            <li>
              <AnswerOptionRow
                letter="B"
                text="Legacy B"
                state={selected === "b" ? "selected" : "default"}
                onClick={() => setSelected("b")}
              />
            </li>
          </ul>
        </QuestionCard>
      </div>
      <footer className={FOOTER_OUTER}>
        <div className="mx-auto flex w-full max-w-[48.75rem] items-center justify-between gap-3 px-3 py-2.5 sm:px-4">
          <button type="button" disabled={idx === 0} onClick={() => setIdx((n) => Math.max(0, n - 1))}>
            Previous
          </button>
          <p className="m-0 text-center text-xs">Question {idx + 1} of 2</p>
          <div className="min-w-[5.5rem] text-right">
            <button type="button" onClick={() => setIdx((n) => n + 1)}>
              Next Question
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

describe("Practice test CAT-aligned shell (mounted fixtures)", () => {
  it("linear tutor after_each: select → submit → inline rationale in scroll well → Next advances", async () => {
    const user = userEvent.setup();
    const { container } = render(<LinearTutorAfterEachFixture />);

    const root = screen.getByTestId("linear-tutor-root");
    assert.match(root.className, /nn-cat-exam-board-frame/);
    assert.match(root.className, /nn-cat-session--exam-single/);

    const scroll = container.querySelector("#nn-cat-exam-scroll-region");
    assert.ok(scroll, "detached exam QuestionCard exposes nn-cat-exam-scroll-region");

    await user.click(screen.getByRole("button", { name: /Correct option/i }));
    await user.click(screen.getByRole("button", { name: /Submit answer/i }));

    const rationale = document.querySelector("[data-nn-practice-per-item-rationale]");
    assert.ok(rationale, "per-item rationale wrapper mounts after submit");
    assert.ok(scroll.contains(rationale), "rationale stays inside the main exam scroll region");

    assert.ok(screen.getByText(/Because this is the keyed correct response/i));

    await user.click(screen.getByRole("button", { name: /Next item/i }));
    assert.ok(screen.getByText(/Item 2 stem/i));
    assert.equal(document.querySelector("[data-nn-practice-per-item-rationale]"), null);
  });

  it("linear exam: submit locks options and does not mount per-item rationale", async () => {
    const user = userEvent.setup();
    const { container } = render(<LinearExamFixture />);

    assert.ok(screen.getByTestId("linear-exam-root").hasAttribute("data-cat-exam-root"));

    await user.click(screen.getByRole("button", { name: /Bravo/i }));
    await user.click(screen.getByRole("button", { name: /Submit answer/i }));

    assert.equal(container.querySelector("[data-nn-practice-per-item-rationale]"), null);
    const locked = screen.getByRole("button", { name: /Bravo/i });
    assert.equal(locked.hasAttribute("disabled"), true);
  });

  it("legacy-style free nav: CAT board frame + QuestionCard stack + opt list + footer pattern", async () => {
    const user = userEvent.setup();
    render(<LegacyPracticeFixture />);

    const root = screen.getByTestId("legacy-root");
    assert.match(root.className, /nn-cat-session--exam-single/);

    const card = document.querySelector(".nn-cat-question-card--exam-stack.nn-cat-question-card--exam-detached");
    assert.ok(card, "uses stacked detached QuestionCard like the runner");

    assert.ok(document.querySelector("ul.nn-cat-opt-list"));

    const footer = root.querySelector("footer.nn-cat-exam-board-footer");
    assert.ok(footer);
    within(footer as HTMLElement).getByRole("button", { name: /Previous/i });
    await user.click(screen.getByRole("button", { name: /Next Question/i }));
    assert.ok(screen.getByText(/Legacy question 2/i));
  });
});
