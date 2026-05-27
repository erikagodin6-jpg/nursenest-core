import assert from "node:assert/strict";
import test from "node:test";

import {
  evaluateProfessionalIdentityExperience,
  resolveProfessionalIdentityStandard,
  type ProfessionalIdentityDimension,
} from "./professional-identity-standards";

const COMPLETE_DIMENSIONS: readonly ProfessionalIdentityDimension[] = [
  "clinical-capability",
  "safe-practice",
  "calm-under-pressure",
  "professional-reasoning",
  "patient-advocacy",
  "nursing-responsibility",
  "transferable-judgment",
];

test("resolves professional identity standards across tiers", () => {
  assert.match(resolveProfessionalIdentityStandard("RN").purpose, /RN identity/);
  assert.match(resolveProfessionalIdentityStandard("RPN").purpose, /practical-nurse confidence/);
  assert.match(resolveProfessionalIdentityStandard("NP").purpose, /advanced-practice identity/);
  assert.match(resolveProfessionalIdentityStandard("ALLIED").purpose, /allied-health professional identity/);
});

test("passes supportive copy that builds safe clinical confidence", () => {
  const result = evaluateProfessionalIdentityExperience({
    tier: "RN",
    dimensions: COMPLETE_DIMENSIONS,
    copy:
      "This review is building the calm prioritization pattern you will use with real clients: identify the safety cue, protect airway and breathing first, then reassess.",
    rationale:
      "The safer nursing judgment is to escalate when the client becomes unstable. That professional reasoning supports patient advocacy because the nurse notices deterioration and communicates it clearly.",
    feedback:
      "Carry this framework to the next question: name the urgent cue, choose the action that prevents harm, and keep lower-priority tasks for later.",
    recommendation:
      "Repeat two respiratory safety cards to strengthen clinical capability without rushing your reasoning.",
  });

  assert.equal(result.pass, true);
  assert.equal(result.issues.length, 0);
});

test("flags score-only learning that does not build professional identity", () => {
  const result = evaluateProfessionalIdentityExperience({
    tier: "RN",
    dimensions: ["clinical-capability"],
    copy: "Your score went up by 4 percent. Keep getting points to rank higher.",
    framesOnlyExamScore: true,
  });

  assert.equal(result.pass, false);
  assert.ok(result.issues.some((issue) => issue.code === "MISSING_SAFE_PRACTICE_LANGUAGE"));
  assert.ok(result.issues.some((issue) => issue.code === "MISSING_TRANSFERABLE_JUDGMENT"));
  assert.ok(result.issues.some((issue) => issue.code === "EXAM_SCORE_ONLY_FRAMING"));
});

test("rejects shaming or overpromising confidence language", () => {
  const result = evaluateProfessionalIdentityExperience({
    tier: "RPN",
    dimensions: COMPLETE_DIMENSIONS,
    copy:
      "You should have known this and will never miss again. This guarantees you will pass if you keep going.",
    usesShameOrFear: true,
    overpromisesConfidence: true,
  });

  assert.equal(result.pass, false);
  assert.ok(result.issues.some((issue) => issue.code === "SHAMING_OR_FEAR_BASED_TONE"));
  assert.ok(result.issues.some((issue) => issue.code === "OVERPROMISES_CONFIDENCE"));
});
