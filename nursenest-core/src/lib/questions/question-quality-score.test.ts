import assert from "node:assert/strict";
import test from "node:test";
import { scoreQuestionQuality } from "@/lib/questions/question-quality-score";

test("question quality score rejects generic rationale and answer-revealing hints", () => {
  const result = scoreQuestionQuality({
    id: "weak-item",
    stem: "A client is short of breath. What should the nurse do?",
    options: ["Give oxygen", "Document", "Teach", "Wait"],
    correctAnswer: "Give oxygen",
    rationale: "The correct answer is correct because it responds to the priority cue.",
    whyIncorrect: ["Not the best answer.", "Less appropriate.", "Not priority."],
    hint: "Review option A.",
    clinicalPearl: "Oxygen helps breathing.",
    topic: "Respiratory Failure",
    questionType: "mcq",
  });

  assert.equal(result.status, "do_not_publish");
  assert.equal(result.gate, "fail");
  assert.ok(result.score < 70);
  assert.ok(result.issues.some((issue) => issue.code === "generic_rationale"));
  assert.ok(result.issues.some((issue) => issue.code === "answer_revealing_hint"));
  assert.ok(result.issues.some((issue) => issue.code === "missing_related_content"));
  assert.ok(result.reviewFlags.includes("emergency"));
});

test("question quality score rewards clinician-grade teaching structure", () => {
  const result = scoreQuestionQuality({
    id: "sepsis-priority",
    pathway: "NCLEX-RN",
    questionType: "mcq",
    topic: "Sepsis Recognition",
    stem:
      "A client being treated for a urinary tract infection becomes newly confused. Vital signs are BP 86/48, HR 124, RR 28, temperature 38.7 C, and skin cool and mottled. Which action should the nurse take first?",
    options: [
      "Notify the rapid response team and begin focused reassessment of perfusion.",
      "Teach the client to report burning with urination.",
      "Document the new confusion and reassess at the next scheduled round.",
      "Offer oral fluids and encourage the client to rest.",
    ],
    correctAnswer: "Notify the rapid response team and begin focused reassessment of perfusion.",
    rationale:
      "The new confusion, hypotension, tachycardia, tachypnea, fever, and cool mottled skin suggest sepsis with impaired perfusion. The first nursing priority is to recognize deterioration, escalate urgently, and reassess airway, breathing, circulation, mental status, urine output, and response to interventions.",
    whyCorrect:
      "Rapid response activation and focused reassessment address the immediate safety threat: possible septic shock and poor tissue perfusion.",
    whyIncorrect: [
      "Teaching about urinary symptoms may be appropriate later, but it delays escalation when the client is unstable.",
      "Documentation is required after assessment and escalation; it is unsafe as the first action when perfusion is compromised.",
      "Oral fluids and rest do not address hypotension, altered mental status, or possible shock.",
    ],
    clinicalReasoning:
      "The stem combines infection plus organ-perfusion cues. That pattern is more urgent than routine UTI care because delayed sepsis treatment increases risk for shock and organ injury.",
    patientSafetyImplications:
      "Missing this pattern can delay antibiotics, fluids, monitoring, and provider response, increasing failure-to-rescue risk.",
    examStrategy:
      "NCLEX priority questions reward acute change and instability. Choose the action that addresses circulation and escalation before teaching or routine documentation.",
    clinicalApplication:
      "At the bedside, trend vital signs, mental status, skin perfusion, urine output, and lactate or cultures if ordered while communicating concerns clearly using SBAR.",
    clinicalPearl:
      "New confusion with infection can be an early sepsis warning sign, especially when it appears with hypotension or tachypnea.",
    hint: "Consider which finding pattern represents the greatest immediate threat to circulation and organ perfusion.",
    relatedTopics: ["Sepsis", "Shock", "Perfusion", "Rapid Response", "Clinical Judgment"],
  });

  assert.equal(result.status, "publish_ready");
  assert.match(result.gate, /publish_eligible|flagship_ready/);
  assert.ok(result.score >= 85);
  assert.equal(result.issues.some((issue) => issue.severity === "critical"), false);
  assert.ok(result.dimensions.stemQuality >= 85);
  assert.ok(result.dimensions.clinicalRealism >= 85);
  assert.ok(result.dimensions.relatedContentQuality >= 85);
  assert.ok(result.reviewFlags.includes("emergency"));
});

