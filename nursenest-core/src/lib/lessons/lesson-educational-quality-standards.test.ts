import assert from "node:assert/strict";
import test from "node:test";

import {
  evaluateLessonEducationalQuality,
  resolveLessonEducationalQualityStandard,
} from "@/lib/lessons/lesson-educational-quality-standards";

const deepRnBody = `
Pneumonia becomes dangerous when inflammation fills alveoli with fluid and cellular debris, reducing gas exchange and causing hypoxia. The mechanism explains why worsening oxygen saturation, new confusion, rising respiratory rate, and accessory muscle use matter more than a memorized diagnosis label. Perfusion and ventilation are no longer matching, so the nurse links symptoms, assessment findings, and intervention timing.

Clinical reasoning begins with cue recognition. If a client with infection becomes newly confused and oxygen saturation drops, the priority is airway and breathing reassessment, upright positioning, oxygen per order, focused lung assessment, and escalation using SBAR. A stable cough can wait; acute deterioration cannot. Trend recognition also matters: a single mildly abnormal value may be watched, but a worsening pattern changes priority.

Pathophysiology connects directly to labs and diagnostics. Fever, leukocytosis, and infiltrates suggest infection, while lactate or hypotension can indicate sepsis risk. ABG changes may show impaired oxygenation. These findings guide nursing surveillance, reassessment timing, and when to notify the provider or rapid response team.

Workflow simulation: during handoff, the nurse receives a report that the client was 93% on room air two hours ago and is now 86% with confusion. The nurse pauses routine medication teaching, reassesses respiratory status, checks orders, notifies the provider with SBAR, documents the deterioration, and prepares for additional diagnostics or treatment. Interdisciplinary communication with respiratory therapy and the provider prevents delayed escalation.

Patient safety is the spine of the lesson. Unsafe actions include delaying reassessment, delegating ambulation during hypoxia, or focusing on education while the client is unstable. Medication safety includes monitoring antibiotics for allergy and timing doses correctly. Red flags include worsening work of breathing, cyanosis, hypotension, fever with confusion, and decreasing level of consciousness.

NCLEX-RN and NGN exam traps often place a routine respiratory intervention beside an urgent deterioration cue. The high-yield rule is: when oxygenation and mentation worsen together, choose the action that prevents immediate harm before teaching or documentation. Bow-tie and chart review items may ask learners to link the condition, priority action, and monitoring parameters.

Flashcard anchors: new confusion plus low oxygen saturation is deterioration; teaching comes after stabilization; SBAR should include baseline, current trend, focused assessment, and requested escalation. Common misconception: incentive spirometry treats every pneumonia problem first. It helps lung expansion, but it is not the priority when the patient is actively hypoxic.
`;

test("resolves tier-specific lesson quality standards", () => {
  assert.ok(resolveLessonEducationalQualityStandard("RN").purpose.includes("NCLEX"));
  assert.ok(resolveLessonEducationalQualityStandard("RPN").purpose.includes("practical-nursing"));
  assert.ok(resolveLessonEducationalQualityStandard("NP").purpose.includes("advanced-practice"));
  assert.ok(resolveLessonEducationalQualityStandard("ALLIED").purpose.includes("workflow"));
});

test("passes a premium RN lesson with reasoning, safety, interactions, adaptive signals, and retention outputs", () => {
  const result = evaluateLessonEducationalQuality({
    tier: "RN",
    title: "Pneumonia Clinical Judgment",
    sections: [
      { kind: "pathophysiology_overview", heading: "Pathophysiology", body: deepRnBody },
      {
        kind: "clinical_decision_making",
        heading: "Clinical decision-making",
        body: deepRnBody,
        checkpointQuestions: [{ question: "What should happen first?", options: ["Assess breathing", "Teach later"] }],
      },
      {
        kind: "case_study",
        heading: "Mini-case",
        body: deepRnBody,
        recallPrompts: [{ prompt: "Name the cue that changes priority." }],
      },
      {
        kind: "linked_flashcard_prompts",
        heading: "Retention",
        body: deepRnBody,
        keyRecallFacts: [{ prompt: "Hypoxia + confusion", answer: "Escalate" }],
      },
    ],
    interactiveTypes: ["knowledge_check", "sata", "prioritization", "case_mini_scenario", "bowtie", "chart_review"],
    embeddedQuestionTypes: ["multiple", "bowtie", "chart-review"],
    flashcardPrompts: [
      "What cue makes pneumonia urgent?",
      "Why does hypoxia cause confusion?",
      "What is the NCLEX trap with incentive spirometry?",
    ],
    adaptiveSignals: ["weak_concept", "confidence_gap", "misconception_pattern", "remediation_queue", "spaced_repetition"],
  });

  assert.equal(result.pass, true);
  assert.equal(result.issues.length, 0);
});

