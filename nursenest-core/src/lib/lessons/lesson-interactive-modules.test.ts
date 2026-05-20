import test from "node:test";
import assert from "node:assert/strict";
import type { PathwayLessonRecord } from "@/lib/lessons/pathway-lesson-types";
import { buildLessonInteractiveModules, getLessonInteractiveModules } from "@/lib/lessons/lesson-interactive-modules";
import { RESPIRATORY_SOUND_RECORDS } from "@/lib/lessons/respiratory-sounds-library-data";

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

test("buildLessonInteractiveModules hydrates respiratory items from registry", () => {
  const lesson = baseLesson({
    embeddedSoundLibraries: ["respiratory_sounds"],
    system: "respiratory",
  });
  const mods = buildLessonInteractiveModules(lesson);
  assert.equal(mods.length, 1);
  assert.equal(mods[0]?.type, "sound-library");
  assert.equal(mods[0]?.soundLibrary, "respiratory_sounds");
  assert.equal(mods[0]?.items.length, RESPIRATORY_SOUND_RECORDS.length);
  const first = mods[0]?.items[0];
  assert.ok(first?.name);
  assert.ok(first?.timing);
  assert.ok(first?.pitch);
  assert.ok(Array.isArray(first?.commonCauses));
});

test("getLessonInteractiveModules prefers lesson.interactiveModules when present", () => {
  const built = buildLessonInteractiveModules(
    baseLesson({ embeddedSoundLibraries: ["respiratory_sounds"], system: "respiratory" }),
  );
  const lesson = baseLesson({
    embeddedSoundLibraries: ["respiratory_sounds"],
    system: "respiratory",
    interactiveModules: built,
  });
  assert.deepEqual(getLessonInteractiveModules(lesson), built);
});
