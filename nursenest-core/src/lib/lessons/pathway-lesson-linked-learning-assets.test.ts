/**
 * Every bundled pathway lesson must expose linked flashcards, practice questions, and CAT pool
 * surfaces (plus adaptive readiness) after {@link normalizeLesson}.
 *
 * Run: `npx tsx --test src/lib/lessons/pathway-lesson-linked-learning-assets.test.ts`
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  collectLinkedLearningGateViolations,
  deriveCanonicalStudyTopicSlug,
} from "@/lib/lessons/pathway-lesson-linked-learning-assets";
import {
  getCatalogPathwayLessonsSync,
  listCatalogPathwayIdsWithLessonsSync,
} from "@/lib/lessons/pathway-lesson-catalog-sync";

describe("pathway lesson linked learning assets (all pathways)", () => {
  it("deriveCanonicalStudyTopicSlug is stable and non-empty for fixed inputs", () => {
    const raw = { slug: "acute-kidney-injury-nclex-rn", title: "AKI", topic: "", topicSlug: "", bodySystem: "" };
    const a = deriveCanonicalStudyTopicSlug(raw);
    const b = deriveCanonicalStudyTopicSlug(raw);
    assert.ok(a.length > 0);
    assert.equal(a, b);
  });

  it("deriveCanonicalStudyTopicSlug never returns empty for real catalog rows", () => {
    const ids = listCatalogPathwayIdsWithLessonsSync();
    assert.ok(ids.length > 0, "expected at least one pathway with lessons");
    for (const pathwayId of ids) {
      const lessons = getCatalogPathwayLessonsSync(pathwayId);
      for (const lesson of lessons) {
        const k = deriveCanonicalStudyTopicSlug(lesson);
        assert.ok(k.length > 0, `empty topic key pathway=${pathwayId} slug=${lesson.slug}`);
      }
    }
  });

  it("every normalized lesson passes linked-learning gate (flashcards, questions, CAT, adaptive)", () => {
    const ids = listCatalogPathwayIdsWithLessonsSync();
    const violations: ReturnType<typeof collectLinkedLearningGateViolations> = [];
    for (const pathwayId of ids) {
      const lessons = getCatalogPathwayLessonsSync(pathwayId);
      violations.push(...collectLinkedLearningGateViolations(pathwayId, lessons));
    }
    assert.deepEqual(
      violations,
      [],
      violations.length
        ? `Linked learning gate failures (first 12):\n${violations
            .slice(0, 12)
            .map((v) => `${v.pathwayId}/${v.slug}: ${v.reasons.join(",")}`)
            .join("\n")}`
        : undefined,
    );
  });
});
