import assert from "node:assert/strict";
import test from "node:test";
import {
  containsPlaceholderCTACopy,
  isLikelyCTA,
  normalizeCTAText,
  validateCTACasing,
} from "./cta-copy-policy";

test("normalizes compact CTA text while preserving clinical acronyms", () => {
  assert.equal(normalizeCTAText("launch cat exam"), "Launch CAT Exam");
  assert.equal(normalizeCTAText("review rex-pn labs"), "Review REx-PN Labs");
  assert.equal(normalizeCTAText("start rn nclex practice"), "Start RN NCLEX Practice");
  assert.equal(normalizeCTAText("continue to ecg flashcards"), "Continue to ECG Flashcards");
  assert.equal(normalizeCTAText("open iv medication review"), "Open IV Medication Review");
});

test("keeps connector words lowercase only when they sit between CTA terms", () => {
  assert.equal(normalizeCTAText("View plans and pricing"), "View Plans and Pricing");
  assert.equal(normalizeCTAText("continue to flashcards"), "Continue to Flashcards");
  assert.equal(normalizeCTAText("join or sign in"), "Join or Sign In");
});

test("rejects sentence-case and malformed compact CTAs", () => {
  const sentence = validateCTACasing("Create account");
  assert.equal(sentence.ok, false);
  assert.deepEqual(sentence.issues, ["malformed-casing"]);
  assert.equal(sentence.normalized, "Create Account");

  const priorBug = validateCTACasing("View plans and pricing");
  assert.equal(priorBug.ok, false);
  assert.ok(priorBug.issues.includes("malformed-casing"));
  assert.equal(priorBug.normalized, "View Plans and Pricing");
});

test("rejects all-caps CTA regressions", () => {
  const result = validateCTACasing("START PRACTICE TEST");
  assert.equal(result.ok, false);
  assert.ok(result.issues.includes("all-caps"));
  assert.equal(result.normalized, "Start Practice Test");
});

test("detects placeholder and generic CTA copy", () => {
  assert.equal(containsPlaceholderCTACopy("placeholder CTA"), true);
  assert.equal(containsPlaceholderCTACopy("click here"), true);
  assert.equal(containsPlaceholderCTACopy("CTA"), true);
  assert.equal(validateCTACasing("placeholder CTA").ok, false);
});

test("keeps compact CTA scope separate from prose", () => {
  assert.equal(isLikelyCTA("Learn more about this feature now"), false);
  assert.equal(isLikelyCTA("Clinical reasoning improves when learners practice retrieval."), false);
  assert.equal(isLikelyCTA("Start Mixed Practice"), true);
  assert.equal(isLikelyCTA("A sentence body", "ctaText"), true);
});

test("captures actual prior CTA regression fixtures", () => {
  const fixtures = [
    ["View plans and pricing", "View Plans and Pricing"],
    ["Choose your occupation track", "Choose Your Occupation Track"],
    ["Start mixed practice (all hubs)", "Start Mixed Practice (All Hubs)"],
    ["Create account", "Create Account"],
  ] as const;

  for (const [input, expected] of fixtures) {
    const result = validateCTACasing(input);
    assert.equal(result.ok, false, input);
    assert.equal(result.normalized, expected);
  }
});

test("accepts approved CTA examples", () => {
  for (const cta of [
    "View Plans and Pricing",
    "Start Mixed Practice",
    "Launch CAT Exam",
    "Create Account",
    "Continue to Flashcards",
    "Review REx-PN Labs",
  ]) {
    assert.deepEqual(validateCTACasing(cta), {
      ok: true,
      normalized: cta,
      issues: [],
    });
  }
});