test("question quality score identifies flagship-quality items", () => {
  const result = scoreQuestionQuality({
    id: "hyperkalemia-flagship",
    pathway: "NCLEX-RN",
    profession: "RN",
    questionType: "matrix",
    topic: "Hyperkalemia ECG Deterioration",
    stem:
      "A client with acute kidney injury reports new weakness. The cardiac monitor shows widening QRS complexes, and the potassium is 6.8 mmol/L. Which findings and actions should the nurse prioritize to prevent deterioration?",
    options: [
      "Recognize widened QRS complexes as a high-risk hyperkalemia cue.",
      "Prepare to administer ordered potassium-lowering therapy and continuous monitoring.",
      "Delay escalation until the next routine chemistry panel results.",
      "Teach dietary potassium restriction before addressing the rhythm change.",
    ],
    correctAnswer: [
      "Recognize widened QRS complexes as a high-risk hyperkalemia cue.",
      "Prepare to administer ordered potassium-lowering therapy and continuous monitoring.",
    ],
    rationale:
      "Hyperkalemia becomes immediately dangerous when it produces ECG changes because myocardial conduction can deteriorate into lethal dysrhythmias or cardiac arrest. The patient-specific cues are acute kidney injury, weakness, potassium of 6.8 mmol/L, and widening QRS complexes. The nurse should treat this as a circulation threat, maintain continuous monitoring, verify access, prepare ordered therapies, and escalate promptly. Teaching still matters, but it is not the first priority when the rhythm suggests instability.",
    whyCorrect:
      "The correct actions connect the abnormal laboratory value with the ECG change and focus on preventing deterioration through monitoring, preparation for ordered treatment, and timely escalation.",
    whyIncorrect: [
      "Delaying escalation may seem reasonable if the nurse is waiting for confirmation, but the existing potassium and ECG findings are already high-risk cues. Waiting can allow progression to ventricular dysrhythmias or arrest. The misconception is trend-interpretation failure: the learner treats potassium and QRS widening as data to confirm later instead of an active deterioration pattern. Remediate with hyperkalemia ECG escalation and failure-to-rescue practice.",
      "Diet teaching may seem reasonable because long-term potassium control matters, but it is incorrect before stabilizing the immediate conduction risk shown by widening QRS complexes. The misconception is task fixation on education while missing medication safety and cardiac monitoring priorities. Remediate with emergency electrolyte, ECG, and safety-priority review.",
    ],
    distractorType: ["trend_interpretation_failure", "task_fixation"],
    misconceptionType: [
      "Learner waits for confirmation even though potassium plus QRS widening already indicates deterioration risk.",
      "Learner prioritizes long-term education before immediate cardiac safety.",
    ],
    safetyRisk: [
      "Delayed escalation can allow progression to ventricular dysrhythmias or cardiac arrest.",
      "Delayed monitoring and ordered therapy can worsen conduction instability.",
    ],
    readinessDomain: [
      "clinical_judgment_readiness",
      "patient_safety_readiness",
      "escalation_readiness",
      "medication_safety_readiness",
    ],
    clinicalReasoning:
      "The clinical decision rule is to treat hyperkalemia with ECG changes as an urgent circulation problem. Lab severity plus rhythm change is more important than education or routine reassessment.",
    patientSafetyImplications:
      "Missing this pattern can delay calcium, insulin-glucose, potassium shifting or elimination therapy as ordered, and continuous monitoring, increasing the risk of cardiac arrest.",
    examStrategy:
      "NCLEX clinical judgment items reward linking labs to assessment cues. Prioritize abnormal potassium with ECG changes before long-term teaching.",
    clinicalApplication:
      "At the bedside, place the patient on continuous monitoring, reassess circulation and symptoms, verify IV access, notify the provider or rapid response team per policy using SBAR, communicate the potassium and ECG findings clearly, and prepare ordered emergency therapy.",
    clinicalPearl:
      "Hyperkalemia is most dangerous when the ECG changes; widening QRS complexes mean the potassium problem is affecting cardiac conduction now.",
    hint: "Link the abnormal lab to the rhythm change and decide which cue creates the greatest immediate circulation risk.",
    relatedTopics: ["Hyperkalemia", "ECG Changes", "Acute Kidney Injury", "Medication Safety", "Clinical Judgment"],
    relatedLessons: ["Hyperkalemia with ECG changes", "Acute kidney injury electrolyte emergencies"],
    relatedFlashcards: ["Hyperkalemia ECG danger signs", "Potassium-lowering therapy monitoring"],
    relatedSimulations: ["Hyperkalemia deterioration simulation"],
    relatedEcgContent: ["Widening QRS and hyperkalemia"],
    relatedLabContent: ["Critical potassium trend interpretation"],
    relatedPharmacologyContent: ["Calcium, insulin-glucose, and potassium shifting therapy"],
  });

  assert.equal(result.status, "publish_ready");
  assert.equal(result.gate, "flagship_ready");
  assert.ok(result.score >= 95);
  assert.equal(result.issues.length, 0);
  assert.ok(result.dimensions.distractorIntelligence >= 95);
  assert.ok(result.dimensions.failureToRescueCoverage >= 95);
  assert.ok(result.dimensions.readinessIntegration >= 95);
});
