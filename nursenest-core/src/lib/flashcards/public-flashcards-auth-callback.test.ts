import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  publicFlashcardDeckLoginHref,
  publicFlashcardsHubLoginHref,
} from "@/lib/flashcards/public-flashcards-auth-callback";

describe("public flashcards auth callbacks", () => {
  it("sends public hub sign-in to the regional learner flashcards hub", () => {
    assert.equal(
      publicFlashcardsHubLoginHref("en", "CA"),
      "/login?callbackUrl=%2Fapp%2Fflashcards%3FpathwayId%3Dca-rn-nclex-rn",
    );
    assert.equal(
      publicFlashcardsHubLoginHref("en", "US"),
      "/login?callbackUrl=%2Fapp%2Fflashcards%3FpathwayId%3Dus-rn-nclex-rn",
    );
  });

  it("sends public deck study CTA to the learner deck session launcher", () => {
    assert.equal(
      publicFlashcardDeckLoginHref("en", "cardiac-rhythm-basics"),
      "/login?callbackUrl=%2Fapp%2Fflashcards%2Fcardiac-rhythm-basics%3Fstart%3D1%26shuffle%3D1",
    );
  });
});
