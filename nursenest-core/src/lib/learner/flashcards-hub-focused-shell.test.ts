import { describe, expect, it } from "vitest";
import { isFlashcardsHubLandingPath } from "@/lib/learner/flashcards-hub-focused-shell";

describe("isFlashcardsHubLandingPath", () => {
  it("matches hub only, not child routes", () => {
    expect(isFlashcardsHubLandingPath("/app/flashcards")).toBe(true);
    expect(isFlashcardsHubLandingPath("/app/flashcards/")).toBe(true);
    expect(isFlashcardsHubLandingPath("/app/flashcards?pathwayId=us-rn-nclex-rn")).toBe(true);
    expect(isFlashcardsHubLandingPath("/app/flashcards/custom")).toBe(false);
    expect(isFlashcardsHubLandingPath("/app/flashcards/weak-areas")).toBe(false);
    expect(isFlashcardsHubLandingPath("/app/flashcards/my-deck")).toBe(false);
  });
});
