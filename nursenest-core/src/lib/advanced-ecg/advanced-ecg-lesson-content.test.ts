import assert from "node:assert/strict";
import test from "node:test";
import {
  ADVANCED_ECG_LESSON_CONTENT,
  ADVANCED_ECG_REQUIRED_TOPIC_KEYS,
  countAdvancedEcgLessonWords,
  getAdvancedEcgLessonContent,
} from "@/lib/advanced-ecg/advanced-ecg-lesson-content";

const REQUIRED_SECTIONS = [
  "electrophysiology",
  "lead_method",
  "criteria",
  "findings",
  "morphology",
  "common_causes",
  "clinical_significance",
  "hemodynamic_risk",
  "nursing_priorities",
  "escalation",
  "acls_relevance",
  "treatment_overview",
  "telemetry_icu_pearls",
  "common_misreads",
  "lookalikes",
  "safety_warnings",
] as const;

test("Advanced ECG lesson registry covers the required specialty topics", () => {
  for (const topicKey of ADVANCED_ECG_REQUIRED_TOPIC_KEYS) {
    const lesson = getAdvancedEcgLessonContent(topicKey);
    assert.ok(lesson, `${topicKey} should exist in the Advanced ECG lesson registry`);
    for (const sectionKey of REQUIRED_SECTIONS) {
      assert.equal(typeof lesson?.sections[sectionKey], "string", `${topicKey} missing ${sectionKey}`);
      assert.equal((lesson?.sections[sectionKey] ?? "").trim().length > 0, true, `${topicKey} has empty ${sectionKey}`);
    }
  }
});

test("Advanced ECG lesson registry stays review-gated until clinically validated", () => {
  assert.equal(ADVANCED_ECG_LESSON_CONTENT.length >= ADVANCED_ECG_REQUIRED_TOPIC_KEYS.length, true);
  for (const lesson of ADVANCED_ECG_LESSON_CONTENT) {
    assert.notEqual(lesson.status, "published", `${lesson.topicKey} should not be learner-published by default`);
    assert.match(lesson.stripAssetReviewStatus, /clinical-review-required|generated_review_required|curated_static_review/);
  }
});

test("Advanced ECG lessons carry substantive word-count depth", () => {
  const vt = getAdvancedEcgLessonContent("ventricular_rhythms");
  const systematic = getAdvancedEcgLessonContent("systematic_interpretation");

  assert.ok(vt);
  assert.ok(systematic);
  assert.equal(countAdvancedEcgLessonWords(vt!) >= 450, true);
  assert.equal(countAdvancedEcgLessonWords(systematic!) >= 450, true);
});
