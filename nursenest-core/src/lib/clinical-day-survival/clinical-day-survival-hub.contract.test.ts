import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  formatClinicalDaySurvivalForCopy,
  generateClinicalDaySurvivalHub,
  type ClinicalDayInput,
} from "./clinical-day-survival-hub";

const INPUT: ClinicalDayInput = {
  role: "rn-student",
  unit: "med-surg",
  diagnosis: "Heart failure exacerbation",
  age: "72",
  comorbidities: "Type 2 diabetes, chronic kidney disease",
  medications: "Furosemide, metoprolol, insulin glargine",
  labs: "BNP 980, potassium 3.1, creatinine 144, glucose 14.2",
  notes: "Tomorrow's patient has shortness of breath and bilateral crackles.",
};

describe("clinical day survival hub", () => {
  it("generates a concise patient assignment prep package with reasoning", () => {
    const output = generateClinicalDaySurvivalHub(INPUT, "patient-assignment");

    assert.equal(output.title, "Patient Assignment Prep Tool");
    assert.match(output.patientSnapshot.title, /Heart failure/i);
    assert.ok(output.patientSnapshot.bullets.some((bullet) => /Pathophysiology/i.test(bullet)));
    assert.ok(output.onePageSummary.some((card) => /Assessments/i.test(card.title)));
    assert.ok(output.onePageSummary.every((card) => card.rationale.length > 30));
  });

  it("builds instructor questions with model answers and rationales", () => {
    const output = generateClinicalDaySurvivalHub(INPUT, "instructor-questions");

    assert.ok(output.instructorQuestions.length >= 7);
    assert.ok(output.instructorQuestions.some((item) => item.category === "Pharmacology"));
    assert.ok(output.instructorQuestions.every((item) => item.modelAnswer.length > 20));
    assert.ok(output.instructorQuestions.every((item) => item.rationale.length > 20));
  });

  it("creates med-pass prep with hold and monitoring logic", () => {
    const output = generateClinicalDaySurvivalHub(INPUT, "med-pass");
    const medCard = output.onePageSummary.find((card) => card.id === "med-pass");

    assert.ok(medCard);
    assert.ok(medCard.bullets.some((bullet) => /monitor BP/i.test(bullet)));
    assert.ok(medCard.bullets.some((bullet) => /hypoglycemia/i.test(bullet)));
  });

  it("links likely skills to existing clinical-skills routes", () => {
    const output = generateClinicalDaySurvivalHub(INPUT, "skills-prep");

    assert.ok(output.skills.length >= 3);
    assert.ok(output.skills.every((skill) => skill.href.startsWith("/app/clinical-skills/")));
    assert.ok(output.skills.every((skill) => skill.whyRelevant.length > 20));
  });

  it("exports printable text", () => {
    const output = generateClinicalDaySurvivalHub(INPUT, "tomorrow-cheat-sheet");
    const copy = formatClinicalDaySurvivalForCopy(output);

    assert.match(copy, /What Should I Know Tomorrow/);
    assert.match(copy, /Patient Snapshot/);
    assert.match(copy, /Instructor Questions/);
  });
});
