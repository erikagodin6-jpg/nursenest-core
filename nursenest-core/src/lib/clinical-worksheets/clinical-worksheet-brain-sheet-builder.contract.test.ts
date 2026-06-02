import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  formatClinicalWorksheetForCopy,
  generateClinicalWorksheet,
  type WorksheetInput,
} from "./clinical-worksheet-brain-sheet-builder";

const INPUT: WorksheetInput = {
  learnerMode: "student",
  template: "student-clinical",
  patients: [
    {
      id: "p1",
      roomNumber: "412A",
      age: "72",
      diagnosis: "Heart failure exacerbation",
      codeStatus: "Full code",
      allergies: "NKDA",
      medicalHistory: "HFrEF, atrial fibrillation, CKD",
      surgicalHistory: "No recent surgery",
      currentMedications: "Furosemide, metoprolol, insulin glargine",
      relevantLabs: "BNP 980, potassium 3.1, creatinine 144",
      vitalSigns: "BP 96/58, HR 118 irregular, RR 26, SpO2 89% room air",
      mobilityStatus: "1 assist with walker",
      isolationPrecautions: "None",
      diet: "Low sodium, fluid restriction",
      ivAccess: "20g left forearm",
      oxygenRequirements: "2 L nasal cannula after dyspnea",
      monitoringRequirements: "Strict intake/output, daily weight, telemetry",
      personalNotes: "Instructor wants patho and med rationales.",
    },
    {
      id: "p2",
      roomNumber: "414B",
      age: "58",
      diagnosis: "Diabetes with wound infection",
      codeStatus: "Full code",
      allergies: "Penicillin",
      medicalHistory: "Type 2 diabetes",
      surgicalHistory: "Toe amputation history",
      currentMedications: "Insulin lispro, ceftriaxone",
      relevantLabs: "glucose 18.2, WBC 15.4",
      vitalSigns: "T 38.1, HR 104, BP 122/70",
      mobilityStatus: "Independent with cane",
      isolationPrecautions: "Contact precautions pending culture",
      diet: "Diabetic diet",
      ivAccess: "Saline lock right hand",
      oxygenRequirements: "Room air",
      monitoringRequirements: "ACHS glucose, wound checks",
      personalNotes: "",
    },
  ],
};

describe("clinical worksheet brain sheet builder", () => {
  it("generates multi-patient worksheet outputs with priority analysis", () => {
    const output = generateClinicalWorksheet(INPUT);

    assert.equal(output.patients.length, 2);
    assert.match(output.assignmentSummary.title, /2-Patient/);
    assert.ok(output.multiPatientAnalysis.bullets.some((bullet) => /Most unstable patient/i.test(bullet)));
    assert.ok(output.patients[0].priorityAnalysis.bullets.some((bullet) => /Deterioration risk/i.test(bullet)));
  });

  it("builds assessment sections, lab tracker, medication organizer, and tasks", () => {
    const patient = generateClinicalWorksheet(INPUT).patients[0];

    assert.ok(patient.assessmentSections.some((section) => section.system === "Respiratory"));
    assert.ok(patient.labTracker.some((lab) => /potassium/i.test(lab.lab) || /potassium/i.test(lab.currentResult)));
    assert.ok(patient.medicationOrganizer.some((med) => /Furosemide/i.test(med.medication)));
    assert.ok(patient.tasks.length >= 6);
  });

  it("adds learner mode coaching", () => {
    const student = generateClinicalWorksheet(INPUT).patients[0].learnerModePanel;
    const np = generateClinicalWorksheet({ ...INPUT, learnerMode: "np", template: "np-clinical" }).patients[0].learnerModePanel;

    assert.match(student.title, /Student Mode/);
    assert.match(np.title, /NP Mode/);
    assert.ok(np.bullets.some((bullet) => /Differential/i.test(bullet)));
  });

  it("creates copy-ready printable brain sheets", () => {
    const output = generateClinicalWorksheet(INPUT);
    const copy = formatClinicalWorksheetForCopy(output);

    assert.match(copy, /Student Clinical Worksheet Builder/);
    assert.match(copy, /Room 412A/);
    assert.match(copy, /SBAR/);
  });
});
