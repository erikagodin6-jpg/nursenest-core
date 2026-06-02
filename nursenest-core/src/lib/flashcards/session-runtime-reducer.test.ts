/**
 * Session Runtime Reducer — deterministic unit tests.
 *
 * Pure-state: no DB, no Prisma, no Next.js imports.
 * Run with: node --import tsx --test src/lib/flashcards/session-runtime-reducer.test.ts
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { createSessionRuntime, sessionRuntimeReducer } from "./session-runtime-reducer";
import type { SessionCardPayload, SessionRuntime } from "./session-runtime-types";

// ── Fixtures ──────────────────────────────────────────────────────────────────

function makePayload(cardId: string, pos = 0): SessionCardPayload {
  return {
    cardId,
    positionInDeck: pos,
    questionStem: "A patient presents with chest pain. Priority action?",
    answerOptions: [
      { letter: "A", text: "Administer O2" },
      { letter: "B", text: "Obtain 12-lead ECG" },
      { letter: "C", text: "Call physician" },
      { letter: "D", text: "Document findings" },
    ],
    correctLetter: "B",
    rationaleCorrect: "ECG confirms ischemia immediately.",
    rationaleIncorrect: [
      { letter: "A", rationale: "O2 only if SpO2 <94%." },
      { letter: "C", rationale: "ECG precedes physician notification." },
      { letter: "D", rationale: "Documentation is not the priority action." },
    ],
    itemKind: "CLINICAL",
  };
}

const CARDS = ["card-1", "card-2", "card-3"];

function freshRuntime(): SessionRuntime {
  return createSessionRuntime(
    CARDS.map((id, i) => makePayload(id, i)),
    "test-session-001",
  );
}

// ── createSessionRuntime ──────────────────────────────────────────────────────

describe("createSessionRuntime", () => {
  it("initialises all cards as UNANSWERED", () => {
    const rt = freshRuntime();
    for (const card of rt.cards) {
      assert.equal(card.state, "UNANSWERED");
      assert.equal(card.revealed, false);
      assert.equal(card.attempt, undefined);
    }
  });

  it("totalCards matches payload count", () => {
    const rt = freshRuntime();
    assert.equal(rt.totalCards, CARDS.length);
    assert.equal(rt.cards.length, CARDS.length);
  });

  it("metrics start at zero", () => {
    const rt = freshRuntime();
    assert.deepEqual(rt.metrics, { correct: 0, incorrect: 0, guessed: 0, bookmarked: 0 });
  });

  it("currentIndex starts at 0", () => {
    const rt = freshRuntime();
    assert.equal(rt.currentIndex, 0);
  });

  it("completed starts false", () => {
    const rt = freshRuntime();
    assert.equal(rt.completed, false);
  });

  it("preserves sessionId", () => {
    const rt = freshRuntime();
    assert.equal(rt.sessionId, "test-session-001");
  });
});

// ── PICK_ANSWER ───────────────────────────────────────────────────────────────

describe("PICK_ANSWER", () => {
  it("transitions UNANSWERED → ANSWERED", () => {
    const rt = sessionRuntimeReducer(freshRuntime(), {
      type: "PICK_ANSWER",
      cardId: "card-1",
      selectedAnswerId: "B",
    });
    const card = rt.cards.find((c) => c.cardId === "card-1")!;
    assert.equal(card.state, "ANSWERED");
    assert.equal(card.selectedAnswerId, "B");
  });

  it("is idempotent when card is already ANSWERED", () => {
    let rt = sessionRuntimeReducer(freshRuntime(), {
      type: "PICK_ANSWER",
      cardId: "card-1",
      selectedAnswerId: "B",
    });
    const before = rt.cards.find((c) => c.cardId === "card-1")!;
    rt = sessionRuntimeReducer(rt, {
      type: "PICK_ANSWER",
      cardId: "card-1",
      selectedAnswerId: "A",
    });
    const after = rt.cards.find((c) => c.cardId === "card-1")!;
    assert.equal(after.selectedAnswerId, before.selectedAnswerId);
  });

  it("ignores unknown cardId", () => {
    const before = freshRuntime();
    const after = sessionRuntimeReducer(before, {
      type: "PICK_ANSWER",
      cardId: "nonexistent",
      selectedAnswerId: "A",
    });
    assert.deepEqual(after, before);
  });

  it("does not mutate metrics", () => {
    const rt = sessionRuntimeReducer(freshRuntime(), {
      type: "PICK_ANSWER",
      cardId: "card-1",
      selectedAnswerId: "B",
    });
    assert.deepEqual(rt.metrics, { correct: 0, incorrect: 0, guessed: 0, bookmarked: 0 });
  });
});

// ── REVEAL ────────────────────────────────────────────────────────────────────

describe("REVEAL", () => {
  function afterAnswer(): SessionRuntime {
    return sessionRuntimeReducer(freshRuntime(), {
      type: "PICK_ANSWER",
      cardId: "card-1",
      selectedAnswerId: "B",
    });
  }

  it("transitions ANSWERED → REVEALED", () => {
    const rt = sessionRuntimeReducer(afterAnswer(), {
      type: "REVEAL",
      cardId: "card-1",
      correct: true,
    });
    const card = rt.cards.find((c) => c.cardId === "card-1")!;
    assert.equal(card.state, "REVEALED");
    assert.equal(card.revealed, true);
    assert.ok(card.attempt);
    assert.equal(card.attempt.correct, true);
  });

  it("increments metrics.correct on correct reveal", () => {
    const rt = sessionRuntimeReducer(afterAnswer(), {
      type: "REVEAL",
      cardId: "card-1",
      correct: true,
    });
    assert.equal(rt.metrics.correct, 1);
    assert.equal(rt.metrics.incorrect, 0);
  });

  it("increments metrics.incorrect on incorrect reveal", () => {
    const rt = sessionRuntimeReducer(afterAnswer(), {
      type: "REVEAL",
      cardId: "card-1",
      correct: false,
    });
    assert.equal(rt.metrics.incorrect, 1);
    assert.equal(rt.metrics.correct, 0);
  });

  it("ignores REVEAL on UNANSWERED card", () => {
    const before = freshRuntime();
    const after = sessionRuntimeReducer(before, {
      type: "REVEAL",
      cardId: "card-1",
      correct: true,
    });
    const card = after.cards.find((c) => c.cardId === "card-1")!;
    assert.equal(card.state, "UNANSWERED");
    assert.deepEqual(after.metrics, before.metrics);
  });

  it("populates attempt with defaults", () => {
    const rt = sessionRuntimeReducer(afterAnswer(), {
      type: "REVEAL",
      cardId: "card-1",
      correct: false,
    });
    const card = rt.cards.find((c) => c.cardId === "card-1")!;
    assert.ok(card.attempt);
    assert.equal(card.attempt.guessed, false);
    assert.equal(card.attempt.bookmarked, false);
  });
});

// ── SET_CONFIDENCE ────────────────────────────────────────────────────────────

describe("SET_CONFIDENCE", () => {
  function afterReveal(): SessionRuntime {
    let rt = sessionRuntimeReducer(freshRuntime(), {
      type: "PICK_ANSWER",
      cardId: "card-1",
      selectedAnswerId: "B",
    });
    rt = sessionRuntimeReducer(rt, {
      type: "REVEAL",
      cardId: "card-1",
      correct: true,
    });
    return rt;
  }

  it("sets confidence on REVEALED card", () => {
    const rt = sessionRuntimeReducer(afterReveal(), {
      type: "SET_CONFIDENCE",
      cardId: "card-1",
      confidence: 4,
    });
    const card = rt.cards.find((c) => c.cardId === "card-1")!;
    assert.equal(card.attempt?.confidence, 4);
  });

  it("overwrites prior confidence", () => {
    let rt = sessionRuntimeReducer(afterReveal(), {
      type: "SET_CONFIDENCE",
      cardId: "card-1",
      confidence: 2,
    });
    rt = sessionRuntimeReducer(rt, {
      type: "SET_CONFIDENCE",
      cardId: "card-1",
      confidence: 5,
    });
    const card = rt.cards.find((c) => c.cardId === "card-1")!;
    assert.equal(card.attempt?.confidence, 5);
  });

  it("ignores SET_CONFIDENCE on UNANSWERED card", () => {
    const before = freshRuntime();
    const after = sessionRuntimeReducer(before, {
      type: "SET_CONFIDENCE",
      cardId: "card-1",
      confidence: 3,
    });
    assert.deepEqual(after, before);
  });
});

// ── TOGGLE_BOOKMARK ───────────────────────────────────────────────────────────

describe("TOGGLE_BOOKMARK", () => {
  function afterReveal(correct = true): SessionRuntime {
    let rt = sessionRuntimeReducer(freshRuntime(), {
      type: "PICK_ANSWER",
      cardId: "card-1",
      selectedAnswerId: "B",
    });
    rt = sessionRuntimeReducer(rt, {
      type: "REVEAL",
      cardId: "card-1",
      correct,
    });
    return rt;
  }

  it("bookmarks a revealed card", () => {
    const rt = sessionRuntimeReducer(afterReveal(), {
      type: "TOGGLE_BOOKMARK",
      cardId: "card-1",
    });
    const card = rt.cards.find((c) => c.cardId === "card-1")!;
    assert.equal(card.attempt?.bookmarked, true);
    assert.equal(rt.metrics.bookmarked, 1);
  });

  it("un-bookmarks when toggled again", () => {
    let rt = sessionRuntimeReducer(afterReveal(), {
      type: "TOGGLE_BOOKMARK",
      cardId: "card-1",
    });
    rt = sessionRuntimeReducer(rt, {
      type: "TOGGLE_BOOKMARK",
      cardId: "card-1",
    });
    const card = rt.cards.find((c) => c.cardId === "card-1")!;
    assert.equal(card.attempt?.bookmarked, false);
    assert.equal(rt.metrics.bookmarked, 0);
  });

  it("does not go negative on metrics.bookmarked", () => {
    const rt = sessionRuntimeReducer(afterReveal(), {
      type: "TOGGLE_BOOKMARK",
      cardId: "card-1",
    });
    const rt2 = sessionRuntimeReducer(rt, {
      type: "TOGGLE_BOOKMARK",
      cardId: "card-1",
    });
    assert.ok(rt2.metrics.bookmarked >= 0);
  });

  it("ignores TOGGLE_BOOKMARK on UNANSWERED card", () => {
    const before = freshRuntime();
    const after = sessionRuntimeReducer(before, {
      type: "TOGGLE_BOOKMARK",
      cardId: "card-1",
    });
    assert.deepEqual(after.metrics.bookmarked, before.metrics.bookmarked);
  });
});

// ── SET_GUESSED ───────────────────────────────────────────────────────────────

describe("SET_GUESSED", () => {
  function afterReveal(): SessionRuntime {
    let rt = sessionRuntimeReducer(freshRuntime(), {
      type: "PICK_ANSWER",
      cardId: "card-1",
      selectedAnswerId: "B",
    });
    rt = sessionRuntimeReducer(rt, {
      type: "REVEAL",
      cardId: "card-1",
      correct: true,
    });
    return rt;
  }

  it("marks card as guessed", () => {
    const rt = sessionRuntimeReducer(afterReveal(), {
      type: "SET_GUESSED",
      cardId: "card-1",
      guessed: true,
    });
    const card = rt.cards.find((c) => c.cardId === "card-1")!;
    assert.equal(card.attempt?.guessed, true);
    assert.equal(rt.metrics.guessed, 1);
  });

  it("clears guessed flag", () => {
    let rt = sessionRuntimeReducer(afterReveal(), {
      type: "SET_GUESSED",
      cardId: "card-1",
      guessed: true,
    });
    rt = sessionRuntimeReducer(rt, {
      type: "SET_GUESSED",
      cardId: "card-1",
      guessed: false,
    });
    assert.equal(rt.metrics.guessed, 0);
  });

  it("is idempotent when setting same value", () => {
    let rt = sessionRuntimeReducer(afterReveal(), {
      type: "SET_GUESSED",
      cardId: "card-1",
      guessed: true,
    });
    const before = rt.metrics.guessed;
    rt = sessionRuntimeReducer(rt, {
      type: "SET_GUESSED",
      cardId: "card-1",
      guessed: true,
    });
    assert.equal(rt.metrics.guessed, before);
  });
});

// ── ADVANCE ───────────────────────────────────────────────────────────────────

describe("ADVANCE", () => {
  function atRevealed(): SessionRuntime {
    let rt = sessionRuntimeReducer(freshRuntime(), {
      type: "PICK_ANSWER",
      cardId: "card-1",
      selectedAnswerId: "B",
    });
    rt = sessionRuntimeReducer(rt, {
      type: "REVEAL",
      cardId: "card-1",
      correct: true,
    });
    return rt;
  }

  it("locks current card and advances index", () => {
    const rt = sessionRuntimeReducer(atRevealed(), { type: "ADVANCE" });
    const card1 = rt.cards.find((c) => c.cardId === "card-1")!;
    assert.equal(card1.state, "LOCKED");
    assert.equal(rt.currentIndex, 1);
  });

  it("does not advance past last card", () => {
    let rt = freshRuntime();
    for (const cardId of CARDS) {
      rt = sessionRuntimeReducer(rt, { type: "PICK_ANSWER", cardId, selectedAnswerId: "B" });
      rt = sessionRuntimeReducer(rt, { type: "REVEAL", cardId, correct: true });
      rt = sessionRuntimeReducer(rt, { type: "ADVANCE" });
    }
    assert.ok(rt.currentIndex < CARDS.length);
  });

  it("ignores ADVANCE when current card is UNANSWERED", () => {
    const before = freshRuntime();
    const after = sessionRuntimeReducer(before, { type: "ADVANCE" });
    assert.equal(after.currentIndex, before.currentIndex);
  });
});

// ── COMPLETE ──────────────────────────────────────────────────────────────────

describe("COMPLETE", () => {
  it("sets completed=true", () => {
    let rt = freshRuntime();
    for (const cardId of CARDS) {
      rt = sessionRuntimeReducer(rt, { type: "PICK_ANSWER", cardId, selectedAnswerId: "A" });
      rt = sessionRuntimeReducer(rt, { type: "REVEAL", cardId, correct: false });
    }
    rt = sessionRuntimeReducer(rt, { type: "COMPLETE" });
    assert.equal(rt.completed, true);
  });

  it("locks the final REVEALED card", () => {
    let rt = freshRuntime();
    for (const cardId of CARDS) {
      rt = sessionRuntimeReducer(rt, { type: "PICK_ANSWER", cardId, selectedAnswerId: "B" });
      rt = sessionRuntimeReducer(rt, { type: "REVEAL", cardId, correct: true });
    }
    rt = sessionRuntimeReducer(rt, { type: "COMPLETE" });
    const lastCard = rt.cards[CARDS.length - 1];
    assert.equal(lastCard?.state, "LOCKED");
  });

  it("can complete from any index", () => {
    const rt = sessionRuntimeReducer(freshRuntime(), { type: "COMPLETE" });
    assert.equal(rt.completed, true);
  });
});

// ── Full session flow ─────────────────────────────────────────────────────────

describe("full session flow", () => {
  it("correct → bookmark → confidence → advance cycle accumulates metrics", () => {
    let rt = freshRuntime();

    for (let i = 0; i < CARDS.length; i++) {
      const cardId = CARDS[i]!;
      rt = sessionRuntimeReducer(rt, { type: "PICK_ANSWER", cardId, selectedAnswerId: "B" });
      rt = sessionRuntimeReducer(rt, {
        type: "REVEAL",
        cardId,
        correct: i < 2,
      });
      rt = sessionRuntimeReducer(rt, {
        type: "SET_CONFIDENCE",
        cardId,
        confidence: (i + 3) as 3 | 4 | 5,
      });
      if (i === 1) {
        rt = sessionRuntimeReducer(rt, { type: "TOGGLE_BOOKMARK", cardId });
      }
      if (i < CARDS.length - 1) {
        rt = sessionRuntimeReducer(rt, { type: "ADVANCE" });
      }
    }
    rt = sessionRuntimeReducer(rt, { type: "COMPLETE" });

    assert.equal(rt.metrics.correct, 2);
    assert.equal(rt.metrics.incorrect, 1);
    assert.equal(rt.metrics.bookmarked, 1);
    assert.equal(rt.completed, true);
    assert.ok(rt.cards.every((c) => c.state === "LOCKED"));
  });

  it("LOCKED cards from resumed session are not re-answered", () => {
    const rt: SessionRuntime = {
      sessionId: "resumed",
      currentIndex: 2,
      totalCards: 3,
      cards: [
        { cardId: "c1", state: "LOCKED", revealed: true, attempt: { correct: true, guessed: false, bookmarked: false } },
        { cardId: "c2", state: "LOCKED", revealed: true, attempt: { correct: false, guessed: false, bookmarked: true } },
        { cardId: "c3", state: "UNANSWERED", revealed: false },
      ],
      metrics: { correct: 1, incorrect: 1, guessed: 0, bookmarked: 1 },
      completed: false,
    };

    const attempt = sessionRuntimeReducer(rt, {
      type: "PICK_ANSWER",
      cardId: "c1",
      selectedAnswerId: "A",
    });
    const c1 = attempt.cards.find((c) => c.cardId === "c1")!;
    assert.equal(c1.state, "LOCKED");
    assert.notEqual(c1.selectedAnswerId, "A");
  });
});
