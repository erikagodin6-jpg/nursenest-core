import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { pathwayHubAppFlashcardsHref, pathwayHubAppPracticeTestsHref } from "@/lib/marketing/pathway-hub-app-questions-href";

describe("pathway hub → in-app study hrefs", () => {
  it("flashcards hub carries pathwayId for US and Canada RN", () => {
    assert.equal(pathwayHubAppFlashcardsHref("us-rn-nclex-rn"), "/app/flashcards?pathwayId=us-rn-nclex-rn");
    assert.equal(pathwayHubAppFlashcardsHref("ca-rn-nclex-rn"), "/app/flashcards?pathwayId=ca-rn-nclex-rn");
  });

  it("practice tests hub carries pathwayId for US and Canada RN", () => {
    assert.equal(pathwayHubAppPracticeTestsHref("us-rn-nclex-rn"), "/app/practice-tests?pathwayId=us-rn-nclex-rn");
    assert.equal(pathwayHubAppPracticeTestsHref("ca-rn-nclex-rn"), "/app/practice-tests?pathwayId=ca-rn-nclex-rn");
  });
});
