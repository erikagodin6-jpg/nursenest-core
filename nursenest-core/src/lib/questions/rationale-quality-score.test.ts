import assert from "node:assert/strict";
import test from "node:test";
import {
  canPublishRationale,
  detectRationaleRepetition,
  rationaleQualityGate,
  scoreRationaleQuality,
} from "@/lib/questions/rationale-quality-score";

test("rationale quality scoring fails thin template rationales", () => {
  const result = scoreRationaleQuality({
    id: "thin-template",
    stem: "A client with dyspnea has an oxygen saturation of 88%. What should the nurse do first?",
    correctAnswer: "Apply oxygen.",
    rationale: "This is correct because it is the best answer. Option B is incorrect because it is not priority.",
  });

  assert.equal(result.gate, "fail");
  assert.ok(result.score < 70);
  assert.ok(result.repetitionFindings.some((finding) => finding.patternId === "is_correct_because"));
  assert.ok(result.missingContractFields.includes("patientSafetyImplications"));
});

test("rationale quality scoring rewards premium clinical judgment teaching", () => {
  const result = scoreRationaleQuality({
    id: "heart-failure-premium",
    pathway: "NCLEX-RN",
    stem: "A client with heart failure has crackles, dyspnea, oxygen saturation of 88%, and new edema. Which action is priority?",
    correctAnswer: "Position upright, apply oxygen as prescribed, and reassess respiratory status.",
    rationale:
      "Correct answer: Position upright, support oxygenation, and reassess respiratory status. Why correct: crackles, dyspnea, edema, and SpO2 of 88% indicate impaired oxygenation from possible pulmonary congestion. ABCs make breathing the priority before routine education or documentation. Why incorrect: daily weight helps trend fluid retention but does not address current hypoxemia; sodium teaching matters for discharge but can wait; documenting findings without intervention delays care. Clinical reasoning: the learner should connect fluid overload to reduced gas exchange, increased work of breathing, and risk for deterioration. Patient safety implications: delayed intervention may worsen hypoxemia and increase cardiac workload, requiring escalation. Clinical application: at the bedside, place the patient upright, monitor SpO2 and lung sounds, reassess response, and notify the provider if symptoms persist. Exam strategy: when one option addresses an unstable ABC problem, choose it over important but nonurgent teaching. Clinical pearl: weight gain warns early, but dyspnea with low SpO2 means the patient may be deteriorating now.",
    clinicalPearl: "In heart failure, dyspnea with low SpO2 is more urgent than routine fluid-status teaching.",
    relatedContent: ["Heart Failure Lesson", "Oxygen Therapy Skill", "BNP Interpretation", "Heart Failure Flashcards"],
    optionRationales: {
      A: "Daily weight is useful for monitoring fluid retention, but it does not correct immediate impaired oxygenation.",
      B: "Sodium restriction teaching is important for long-term self-management, but the client is currently unstable.",
      C: "Documentation is required after assessment and intervention; documenting first delays the priority breathing action.",
    },
  });

  assert.ok(result.score >= 95);
  assert.equal(result.gate, "flagship");
  assert.deepEqual(result.missingContractFields, []);
});

test("rationale quality gate thresholds match publish policy", () => {
  assert.equal(rationaleQualityGate(69), "fail");
  assert.equal(rationaleQualityGate(70), "review");
  assert.equal(rationaleQualityGate(84), "review");
  assert.equal(rationaleQualityGate(85), "publish_eligible");
  assert.equal(rationaleQualityGate(94), "publish_eligible");
  assert.equal(rationaleQualityGate(95), "flagship");
  assert.equal(canPublishRationale(84), false);
  assert.equal(canPublishRationale(85), true);
});

test("repetition detection catches specified boilerplate patterns", () => {
  const findings = detectRationaleRepetition([
    "This is correct because it is safest.",
    "Option C is incorrect because it does not address the priority.",
  ]);

  assert.ok(findings.some((finding) => finding.patternId === "is_correct_because"));
  assert.ok(findings.some((finding) => finding.patternId === "option_is_incorrect_because"));
});