test("rejects shallow passive lessons even when they have a title and one section", () => {
  const result = evaluateLessonEducationalQuality({
    tier: "RN",
    title: "Pneumonia",
    sections: [
      {
        kind: "core_concept",
        heading: "Overview",
        body: "Pneumonia is a lung infection. This is important to know. Review the material and be familiar with symptoms.",
      },
    ],
    adaptiveSignals: [],
  });

  assert.equal(result.pass, false);
  assert.ok(result.issues.some((issue) => issue.code === "SHALLOW_EDUCATIONAL_DEPTH"));
  assert.ok(result.issues.some((issue) => issue.code === "MISSING_INTERACTIVE_LEARNING"));
  assert.ok(result.issues.some((issue) => issue.code === "GENERIC_TEACHING_LANGUAGE"));
});

test("requires adaptive hooks before lessons can feed personalization", () => {
  const result = evaluateLessonEducationalQuality({
    tier: "RN",
    title: "Pneumonia Clinical Judgment",
    sections: [
      { kind: "pathophysiology_overview", heading: "Pathophysiology", body: deepRnBody },
      { kind: "clinical_decision_making", heading: "Clinical reasoning", body: deepRnBody },
      { kind: "case_study", heading: "Case", body: deepRnBody, checkpointQuestions: [{}] },
      { kind: "client_education", heading: "Education", body: deepRnBody },
    ],
    interactiveTypes: ["knowledge_check", "prioritization"],
    embeddedQuestionTypes: ["single"],
    adaptiveSignals: ["weak_concept"],
  });

  assert.equal(result.pass, false);
  assert.ok(result.issues.some((issue) => issue.code === "MISSING_ADAPTIVE_INTEGRATION"));
});

test("flags missing tier-scope customization for NP lessons", () => {
  const result = evaluateLessonEducationalQuality({
    tier: "NP",
    title: "Respiratory Symptoms",
    sections: [
      { kind: "pathophysiology_overview", heading: "Mechanism", body: deepRnBody },
      { kind: "clinical_decision_making", heading: "Reasoning", body: deepRnBody },
      { kind: "case_study", heading: "Case", body: deepRnBody, checkpointQuestions: [{}] },
      { kind: "linked_flashcard_prompts", heading: "Retention", body: deepRnBody },
    ],
    interactiveTypes: ["knowledge_check", "case_mini_scenario", "reflection_prompt"],
    embeddedQuestionTypes: ["chart-review"],
    flashcardPrompts: ["Cue", "Safety", "Trap"],
    adaptiveSignals: ["weak_concept", "confidence_gap", "misconception_pattern", "remediation_queue", "spaced_repetition"],
  });

  assert.equal(result.pass, false);
  assert.ok(result.issues.some((issue) => issue.code === "MISSING_TIER_SCOPE_CUSTOMIZATION"));
});

test("accepts Allied lessons when workflow and profession-specific scope drive the teaching", () => {
  const alliedBody = `${deepRnBody}

For Allied Health workflow, the learner must identify technical responsibilities, procedure safety checks, equipment verification, documentation, interprofessional escalation, and diagnostic interpretation limits. The clinician communicates abnormal findings through the correct channel, documents what was observed, and escalates when the result suggests deterioration or a scope boundary.`;

  const result = evaluateLessonEducationalQuality({
    tier: "ALLIED",
    title: "Respiratory Workflow and Escalation",
    sections: [
      { kind: "pathophysiology_overview", heading: "Mechanism", body: alliedBody },
      { kind: "clinical_decision_making", heading: "Workflow reasoning", body: alliedBody },
      { kind: "case_study", heading: "Chart case", body: alliedBody, checkpointQuestions: [{}] },
      { kind: "linked_flashcard_prompts", heading: "Retention", body: alliedBody },
    ],
    interactiveTypes: ["knowledge_check", "chart_review", "reflection_prompt", "case_mini_scenario"],
    embeddedQuestionTypes: ["chart-review", "trend"],
    flashcardPrompts: ["Workflow cue", "Escalation boundary", "Documentation trap"],
    adaptiveSignals: ["weak_concept", "confidence_gap", "misconception_pattern", "remediation_queue", "spaced_repetition"],
  });

  assert.equal(result.pass, true);
});
