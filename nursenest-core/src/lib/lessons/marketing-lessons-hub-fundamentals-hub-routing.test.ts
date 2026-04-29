/**
 * Fundamentals marketing hub uses a non-colliding URL segment so `…/lessons/fundamentals` can remain a lesson detail route when needed.
 *
 * Run: `npx tsx --test src/lib/lessons/marketing-lessons-hub-fundamentals-hub-routing.test.ts`
 */
import assert from "node:assert/strict";
import test from "node:test";
import { getExamPathwayById } from "@/lib/exam-pathways/exam-pathways-catalog";
import { marketingPathwayLessonsCategoryPath, marketingPathwayLessonsIndexPath } from "@/lib/lessons/lesson-routes";
import {
  MARKETING_LESSONS_HUB_CATEGORY_SLUGS,
  countMarketingHubLessonsByDisplayCategory,
  countPathwayMarketingHubLessonsByCategoryForPathway,
  filterMarketingHubLessonsByDisplayCategory,
  filterPathwayMarketingHubLessonsByCategory,
  getMarketingLessonsHubCatalogLessons,
  lessonCategoryFromMarketingHubPathSegment,
  marketingHubCategorySlugForCategory,
  pathwayMarketingHubCategories,
  pathwayMarketingHubCategoryFromSegment,
} from "@/lib/lessons/marketing-lessons-hub-category";
import { lessonCategoryToSlug } from "@/lib/lessons/lesson-taxonomy";
import { pathwayLessonMarketingHubVerifiedCardHref } from "@/lib/lessons/pathway-lesson-types";

test("Fundamentals hub slug is nursing-fundamentals (not fundamentals) and is unique among category slugs", () => {
  assert.equal(lessonCategoryToSlug("Fundamentals"), "nursing-fundamentals");
  assert.equal(marketingHubCategorySlugForCategory("Fundamentals"), "nursing-fundamentals");
  const hits = MARKETING_LESSONS_HUB_CATEGORY_SLUGS.filter((s) => s === "nursing-fundamentals");
  assert.equal(hits.length, 1);
  assert.ok(!MARKETING_LESSONS_HUB_CATEGORY_SLUGS.includes("fundamentals"));
});

test("US New Grad lesson areas use transition-to-practice categories and routes", () => {
  const pathway = getExamPathwayById("us-rn-new-grad-transition");
  assert.ok(pathway);
  const categories = pathwayMarketingHubCategories(pathway.id);
  assert.ok(categories.some((c) => c.label === "Medical-Surgical Nursing"));
  assert.ok(categories.some((c) => c.label === "Emergency Department"));
  assert.ok(categories.some((c) => c.label === "Job Applications and Interviews"));
  assert.ok(categories.some((c) => c.label === "Orientation and Preceptorship"));

  const communication = pathwayMarketingHubCategoryFromSegment(pathway.id, "communication-with-providers-and-families");
  assert.equal(communication?.id, "communication_providers_families");
  assert.equal(
    marketingPathwayLessonsCategoryPath(pathway, communication!.slug),
    "/us/rn/new-grad-transition/lessons/communication-with-providers-and-families",
  );

  const counts = countPathwayMarketingHubLessonsByCategoryForPathway(pathway.id);
  assert.ok((counts.get("prioritization_delegation") ?? 0) > 0);
  assert.ok((counts.get("communication_providers_families") ?? 0) > 0);

  const catalog = getMarketingLessonsHubCatalogLessons(pathway.id);
  const rows = filterPathwayMarketingHubLessonsByCategory(catalog, pathway.id, "communication_providers_families");
  assert.ok(rows.some((row) => row.slug === "ngn-first-physician-call"));
});

test("Fundamentals resolves from canonical segment and legacy fundamentals alias", () => {
  assert.equal(lessonCategoryFromMarketingHubPathSegment("nursing-fundamentals"), "Fundamentals");
  assert.equal(lessonCategoryFromMarketingHubPathSegment("fundamentals"), "Fundamentals");
});

test("CA and US RN NCLEX-RN: Fundamentals count from catalog, non-empty category href, twelve lesson detail hrefs", () => {
  for (const pathwayId of ["ca-rn-nclex-rn", "us-rn-nclex-rn"] as const) {
    const pathway = getExamPathwayById(pathwayId);
    assert.ok(pathway, pathwayId);
    const catalog = getMarketingLessonsHubCatalogLessons(pathwayId);
    const counts = countMarketingHubLessonsByDisplayCategory(catalog);
    assert.equal(counts.get("Fundamentals"), 12, pathwayId);

    const categorySlug = marketingHubCategorySlugForCategory("Fundamentals");
    const categoryHref = marketingPathwayLessonsCategoryPath(pathway, categorySlug);
    assert.ok(categoryHref.length > 0, pathwayId);
    assert.ok(categoryHref.endsWith("/lessons/nursing-fundamentals"), `${pathwayId}: ${categoryHref}`);

    const lessonsBase = marketingPathwayLessonsIndexPath(pathway);
    const filtered = filterMarketingHubLessonsByDisplayCategory(catalog, "Fundamentals");
    assert.equal(filtered.length, 12, pathwayId);
    for (const lesson of filtered) {
      const href = pathwayLessonMarketingHubVerifiedCardHref(lessonsBase, lesson);
      assert.ok(href && href.length > 0, `${pathwayId}/${lesson.slug}: degraded or empty href`);
      const expectedTail = `/lessons/${encodeURIComponent(lesson.slug)}`;
      assert.ok(href.endsWith(expectedTail), `${pathwayId}: expected ${expectedTail}, got ${href}`);
    }
  }
});
