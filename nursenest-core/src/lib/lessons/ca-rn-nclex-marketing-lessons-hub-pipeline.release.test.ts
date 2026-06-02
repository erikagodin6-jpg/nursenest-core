/**
 * Release gate: Canada RN NCLEX marketing hub pipeline must not collapse to a single lesson
 * after prepare + verify when detail resolution matches list rows (mocked resolver).
 */
import "../../../scripts/stub-server-only.cjs";
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { prepareLessonsForHubCurriculumWithDiagnostics } from "@/components/pathway-lessons/pathway-lessons-curriculum-hub";
import { verifyMarketingHubLessonRowsResolve } from "@/lib/lessons/pathway-lesson-hub-link-integrity";
import { pathwayLessonMarketingDetailHref } from "@/lib/lessons/pathway-lesson-types";
import type { PathwayLessonRecord } from "@/lib/lessons/pathway-lesson-types";

const LESSONS_BASE = "/canada/rn/nclex-rn/lessons";

function hubRow(i: number): PathwayLessonRecord {
  const slug = `rn-hub-release-${i}`;
  const title = `RN hub release lesson ${i}`;
  return {
    slug,
    title,
    topic: "Topic",
    topicSlug: "infection",
    bodySystem: "cardiovascular",
    system: "cardiovascular",
    previewSectionCount: 3,
    seoTitle: title,
    seoDescription:
      "Clinical framing, safety cues, prioritization patterns, and exam-style rationale for this topic in nursing practice and on the NCLEX-RN.",
    sections: [],
    structuralQuality: {
      publicComplete: true,
      issues: [],
      warnings: [],
      structureMode: "legacy",
      internalStudyLinkCount: 0,
    },
    exams: ["NCLEX_RN"],
    countries: ["CA", "US"],
    localeMeta: {
      requestedContentLocale: "en",
      contentLocale: "en",
      usedLocaleFallback: false,
      isCatalogEnglishSource: false,
    },
  };
}

describe("Canada RN NCLEX marketing lessons hub pipeline (release)", () => {
  it("prepare + verify keeps >100 lessons when detail resolver returns each slug (no optional-taxonomy-only drops)", async () => {
    const pathway = { id: "ca-rn-nclex-rn" } as const;
    const raw = Array.from({ length: 140 }, (_, i) => hubRow(i));
    const prep = prepareLessonsForHubCurriculumWithDiagnostics(raw, {
      pathwayId: pathway.id,
      lessonsBasePath: LESSONS_BASE,
    });
    assert.ok(
      prep.lessons.length > 100,
      `expected >100 lessons after prepare, got ${prep.lessons.length} (stages=${JSON.stringify(prep.prepareStages)})`,
    );
    assert.ok(
      prep.prepareStages.afterMarketingHrefFilter > 1,
      `expected page-1-sized href filter to keep >1 row, got ${prep.prepareStages.afterMarketingHrefFilter}`,
    );

    const resolveLessonDetail = async (_pid: string, slug: string) => prep.lessons.find((l) => l.slug === slug);
    const vr = await verifyMarketingHubLessonRowsResolve(pathway, prep.lessons, "en", {
      listWarehouseLocale: "en",
      resolveLessonDetail,
      prepareStages: prep.prepareStages,
    });
    assert.ok(vr.kept.length > 100, `expected verify to keep >100 rows, got ${vr.kept.length}`);
    assert.ok(vr.diagnostics.droppedPreparedRowSamples != null);
    assert.equal(vr.diagnostics.excludedUniqueSlugCount, 0);
    for (const slug of vr.kept.slice(0, 5).map((l) => l.slug)) {
      assert.ok(
        pathwayLessonMarketingDetailHref(LESSONS_BASE, slug),
        `expected marketing detail href for ${slug}`,
      );
    }
  });
});
