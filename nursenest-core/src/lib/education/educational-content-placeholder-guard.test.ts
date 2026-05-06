import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  collectEducationalPlaceholderIds,
  hasEducationalAiDisclaimerLanguage,
  hasLargeDuplicateParagraphBlock,
} from "@/lib/education/educational-content-placeholder-guard";

describe("educational-content-placeholder-guard", () => {
  it("collects stable ids for obvious stubs", () => {
    const ids = collectEducationalPlaceholderIds("Intro lorem ipsum filler and a [TODO] marker.");
    assert.ok(ids.includes("lorem_ipsum"));
    assert.ok(ids.includes("fixme_bracket"));
  });

  it("detects AI disclaimer phrasing", () => {
    assert.equal(hasEducationalAiDisclaimerLanguage("As an AI, I cannot give medical advice."), true);
    assert.equal(hasEducationalAiDisclaimerLanguage("Nursing assessment includes vitals."), false);
  });

  it("detects duplicate long paragraphs in markdown-ish bodies", () => {
    const para =
      "This is a long clinical paragraph that repeats verbatim for testing purposes and must exceed the minimum character threshold for duplicate detection in lesson bodies.";
    const body = `${para}\n\n${para}\n\nShort tail.`;
    assert.equal(hasLargeDuplicateParagraphBlock(body, 120), true);
    assert.equal(hasLargeDuplicateParagraphBlock("Short only.\n\nAlso short.", 120), false);
  });
});
