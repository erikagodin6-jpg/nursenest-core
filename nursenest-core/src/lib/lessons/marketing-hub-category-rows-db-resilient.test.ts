import assert from "node:assert/strict";
import { describe, test } from "node:test";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import { HubLessonsListDatabaseError } from "@/lib/lessons/hub-lessons-database-error";
import { resolveMarketingHubCategoryLessonRowsWithDbResilience } from "@/lib/lessons/marketing-hub-category-rows-db-resilient";
import type { PathwayLessonRecord } from "@/lib/lessons/pathway-lesson-types";

const pathwayStub = {
  id: "us-rn-nclex-rn",
  countrySlug: "us",
  roleTrack: "rn",
  examCode: "nclex-rn",
} satisfies ExamPathwayDefinition;

function lessonStub(slug: string): PathwayLessonRecord {
  return {
    slug,
    title: "T",
    topic: "Fundamentals",
    topicSlug: "fundamentals",
    bodySystem: "fundamentals",
    system: "fundamentals",
    previewSectionCount: 0,
    seoTitle: "T",
    seoDescription: "d",
    sections: [],
    structuralQuality: {
      structureMode: "legacy",
      publicComplete: true,
      issues: [],
      warnings: [],
      internalStudyLinkCount: 0,
    },
    exams: [],
    countries: [],
    examMeta: [],
  };
}

describe("marketing-hub-category-rows-db-resilient", () => {
  test("skipDbVerify returns prepared lessons without calling deps", async () => {
    const prepared = [lessonStub("a")];
    let warehouseCalled = false;
    let verifyCalled = false;
    const out = await resolveMarketingHubCategoryLessonRowsWithDbResilience(
      {
        pathway: pathwayStub,
        lessonContentLocale: "en",
        skipDbVerify: true,
        preparedLessons: prepared,
        maxUniqueSlugsToVerify: 8,
        surface: "category_first_index",
      },
      {
        getWarehouseLocale: async () => {
          warehouseCalled = true;
          return "en";
        },
        verifyRows: async () => {
          verifyCalled = true;
          throw new Error("should not run");
        },
      },
    );
    assert.deepEqual(out, prepared);
    assert.equal(warehouseCalled, false);
    assert.equal(verifyCalled, false);
  });

  test("warehouse locale HubLessonsListDatabaseError falls back to prepared rows path (verify still runs)", async () => {
    const prepared = [lessonStub("slug-one")];
    const out = await resolveMarketingHubCategoryLessonRowsWithDbResilience(
      {
        pathway: pathwayStub,
        lessonContentLocale: "en",
        skipDbVerify: false,
        preparedLessons: prepared,
        maxUniqueSlugsToVerify: 8,
        surface: "category_first_index",
      },
      {
        getWarehouseLocale: async () => {
          throw new HubLessonsListDatabaseError({
            category: "database_timeout",
            label: "test",
            message: "database_timeout",
          });
        },
        verifyRows: async (_p, lessons) => ({
          kept: lessons,
          excluded: [],
          diagnostics: {} as never,
        }),
      },
    );
    assert.equal(out.length, 1);
    assert.equal(out[0]?.slug, "slug-one");
  });

  test("verify throws HubLessonsListDatabaseError → returns prepared catalog rows", async () => {
    const prepared = [lessonStub("fallback-slug")];
    const out = await resolveMarketingHubCategoryLessonRowsWithDbResilience(
      {
        pathway: pathwayStub,
        lessonContentLocale: "en",
        skipDbVerify: false,
        preparedLessons: prepared,
        maxUniqueSlugsToVerify: 8,
        surface: "category_first_index",
      },
      {
        getWarehouseLocale: async () => "en",
        verifyRows: async () => {
          throw new HubLessonsListDatabaseError({
            category: "database_timeout",
            label: "test_verify",
            message: "database_timeout",
          });
        },
      },
    );
    assert.deepEqual(out, prepared);
  });
});
