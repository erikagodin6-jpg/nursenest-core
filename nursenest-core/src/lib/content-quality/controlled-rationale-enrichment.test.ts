import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  buildControlledRationaleEnrichment,
  buildFlashcardExplanationFromSources,
} from "@/lib/content-quality/controlled-rationale-enrichment";

describe("buildControlledRationaleEnrichment", () => {
  it("applies high-yield enrichment for source-anchored electrolyte content", () => {
    const out = buildControlledRationaleEnrichment({
      stem: "A client with hyperkalemia has peaked T waves. Which action is priority?",
      topic: "Electrolytes",
      rationale: "Peaked T waves indicate cardiac instability from elevated potassium and require urgent stabilization.",
      correctAnswerExplanation: "IV calcium is used first to stabilize the myocardium before shifting potassium intracellularly.",
      keyTakeaway: "Treat life-threatening ECG changes before slower corrective therapies.",
    });
    assert.equal(out.applied, true);
    assert.equal(out.batchId, "electrolytes");
    assert.ok(out.whyCorrect.includes("stabilize"));
    assert.ok(out.clinicalPearl.length > 20);
  });

  it("uses honest distractor fallback when option-level reasoning is unavailable", () => {
    const out = buildControlledRationaleEnrichment({
      stem: "Which action is first in septic shock management?",
      topic: "Shock / Sepsis",
      rationale:
        "Early source control and hemodynamic stabilization improve outcomes in septic shock because delayed perfusion support increases organ injury risk.",
      correctAnswerExplanation:
        "Prioritizing fluids, cultures, and antibiotics in sequence reduces time-to-treatment delays and supports tissue perfusion.",
    });
    assert.equal(out.applied, true);
    assert.equal(out.whyWrong, "Detailed distractor explanations are not available for this item yet.");
  });
});

describe("buildFlashcardExplanationFromSources", () => {
  it("returns null when topic is not in high-yield batches", () => {
    const out = buildFlashcardExplanationFromSources({
      front: "Define informed consent.",
      back: "Informed consent requires disclosure, comprehension, voluntariness, and capacity.",
      topic: "Professional Communication",
    });
    assert.equal(out, null);
  });

  it("returns concise structured explanation for high-yield cardiac card", () => {
    const out = buildFlashcardExplanationFromSources({
      front: "What is the priority action for STEMI with ongoing chest pain?",
      back:
        "Activate the reperfusion pathway immediately, monitor for hypotension and dysrhythmias, and administer ordered anti-ischemic therapy while escalating any instability.",
      topic: "Cardiac",
      subtopic: "ACS",
    });
    assert.ok(out);
    assert.ok(out!.includes("Why it is correct:"));
    assert.ok(out!.includes("Clinical pearl:"));
  });
});
