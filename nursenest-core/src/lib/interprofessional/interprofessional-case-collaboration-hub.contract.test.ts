import assert from "node:assert/strict";
import test from "node:test";
import {
  generateInterprofessionalCaseCollaborationHub,
  listIpeProfessionProfiles,
  type IpeCaseId,
  type IpeProfessionId,
} from "./interprofessional-case-collaboration-hub";

const REQUIRED_PROFESSIONS: readonly IpeProfessionId[] = [
  "rn",
  "rpn-lpn",
  "np",
  "respiratory-therapy",
  "paramedicine",
  "occupational-therapy",
  "physiotherapy",
  "medical-laboratory-technology",
  "social-work",
  "psw",
  "pharmacy",
  "medicine",
];

const REQUIRED_CASES: readonly IpeCaseId[] = [
  "stroke",
  "copd-exacerbation",
  "heart-failure",
  "trauma",
  "septic-shock",
  "pediatric-respiratory-distress",
  "mental-health-crisis",
  "postoperative-complications",
  "polypharmacy-older-adult",
  "community-care-transitions",
];

test("registers active and future IPE professions", () => {
  const ids = listIpeProfessionProfiles().map((profile) => profile.id);
  for (const id of REQUIRED_PROFESSIONS) {
    assert.ok(ids.includes(id), `missing profession: ${id}`);
  }
  assert.equal(listIpeProfessionProfiles().find((profile) => profile.id === "pharmacy")?.status, "future");
  assert.equal(listIpeProfessionProfiles().find((profile) => profile.id === "medicine")?.status, "future");
});

test("case library contains every requested interprofessional case", () => {
  const hub = generateInterprofessionalCaseCollaborationHub();
  const ids = hub.caseLibrary.map((item) => item.id);
  for (const id of REQUIRED_CASES) {
    assert.ok(ids.includes(id), `missing case: ${id}`);
  }
});

test("heart failure case includes authentic role perspective examples", () => {
  const heartFailure = generateInterprofessionalCaseCollaborationHub("heart-failure").selectedCase;
  const rt = heartFailure.rolePerspectives.find((view) => view.professionId === "respiratory-therapy");
  const pt = heartFailure.rolePerspectives.find((view) => view.professionId === "physiotherapy");
  const ot = heartFailure.rolePerspectives.find((view) => view.professionId === "occupational-therapy");
  const socialWork = heartFailure.rolePerspectives.find((view) => view.professionId === "social-work");
  const mlt = heartFailure.rolePerspectives.find((view) => view.professionId === "medical-laboratory-technology");

  assert.match(JSON.stringify(rt), /oxygenation|work of breathing/i);
  assert.match(JSON.stringify(pt), /function|mobility/i);
  assert.match(JSON.stringify(ot), /home safety|ADL|function/i);
  assert.match(JSON.stringify(socialWork), /home support|discharge barriers/i);
  assert.match(JSON.stringify(mlt), /BNP|potassium|renal/i);
});

test("team huddle, consult decisions, SBAR exercises, and discharge planning are generated", () => {
  const hub = generateInterprofessionalCaseCollaborationHub("copd-exacerbation");
  const selectedCase = hub.selectedCase;
  assert.ok(selectedCase.teamHuddle.length >= 4);
  assert.ok(selectedCase.consultDecisions.length >= 4);
  assert.ok(selectedCase.communicationExercises.some((exercise) => /RN to RT/i.test(exercise.title)));
  assert.ok(selectedCase.dischargePlanning.length >= 1);
  assert.match(selectedCase.deteriorationResponse.trigger, /SpO2|respiratory|ABG/i);
});

test("profession explorer includes scope, misconceptions, collaboration, and escalation triggers", () => {
  const hub = generateInterprofessionalCaseCollaborationHub();
  for (const profile of hub.professionExplorer) {
    assert.ok(profile.scope.length >= 4);
    assert.ok(profile.responsibilities.length >= 4);
    assert.ok(profile.commonMisconceptions.length >= 2);
    assert.ok(profile.collaborationOpportunities.length >= 4);
    assert.ok(profile.escalationTriggers.length >= 4);
  }
});

test("assessment and institutional systems cover required outputs", () => {
  const hub = generateInterprofessionalCaseCollaborationHub();
  assert.ok(hub.assessmentSystem.communication.length > 0);
  assert.ok(hub.assessmentSystem.collaboration.length > 0);
  assert.ok(hub.assessmentSystem.professionalism.length > 0);
  assert.ok(hub.assessmentSystem.advocacy.length > 0);
  assert.ok(hub.assessmentSystem.clinicalReasoning.length > 0);
  assert.ok(hub.assessmentSystem.teamAwareness.length > 0);
  assert.match(JSON.stringify(hub.institutionalVersion), /assign|completion|competenc|reports/i);
});

test("quality standards reject tokenized profession representation", () => {
  const hub = generateInterprofessionalCaseCollaborationHub("community-care-transitions");
  const text = hub.qualityStandard.join(" ").toLowerCase();
  assert.match(text, /authentic/);
  assert.match(text, /no profession is presented as secondary/);
  assert.match(text, /shared patient outcomes/);
});
