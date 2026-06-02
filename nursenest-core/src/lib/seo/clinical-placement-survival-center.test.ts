import assert from "node:assert/strict";
import test from "node:test";

import {
  CLINICAL_CHECKLISTS,
  CLINICAL_CONFIDENCE_CENTER_TOPICS,
  CLINICAL_DOCUMENTATION_HUB_PAGES,
  CLINICAL_SKILLS_PREP_PAGES,
  FIRST_DAY_GUIDES,
  INSTRUCTOR_QUESTION_LIBRARIES,
  PLACEMENT_PROFESSION_HUBS,
  PLACEMENT_SCALE_DIMENSIONS,
  PLACEMENT_SUCCESS_STORY_CONTRACT,
  QUICK_PREP_PAGES,
  UNIT_SPECIFIC_GUIDES,
  buildClinicalPlacementSurvivalDashboard,
  getPlacementHubForProfession,
  validateFirstDayGuide,
} from "./clinical-placement-survival-center";

test("profession-specific placement hubs cover requested professions", () => {
  const titles = new Set(PLACEMENT_PROFESSION_HUBS.map((hub) => hub.title));
  for (const title of ["Nursing Placement Hub", "RT Placement Hub", "Paramedic Placement Hub", "OT Placement Hub", "PT Placement Hub", "MLT Placement Hub", "PSW Placement Hub"]) {
    assert.ok(titles.has(title), `${title} missing`);
  }
  for (const hub of PLACEMENT_PROFESSION_HUBS) {
    assert.ok(hub.canonicalPath.startsWith("/clinical-placement/"));
    assert.ok(hub.audience.includes("Pre-Nursing"));
    assert.ok(hub.audience.includes("Nursing"));
  }
});

test("first day clinical guides include required survival content blocks", () => {
  const titles = new Set(FIRST_DAY_GUIDES.map((guide) => guide.title));
  for (const title of ["First Day Of Nursing Clinical", "First Day Of RT Placement", "First Day Of Paramedic Placement", "First Day Of OT Placement", "First Day Of PT Placement", "First Day Of MLT Placement"]) {
    assert.ok(titles.has(title), `${title} missing`);
  }
  for (const guide of FIRST_DAY_GUIDES) {
    assert.deepEqual(validateFirstDayGuide(guide), []);
    assert.ok(guide.requiredBlocks.includes("what_to_bring"));
    assert.ok(guide.requiredBlocks.includes("instructor_expectations"));
    assert.ok(guide.requiredBlocks.includes("professional_conduct"));
    assert.ok(guide.requiredBlocks.includes("confidence_tips"));
  }
});

test("clinical checklists include required downloadable resources", () => {
  const titles = new Set(CLINICAL_CHECKLISTS.map((checklist) => checklist.title));
  for (const title of ["Clinical Placement Checklist", "Night Before Clinical Checklist", "First Shift Checklist", "Clinical Documentation Checklist", "Medication Pass Checklist", "Assessment Checklist"]) {
    assert.ok(titles.has(title), `${title} missing`);
  }
  assert.ok(CLINICAL_CHECKLISTS.every((checklist) => checklist.checklistType === "downloadable"));
});

test("instructor question libraries include question, answer, reasoning, and mistakes", () => {
  const titles = new Set(INSTRUCTOR_QUESTION_LIBRARIES.map((library) => library.title));
  for (const title of ["50 Questions Clinical Instructors Ask", "100 Nursing Clinical Questions", "RT Clinical Questions", "Paramedic Clinical Questions", "OT Clinical Questions", "PT Clinical Questions", "MLT Clinical Questions"]) {
    assert.ok(titles.has(title), `${title} missing`);
  }
  for (const library of INSTRUCTOR_QUESTION_LIBRARIES) {
    assert.deepEqual(library.requiredBlocks, ["question", "answer", "clinical_reasoning", "common_mistakes"]);
    assert.ok(library.targetQuestions >= 50);
  }
});

test("unit-specific guides cover core clinical settings", () => {
  const units = new Set(UNIT_SPECIFIC_GUIDES.map((guide) => guide.unit));
  for (const unit of ["Medical-Surgical", "ICU", "Emergency Department", "Pediatrics", "Mental Health", "Community", "Long-Term Care"]) {
    assert.ok(units.has(unit), `${unit} missing`);
  }
});

test("quick prep pages cover high-value condition and rotation searches", () => {
  const titles = new Set(QUICK_PREP_PAGES.map((page) => page.title));
  for (const title of [
    "What To Know Before A Heart Failure Clinical",
    "What To Know Before A COPD Clinical",
    "What To Know Before A Stroke Clinical",
    "What To Know Before An RT Ventilator Rotation",
    "What To Know Before A Trauma Rotation",
  ]) {
    assert.ok(titles.has(title), `${title} missing`);
  }
  assert.ok(QUICK_PREP_PAGES.every((page) => page.preparationFocus.includes("questions_to_expect")));
});

test("clinical skills prep pages link into the skills passport", () => {
  const professions = new Set(CLINICAL_SKILLS_PREP_PAGES.map((page) => page.profession));
  for (const profession of ["Nursing", "RT", "Paramedic", "OT", "PT", "MLT"]) {
    assert.ok(professions.has(profession), `${profession} missing`);
  }
  assert.ok(CLINICAL_SKILLS_PREP_PAGES.every((page) => page.linksToSkillsPassport));
});

test("documentation hub and confidence center cover requested topics", () => {
  for (const page of ["How To Chart During Clinical", "SOAP Notes", "DAR Charting", "SBAR", "Documentation Examples", "Clinical Documentation Mistakes"]) {
    assert.ok(CLINICAL_DOCUMENTATION_HUB_PAGES.includes(page), `${page} missing`);
  }
  for (const topic of ["Clinical Anxiety", "Imposter Syndrome", "Confidence Building", "Professional Communication", "Talking To Patients", "Talking To Instructors", "Talking To Physicians", "Handling Mistakes"]) {
    assert.ok(CLINICAL_CONFIDENCE_CENTER_TOPICS.includes(topic), `${topic} missing`);
  }
});

test("success story contract supports EEAT and consent", () => {
  assert.equal(PLACEMENT_SUCCESS_STORY_CONTRACT.requiresConsent, true);
  assert.deepEqual(PLACEMENT_SUCCESS_STORY_CONTRACT.supportedStories, ["student_stories", "placement_wins", "lessons_learned", "advice_for_future_students"]);
  assert.ok(PLACEMENT_SUCCESS_STORY_CONTRACT.eeatBenefit.includes("experience"));
});

test("dashboard tracks 500 page scale target and dimensions", () => {
  const dashboard = buildClinicalPlacementSurvivalDashboard();
  assert.equal(dashboard.professionHubs, PLACEMENT_PROFESSION_HUBS.length);
  assert.equal(dashboard.firstDayGuides, FIRST_DAY_GUIDES.length);
  assert.equal(dashboard.yearOneTargetPages, 500);
  assert.deepEqual(dashboard.scaleDimensions, PLACEMENT_SCALE_DIMENSIONS);
  assert.ok(dashboard.remainingYearOnePages > 0);
});

test("placement hub helper resolves profession hubs", () => {
  assert.equal(getPlacementHubForProfession("RT")?.title, "RT Placement Hub");
  assert.equal(getPlacementHubForProfession("NP"), undefined);
});
