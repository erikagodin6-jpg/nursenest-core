import assert from "node:assert/strict";
import test from "node:test";
import {
  buildCurriculumCoverageDashboard,
  buildCurriculumCoverageReport,
  CURRICULUM_DEFINITIONS,
  inferCurriculumTopic,
  type CurriculumMappedCount,
} from "@/lib/curriculum-coverage/curriculum-coverage-intelligence";

test("maps curriculum signals to HESI and RT topic definitions", () => {
  assert.equal(inferCurriculumTopic(CURRICULUM_DEFINITIONS.hesi, ["Anatomy and physiology body systems"]), "anatomy_physiology");
  assert.equal(inferCurriculumTopic(CURRICULUM_DEFINITIONS.rt_competencies, ["Ventilator troubleshooting and PEEP"]), "airway_ventilation");
});

test("coverage report identifies missing, weak, and overrepresented curriculum topics", () => {
  const mappedCounts: CurriculumMappedCount[] = [
    { curriculumKey: "teas", topicId: "science", contentType: "questions", count: 100 },
    { curriculumKey: "teas", topicId: "science", contentType: "lessons", count: 20 },
    { curriculumKey: "teas", topicId: "reading", contentType: "questions", count: 2 },
  ];
  const report = buildCurriculumCoverageReport(CURRICULUM_DEFINITIONS.teas, mappedCounts);

  assert.equal(report.totalItems, 122);
  assert.ok(report.overrepresentedTopics.some((topic) => topic.topicId === "science"));
  assert.ok(report.weakTopicAreas.some((topic) => topic.topicId === "reading"));
  assert.ok(report.missingTopics.some((topic) => topic.topicId === "english"));
  assert.ok(report.contentDensityScores.questions > report.contentDensityScores.ecg);
});

test("dashboard summarizes all required curricula", () => {
  const dashboard = buildCurriculumCoverageDashboard({
    mappedCounts: [
      { curriculumKey: "nclex", topicId: "pharmacological_therapies", contentType: "pharmacology", count: 12 },
      { curriculumKey: "new_grad_competencies", topicId: "medication_safety", contentType: "pharmacology", count: 12 },
      { curriculumKey: "rt_competencies", topicId: "airway_ventilation", contentType: "clinical_skills", count: 6 },
    ],
  });

  assert.equal(dashboard.summary.curriculaAudited, 7);
  assert.ok(dashboard.reports.some((report) => report.curriculumKey === "nclex"));
  assert.ok(dashboard.reports.some((report) => report.curriculumKey === "rex_pn"));
  assert.ok(dashboard.reports.some((report) => report.curriculumKey === "cnple"));
  assert.ok(dashboard.reports.some((report) => report.curriculumKey === "hesi"));
  assert.ok(dashboard.reports.some((report) => report.curriculumKey === "teas"));
  assert.ok(dashboard.reports.some((report) => report.curriculumKey === "rt_competencies"));
  assert.ok(dashboard.reports.some((report) => report.curriculumKey === "new_grad_competencies"));
});
