import assert from "node:assert/strict";
import test from "node:test";
import { countTotalWordsInLessonSections } from "@/lib/lessons/pathway-lesson-premium";
import { getCatalogLessonRawBySlug } from "@/lib/lessons/pathway-lesson-catalog-sync";
import { lessonSignalsEcgLinkedLearning } from "@/lib/ecg-module/ecg-linked-learning";

const ECG_DEPTH_SLUGS = [
  "ecg-rate-calculation-basics-gold",
  "ecg-interval-interpretation-pr-qrs-qt-gold",
  "ecg-sinus-arrhythmia-recognition-gold",
  "ecg-junctional-rhythm-recognition-gold",
] as const;

test("RN bundled lesson loader includes the scoped ECG depth expansion lessons", () => {
  for (const pathwayId of ["us-rn-nclex-rn", "ca-rn-nclex-rn"] as const) {
    for (const slug of ECG_DEPTH_SLUGS) {
      const lesson = getCatalogLessonRawBySlug(pathwayId, slug);
      assert.ok(lesson, `${pathwayId} should include ${slug}`);
      assert.equal(lesson?.topicSlug, "cardiovascular");
      assert.equal(lessonSignalsEcgLinkedLearning(lesson!), true, `${slug} should register as ECG-linked learning`);
      assert.equal(countTotalWordsInLessonSections(lesson?.sections as never) >= 650, true, `${slug} should be substantive`);
    }
  }
});
