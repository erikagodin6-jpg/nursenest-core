import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  isFlashcardsFocusedStudyPath,
  isFlashcardsHubLandingPath,
} from "@/lib/learner/flashcards-hub-focused-shell";

describe("flashcards focused learner shell routes", () => {
  it("keeps the hub distinct from active study routes", () => {
    assert.equal(isFlashcardsHubLandingPath("/app/flashcards"), true);
    assert.equal(isFlashcardsHubLandingPath("/app/flashcards/cardiac-rhythm-basics"), false);
    assert.equal(isFlashcardsFocusedStudyPath("/app/flashcards"), false);
  });

  it("treats deck, custom, and weak-area study pages as focused study surfaces", () => {
    assert.equal(isFlashcardsFocusedStudyPath("/app/flashcards/cardiac-rhythm-basics?start=1"), true);
    assert.equal(isFlashcardsFocusedStudyPath("/app/flashcards/custom?pathwayId=us-rn-nclex-rn"), true);
    assert.equal(isFlashcardsFocusedStudyPath("/app/flashcards/weak-areas"), true);
  });

  it("does not collapse deck library or legacy nested detail routes into focused study", () => {
    assert.equal(isFlashcardsFocusedStudyPath("/app/flashcards/decks"), false);
    assert.equal(isFlashcardsFocusedStudyPath("/app/flashcards/decks/deck_123"), false);
  });
});
