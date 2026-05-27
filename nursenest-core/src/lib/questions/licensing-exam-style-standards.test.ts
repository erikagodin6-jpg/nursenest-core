import test from "node:test";
import assert from "node:assert/strict";

import {
  evaluateLicensingExamStyle,
  resolveLicensingExamStyleStandard,
} from "./licensing-exam-style-standards";

test("resolves the correct licensing style for each healthcare tier", () => {
  assert.equal(resolveLicensingExamStyleStandard("RN").style, "NCLEX-RN");
  assert.equal(resolveLicensingExamStyleStandard("RPN").style, "REx-PN");
  assert.equal(resolveLicensingExamStyleStandard("NP").style, "NP-board-style");
  assert.equal(resolveLicensingExamStyleStandard("ALLIED").style, "Allied-Health-licensing");
});

test("passes an NCLEX-RN style clinical judgment item", () => {
  const result = evaluateLicensingExamStyle({
    tier: "RN",
    cognitiveLevel: "analysis",
    stem:
      "A nurse is caring for a client with pneumonia who becomes newly confused while receiving oxygen at 2 L/min. The oxygen saturation has decreased from 93% to 86% over 30 minutes. Which action should the nurse take first?",
    options: [
      "Increase the frequency of incentive spirometry teaching",
      "Assess airway and breathing and escalate the change in condition",
      "Document the findings and reassess at the next scheduled vital sign check",
      "Ask assistive personnel to ambulate the client to improve ventilation",
    ],
    rationale:
      "New confusion with worsening oxygen saturation indicates acute deterioration and a breathing priority. The nurse should assess airway and breathing and escalate promptly rather than delaying for teaching, routine documentation, or ambulation.",
    clinicalReasoning:
      "The item requires cue recognition, trend interpretation, safety prioritization, and selection of the immediate nursing action that protects oxygenation.",
  });

  assert.equal(result.pass, true);
  assert.equal(result.issues.length, 0);
});

test("rejects trivia-style recall without a patient scenario", () => {
  const result = evaluateLicensingExamStyle({
    tier: "RN",
    cognitiveLevel: "recall",
    stem: "What is atelectasis?",
    options: [
      "Collapse of alveoli",
      "Infection of the bloodstream",
      "Fluid in the pleural space",
      "Inflammation of the pancreas",
    ],
    rationale: "This is a definition-only item.",
  });

  assert.ok(result.issues.some((issue) => issue.code === "RECALL_OR_TRIVIA_STYLE"));
  assert.ok(result.issues.some((issue) => issue.code === "MISSING_PATIENT_SCENARIO"));
  assert.ok(result.issues.some((issue) => issue.code === "MISSING_CLINICAL_JUDGMENT"));
  assert.equal(result.pass, false);
});

test("flags items that lack cue recognition or a decision point", () => {
  const result = evaluateLicensingExamStyle({
    tier: "RPN",
    stem: "A client is in the clinic. The nurse reviews general health information.",
    options: [
      "Provide general wellness advice",
      "Review the pamphlet",
      "Ask the client to wait",
      "Schedule a routine appointment",
    ],
    rationale: "The item does not provide cues to interpret.",
    clinicalReasoning: "There is no practical-nurse recognition, reporting, or safety decision.",
  });

  assert.ok(result.issues.some((issue) => issue.code === "MISSING_CUE_RECOGNITION"));
  assert.ok(result.issues.some((issue) => issue.code === "MISSING_DECISION_POINT"));
  assert.equal(result.pass, false);
});

test("guards RN scope while preserving realistic bedside language", () => {
  const result = evaluateLicensingExamStyle({
    tier: "RN",
    stem:
      "A client in respiratory distress has worsening oxygen saturation despite oxygen therapy and new confusion. Which action should the nurse take first?",
    options: [
      "Adjust ventilator settings independently",
      "Assess breathing and call the rapid response team",
      "Wait for the next routine respiratory therapy treatment",
      "Teach pursed-lip breathing before reassessing oxygenation",
    ],
    rationale:
      "The RN recognizes deterioration and escalates while supporting breathing, but independent ventilator adjustment is outside scope.",
    clinicalReasoning:
      "The item should test recognition of deterioration, safety, escalation, and RN scope rather than specialist ventilator management.",
  });

  assert.ok(result.issues.some((issue) => issue.code === "TIER_SCOPE_MISMATCH"));
  assert.equal(result.pass, false);
});

test("passes Allied Health licensing style when workflow and scope drive the decision", () => {
  const result = evaluateLicensingExamStyle({
    tier: "ALLIED",
    stem:
      "A respiratory therapy student is transporting a client for testing when the oxygen tubing disconnects and the client's oxygen saturation decreases from 94% to 88%. Which action should the student take first?",
    options: [
      "Reconnect the oxygen tubing and assess the client's response",
      "Continue transport because the testing area is nearby",
      "Document the event after the diagnostic test is complete",
      "Ask the client whether oxygen is still needed",
    ],
    rationale:
      "The disconnected oxygen source is an immediate safety issue within respiratory workflow. Reconnecting oxygen and assessing response comes before transport efficiency, delayed documentation, or relying on client preference.",
    clinicalReasoning:
      "The item uses profession-specific workflow, cue recognition, safety, scope, and escalation reasoning.",
  });

  assert.equal(result.pass, true);
  assert.equal(result.standard.style, "Allied-Health-licensing");
});
