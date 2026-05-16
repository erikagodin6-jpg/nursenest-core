import assert from "node:assert/strict";
import test from "node:test";

import {
  ADMISSIONS_ACADEMY_PROGRAMS,
  HESI_A2_ACADEMY,
  ATI_TEAS_ACADEMY,
  flattenAdmissionsAcademyLessons,
  validateAdmissionsAcademyPrograms,
} from "./admissions-academy-programs";

test("Admissions academies validate cleanly", () => {
  assert.deepEqual(validateAdmissionsAcademyPrograms(), { ok: true });
});

test("HESI A2 academy has all required domains", () => {
  const domains = new Set(HESI_A2_ACADEMY.domains.map((domain) => domain.id));

  assert.ok(domains.has("hesi-a2-anatomy-physiology"));
  assert.ok(domains.has("hesi-a2-biology"));
  assert.ok(domains.has("hesi-a2-chemistry"));
  assert.ok(domains.has("hesi-a2-math"));
  assert.ok(domains.has("hesi-a2-grammar"));
  assert.ok(domains.has("hesi-a2-vocabulary"));
  assert.ok(domains.has("hesi-a2-reading-comprehension"));
  assert.ok(domains.has("hesi-a2-critical-thinking"));
});

test("ATI TEAS academy has all required domains", () => {
  const domains = new Set(ATI_TEAS_ACADEMY.domains.map((domain) => domain.id));

  assert.ok(domains.has("ati-teas-reading"));
  assert.ok(domains.has("ati-teas-math"));
  assert.ok(domains.has("ati-teas-science"));
  assert.ok(domains.has("ati-teas-english-language-usage"));
});

test("all admissions programs are mapped to foundation competencies", () => {
  for (const program of ADMISSIONS_ACADEMY_PROGRAMS) {
    for (const programDomain of program.domains) {
      assert.ok(programDomain.foundationCompetencyIds.length >= 1);
      assert.ok(programDomain.lessons.every((lessonItem) => lessonItem.foundationCompetencyIds.length >= 1));
    }
  }
});

test("admissions programs cannot regress into thin quiz-bank products", () => {
  for (const program of ADMISSIONS_ACADEMY_PROGRAMS) {
    assert.ok(program.freeFunnel.length >= 4);
    assert.ok(program.premiumFeatures.length >= 8);
    assert.ok(program.launchRequirements.length >= 4);

    for (const programDomain of program.domains) {
      assert.ok(programDomain.lessons.length >= 1);
      assert.ok(programDomain.diagnosticBlueprint.length >= 3);
      assert.ok(programDomain.remediationRules.length >= 1);
    }
  }
});

test("admissions academy lessons support timed/adaptive preparation", () => {
  const lessons = flattenAdmissionsAcademyLessons();
  assert.ok(lessons.length >= 20, "expected substantial admissions curriculum coverage");

  for (const lessonItem of lessons) {
    assert.ok(lessonItem.assessmentModes.includes("mini_quiz"));
    assert.ok(
      lessonItem.assessmentModes.includes("timed_drill") || lessonItem.assessmentModes.includes("case_prompt"),
      `${lessonItem.id} should support applied admissions-prep assessment modes`,
    );
    assert.ok(lessonItem.premiumReady, `${lessonItem.id} should be premium-ready`);
  }
});
