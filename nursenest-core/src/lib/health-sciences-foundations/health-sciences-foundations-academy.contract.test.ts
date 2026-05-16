import assert from "node:assert/strict";
import test from "node:test";

import {
  FOUNDATION_REQUIRED_LESSON_SECTIONS,
  HEALTH_SCIENCES_FOUNDATIONS_ACADEMY,
  collectFoundationCompetencyIds,
  flattenFoundationLessons,
  validateHealthSciencesFoundationsAcademy,
} from "./health-sciences-foundations-academy";

test("Health Sciences Foundations Academy validates cleanly", () => {
  assert.deepEqual(validateHealthSciencesFoundationsAcademy(), { ok: true });
});

test("academy has the required university-style hierarchy", () => {
  const academy = HEALTH_SCIENCES_FOUNDATIONS_ACADEMY;

  assert.equal(academy.id, "health-sciences-foundations");
  assert.ok(academy.semesters.length >= 3, "expected at least three semesters");
  assert.ok(academy.semesters.every((semester) => semester.units.length > 0), "every semester needs units");
  assert.ok(
    academy.semesters.every((semester) =>
      semester.units.every((unit) => unit.modules.length > 0 && unit.modules.every((module) => module.lessons.length > 0)),
    ),
    "every unit needs modules and every module needs lessons",
  );
});

test("every foundation lesson follows the complete lesson-authoring standard", () => {
  const lessons = flattenFoundationLessons();
  assert.ok(lessons.length >= 24, "expected a complete foundation starter curriculum, not a thin outline");

  for (const lesson of lessons) {
    for (const section of FOUNDATION_REQUIRED_LESSON_SECTIONS) {
      assert.ok(
        lesson.requiredLessonSections.includes(section),
        `${lesson.id} must include required lesson section ${section}`,
      );
    }
    assert.ok(lesson.summary.length >= 40, `${lesson.id} needs a meaningful summary`);
    assert.ok(lesson.estimatedMinutes >= 20, `${lesson.id} should be a substantive lesson`);
    assert.ok(lesson.competencyIds.length >= 1, `${lesson.id} must map to at least one competency`);
    assert.ok(lesson.assessmentModes.includes("mini_quiz"), `${lesson.id} must include a mastery checkpoint`);
  }
});

test("competency graph has no orphaned lesson references", () => {
  const competencyIds = new Set(collectFoundationCompetencyIds());

  for (const lesson of flattenFoundationLessons()) {
    for (const competencyId of lesson.competencyIds) {
      assert.ok(competencyIds.has(competencyId), `${lesson.id} references missing competency ${competencyId}`);
    }
  }
});

test("foundation competencies support admissions, nursing, allied health, ECG, and critical care downstream products", () => {
  const academy = HEALTH_SCIENCES_FOUNDATIONS_ACADEMY;
  const downstream = new Set(academy.downstreamPrograms);

  assert.ok(downstream.has("HESI A2 Admissions Prep"));
  assert.ok(downstream.has("ATI TEAS Admissions Prep"));
  assert.ok(downstream.has("ECG Institute"));
  assert.ok(downstream.has("Respiratory Therapy Academy"));
  assert.ok(downstream.has("Paramedic / EMT Academy"));
  assert.ok(downstream.has("CNA / PSW Academy"));
  assert.ok(downstream.has("Critical Care Institute"));
});

test("remediation routes stay learner-app scoped", () => {
  for (const competency of HEALTH_SCIENCES_FOUNDATIONS_ACADEMY.competencies) {
    assert.match(competency.remediationRoute, /^\/app\/lessons\?competency=/);
    assert.ok(competency.masteryThreshold >= 70 && competency.masteryThreshold <= 100);
  }
});
