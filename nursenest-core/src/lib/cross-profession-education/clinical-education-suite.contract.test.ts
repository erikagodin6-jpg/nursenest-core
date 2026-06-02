import assert from "node:assert/strict";
import test from "node:test";
import {
  generateClinicalEducationSuite,
  listClinicalEducationProfessions,
  type ClinicalEducationProfessionId,
} from "./clinical-education-suite";

const REQUIRED_PROFESSIONS: readonly ClinicalEducationProfessionId[] = [
  "rn",
  "rpn-lpn",
  "np",
  "respiratory-therapy",
  "paramedicine",
  "occupational-therapy",
  "physiotherapy",
  "medical-laboratory-technology",
  "psw",
  "social-work",
  "psychotherapy",
];

test("Clinical Education Suite registers every requested profession", () => {
  const ids = listClinicalEducationProfessions().map((profile) => profile.id);
  for (const id of REQUIRED_PROFESSIONS) {
    assert.ok(ids.includes(id), `missing profession profile: ${id}`);
  }
});

test("each profession receives all ten shared tools with profession-specific adaptation", () => {
  for (const id of REQUIRED_PROFESSIONS) {
    const suite = generateClinicalEducationSuite(id);
    assert.equal(suite.tools.length, 10, `${id} should have all shared tools`);
    for (const tool of suite.tools) {
      assert.match(tool.professionAdaptation, new RegExp(suite.selectedProfession.label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
      assert.ok(tool.activities.length >= 3);
      assert.ok(tool.documentationOutput.length > 0);
      assert.ok(tool.portfolioEvidence.length >= 3);
    }
  }
});

test("RT layer is respiratory-specific and not nursing-label reuse", () => {
  const suite = generateClinicalEducationSuite("respiratory-therapy");
  const text = JSON.stringify({
    selectedProfession: suite.selectedProfession,
    tools: suite.tools,
    documentationTraining: suite.documentationTraining,
    placementPreparation: suite.placementPreparation,
  }).toLowerCase();
  assert.match(text, /ventilator/);
  assert.match(text, /abg/);
  assert.match(text, /airway/);
  assert.doesNotMatch(text, /nursing diagnoses/);
  assert.doesNotMatch(text, /care plans/);
});

test("paramedicine layer includes scene, prehospital, trauma, ECG, and emergency pharmacology", () => {
  const suite = generateClinicalEducationSuite("paramedicine");
  const text = JSON.stringify(suite).toLowerCase();
  for (const expected of ["scene", "prehospital", "trauma", "ecg", "emergency pharmacology"]) {
    assert.match(text, new RegExp(expected), `missing ${expected}`);
  }
});

test("allied, support, social work, and psychotherapy profiles have dedicated documentation standards", () => {
  const expected: Record<ClinicalEducationProfessionId, readonly string[]> = {
    rn: ["SOAP", "DAR", "SBAR"],
    "rpn-lpn": ["DAR", "SBAR"],
    np: ["advanced SOAP", "differential diagnosis"],
    "respiratory-therapy": ["respiratory assessments", "ventilator checks"],
    paramedicine: ["patient care report", "scene narrative"],
    "occupational-therapy": ["functional assessment", "ADL"],
    physiotherapy: ["mobility assessment", "exercise prescription"],
    "medical-laboratory-technology": ["laboratory reporting", "quality control"],
    psw: ["personal care", "mobility"],
    "social-work": ["psychosocial assessment", "case management"],
    psychotherapy: ["intake notes", "session notes"],
  };

  for (const [id, needles] of Object.entries(expected) as Array<[ClinicalEducationProfessionId, readonly string[]]>) {
    const standards = generateClinicalEducationSuite(id).selectedProfession.documentationStandards.join(" | ").toLowerCase();
    for (const needle of needles) {
      assert.match(standards, new RegExp(needle.toLowerCase()));
    }
  }
});

test("interprofessional case includes every profession with a distinct contribution", () => {
  const suite = generateClinicalEducationSuite("rn");
  const contributionIds = suite.interprofessionalCase.contributions.map((item) => item.professionId);
  for (const id of REQUIRED_PROFESSIONS) {
    assert.ok(contributionIds.includes(id), `missing interprofessional contribution for ${id}`);
  }
  const uniqueContributions = new Set(suite.interprofessionalCase.contributions.map((item) => item.contribution));
  assert.equal(uniqueContributions.size, REQUIRED_PROFESSIONS.length);
});

test("quality guards enforce shared engine plus profession-specific layers", () => {
  const suite = generateClinicalEducationSuite("occupational-therapy");
  const guardText = suite.qualityGuards.join(" ").toLowerCase();
  assert.match(guardText, /shared engine/);
  assert.match(guardText, /profession-specific/);
  assert.match(guardText, /not be implemented as renamed nursing labels/);
});
