import test from "node:test";
import assert from "node:assert/strict";

import {
  evaluateDistractorOptimization,
  resolveDistractorOptimizationStandard,
} from "./distractor-optimization-standards";

test("resolves tier-specific distractor standards", () => {
  const rn = resolveDistractorOptimizationStandard("RN");
  const np = resolveDistractorOptimizationStandard("NP");
  const allied = resolveDistractorOptimizationStandard("ALLIED");

  assert.ok(rn.misconceptionTargets.some((target) => target.includes("prioritizing")));
  assert.ok(np.misconceptionTargets.some((target) => target.includes("diagnosis")));
  assert.ok(allied.misconceptionTargets.some((target) => target.includes("scope")));
});

test("passes balanced RN distractors with misconception-based teaching", () => {
  const result = evaluateDistractorOptimization({
    tier: "RN",
    stem:
      "A nurse is caring for four clients on a medical-surgical unit. Which client should the nurse assess first?",
    options: [
      {
        id: "A",
        text: "A client with chronic COPD reporting mild dyspnea after ambulating to the bathroom",
        correct: false,
      },
      {
        id: "B",
        text: "A client with heart failure who gained 1 kg over the last 24 hours",
        correct: false,
      },
      {
        id: "C",
        text: "A client with pneumonia who is newly confused and has an oxygen saturation of 86%",
        correct: true,
      },
      {
        id: "D",
        text: "A client with diabetes requesting teaching before a scheduled insulin dose",
        correct: false,
      },
    ],
    correctAnswer: "C",
    distractorRationales: {
      A: "Mild dyspnea after activity may need follow-up, but it is less urgent than new hypoxia with mental status change.",
      B: "Weight gain suggests fluid retention, but the cue is not as immediately threatening as acute oxygenation decline.",
      D: "Teaching is important, but it can wait until the unstable respiratory assessment is addressed.",
    },
  });

  assert.equal(result.pass, true);
  assert.equal(result.issues.length, 0);
  assert.ok(result.score >= 80);
});

test("flags throwaway and absolute distractors", () => {
  const result = evaluateDistractorOptimization({
    tier: "RN",
    stem: "Which action should the nurse take first when a client reports chest pressure and shortness of breath?",
    options: [
      "Assess airway, breathing, circulation, and obtain vital signs",
      "Ignore the symptoms because anxiety is common",
      "Always administer the strongest pain medication available",
      "All of the above",
    ],
    correctAnswer: "Assess airway, breathing, circulation, and obtain vital signs",
    distractorRationales: {
      B: "Wrong.",
      C: "Wrong.",
      D: "Wrong.",
    },
  });

  assert.ok(result.issues.some((issue) => issue.code === "OBVIOUS_SAFETY_GIVEAWAY"));
  assert.ok(result.issues.some((issue) => issue.code === "ABSOLUTE_LANGUAGE_GIVEAWAY"));
  assert.ok(result.issues.some((issue) => issue.code === "ALL_OR_NONE_PATTERN"));
  assert.ok(result.issues.some((issue) => issue.code === "DISTRACTOR_RATIONALE_TOO_GENERIC"));
  assert.equal(result.pass, false);
});

test("flags length clues and missing distractor rationales", () => {
  const result = evaluateDistractorOptimization({
    tier: "NP",
    stem:
      "An adult client has fever, flank pain, dysuria, and nausea. Which initial management plan is most appropriate?",
    options: [
      "Repeat urinalysis in one month",
      "Recommend cranberry supplements",
      "Prescribe outpatient antibiotics after assessing severity, pregnancy status, allergies, local resistance risk, and need for escalation",
      "Provide reassurance only",
    ],
    correctAnswer:
      "Prescribe outpatient antibiotics after assessing severity, pregnancy status, allergies, local resistance risk, and need for escalation",
    distractorRationales: {
      A: "Delayed testing misses current infection and does not address symptoms.",
    },
  });

  assert.ok(result.issues.some((issue) => issue.code === "LENGTH_CLUE"));
  assert.ok(result.issues.some((issue) => issue.code === "DISTRACTOR_RATIONALE_MISSING"));
  assert.equal(result.pass, false);
});

test("flags duplicate distractors that do not test distinct misconceptions", () => {
  const result = evaluateDistractorOptimization({
    tier: "ALLIED",
    stem:
      "A respiratory therapy student notices a client's oxygen tubing is disconnected during transport. What should the student do first?",
    options: [
      { id: "A", text: "Reconnect the oxygen tubing and assess the client's response", correct: true },
      { id: "B", text: "Reconnect the oxygen tubing and document the client's response", correct: false },
      { id: "C", text: "Ask the client whether oxygen is still needed during transport", correct: false },
      { id: "D", text: "Wait until arrival because transport is almost complete", correct: false },
    ],
    correctAnswer: "A",
    distractorRationales: {
      B: "Documentation matters, but assessment after restoring oxygen comes before documentation.",
      C: "The client report is useful, but the visible disconnection requires immediate safety correction.",
      D: "Waiting delays correction of an oxygen delivery failure and increases risk of deterioration.",
    },
  });

  assert.ok(result.issues.some((issue) => issue.code === "DUPLICATE_DISTRACTOR"));
});
