import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { buildHomepageHeroSlidesAtIndices } from "@/config/home-hero-carousel";

describe("home-hero-carousel copy fallbacks", () => {
  it("does not expose humanized missing-key placeholders in slide copy", () => {
    const slides = buildHomepageHeroSlidesAtIndices((key) => {
      if (key.endsWith(".label")) return "KICKER";
      if (key.endsWith(".title")) return "Title";
      return "Body";
    }, [0]);

    const slide = slides[0]!;
    assert.notEqual(slide.label, "KICKER");
    assert.notEqual(slide.title, "Title");
    assert.notEqual(slide.caption, "Body");
    assert.ok(slide.title.length > 8);
    assert.ok(slide.caption.length > 8);
  });
});
