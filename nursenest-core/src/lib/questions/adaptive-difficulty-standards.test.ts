import test from "node:test";
import assert from "node:assert/strict";

import {
  difficultyLevelFromScore,
  evaluateAdaptiveDifficulty,
  resolveAdaptiveDifficultyStandard,
} from "./adaptive-difficulty-standards";

test("maps numeric item difficulty into progressive adaptive levels", () => {
  assert.equal(difficultyLevelFromScore(1), "beginner");
  assert.equal(difficultyLevelFromScore(2.4), "intermediate");
  assert.equal(difficultyLevelFromScore(3.4), "advanced");
  assert.equal(difficultyLevelFromScore(4.2), "licensing-exam");
  assert.equal(difficultyLevelFromScore(4.9), "expert-clinical-reasoning");
});

test("documents intentional difficulty scaling across every tier", () => {
  for (const tier of ["RPN", "RN", "NP", "ALLIED"] as const) {
    const standard = resolveAdaptiveDifficultyStandard(tier);

    assert.equal(standard.descriptors.beginner.learnerIntent.includes("foundational"), true);
    assert.equal(standard.descriptors.advanced.cognitiveDemand.includes("synthesis"), true);
    assert.equal(
      standard.descriptors["expert-clinical-reasoning"].cognitiveDemand.includes("ambiguity tolerance"),
      true,
    );
    assert.ok(standard.tierScopeGuardrails.length >= 2);
  }
});

test("passes a licensing-level RN item with concise synthesis instead of extra length", () => {
  const result = evaluateAdaptiveDifficulty({
    tier: "RN",
    level: "licensing-exam",
    stem:
      "A nurse is caring for four clients after change of shift. Which client should the nurse assess first?",
    options: [
      "A client with pneumonia whose oxygen saturation decreased from 93% to 86% despite 2 L/min oxygen",
      "A client with heart failure who gained 1 kg and reports mild ankle swelling",
      "A client with diabetes whose premeal glucose is 68 mg/dL and who is awake and drinking juice",
      "A client after appendectomy requesting prescribed pain medication before ambulation",
    ],
    rationale:
      "The priority is the client with worsening oxygenation despite oxygen therapy because this reflects acute deterioration. The other clients require nursing care, but they are either stable, already receiving an appropriate intervention, or do not show the same immediate airway/breathing risk.",
    clinicalReasoning:
      "The nurse must synthesize trend recognition, oxygenation risk, and competing patient priorities to choose the unstable client first.",
  });

  assert.equal(result.pass, true);
  assert.equal(result.issues.length, 0);
});

test("rejects fake difficulty created by a long stem without cognitive demand", () => {
  const result = evaluateAdaptiveDifficulty({
    tier: "RN",
    level: "advanced",
    stem:
      "A client is in a clinic room on a Tuesday morning wearing a blue sweater and sitting near the window while the nurse reviews the chart, checks the appointment notes, confirms the client has arrived, notices the client has several routine forms, and prepares to begin the visit after greeting the family member who is present.",
    options: [
      "Provide routine teaching",
      "Document the visit",
      "Offer a blanket",
      "Schedule follow-up",
    ],
    rationale: "The item is routine and does not require meaningful synthesis.",
    clinicalReasoning: "The item remains descriptive and does not require interpretation of clinical cues.",
  });

  assert.ok(result.issues.some((issue) => issue.code === "FAKE_LENGTH_BASED_DIFFICULTY"));
  assert.ok(result.issues.some((issue) => issue.code === "MISSING_ADVANCED_SYNTHESIS"));
  assert.equal(result.pass, false);
});

test("requires expert items to include real ambiguity and competing risks", () => {
  const result = evaluateAdaptiveDifficulty({
    tier: "NP",
    level: "expert-clinical-reasoning",
    stem:
      "A 54-year-old client has dysuria and a positive leukocyte esterase result. Which prescription should be selected?",
    options: [
      "Nitrofurantoin",
      "Amoxicillin",
      "Ciprofloxacin",
      "No treatment",
    ],
    rationale:
      "This tests medication selection, but it lacks competing risks, contraindications, diagnostic uncertainty, or follow-up complexity.",
    clinicalReasoning: "The item asks for a direct treatment choice without ambiguity.",
  });

  assert.ok(result.issues.some((issue) => issue.code === "MISSING_EXPERT_AMBIGUITY"));
  assert.equal(result.pass, false);
});

test("guards RN and RPN difficulty scaling from out-of-scope escalation", () => {
  const rn = evaluateAdaptiveDifficulty({
    tier: "RN",
    level: "advanced",
    stem:
      "A client with respiratory distress has worsening oxygen saturation and new confusion. Which action should the nurse take first?",
    options: [
      "Adjust ventilator settings independently",
      "Assess airway and call the rapid response team",
      "Document findings at the end of the shift",
      "Request routine respiratory therapy rounding",
    ],
    rationale: "The item includes an out-of-scope ventilator action as a distractor.",
    clinicalReasoning:
      "Advanced RN difficulty should test recognition of deterioration and escalation, not independent ventilator management.",
  });

  const rpn = evaluateAdaptiveDifficulty({
    tier: "RPN",
    level: "licensing-exam",
    stem:
      "A practical nurse notes a stable client now has new chest pain and shortness of breath. What is the priority action?",
    options: [
      "Diagnose acute coronary syndrome",
      "Stay with the client and report the change immediately",
      "Offer discharge teaching",
      "Delay assessment until the next scheduled vital signs",
    ],
    rationale: "The best action stays within practical-nurse recognition and reporting scope.",
    clinicalReasoning:
      "The item should scale through safety recognition, immediate reporting, and stable-vs-unstable judgment.",
  });

  assert.ok(rn.issues.some((issue) => issue.code === "TIER_SCOPE_MISMATCH"));
  assert.ok(rpn.issues.some((issue) => issue.code === "TIER_SCOPE_MISMATCH"));
});
