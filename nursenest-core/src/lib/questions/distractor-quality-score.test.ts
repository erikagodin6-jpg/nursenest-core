import test from "node:test";
import assert from "node:assert/strict";
import {
  scoreDistractorQuality,
  scoreDistractorSetQuality,
} from "@/lib/questions/distractor-quality-score";

test("fails throwaway distractors without why-tempting or safety analysis", () => {
  const result = scoreDistractorQuality({
    distractor: "Do nothing.",
    stem: "A client has falling SpO2 and increased work of breathing.",
    correctAnswer: "Position upright, assess airway and breathing, and escalate respiratory support.",
    rationale: "This is wrong.",
  });

  assert.equal(result.publishAllowed, false);
  assert.equal(result.gate, "fail");
  assert.ok(result.score < 70);
});

test("rewards realistic distractors with why-tempting and safety analysis", () => {
  const result = scoreDistractorQuality({
    distractor: "Reposition the pulse oximeter and recheck the reading in 10 minutes.",
    stem: "A ventilated client is coughing, has visible secretions, a high-pressure alarm, and SpO2 has fallen from 94% to 86%.",
    correctAnswer: "Assess the airway, call for respiratory support, and prepare to suction according to policy.",
    whyTempting: "A learner may select this because pulse oximeter probes can be inaccurate and equipment checks are familiar.",
    whyIncorrect: "It is incorrect because the patient has multiple airway and ventilation cues that require immediate assessment rather than delayed equipment troubleshooting.",
    riskIntroduced: "The risk is delayed response to airway obstruction, worsening hypoxemia, and failure to rescue.",
  });

  assert.equal(result.publishAllowed, true);
  assert.ok(result.score >= 70);
  assert.ok(result.taxonomy.includes("assessment_error"));
  assert.ok(result.taxonomy.includes("safety_error"));
  assert.equal(result.misconceptionMappingPresent, true);
  assert.equal(result.remediationMappingPresent, true);
  assert.equal(result.readinessMappingPresent, true);
  assert.ok(result.readinessDomains.includes("patient_safety_readiness"));
  assert.ok(result.remediationTargets.length > 0);
});

test("maps failure-to-rescue distractors to remediation and readiness intelligence", () => {
  const result = scoreDistractorQuality({
    distractor: "Recheck the oxygen saturation later during routine rounds.",
    stem: "A client has new confusion, SpO2 of 84%, and labored respirations.",
    correctAnswer: "Assess airway and breathing, apply oxygen per protocol, and escalate immediately.",
    whyTempting: "A learner may select this because rechecking data can seem careful.",
    whyIncorrect: "It is incorrect because this delays response to an unstable respiratory pattern.",
    riskIntroduced: "The risk is missed deterioration and failure to rescue.",
  });

  assert.equal(result.publishAllowed, true);
  assert.ok(result.failureToRescueSignal);
  assert.ok(result.taxonomy.includes("failure_to_rescue"));
});

test("question set blocks publication when any distractor fails", () => {
  const result = scoreDistractorSetQuality({
    stem: "A client with hypoglycemia is awake and able to swallow.",
    correctAnswer: "Give fast-acting carbohydrate and reassess glucose.",
    distractors: [
      {
        distractor: "Administer the scheduled insulin.",
        whyTempting: "A learner may focus on diabetes and scheduled medication timing.",
        whyIncorrect: "It is incorrect because insulin worsens active hypoglycemia.",
        riskIntroduced: "The risk is worsening neuroglycopenia and delayed rescue.",
      },
      {
        distractor: "Document the finding.",
        whyTempting: "A learner may know documentation is required after abnormal findings.",
        whyIncorrect: "It is incorrect because treatment and reassessment must happen before routine charting.",
        riskIntroduced: "The risk is delayed correction of low glucose.",
      },
      {
        distractor: "None of the above.",
        rationale: "Wrong.",
      },
    ],
  });

  assert.equal(result.publishAllowed, false);
  assert.equal(result.gate, "fail");
});
