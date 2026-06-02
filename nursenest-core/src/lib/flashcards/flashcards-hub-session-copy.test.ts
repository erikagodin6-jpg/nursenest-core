import { describe, expect, it } from "vitest";
import { buildFlashcardsSessionPreview } from "@/lib/flashcards/flashcards-hub-session-copy";

describe("buildFlashcardsSessionPreview", () => {
  it("builds preview and CTA subline for focused systems", () => {
    const { preview, ctaSubline } = buildFlashcardsSessionPreview({
      effectiveCount: 20,
      cardLimit: 20,
      selectedCanonicalIds: ["cardiovascular", "respiratory"],
      shuffleOn: true,
      weakOnly: false,
      notStudiedOnly: false,
      incorrectOnly: false,
    });
    expect(preview).toContain("20");
    expect(preview).toContain("Cardiovascular");
    expect(ctaSubline).toContain("Shuffle on");
  });

  it("labels full review mode", () => {
    const { ctaSubline } = buildFlashcardsSessionPreview({
      effectiveCount: 120,
      cardLimit: "all",
      selectedCanonicalIds: [],
      shuffleOn: false,
      weakOnly: false,
      notStudiedOnly: false,
      incorrectOnly: false,
    });
    expect(ctaSubline).toContain("Full review");
  });
});
