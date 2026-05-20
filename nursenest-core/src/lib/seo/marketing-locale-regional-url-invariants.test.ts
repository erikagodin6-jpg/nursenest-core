import assert from "node:assert/strict";
import test from "node:test";
import {
  isDisallowedMarketingSeoPathname,
  pathnameHasLocalePrefixBeforeExamCountry,
} from "@/lib/seo/marketing-locale-regional-url-invariants";

test("pathnameHasLocalePrefixBeforeExamCountry detects /fr/us/…", () => {
  assert.equal(pathnameHasLocalePrefixBeforeExamCountry("/fr/us/np/fnp"), true);
  assert.equal(pathnameHasLocalePrefixBeforeExamCountry("/fr/canada/np/foo"), true);
});

test("pathnameHasLocalePrefixBeforeExamCountry allows /us/np/… and /fr/pricing", () => {
  assert.equal(pathnameHasLocalePrefixBeforeExamCountry("/us/np/fnp"), false);
  assert.equal(pathnameHasLocalePrefixBeforeExamCountry("/fr/pricing"), false);
  assert.equal(pathnameHasLocalePrefixBeforeExamCountry("/fr/india/nursing-exams"), false);
});

test("isDisallowedMarketingSeoPathname rejects locale-first paths with 5+ segments", () => {
  assert.equal(isDisallowedMarketingSeoPathname("/fr/a/b/c/d"), true);
  assert.equal(isDisallowedMarketingSeoPathname("/fr/pre-nursing/lessons/slug"), false);
});

test("isDisallowedMarketingSeoPathname rejects locale-prefixed default-only /exams/:country URLs", () => {
  assert.equal(isDisallowedMarketingSeoPathname("/fr/exams/philippines"), true);
  assert.equal(isDisallowedMarketingSeoPathname("/fr/exams/canada"), true);
  assert.equal(isDisallowedMarketingSeoPathname("/fr/exams/india"), false);
  assert.equal(isDisallowedMarketingSeoPathname("/exams/philippines"), false);
});
