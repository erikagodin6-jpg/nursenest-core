import "../../../scripts/stub-server-only.cjs";
import test from "node:test";
import assert from "node:assert/strict";
import { filterCatalogLessonsForAlliedProfessionHub } from "@/lib/allied/allied-profession-catalog-hub-filter";
import type { LessonInput } from "@/lib/lessons/pathway-lesson-catalog-sync";

function row(slug: string, topicSlug: string, alliedProfessionKey?: string): LessonInput {
  return {
    slug,
    title: slug,
    topic: "t",
    topicSlug,
    bodySystem: "general",
    previewSectionCount: 1,
    seoTitle: slug,
    seoDescription: "d",
    sections: [],
    ...(alliedProfessionKey ? { alliedProfessionKey } : {}),
  };
}

test("filterCatalogLessonsForAlliedProfessionHub returns keyed rows when present", () => {
  const rows = [row("a", "lab-values"), row("b", "lab-values", "mlt"), row("c", "lab-values", "mlt")];
  const out = filterCatalogLessonsForAlliedProfessionHub(rows, "mlt", "us-allied-core");
  assert.deepEqual(
    out.map((r) => r.slug),
    ["b", "c"],
  );
});

test("filterCatalogLessonsForAlliedProfessionHub excludes untagged rows with no profession claim", () => {
  const rows = [row("only", "__allied_test_no_claimants__")];
  const out = filterCatalogLessonsForAlliedProfessionHub(rows, "mlt", "us-allied-core");
  assert.equal(out.length, 0);
});

test("filterCatalogLessonsForAlliedProfessionHub no key leaves rows unchanged", () => {
  const rows = [row("a", "lab-values", "x")];
  assert.equal(filterCatalogLessonsForAlliedProfessionHub(rows, undefined, "us-allied-core").length, 1);
  assert.equal(filterCatalogLessonsForAlliedProfessionHub(rows, "   ", "us-allied-core").length, 1);
});
