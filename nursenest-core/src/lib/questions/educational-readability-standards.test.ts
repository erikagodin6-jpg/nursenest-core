import test from "node:test";
import assert from "node:assert/strict";

import {
  evaluateEducationalReadability,
  resolveEducationalReadabilityStandard,
} from "./educational-readability-standards";

test("resolves tier-specific readability standards", () => {
  assert.equal(resolveEducationalReadabilityStandard("RN").maxParagraphWords, 80);
  assert.ok(resolveEducationalReadabilityStandard("NP").preferredRationaleSections.some((section) => section.includes("Differential")));
  assert.ok(resolveEducationalReadabilityStandard("ALLIED").mobileGuidance.some((line) => line.includes("role-specific")));
});

test("passes chunked RN teaching content optimized for rapid review", () => {
  const result = evaluateEducationalReadability({
    tier: "RN",
    stem:
      "A nurse is caring for a client with pneumonia whose oxygen saturation decreases from 93% to 86%. Which action should the nurse take first?",
    options: [
      "Assess airway and breathing and escalate the change",
      "Document the finding and recheck later",
      "Teach incentive spirometry",
      "Delegate ambulation to assistive personnel",
    ],
    rationaleSections: [
      {
        heading: "Why this is correct",
        body: "New confusion and falling oxygen saturation are breathing-priority cues. The nurse should assess and escalate promptly.",
      },
      {
        heading: "Safety cue",
        body: "Treat an acute oxygenation change as urgent because hypoxia can worsen quickly.",
      },
      {
        heading: "Test-taking takeaway",
        body: "Choose the option that protects airway and breathing before routine teaching or documentation.",
      },
    ],
    keyTeachingPoints: [
      "Falling SpO2 plus confusion is urgent.",
      "Breathing comes before routine teaching.",
    ],
  });

  assert.equal(result.pass, true);
  assert.equal(result.issues.length, 0);
});

test("flags dense rationale paragraphs and missing section chunking", () => {
  const dense =
    "The client has worsening oxygenation and new confusion, and although several nursing actions may eventually be appropriate, the priority is to recognize the acute change, connect it to impaired gas exchange, avoid delaying care for routine teaching or documentation, understand that hypoxia can progress quickly, decide that reassessment and escalation are required, choose the response that reduces immediate risk while preserving patient safety across the shift, and avoid blending the correct answer with unrelated background details that make the teaching harder to scan during a rapid mobile review session.";

  const result = evaluateEducationalReadability({
    tier: "RN",
    stem: "A patient with pneumonia has new confusion and lower oxygen saturation. Which action is best?",
    options: ["Assess breathing", "Teach coughing", "Document later", "Ambulate now"],
    rationale: dense,
    clinicalReasoning: dense,
  });

  assert.ok(result.issues.some((issue) => issue.code === "DENSE_PARAGRAPH"));
  assert.ok(result.issues.some((issue) => issue.code === "RATIONALE_NOT_CHUNKED"));
  assert.ok(result.issues.some((issue) => issue.code === "INCONSISTENT_TERMINOLOGY"));
  assert.equal(result.pass, false);
});

test("flags long answer options that are difficult to scan on mobile", () => {
  const result = evaluateEducationalReadability({
    tier: "RPN",
    stem: "A client reports dizziness after receiving medication. What should the practical nurse do first?",
    options: [
      "Ask the client to remain seated, assess vital signs, and report unexpected findings to the registered nurse according to facility policy while continuing to monitor for worsening symptoms",
      "Offer a snack",
      "Review the pamphlet",
      "Document at the end of shift",
    ],
    rationaleSections: [
      {
        heading: "Safety cue",
        body: "Dizziness after medication can signal a safety risk. Assess first and report unexpected findings.",
      },
      {
        heading: "Takeaway",
        body: "Do not delay assessment when a new symptom appears after medication.",
      },
    ],
  });

  assert.ok(result.issues.some((issue) => issue.code === "OPTION_TOO_LONG_FOR_MOBILE"));
});

test("flags long rationale without bullets or scannable teaching points", () => {
  const rationale =
    "The client has several findings that matter for safety. The new weakness, dizziness, and medication timing should be interpreted together because the symptom pattern may represent an adverse response rather than a routine complaint. The learner should recognize that a quick focused assessment is safer than continuing the planned task. The clinician should also consider fall risk, reportable findings, and the need to monitor whether symptoms improve or worsen after the intervention. The explanation should separate immediate safety action, communication, documentation, and reassessment so fatigued learners can retain the priority instead of reading a single dense teaching block.";

  const result = evaluateEducationalReadability({
    tier: "ALLIED",
    stem: "A client becomes dizzy during a diagnostic workflow. Which action is safest?",
    options: [
      "Stop the workflow and assess the client before proceeding",
      "Continue because the test is almost finished",
      "Document after the client leaves",
      "Ask another student to decide",
    ],
    rationale,
  });

  assert.ok(result.issues.some((issue) => issue.code === "MISSING_BULLETS_FOR_LONG_RATIONALE"));
  assert.ok(result.issues.some((issue) => issue.code === "SAFETY_CUES_NOT_SCANNABLE"));
});

test("flags cumulative readability issues as excessive cognitive load", () => {
  const longSentence =
    "The client is experiencing a complicated clinical situation that requires the learner to interpret multiple details simultaneously while also remembering medication effects and safety principles and documentation expectations without any clear chunking or visual structure for rapid mobile review";

  const result = evaluateEducationalReadability({
    tier: "NP",
    stem: "A patient has several symptoms after a medication change. Which action is best?",
    options: [
      "Choose a very long management plan that includes reassessment, medication review, diagnostics, shared decision-making, follow-up, and emergency precautions in one option that is hard to scan",
      "Reassure the patient",
      "Stop all medications",
      "Schedule routine follow-up",
    ],
    rationale: `${longSentence}. ${longSentence}. ${longSentence}.`,
    clinicalReasoning: longSentence,
  });

  assert.ok(result.issues.some((issue) => issue.code === "EXCESSIVE_COGNITIVE_LOAD"));
  assert.equal(result.pass, false);
});
