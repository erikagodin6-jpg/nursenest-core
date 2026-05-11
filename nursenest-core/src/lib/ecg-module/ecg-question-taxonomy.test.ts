import assert from "node:assert/strict";
import test from "node:test";
import {
  ECG_EXAM_STYLE_TAGS,
  ECG_QUESTION_FAMILIES,
  normalizeEcgQuestionTaxonomy,
} from "@/lib/ecg-module/ecg-question-taxonomy";

test("taxonomy exports the supported families and exam styles", () => {
  assert.deepEqual(ECG_QUESTION_FAMILIES, [
    "strip_identification",
    "rhythm_specific",
    "priority_action",
    "complication_escalation",
    "comparison",
    "clinical_causes",
  ]);
  assert.deepEqual(ECG_EXAM_STYLE_TAGS, ["telemetry", "icu", "acls", "nclex", "np", "mixed"]);
});

test("normalizeEcgQuestionTaxonomy honors explicit family and exam-style tags", () => {
  const taxonomy = normalizeEcgQuestionTaxonomy({
    rhythmTag: "ventricular_tachycardia",
    topicTags: [
      "rhythm:ventricular_tachycardia",
      "family:strip_identification",
      "family:priority_action",
      "family:complication_escalation",
      "exam_style:icu",
      "exam_style:acls",
      "review:clinical_required",
    ],
    clinicalPriority: "urgent recognition",
  });

  assert.deepEqual(taxonomy.rhythmOrTopicKey, "ventricular_tachycardia");
  assert.deepEqual(taxonomy.families, [
    "strip_identification",
    "priority_action",
    "complication_escalation",
  ]);
  assert.deepEqual(taxonomy.examStyles, ["icu", "acls"]);
  assert.equal(taxonomy.clinicalReviewRequired, true);
});

test("normalizeEcgQuestionTaxonomy backfills families from current curated category tags", () => {
  const waveform = normalizeEcgQuestionTaxonomy({
    rhythmTag: "atrial_fibrillation",
    topicTags: ["category:waveform_identification_drill"],
    clinicalPriority: null,
  });
  assert.deepEqual(waveform.families, ["strip_identification"]);

  const telemetry = normalizeEcgQuestionTaxonomy({
    rhythmTag: "svt",
    topicTags: ["category:telemetry_prioritization"],
    clinicalPriority: "urgent recognition",
  });
  assert.deepEqual(telemetry.families, ["priority_action", "complication_escalation"]);

  const compare = normalizeEcgQuestionTaxonomy({
    rhythmTag: "artifact",
    topicTags: ["category:artifact_vs_true_rhythm"],
    clinicalPriority: null,
  });
  assert.deepEqual(compare.families, ["comparison", "strip_identification"]);

  const med = normalizeEcgQuestionTaxonomy({
    rhythmTag: "hyperkalemia_pattern",
    topicTags: ["category:electrolyte_ecg"],
    clinicalPriority: null,
  });
  assert.deepEqual(med.families, ["clinical_causes"]);
});
