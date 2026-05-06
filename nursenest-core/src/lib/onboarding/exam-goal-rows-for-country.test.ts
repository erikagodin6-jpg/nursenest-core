import assert from "node:assert/strict";
import test from "node:test";
import { examGoalRowsForCountry, normalizeOnboardingCountry } from "./exam-goal-rows-for-country";

test("normalizeOnboardingCountry maps ISO-2 and unknown", () => {
  assert.equal(normalizeOnboardingCountry("us"), "US");
  assert.equal(normalizeOnboardingCountry("CA"), "CA");
  assert.equal(normalizeOnboardingCountry(null), "OTHER");
  assert.equal(normalizeOnboardingCountry("IN"), "OTHER");
});

test("US PN row uses NCLEX-PN wording", () => {
  const rows = examGoalRowsForCountry("US");
  const rpn = rows.find((r) => r.id === "rpn");
  assert.ok(rpn);
  assert.match(rpn.label, /NCLEX-PN/i);
  assert.match(rpn.description, /NCLEX-PN/i);
});

test("CA RPN row uses REx-PN wording", () => {
  const rows = examGoalRowsForCountry("CA");
  const rpn = rows.find((r) => r.id === "rpn");
  assert.ok(rpn);
  assert.match(rpn.label, /REx-PN|RPN/i);
  assert.match(rpn.description, /REx-PN|Canadian/i);
});

test("OTHER keeps combined RPN / LPN label", () => {
  const rows = examGoalRowsForCountry("OTHER");
  const rpn = rows.find((r) => r.id === "rpn");
  assert.ok(rpn);
  assert.match(rpn.label, /RPN.*LPN|LPN.*RPN/);
});
