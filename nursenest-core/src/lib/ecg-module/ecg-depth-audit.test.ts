import assert from "node:assert/strict";
import test from "node:test";
import {
  buildAdvancedEcgCoverageReport,
  buildEcgDepthAudit,
  countStructuredContentWords,
  type EcgAuditQuestionSnapshot,
  type EcgAuditStructuredContent,
} from "@/lib/ecg-module/ecg-depth-audit";

const coreLesson: EcgAuditStructuredContent = {
  key: "sinus_tachycardia",
  title: "Sinus Tachycardia",
  route: "/lessons/sinus-tachycardia",
  status: "published",
  sections: {
    mechanism: "Sympathetic stimulation, pain, fever, hypovolemia, hypoxia, anemia, or anxiety can increase the SA-node firing rate and create sinus tachycardia.",
    criteria: "Interpret the strip by confirming upright P waves before each QRS, a constant PR interval, a narrow QRS, and a rate over 100 beats/minute.",
    risks: "Persistent tachycardia can shorten diastolic filling time, reduce coronary perfusion, and signal a worsening underlying illness.",
  },
};

const advancedTopic: EcgAuditStructuredContent = {
  key: "ventricular_tachycardia",
  title: "Ventricular Tachycardia",
  route: "/modules/ecg-advanced/telemetry",
  status: "review_ready",
  sections: {
    electrophysiology: "Monomorphic VT arises from a ventricular focus or re-entry loop below the AV node and produces rapid wide-complex depolarization without organized sinus activation.",
    strip_method: "Start with rate and width, then assess regularity, AV association, capture or fusion beats, and hemodynamic stability before deciding whether the rhythm is shockable or perfusing.",
    criteria:
      "Typical criteria include a wide QRS, very fast ventricular rate, absent or dissociated P waves, possible capture or fusion beats, and a regular ventricular rhythm.",
    acls:
      "Unstable VT requires immediate synchronized cardioversion if a pulse is present and defibrillation plus arrest management if pulseless.",
    pearls:
      "Common telemetry pitfalls include labeling VT as SVT with aberrancy or missing pre-arrest deterioration signs such as hypotension, chest pain, mental-status change, and diaphoresis.",
  },
};

const advancedQuestions: EcgAuditQuestionSnapshot[] = Array.from({ length: 40 }, (_, index) => {
  const families = ["family:rhythm_specific"];
  if (index < 15) families.push("family:strip_identification");
  if (index >= 15 && index < 25) families.push("family:priority_action");
  if (index >= 25 && index < 30) families.push("family:complication_escalation");
  if (index >= 30 && index < 35) families.push("family:comparison");
  if (index >= 35) families.push("family:clinical_causes");
  return {
    id: `vt-${index}`,
    rhythmOrTopicKey: "ventricular_tachycardia",
    tags: ["rhythm:ventricular_tachycardia", ...families, "exam_style:icu", "review:clinical_required"],
    rationale: "Correct because the rhythm is wide, rapid, and unstable. Distractors are incorrect because their morphology and bedside response priorities do not match this strip.",
    distractorRationalesComplete: true,
    assetReviewStatus: index < 10 ? "generated_review_required" : "curated_static",
    lessonStatus: "review_ready",
  };
});

test("countStructuredContentWords counts all populated sections", () => {
  assert.equal(countStructuredContentWords(coreLesson.sections) > 20, true);
  assert.equal(countStructuredContentWords(advancedTopic.sections) > countStructuredContentWords(coreLesson.sections), true);
});

test("buildEcgDepthAudit reports coverage, gaps, rationale completeness, and review flags", () => {
  const audit = buildEcgDepthAudit({
    expectedKeys: ["sinus_tachycardia", "junctional_rhythm", "ventricular_tachycardia"],
    coreLessons: [coreLesson],
    advancedLessons: [advancedTopic],
    questions: advancedQuestions,
  });

  assert.deepEqual(audit.coveredKeys, ["sinus_tachycardia", "ventricular_tachycardia"]);
  assert.deepEqual(audit.missingKeys, ["junctional_rhythm"]);
  assert.equal(audit.lessonWordCounts.sinus_tachycardia > 0, true);
  assert.equal(audit.lessonWordCounts.ventricular_tachycardia > audit.lessonWordCounts.sinus_tachycardia, true);
  assert.equal(audit.questionCountsByKey.ventricular_tachycardia.total, 40);
  assert.equal(audit.questionCountsByKey.ventricular_tachycardia.families.strip_identification, 15);
  assert.equal(audit.questionCountsByKey.ventricular_tachycardia.families.priority_action, 10);
  assert.equal(audit.questionCountsByKey.ventricular_tachycardia.families.complication_escalation, 5);
  assert.equal(audit.questionCountsByKey.ventricular_tachycardia.families.comparison, 5);
  assert.equal(audit.questionCountsByKey.ventricular_tachycardia.families.clinical_causes, 5);
  assert.equal(audit.rationaleCompleteness.ventricular_tachycardia.fullRationaleCount, 40);
  assert.equal(audit.assetReviewCounts.generated_review_required, 10);
  assert.equal(audit.reviewStatusCounts.review_ready, 41);
});

test("buildAdvancedEcgCoverageReport enforces premium minimums for high-priority topics", () => {
  const report = buildAdvancedEcgCoverageReport({
    topics: [advancedTopic],
    questions: advancedQuestions,
    entitledTierLabels: ["RN", "NP"],
    blockedTierLabels: ["RPN"],
  });

  assert.equal(report.topics.length, 1);
  assert.equal(report.topics[0]?.key, "ventricular_tachycardia");
  assert.equal(report.topics[0]?.questionVolume.total, 40);
  assert.equal(report.topics[0]?.questionVolume.minimumsMet, true);
  assert.equal(report.topics[0]?.status, "review_ready");
  assert.equal(report.topics[0]?.clinicalReviewRequired, true);
  assert.equal(report.entitlementSummary.advancedEcgEligible.join(", "), "RN, NP");
  assert.equal(report.entitlementSummary.advancedEcgBlocked.join(", "), "RPN");
});
