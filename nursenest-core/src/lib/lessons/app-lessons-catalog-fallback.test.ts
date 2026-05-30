import test from "node:test";
import assert from "node:assert/strict";
import {
  appLessonCatalogFallbackId,
  buildAppLessonsCatalogFallbackBlock,
  getAppCatalogFallbackLesson,
  parseAppLessonCatalogFallbackId,
} from "@/lib/lessons/app-lessons-catalog-fallback";

test("catalog fallback ids preserve pathway and slug for learner lesson detail routes", () => {
  const id = appLessonCatalogFallbackId("ca-rn-nclex-rn", "acute-coronary-syndrome-gold");
  assert.equal(id, "catalog:ca-rn-nclex-rn:acute-coronary-syndrome-gold");
  assert.deepEqual(parseAppLessonCatalogFallbackId(id), {
    pathwayId: "ca-rn-nclex-rn",
    slug: "acute-coronary-syndrome-gold",
  });
  assert.equal(parseAppLessonCatalogFallbackId("not-a-fallback-id"), null);
});

test("catalog fallback exposes advertised pathway lessons when live list and snapshot are unavailable", () => {
  const block = buildAppLessonsCatalogFallbackBlock({
    visiblePathwayIds: ["ca-rn-nclex-rn"],
    pathwayIdFilter: "ca-rn-nclex-rn",
    learnerPath: "ca-rn-nclex-rn",
    qEffective: null,
    topicSlugFilter: null,
    topicFilter: null,
    pageRequested: 1,
    pageSize: 12,
  });

  assert.ok(block);
  assert.equal(block?.source, "pathway_lessons");
  assert.equal(block?.page, 1);
  assert.ok((block?.total ?? 0) > 0, "CA RN advertised lessons should be available from bundled catalog fallback");
  assert.ok(block?.rows.every((row) => row.id.startsWith("catalog:ca-rn-nclex-rn:")));
  assert.ok(block?.rows.every((row) => row.pathwayMeta.pathwayId === "ca-rn-nclex-rn"));
});

test("catalog fallback detail resolver can load the lesson behind a fallback list card", () => {
  const lesson = getAppCatalogFallbackLesson("ca-rn-nclex-rn", "acute-coronary-syndrome-gold");
  assert.ok(lesson);
  assert.equal(lesson?.slug, "acute-coronary-syndrome-gold");
  assert.ok((lesson?.sections.length ?? 0) > 0);
});
