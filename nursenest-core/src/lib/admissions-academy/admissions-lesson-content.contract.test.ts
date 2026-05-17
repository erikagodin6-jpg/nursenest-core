import assert from "node:assert/strict";
import test from "node:test";

import {
  STARTER_ADMISSIONS_LESSON_CONTENT,
  getAdmissionsLessonContentForProgram,
  validateStarterAdmissionsLessonContent,
} from "./admissions-lesson-content";

test("starter admissions lesson content validates cleanly", () => {
  assert.deepEqual(validateStarterAdmissionsLessonContent(), { ok: true });
});

test("starter content includes both HESI A2 and ATI TEAS lessons", () => {
  assert.ok(getAdmissionsLessonContentForProgram("hesi-a2-academy").length >= 2);
  assert.ok(getAdmissionsLessonContentForProgram("ati-teas-academy").length >= 2);
});

test("authored lessons include full education blocks, not outline-only placeholders", () => {
  for (const lesson of STARTER_ADMISSIONS_LESSON_CONTENT) {
    assert.ok(lesson.blocks.deepTeaching.join(" ").length >= 180, `${lesson.id} needs substantive deep teaching`);
    assert.ok(lesson.blocks.examTraps.length >= 1, `${lesson.id} needs exam-trap teaching`);
    assert.ok(lesson.blocks.commonMistakes.length >= 1, `${lesson.id} needs common mistakes`);
    assert.ok(lesson.blocks.remediation.length >= 1, `${lesson.id} needs remediation instructions`);
    assert.ok(lesson.remediationTargets.length >= 1, `${lesson.id} needs remediation targets`);
  }
});

test("practice rationales teach mechanisms and every incorrect answer", () => {
  for (const lesson of STARTER_ADMISSIONS_LESSON_CONTENT) {
    for (const question of lesson.practiceQuestions) {
      assert.equal(question.options.length, 4);
      assert.ok(question.rationale.correct.length >= 30, `${lesson.id} correct rationale too short`);
      assert.equal(question.rationale.incorrect.length, question.options.length - 1);
      assert.ok(question.rationale.mechanism.length >= 40, `${lesson.id} missing mechanism rationale`);
      assert.ok(question.rationale.examTrap.length >= 30, `${lesson.id} missing exam-trap rationale`);
    }
  }
});

test("flashcards include multiple learning modes", () => {
  const cardTypes = new Set(STARTER_ADMISSIONS_LESSON_CONTENT.flatMap((lesson) => lesson.flashcards.map((card) => card.cardType)));

  assert.ok(cardTypes.has("recall"));
  assert.ok(cardTypes.has("mechanism"));
  assert.ok(cardTypes.has("exam_trap"));
  assert.ok(cardTypes.has("clinical_reasoning"));
});
