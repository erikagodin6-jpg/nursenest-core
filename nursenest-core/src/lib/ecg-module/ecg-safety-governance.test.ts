import assert from "node:assert/strict";
import test from "node:test";
import {
  countPublishReadyEcgQuestions,
  defaultEcgQaMetadataForRhythm,
  ECG_QUARANTINED_RHYTHM_KEYS,
  isEcgQuestionLearnerVisible,
  isQuarantinedEcgRhythm,
  usesGeneratedPacemakerPhysiology,
  type EcgQuestionGovernanceSnapshot,
} from "@/lib/ecg-module/ecg-safety-governance";

function makeQuestion(
  overrides: Partial<EcgQuestionGovernanceSnapshot> = {},
): EcgQuestionGovernanceSnapshot {
  return {
    id: "ecg-test-row",
    rhythmTag: "atrial_fibrillation",
    mediaType: "ecg_live_strip",
    mediaConfig: { rhythmKey: "atrial_fibrillation" },
    videoUrl: "",
    qaStatus: "approved",
    publishSafetyStatus: "safe",
    waveformFidelity: "morphology_approximate",
    clinicianReviewedAt: new Date("2026-05-11T00:00:00.000Z"),
    clinicianReviewedBy: "tester",
    ...overrides,
  };
}

test("unsupported AV block rhythms stay quarantined and internal-only", () => {
  for (const rhythmKey of [
    "first_degree_av_block",
    "second_degree_type_i_av_block",
    "second_degree_type_ii_av_block",
    "third_degree_av_block",
  ]) {
    assert.equal(isQuarantinedEcgRhythm(rhythmKey), true, `${rhythmKey} should be quarantined`);
  }

  assert.equal(ECG_QUARANTINED_RHYTHM_KEYS.includes("third_degree_av_block"), true);
  assert.equal(isQuarantinedEcgRhythm("atrial_fibrillation"), false);
});

test("learner visibility requires clinician review, approved QA, safe publish status, and media", () => {
  assert.equal(isEcgQuestionLearnerVisible(makeQuestion()), true);
  assert.equal(isEcgQuestionLearnerVisible(makeQuestion({ clinicianReviewedAt: null })), false);
  assert.equal(isEcgQuestionLearnerVisible(makeQuestion({ qaStatus: "pending" })), false);
  assert.equal(isEcgQuestionLearnerVisible(makeQuestion({ publishSafetyStatus: "internal_only" })), false);
  assert.equal(isEcgQuestionLearnerVisible(makeQuestion({ mediaConfig: null })), false);
  assert.equal(
    isEcgQuestionLearnerVisible(makeQuestion({ rhythmTag: "third_degree_av_block" })),
    false,
  );
});

test("publish-ready ECG counts exclude pending, media-less, generated-only, and quarantined items", () => {
  const rows = [
    makeQuestion({ id: "ready" }),
    makeQuestion({ id: "pending", qaStatus: "pending", publishSafetyStatus: "internal_only", clinicianReviewedAt: null }),
    makeQuestion({ id: "no-media", mediaConfig: null }),
    makeQuestion({ id: "quarantined", rhythmTag: "first_degree_av_block" }),
  ];

  assert.equal(countPublishReadyEcgQuestions(rows), 1);
});

test("generated pacemaker physiology stays internal-only even if other QA flags look approved", () => {
  const pacedQuestion = makeQuestion({
    rhythmTag: "paced_rhythm",
    mediaType: "ecg_live_strip",
    mediaConfig: { rhythmKey: "paced_rhythm", pacingMode: "ventricular" },
  });

  assert.equal(usesGeneratedPacemakerPhysiology(pacedQuestion), true);
  assert.equal(isEcgQuestionLearnerVisible(pacedQuestion), false);
});

test("generated ECG defaults remain non-publishable until clinician QA happens", () => {
  const generated = defaultEcgQaMetadataForRhythm("atrial_fibrillation", "generated");
  assert.equal(generated.qaStatus, "pending");
  assert.equal(generated.publishSafetyStatus, "internal_only");
  assert.equal(generated.waveformFidelity, "educational_simplified");

  const quarantined = defaultEcgQaMetadataForRhythm("third_degree_av_block", "curated");
  assert.equal(quarantined.qaStatus, "quarantined");
  assert.equal(quarantined.publishSafetyStatus, "internal_only");
});
