import test from "node:test";
import assert from "node:assert/strict";
import { buildLearnerAppLessonsHubSummary } from "@/lib/lessons/learner-app-lessons-hub-summary";

test("populated: never show empty surfaces", () => {
  const s = buildLearnerAppLessonsHubSummary({
    rows: [{ id: "1" }],
    catalogMatchTotal: 100,
    qEffective: null,
    topicFilter: null,
    topicSlugFilter: null,
    pathwayIdFilter: null,
  });
  assert.equal(s.resolvedRenderableLessons.length, 1);
  assert.equal(s.emptyReason, "none");
  assert.equal(s.showCatalogEmpty, false);
  assert.equal(s.showFilterMissEmpty, false);
  assert.equal(s.showCountMismatchHint, false);
});

test("true empty: no filters, zero total", () => {
  const s = buildLearnerAppLessonsHubSummary({
    rows: [],
    catalogMatchTotal: 0,
    qEffective: null,
    topicFilter: null,
    topicSlugFilter: null,
    pathwayIdFilter: null,
  });
  assert.equal(s.emptyReason, "catalog_empty");
  assert.equal(s.showCatalogEmpty, true);
  assert.equal(s.showFilterMissEmpty, false);
});

test("search miss: filters on, zero total, zero rows", () => {
  const s = buildLearnerAppLessonsHubSummary({
    rows: [],
    catalogMatchTotal: 0,
    qEffective: "zzzznotfound",
    topicFilter: null,
    topicSlugFilter: null,
    pathwayIdFilter: null,
  });
  assert.equal(s.emptyReason, "search_or_filters_no_matches");
  assert.equal(s.showCatalogEmpty, false);
  assert.equal(s.showFilterMissEmpty, true);
});

test("count matches list: header list length equals rendered rows", () => {
  const rows = [{ id: "a" }, { id: "b" }];
  const s = buildLearnerAppLessonsHubSummary({
    rows,
    catalogMatchTotal: 2,
    qEffective: null,
    topicFilter: null,
    topicSlugFilter: null,
    pathwayIdFilter: null,
  });
  assert.equal(s.resolvedRenderableLessons.length, s.catalogMatchTotal);
});

test("no false empty: total>0 but zero rows surfaces mismatch, not catalog empty", () => {
  const s = buildLearnerAppLessonsHubSummary({
    rows: [],
    catalogMatchTotal: 5,
    qEffective: null,
    topicFilter: null,
    topicSlugFilter: null,
    pathwayIdFilter: null,
  });
  assert.equal(s.showCatalogEmpty, false);
  assert.equal(s.emptyReason, "count_rows_mismatch");
  assert.equal(s.showCountMismatchHint, true);
});
