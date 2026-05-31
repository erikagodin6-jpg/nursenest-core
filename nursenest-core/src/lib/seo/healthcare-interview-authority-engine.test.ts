import assert from "node:assert/strict";
import test from "node:test";

import {
  ALLIED_INTERVIEW_LIBRARY_SEEDS,
  BEHAVIORAL_INTERVIEW_DOMAINS,
  CLINICAL_INTERVIEW_DOMAINS,
  HIRING_MANAGER_INSIGHTS,
  INTERVIEW_PROFESSION_HUBS,
  INTERVIEW_QUESTION_SEEDS,
  MOCK_INTERVIEW_SYSTEM_CONTRACT,
  NEW_GRAD_INTERVIEW_CENTERS,
  NURSING_INTERVIEW_LIBRARY_SEEDS,
  SPECIALTY_INTERVIEW_TRACKS,
  STAR_RESPONSE_ENGINE,
  buildInterviewAuthorityDashboard,
  getInterviewHubForProfession,
  getInterviewQuestionsForProfession,
  validateInterviewQuestionSeed,
} from "./healthcare-interview-authority-engine";

test("profession interview hubs cover healthcare interview audiences", () => {
  const professions = new Set(INTERVIEW_PROFESSION_HUBS.map((seed) => seed.profession));
  for (const profession of ["RN", "RPN", "NP", "RT", "Paramedic", "OT", "PT", "MLT", "PSW", "Social Work", "Future"]) {
    assert.ok(professions.has(profession), `${profession} hub missing`);
  }
  for (const hub of INTERVIEW_PROFESSION_HUBS) {
    assert.ok(hub.canonicalPath.startsWith("/careers/interviews/"));
    assert.ok(hub.targetAudience.includes("student"));
    assert.ok(hub.targetAudience.includes("new_grad"));
    assert.ok(hub.targetAudience.includes("internationally_educated"));
  }
});

test("nursing interview library includes requested nursing pages", () => {
  const titles = new Set(NURSING_INTERVIEW_LIBRARY_SEEDS.map((seed) => seed.title));
  for (const title of [
    "100 Nursing Interview Questions",
    "New Graduate Nursing Interview Questions",
    "ICU Nurse Interview Questions",
    "Emergency Nurse Interview Questions",
    "Pediatric Nurse Interview Questions",
    "Mental Health Nurse Interview Questions",
    "Community Nurse Interview Questions",
    "Charge Nurse Interview Questions",
    "Leadership Interview Questions",
  ]) {
    assert.ok(titles.has(title), `${title} missing`);
  }
});

test("allied interview libraries require 50 to 200 dedicated questions", () => {
  const professions = new Set(ALLIED_INTERVIEW_LIBRARY_SEEDS.map((seed) => seed.profession));
  for (const profession of ["RT", "Paramedic", "OT", "PT", "MLT", "PSW"]) {
    assert.ok(professions.has(profession), `${profession} library missing`);
  }
  for (const library of ALLIED_INTERVIEW_LIBRARY_SEEDS) {
    assert.equal(library.minQuestions, 50);
    assert.equal(library.maxQuestions, 200);
  }
});

test("question structure enforces premium interview answer blocks", () => {
  for (const seed of INTERVIEW_QUESTION_SEEDS) {
    assert.deepEqual(validateInterviewQuestionSeed(seed), []);
    assert.ok(seed.requiredBlocks.includes("why_employers_ask_it"));
    assert.ok(seed.requiredBlocks.includes("what_they_are_assessing"));
    assert.ok(seed.requiredBlocks.includes("strong_example_answer"));
    assert.ok(seed.requiredBlocks.includes("weak_example_answer"));
    assert.ok(seed.requiredBlocks.includes("clinical_considerations"));
    assert.ok(seed.requiredBlocks.includes("advanced_professional_tips"));
  }
});

test("STAR response engine uses clinical and professional example sources", () => {
  assert.deepEqual(STAR_RESPONSE_ENGINE.framework, ["situation", "task", "action", "result"]);
  assert.deepEqual(STAR_RESPONSE_ENGINE.exampleSources, ["clinical_placements", "simulations", "volunteer_experience", "healthcare_employment", "leadership_roles"]);
  assert.ok(STAR_RESPONSE_ENGINE.outputRequirements.includes("measurable_or_observable_result"));
  assert.ok(STAR_RESPONSE_ENGINE.outputRequirements.includes("reflection_or_growth"));
});

