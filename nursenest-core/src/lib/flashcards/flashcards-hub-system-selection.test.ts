import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  normalizeFlashcardsHubSystemSelection,
  toggleFlashcardsHubSystemSelection,
} from "@/lib/flashcards/flashcards-hub-system-selection";

describe("flashcards hub system selection", () => {
  it("adds a second system instead of replacing the first one", () => {
    assert.deepEqual(
      toggleFlashcardsHubSystemSelection(["cardiovascular"], "respiratory"),
      ["cardiovascular", "respiratory"],
    );
  });

  it("toggles an active system off", () => {
    assert.deepEqual(
      toggleFlashcardsHubSystemSelection(["cardiovascular", "respiratory"], "cardiovascular"),
      ["respiratory"],
    );
  });

  it("deduplicates and ignores unknown ids", () => {
    assert.deepEqual(
      normalizeFlashcardsHubSystemSelection(["respiratory", "bogus", "respiratory", "cardiovascular"]),
      ["cardiovascular", "respiratory"],
    );
  });
});
