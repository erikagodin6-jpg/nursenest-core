import assert from "node:assert/strict";
import test from "node:test";

import {
  ECG_PREMIUM_LESSON_BLUEPRINTS,
  assertEcgPremiumLessonBlueprintComplete,
  getEcgPremiumLessonBlueprint,
} from "@/lib/ecg-module/ecg-premium-lesson-blueprint";

test("premium ECG lesson blueprints include initial rhythms", () => {
  const tags = ECG_PREMIUM_LESSON_BLUEPRINTS.map((lesson) => lesson.rhythmTag);
  assert.ok(tags.includes("atrial_fibrillation"));
  assert.ok(tags.includes("mobitz_ii"));
  assert.ok(tags.includes("fascicular_vt"));
});

test("premium ECG lesson blueprints pass completeness checks", () => {
  for (const lesson of ECG_PREMIUM_LESSON_BLUEPRINTS) {
    assert.doesNotThrow(() => assertEcgPremiumLessonBlueprintComplete(lesson));
  }
});

test("premium ECG lesson lookup normalizes tags", () => {
  assert.equal(getEcgPremiumLessonBlueprint("atrial-fibrillation")?.rhythmTag, "atrial_fibrillation");
  assert.equal(getEcgPremiumLessonBlueprint("Mobitz II")?.rhythmTag, "mobitz_ii");
  assert.equal(getEcgPremiumLessonBlueprint("fascicular vt")?.rhythmTag, "fascicular_vt");
});

test("premium ECG lessons link into product pathways", () => {
  for (const lesson of ECG_PREMIUM_LESSON_BLUEPRINTS) {
    const hrefs = lesson.internalLinks.map((link) => link.href);
    assert.ok(hrefs.includes("/ecg-interpretation"));
    assert.ok(hrefs.includes("/app/practice-tests"));
    assert.ok(hrefs.includes("/app/flashcards"));
  }
});
