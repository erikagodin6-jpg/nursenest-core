import assert from "node:assert/strict";
import { test } from "node:test";
import { hashBetaCode, normalizeBetaCode, parseBetaFeatures } from "@/lib/beta/beta-access";

test("normalizes beta access codes consistently", () => {
  assert.equal(normalizeBetaCode(" flashcards v2 "), "FLASHCARDS-V2");
  assert.equal(normalizeBetaCode("ClinicalSkills-Early"), "CLINICALSKILLS-EARLY");
});

test("hashes beta codes without storing raw values", () => {
  assert.equal(hashBetaCode("flashcards v2"), hashBetaCode("FLASHCARDS-V2"));
  assert.notEqual(hashBetaCode("flashcards v2"), "FLASHCARDS-V2");
  assert.equal(hashBetaCode("flashcards v2").length, 64);
});

test("parses only supported beta feature keys from form input", () => {
  const parsed = parseBetaFeatures([
    "FLASHCARDS_V2",
    "FLASHCARDS_V2",
    "NOT_A_FEATURE",
    "ECG_ENHANCEMENTS",
  ]);
  assert.deepEqual(parsed, ["FLASHCARDS_V2", "ECG_ENHANCEMENTS"]);
});
