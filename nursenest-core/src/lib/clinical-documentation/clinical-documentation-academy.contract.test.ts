import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  formatDocumentationAcademyForCopy,
  generateDocumentationAcademy,
  type DocumentationAcademyInput,
} from "./clinical-documentation-academy";

const STRONG_ENTRY =
  "0935 Patient reports increased shortness of breath after ambulating. RR 28, SpO2 87% room air, HR 116, BP 98/60. Bilateral crackles increased from baseline. Patient positioned high Fowler's, oxygen applied per order, charge nurse and provider notified at 0940. 0948 SpO2 improved to 92% on 2 L nasal cannula and patient states breathing is improving. Reassessment ongoing.";

describe("clinical documentation academy", () => {
  it("scores charting simulator entries across required competency domains", () => {
    const output = generateDocumentationAcademy(input("charting-simulator", STRONG_ENTRY));

    assert.equal(output.title, "Charting Simulator");
    assert.ok(output.feedback.overallScore > 0);
    assert.ok(output.feedback.legalSafetyScore > 0);
    assert.ok(output.feedback.clinicalCompletenessScore > 0);
    assert.ok(output.feedback.coaching.some((item) => /assessed|Document/i.test(item)));
  });

  it("detects unsafe opinion-based wording", () => {
    const output = generateDocumentationAcademy(input("fall-documentation", "Patient was lazy and fell earlier but seems fine."));

    assert.ok(output.feedback.objectiveLanguageIssues.includes("lazy"));
    assert.ok(output.feedback.ambiguousWording.includes("fine"));
    assert.ok(output.feedback.legalConcerns.length > 0);
  });

  it("generates NP documentation expectations with differential and follow-up", () => {
    const output = generateDocumentationAcademy({
      ...input("np-documentation", "S: Dysuria x2 days. O: UA positive. A: Cystitis. P: Antibiotic, follow-up, return precautions."),
      level: "advanced-practice",
    });

    assert.match(output.scenario.modelDocumentation.example, /differential/i);
    assert.ok(output.learningPathway.objectives.some((objective) => /differential diagnosis/i.test(objective)));
    assert.ok(output.feedback.missingInformation.includes("differential diagnosis"));
  });

  it("provides realistic EHR tabs", () => {
    const output = generateDocumentationAcademy(input("medication-documentation", STRONG_ENTRY));

    assert.deepEqual(
      output.scenario.ehrTabs.map((tab) => tab.id),
      ["summary", "assessments", "flowsheets", "mar", "notes", "orders", "labs"],
    );
  });

  it("exports printable academy feedback", () => {
    const output = generateDocumentationAcademy(input("sbar-documentation", STRONG_ENTRY));
    const copy = formatDocumentationAcademyForCopy(output);

    assert.match(copy, /SBAR Documentation/);
    assert.match(copy, /Model Documentation/);
    assert.match(copy, /Legal Concerns/);
  });
});

function input(track: DocumentationAcademyInput["track"], learnerEntry: string): DocumentationAcademyInput {
  return {
    track,
    level: "new-graduate",
    jurisdiction: "canada",
    learnerEntry,
  };
}
