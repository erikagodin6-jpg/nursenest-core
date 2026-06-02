import test from "node:test";
import assert from "node:assert/strict";

import {
  evaluatePremiumContentDepth,
  resolvePremiumContentDepthStandard,
} from "./premium-content-depth-standards";

test("resolves tier-specific premium depth standards", () => {
  assert.ok(resolvePremiumContentDepthStandard("RN").purpose.includes("prioritization"));
  assert.ok(resolvePremiumContentDepthStandard("RPN").purpose.includes("recognition"));
  assert.ok(resolvePremiumContentDepthStandard("NP").purpose.includes("diagnostic"));
  assert.ok(resolvePremiumContentDepthStandard("ALLIED").purpose.includes("workflow"));
});

test("passes premium RN content that teaches safe clinical practice", () => {
  const result = evaluatePremiumContentDepth({
    tier: "RN",
    stem:
      "A nurse is caring for a client with pneumonia whose oxygen saturation drops from 93% to 86% and who becomes newly confused. Which action should the nurse take first?",
    options: [
      "Assess airway and breathing and escalate the change in condition",
      "Teach incentive spirometry before the next meal",
      "Document the finding and recheck at the next scheduled vital signs",
      "Delegate ambulation to assistive personnel to improve ventilation",
    ],
    rationale:
      "The falling oxygen saturation plus new confusion indicates acute deterioration and impaired oxygen delivery. The safest first decision is to assess airway and breathing and escalate promptly because delay increases risk for hypoxia-related harm. Teaching, documentation, and ambulation may be appropriate later, but they do not protect the client from the immediate breathing priority.",
    clinicalReasoning:
      "The reasoning chain is cue recognition → interpretation → priority action. The nurse connects a trend in oxygenation with mental status change, recognizes instability, and chooses the intervention that prevents harm before routine care. This same framework applies to similar clients: new confusion plus worsening respiratory data should trigger immediate reassessment and escalation.",
    hint:
      "Focus on the acute change and ask which option prevents the most immediate harm.",
    keyTakeaway:
      "High-yield exam trap: do not choose routine teaching when the stem shows acute deterioration.",
    clinicalTrap:
      "Incentive spirometry is tempting because it relates to pneumonia, but it is a later intervention when oxygenation is actively worsening.",
    distractorRationales: {
      B: "Teaching is useful after stabilization, but it delays response to an acute breathing and safety cue.",
      C: "Documentation matters, but waiting for the next scheduled check misses a deterioration pattern.",
      D: "Ambulation may help some clients, but delegating it during hypoxia and confusion is unsafe.",
    },
  });

  assert.equal(result.pass, true);
  assert.equal(result.issues.length, 0);
});

test("rejects shallow explanations and generic teaching language", () => {
  const result = evaluatePremiumContentDepth({
    tier: "RN",
    stem: "A client has pneumonia. What should the nurse do?",
    options: ["Give oxygen", "Teach coughing", "Document", "Ambulate"],
    rationale: "This is the best answer because it is correct. Review the material.",
    clinicalReasoning: "Basic concept.",
    distractorRationales: {
      B: "Wrong.",
    },
  });

  assert.ok(result.issues.some((issue) => issue.code === "SHALLOW_EXPLANATION"));
  assert.ok(result.issues.some((issue) => issue.code === "GENERIC_TEACHING_LANGUAGE"));
  assert.ok(result.issues.some((issue) => issue.code === "INSUFFICIENT_DISTRACTOR_TEACHING"));
  assert.equal(result.pass, false);
});

test("flags textbook regurgitation without transferable clinical judgment", () => {
  const result = evaluatePremiumContentDepth({
    tier: "RPN",
    stem: "What is hypoglycemia?",
    options: [
      "Low blood glucose",
      "High blood glucose",
      "Low blood pressure",
      "High body temperature",
    ],
    rationale:
      "Hypoglycemia is defined as low blood glucose. It is when glucose is below expected range. This textbook term means that the blood sugar is low.",
    clinicalReasoning:
      "The content names a definition but does not connect the finding to safety, recognition, reporting, or a bedside decision.",
    distractorRationales: {
      B: "This is high glucose.",
      C: "This is blood pressure.",
      D: "This is temperature.",
    },
  });

  assert.ok(result.issues.some((issue) => issue.code === "TEXTBOOK_REGURGITATION"));
  assert.ok(result.issues.some((issue) => issue.code === "MISSING_TRANSFERABLE_JUDGMENT"));
  assert.equal(result.pass, false);
});

test("flags missing safety and prioritization depth", () => {
  const result = evaluatePremiumContentDepth({
    tier: "ALLIED",
    stem: "A client arrives for a routine diagnostic workflow. Which statement is accurate?",
    options: [
      "Documentation is part of the workflow",
      "The form can be reviewed later",
      "The room should be cleaned eventually",
      "The test always proceeds as scheduled",
    ],
    rationale:
      "Documentation is part of the workflow and helps the team. The explanation is accurate but stays at a surface level and does not connect the action to a meaningful clinical decision.",
    clinicalReasoning:
      "The learner is not asked to compare competing workflow actions or identify a meaningful patient cue.",
    keyTakeaway: "Workflow documentation matters.",
    distractorRationales: {
      B: "This delays documentation.",
      C: "This is not the best answer.",
      D: "Always is too absolute.",
    },
  });

  assert.ok(result.issues.some((issue) => issue.code === "MISSING_PATIENT_SAFETY_REINFORCEMENT"));
  assert.ok(result.issues.some((issue) => issue.code === "MISSING_NUANCED_PRIORITIZATION"));
  assert.equal(result.pass, false);
});

test("guards premium depth against out-of-scope escalation", () => {
  const result = evaluatePremiumContentDepth({
    tier: "RN",
    stem:
      "A client receiving oxygen develops worsening respiratory distress and new confusion. Which action should the nurse take first?",
    options: [
      "Adjust ventilator settings independently",
      "Assess breathing and call the rapid response team",
      "Wait for routine respiratory therapy rounds",
      "Teach pursed-lip breathing before reassessing",
    ],
    rationale:
      "The nurse should recognize deterioration and escalate. Independent ventilator adjustment is out of scope and should not be used as the premium reasoning target.",
    clinicalReasoning:
      "Premium RN depth should teach the framework of recognizing unstable breathing, reassessing, and escalating safely rather than moving into specialist procedures.",
    keyTakeaway:
      "High-yield exam insight: choose the safest RN action within scope when respiratory status is worsening.",
    clinicalTrap:
      "A technical action may look decisive, but safe practice requires role-appropriate escalation.",
    distractorRationales: {
      A: "This is outside RN scope and bypasses safe escalation.",
      C: "Routine rounds delay response to deterioration.",
      D: "Teaching is not the priority during acute instability.",
    },
  });

  assert.ok(result.issues.some((issue) => issue.code === "TIER_SCOPE_MISMATCH"));
  assert.equal(result.pass, false);
});
