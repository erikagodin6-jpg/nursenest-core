import { describe, expect, it } from "vitest";
import {
  cardLimitQueryValue,
  effectiveSessionCardCount,
  resolveNumericCardLimit,
  sessionSizeLabel,
} from "@/lib/flashcards/flashcards-hub-preferences";

describe("flashcards-hub-preferences", () => {
  it("maps card limits for API query", () => {
    expect(cardLimitQueryValue(20)).toBe("20");
    expect(cardLimitQueryValue("all")).toBe("all");
    expect(resolveNumericCardLimit("all")).toBe(500);
  });

  it("caps effective session size to matching pool", () => {
    expect(effectiveSessionCardCount(100, 42)).toBe(42);
    expect(effectiveSessionCardCount("all", 42)).toBe(42);
    expect(effectiveSessionCardCount(10, null)).toBe(10);
  });

  it("labels session size when pool is smaller than request", () => {
    expect(sessionSizeLabel(50, 12, 12)).toContain("12 cards");
    expect(sessionSizeLabel("all", 12, 12)).toContain("All cards");
  });
});
