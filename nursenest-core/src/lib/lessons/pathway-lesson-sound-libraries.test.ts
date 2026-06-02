import test from "node:test";
import assert from "node:assert/strict";
import type { PathwayLessonRecord } from "@/lib/lessons/pathway-lesson-types";
import {
  inferPathwayLessonSoundLibraries,
  resolvePathwayLessonSoundLibraries,
  sanitizeEmbeddedSoundLibraries,
} from "@/lib/lessons/pathway-lesson-sound-libraries";
import { lessonSoundItemVisibleForTier } from "@/lib/lessons/lesson-sound-library-scope";
import { CARDIAC_ADVANCED_MURMUR_TIERS, CARDIAC_SOUND_RECORDS } from "@/lib/lessons/cardiac-sounds-library-data";

function baseLesson(overrides: Partial<PathwayLessonRecord>): PathwayLessonRecord {
  return {
    slug: "test-lesson",
    title: "Test",
    topic: "Topic",
    topicSlug: "topic",
    bodySystem: "General",
    previewSectionCount: 1,
    seoTitle: "Test",
    seoDescription: "Test description with enough words for catalog normalization if needed.",
    sections: [],
    ...overrides,
  };
}

test("sanitizeEmbeddedSoundLibraries keeps only known ids and dedupes", () => {
  assert.deepEqual(sanitizeEmbeddedSoundLibraries(["cardiac_sounds", "respiratory_sounds", "cardiac_sounds", "x"]), [
    "cardiac_sounds",
    "respiratory_sounds",
  ]);
  assert.equal(sanitizeEmbeddedSoundLibraries(null), undefined);
});

test("resolvePathwayLessonSoundLibraries prefers explicit embeddedSoundLibraries", () => {
  const lesson = baseLesson({
    embeddedSoundLibraries: ["respiratory_sounds"],
    bodySystem: "Cardiovascular",
    title: "No auscultation keywords",
  });
  assert.deepEqual(resolvePathwayLessonSoundLibraries(lesson), ["respiratory_sounds"]);
});

test("inferPathwayLessonSoundLibraries attaches respiratory library for respiratory assessment lessons", () => {
  const lesson = baseLesson({
    topicSlug: "respiratory",
    bodySystem: "Respiratory",
    title: "Respiratory assessment and oxygenation",
  });
  assert.ok(inferPathwayLessonSoundLibraries(lesson).includes("respiratory_sounds"));
});

test("inferPathwayLessonSoundLibraries attaches cardiac library when cardiovascular + auscultation cues", () => {
  const lesson = baseLesson({
    topicSlug: "cardiovascular",
    bodySystem: "Cardiovascular",
    title: "Heart sounds and murmurs review",
  });
  assert.ok(inferPathwayLessonSoundLibraries(lesson).includes("cardiac_sounds"));
});

test("PRE_NURSING does not receive advanced valve murmur rows (explicit tier gate)", () => {
  const as = CARDIAC_SOUND_RECORDS.find((r) => r.id === "aortic-stenosis");
  assert.ok(as);
  assert.ok(CARDIAC_ADVANCED_MURMUR_TIERS.includes("RN"));
  assert.equal(lessonSoundItemVisibleForTier(as, "PRE_NURSING"), false);
  assert.equal(lessonSoundItemVisibleForTier(as, "RN"), true);
});
