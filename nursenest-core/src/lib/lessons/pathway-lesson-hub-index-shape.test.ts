/**
 * Marketing hub list shape: no full lesson bodies or assessments on the hub index path.
 */
import "../../../scripts/stub-server-only.cjs";
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { getEffectiveCatalogLessonsForPathwaySync } from "@/lib/lessons/pathway-lesson-catalog-sync";
import { getPathwayLesson, stripPathwayLessonToHubListShape } from "@/lib/lessons/pathway-lesson-loader";
import { marketingPathwayLessonsIndexPath } from "@/lib/lessons/lesson-routes";
import { pathwayLessonMarketingDetailHref } from "@/lib/lessons/pathway-lesson-types";
import { getExamPathwayById } from "@/lib/exam-pathways/exam-product-registry";

describe("stripPathwayLessonToHubListShape", () => {
  it("drops section bodies, preTest, postTest, and question id arrays for hub index rows", async () => {
    const full = await getPathwayLesson("ca-rn-nclex-rn", "fluid-balance-acute-care");
    assert.ok(full);
    assert.ok((full!.sections?.length ?? 0) > 0 || (full!.preTest?.length ?? 0) > 0);
    const slim = stripPathwayLessonToHubListShape(full!);
    assert.equal(slim.sections.length, 0);
    assert.equal(slim.preTest, undefined);
    assert.equal(slim.postTest, undefined);
    assert.equal(slim.preTestQuestionIds, undefined);
    assert.equal(slim.postTestQuestionIds, undefined);
    assert.ok(typeof slim.title === "string" && slim.title.trim().length > 0);
    assert.ok(typeof slim.slug === "string" && slim.slug.trim().length > 0);
  });
});

describe("getEffectiveCatalogLessonsForPathwaySync hub index shape", () => {
  it("omits section bodies so category-first hubs only hold card metadata in memory", () => {
    const rows = getEffectiveCatalogLessonsForPathwaySync("us-rn-nclex-rn");
    assert.ok(rows.length > 0);
    for (const l of rows.slice(0, 40)) {
      assert.equal(l.sections?.length ?? 0, 0, `expected empty sections for ${l.slug}`);
    }
  });

  it("aligns catalog lesson hrefs with marketingPathwayLessonsIndexPath + slug (detail route contract)", () => {
    const pathway = getExamPathwayById("us-lpn-nclex-pn");
    assert.ok(pathway);
    const base = marketingPathwayLessonsIndexPath(pathway);
    const rows = getEffectiveCatalogLessonsForPathwaySync(pathway.id);
    assert.ok(rows.length > 0);
    const first = rows[0]!;
    const href = pathwayLessonMarketingDetailHref(base, first.slug);
    assert.ok(href);
    assert.equal(href, `${base}/${encodeURIComponent(first.slug.trim())}`);
  });
});
