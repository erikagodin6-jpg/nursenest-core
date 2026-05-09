import "../../../scripts/stub-server-only.cjs";
import test from "node:test";
import assert from "node:assert/strict";
import { ALLIED_PROFESSIONS } from "@/lib/allied/allied-professions-registry";
import {
  REQUIRED_ALLIED_PROFESSION_KEYS,
  resolveAlliedProfessionTopicSlugsForLessonIndexVerification,
} from "@/lib/allied/allied-profession-lesson-index-verification";
import { getMarketingLessonsHubCatalogLessons } from "@/lib/lessons/marketing-lessons-hub-category";

for (const professionKey of REQUIRED_ALLIED_PROFESSION_KEYS) {
  test(`verify:lesson-indexes allied mapping: ${professionKey} resolves to ≥1 marketing hub lesson`, () => {
    const profession = ALLIED_PROFESSIONS.find((p) => p.professionKey === professionKey);
    assert.ok(profession, `missing ALLIED_PROFESSIONS registry row for ${professionKey}`);
    const lessons = getMarketingLessonsHubCatalogLessons("us-allied-core");
    assert.ok(lessons.length > 0, "allied marketing hub should expose at least one lesson");
    const { resolvedTopicSlugsIn } = resolveAlliedProfessionTopicSlugsForLessonIndexVerification(
      profession.topicSlugsIn,
    );
    assert.ok(resolvedTopicSlugsIn.length > 0, `${professionKey}: topicSlugsIn empty after resolution`);
    const mapped = lessons.filter((lesson) => resolvedTopicSlugsIn.includes(lesson.topicSlug));
    assert.ok(
      mapped.length > 0,
      `${professionKey}: no intersection between resolved topic slugs and hub lesson.topicSlug`,
    );
  });
}
