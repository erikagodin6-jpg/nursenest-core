import assert from "node:assert/strict";
import test from "node:test";
import {
  generateAcademicSuccessToolkit,
  listAcademicProfessionProfiles,
  type AcademicProfessionId,
} from "./academic-success-toolkit";

const REQUIRED_PROFESSIONS: readonly AcademicProfessionId[] = [
  "rn",
  "rpn-lpn",
  "np",
  "rt",
  "paramedic",
  "ot",
  "pt",
  "mlt",
  "psw",
  "social-work",
];

test("Academic Success Toolkit registers every requested profession", () => {
  const ids = listAcademicProfessionProfiles().map((profile) => profile.id);
  for (const id of REQUIRED_PROFESSIONS) {
    assert.ok(ids.includes(id), `missing academic profile: ${id}`);
  }
});

test("every profession receives all ten assignment builders", () => {
  for (const id of REQUIRED_PROFESSIONS) {
    const toolkit = generateAcademicSuccessToolkit(id);
    assert.equal(toolkit.assignmentBuilderSuite.length, 10);
    for (const module of toolkit.assignmentBuilderSuite) {
      assert.ok(module.reasoningPrompts.length >= 3);
      assert.ok(module.scaffoldSections.length >= 6);
      assert.match(module.integrityBoundary, /scaffold/i);
    }
  }
});

test("study, research, group, and presentation support are complete", () => {
  const toolkit = generateAcademicSuccessToolkit("rn");
  assert.equal(toolkit.studyTools.length, 7);
  assert.equal(toolkit.researchSupport.length, 6);
  assert.equal(toolkit.groupProjectSupport.length, 6);
  assert.equal(toolkit.presentationBuilder.length, 5);
  assert.match(JSON.stringify(toolkit.researchSupport), /APA 7/);
});

test("profession-specific templates do not collapse into nursing-only labels", () => {
  const rt = JSON.stringify(generateAcademicSuccessToolkit("rt")).toLowerCase();
  const paramedic = JSON.stringify(generateAcademicSuccessToolkit("paramedic")).toLowerCase();
  const ot = JSON.stringify(generateAcademicSuccessToolkit("ot")).toLowerCase();
  const pt = JSON.stringify(generateAcademicSuccessToolkit("pt")).toLowerCase();
  const mlt = JSON.stringify(generateAcademicSuccessToolkit("mlt")).toLowerCase();

  assert.match(rt, /abg analysis/);
  assert.match(rt, /ventilator case reviews/);
  assert.match(paramedic, /call reviews/);
  assert.match(paramedic, /patient care report/);
  assert.match(ot, /functional assessments/);
  assert.match(pt, /treatment plans/);
  assert.match(mlt, /laboratory case analyses/);
});

test("academic writing coach enforces integrity boundaries", () => {
  const toolkit = generateAcademicSuccessToolkit("social-work");
  const text = JSON.stringify(toolkit.academicWritingCoach).toLowerCase();
  assert.match(text, /clarity/);
  assert.match(text, /apa formatting/);
  assert.match(text, /do not write an entire assignment/);
  assert.match(text, /do not fabricate citations/);
});

test("integrity guards require coaching instead of academic dishonesty", () => {
  const toolkit = generateAcademicSuccessToolkit("np");
  const text = JSON.stringify(toolkit.integrityGuards).toLowerCase();
  assert.match(text, /coach the learner/);
  assert.match(text, /preserve academic integrity/);
  assert.match(text, /rather than complete submission-ready answers/);
});