test("specialty tracks cover requested clinical and leadership interview tracks", () => {
  for (const track of ["ICU", "Emergency", "Pediatrics", "NICU", "Cardiology", "Mental Health", "Respiratory Critical Care", "Flight Paramedic", "Community Care", "Primary Care"]) {
    assert.ok(SPECIALTY_INTERVIEW_TRACKS.includes(track), `${track} missing`);
  }
});

test("behavioral and clinical question libraries cover requested domains", () => {
  for (const domain of ["Conflict Resolution", "Time Management", "Prioritization", "Delegation", "Communication", "Professionalism", "Patient Advocacy", "Ethics", "Leadership", "Safety"]) {
    assert.ok(BEHAVIORAL_INTERVIEW_DOMAINS.includes(domain), `${domain} missing`);
  }
  for (const domain of ["Patient Deterioration", "Medication Safety", "Emergency Response", "Assessment Priorities", "Clinical Judgment", "Escalation", "Documentation", "Team Communication"]) {
    assert.ok(CLINICAL_INTERVIEW_DOMAINS.includes(domain), `${domain} missing`);
  }
});

test("new graduate interview center covers requested professions", () => {
  const titles = new Set(NEW_GRAD_INTERVIEW_CENTERS.map((seed) => seed.title));
  for (const title of ["New Graduate Nurse Interviews", "New Graduate RT Interviews", "New Graduate Paramedic Interviews", "New Graduate OT Interviews", "New Graduate PT Interviews", "New Graduate MLT Interviews"]) {
    assert.ok(titles.has(title), `${title} missing`);
  }
});

test("hiring manager insights include manager preferences, mistakes, resume, and communication guidance", () => {
  assert.ok(HIRING_MANAGER_INSIGHTS.whatHiringManagersWant.length > 0);
  assert.ok(HIRING_MANAGER_INSIGHTS.whatHiringManagersDislike.length > 0);
  assert.ok(HIRING_MANAGER_INSIGHTS.commonInterviewMistakes.length > 0);
  assert.ok(HIRING_MANAGER_INSIGHTS.resumeMistakes.length > 0);
  assert.ok(HIRING_MANAGER_INSIGHTS.professionalCommunicationTips.length > 0);
});

test("mock interview system remains a future gated contract", () => {
  assert.equal(MOCK_INTERVIEW_SYSTEM_CONTRACT.launchStatus, "future");
  assert.equal(MOCK_INTERVIEW_SYSTEM_CONTRACT.gatedUntilReady, true);
  assert.deepEqual(MOCK_INTERVIEW_SYSTEM_CONTRACT.capabilities, ["practice_interviews", "video_interviews", "timed_responses", "feedback", "scoring"]);
});

test("lookup helpers return hubs and profession-specific questions", () => {
  assert.equal(getInterviewHubForProfession("RT")?.title, "Respiratory Therapy Interview Questions");
  assert.ok(getInterviewQuestionsForProfession("Paramedic").some((seed) => seed.question.includes("primary survey")));
});

test("interview authority dashboard tracks year-one scale target", () => {
  const dashboard = buildInterviewAuthorityDashboard();
  assert.equal(dashboard.professionHubs, INTERVIEW_PROFESSION_HUBS.length);
  assert.equal(dashboard.nursingLibraries, NURSING_INTERVIEW_LIBRARY_SEEDS.length);
  assert.equal(dashboard.alliedLibraries, ALLIED_INTERVIEW_LIBRARY_SEEDS.length);
  assert.equal(dashboard.newGraduateCenters, NEW_GRAD_INTERVIEW_CENTERS.length);
  assert.equal(dashboard.yearOneTargetPages, 2000);
  assert.ok(dashboard.remainingYearOnePages > 0);
  assert.deepEqual(dashboard.scaleDimensions, ["profession_specific", "specialty_specific", "career_stage_specific", "province_specific"]);
  assert.ok(dashboard.professionsCovered.includes("Social Work"));
});
