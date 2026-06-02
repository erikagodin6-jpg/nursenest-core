import assert from "node:assert/strict";
import test from "node:test";

import {
  buildSimpleCorrectRationale,
  buildSimpleDistractorRationale,
  isGenericRationaleText,
  validateRationaleQuality,
} from "@/lib/questions/rationale-quality";

test("fallback rationale teaches oxytocin instead of generic priority boilerplate", () => {
  const stem = "Which hormone stimulates uterine contractions during labor?";
  const rationale = buildSimpleCorrectRationale({
    stem,
    correctOptionText: "Oxytocin",
  });

  assert.match(rationale, /Oxytocin/i);
  assert.match(rationale, /uterine smooth muscle contractions|uterine contractions/i);
  assert.doesNotMatch(rationale, /prevents harm|priority cue|safe escalation|nursing process/i);
  assert.equal(validateRationaleQuality({ stem, correctOptionText: "Oxytocin" }, rationale).pass, true);
});

test("fallback distractor rationale explains progesterone specifically", () => {
  const stem = "Which hormone stimulates uterine contractions during labor?";
  const rationale = buildSimpleDistractorRationale({
    stem,
    optionText: "Progesterone",
    correctOptionText: "Oxytocin",
  });

  assert.match(rationale, /Progesterone/i);
  assert.match(rationale, /suppresses uterine contractility|maintains/i);
  assert.match(rationale, /Oxytocin/i);
  assert.doesNotMatch(rationale, /not the best answer|lower-priority care/i);
});

test("quality validator fails generic boilerplate and repeated stems", () => {
  const stem = "Which hormone stimulates uterine contractions during labor?";
  const rationale =
    "Which hormone stimulates uterine contractions during labor? The clinical reasoning is to choose the action that prevents harm.";
  const result = validateRationaleQuality({ stem, correctOptionText: "Oxytocin" }, rationale);

  assert.equal(result.pass, false);
  assert.ok(result.issues.includes("generic_boilerplate"));
  assert.ok(result.issues.includes("repeats_stem"));
  assert.ok(result.issues.includes("missing_tested_concept"));
  assert.equal(isGenericRationaleText(rationale), true);
});

