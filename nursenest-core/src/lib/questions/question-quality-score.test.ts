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
  assert.ok(result.score < 70);
  assert.ok(result.issues.some((issue) => issue.code === "generic_rationale"));
  assert.ok(result.issues.some((issue) => issue.code === "answer_revealing_hint"));
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
  assert.ok(result.score >= 85);
  assert.equal(result.issues.some((issue) => issue.severity === "critical"), false);
  assert.ok(result.reviewFlags.includes("emergency"));
});

