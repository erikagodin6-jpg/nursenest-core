import test from "node:test";
import assert from "node:assert/strict";
import { pickAppLessonsHubListSource } from "@/lib/lessons/app-lessons-hub-list-source";

test("prefers pathway when any pathway row matches filters", () => {
  assert.equal(
    pickAppLessonsHubListSource({
      pathwaySampleExists: true,
      contentTotal: 99,
      pathwayIdFilter: null,
    }),
    "pathway_lessons",
  );
});

test("prefers pathway even when pathwayId filter is set and content exists", () => {
  assert.equal(
    pickAppLessonsHubListSource({
      pathwaySampleExists: true,
      contentTotal: 10,
      pathwayIdFilter: "pw-1",
    }),
    "pathway_lessons",
  );
});

test("uses content_items when no pathway rows but content exists and no pathwayId filter", () => {
  assert.equal(
    pickAppLessonsHubListSource({
      pathwaySampleExists: false,
      contentTotal: 3,
      pathwayIdFilter: null,
    }),
    "content_items",
  );
});

test("legacy when pathwayId filter is set, no pathway rows, even if content exists", () => {
  assert.equal(
    pickAppLessonsHubListSource({
      pathwaySampleExists: false,
      contentTotal: 5,
      pathwayIdFilter: "pw-1",
    }),
    "legacy_content_map",
  );
});

test("legacy when no pathway and no content", () => {
  assert.equal(
    pickAppLessonsHubListSource({
      pathwaySampleExists: false,
      contentTotal: 0,
      pathwayIdFilter: null,
    }),
    "legacy_content_map",
  );
});
