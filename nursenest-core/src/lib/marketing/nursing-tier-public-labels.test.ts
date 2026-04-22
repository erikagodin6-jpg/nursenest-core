import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  defaultFlashcardsMetaDescription,
  defaultFlashcardsMetaTitle,
  defaultPublicLessonsMetaDescription,
  defaultQuestionBankMetaTitle,
  publicLessonsHubSectionLeadPn,
  publicLessonsHubSectionHeadingPn,
} from "@/lib/marketing/nursing-tier-public-labels";

describe("nursing-tier-public-labels region divergence (US vs Canada)", () => {
  it("PN headings use NCLEX-PN in US and REx-PN in Canada", () => {
    assert.match(publicLessonsHubSectionHeadingPn("US"), /NCLEX-PN/);
    assert.match(publicLessonsHubSectionHeadingPn("CA"), /REx-PN/);
    assert.equal(publicLessonsHubSectionHeadingPn("US").includes("REx-PN"), false);
    assert.equal(publicLessonsHubSectionHeadingPn("CA").includes("NCLEX-PN"), false);
  });

  it("PN marketing leads stay country-scoped (no cross-packaging copy)", () => {
    assert.match(publicLessonsHubSectionLeadPn("US"), /US exam|United States/i);
    assert.match(publicLessonsHubSectionLeadPn("CA"), /Canadian|REx-PN/);
    assert.equal(publicLessonsHubSectionLeadPn("US").includes("REx-PN"), false);
    assert.equal(publicLessonsHubSectionLeadPn("CA").includes("NCLEX-PN content repackaged"), true);
  });

  it("meta titles for lessons, question bank, and flashcards differ by region (exam naming)", () => {
    assert.match(defaultPublicLessonsMetaDescription("US"), /NCLEX-PN \(LPN \/ LVN\)/);
    assert.match(defaultPublicLessonsMetaDescription("CA"), /REx-PN \(RPN\)/);
    assert.match(defaultQuestionBankMetaTitle("US"), /NCLEX-PN/);
    assert.match(defaultQuestionBankMetaTitle("CA"), /REx-PN/);
    assert.match(defaultFlashcardsMetaTitle("US"), /NCLEX-PN/);
    assert.match(defaultFlashcardsMetaTitle("CA"), /REx-PN/);
    assert.match(defaultFlashcardsMetaDescription("US"), /NCLEX-PN/);
    assert.match(defaultFlashcardsMetaDescription("CA"), /REx-PN/);
    assert.notEqual(defaultFlashcardsMetaTitle("US"), defaultFlashcardsMetaTitle("CA"));
  });
});
