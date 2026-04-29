import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { isSyntheticFlashcardStudyId } from "@/lib/flashcards/flashcard-access";

describe("isSyntheticFlashcardStudyId", () => {
  it("flags lesson-linked and catalog-derived ids", () => {
    assert.equal(isSyntheticFlashcardStudyId("lq:ca-rn:a:b:pre"), true);
    assert.equal(isSyntheticFlashcardStudyId("lrp:ca-rn:slug:sec:1"), true);
    assert.equal(isSyntheticFlashcardStudyId("ltk:ca-rn:slug:tk:0"), true);
    assert.equal(isSyntheticFlashcardStudyId("lta:ca-rn:slug"), true);
    assert.equal(isSyntheticFlashcardStudyId("clrz_01abc"), false);
  });
});
