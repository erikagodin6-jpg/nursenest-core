import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { CountryCode } from "@prisma/client";
import { normalizeLearnerFlashcardsPathwayQueryId } from "@/lib/flashcards/flashcards-pathway-query";

describe("normalizeLearnerFlashcardsPathwayQueryId", () => {
  it("maps short Canada NP slug to canonical pathway id", () => {
    assert.equal(normalizeLearnerFlashcardsPathwayQueryId("ca-np", CountryCode.CA), "ca-np-cnple");
    assert.equal(normalizeLearnerFlashcardsPathwayQueryId("ca-np", CountryCode.US), "ca-np-cnple");
  });

  it("maps new-grad hub slug to bundled new-grad transition pathway", () => {
    assert.equal(normalizeLearnerFlashcardsPathwayQueryId("new-grad", CountryCode.US), "us-rn-new-grad-transition");
  });

  it("maps allied-health to country-scoped allied core pathway", () => {
    assert.equal(normalizeLearnerFlashcardsPathwayQueryId("allied-health", CountryCode.US), "us-allied-core");
    assert.equal(normalizeLearnerFlashcardsPathwayQueryId("allied-health", CountryCode.CA), "ca-allied-core");
  });

  it("passes through canonical ids unchanged", () => {
    assert.equal(normalizeLearnerFlashcardsPathwayQueryId("ca-rn-nclex-rn", CountryCode.CA), "ca-rn-nclex-rn");
    assert.equal(normalizeLearnerFlashcardsPathwayQueryId("ca-rpn-rex-pn", CountryCode.CA), "ca-rpn-rex-pn");
  });
});
