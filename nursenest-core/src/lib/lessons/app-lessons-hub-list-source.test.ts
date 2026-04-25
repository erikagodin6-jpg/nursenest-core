import test from "node:test";
import assert from "node:assert/strict";
import { pickAppLessonsHubListSource } from "@/lib/lessons/app-lessons-hub-list-source";

type SourceInput = Parameters<typeof pickAppLessonsHubListSource>[0];

function pick(input: SourceInput) {
  return pickAppLessonsHubListSource(input);
}

test("uses pathway_lessons when any pathway row matches filters", () => {
  assert.equal(
    pick({
      pathwaySampleExists: true,
      contentTotal: 99,
      pathwayIdFilter: null,
    }),
    "pathway_lessons",
  );
});

test("uses pathway_lessons when pathwayId filter is set and pathway rows exist", () => {
  assert.equal(
    pick({
      pathwaySampleExists: true,
      contentTotal: 10,
      pathwayIdFilter: "pw-1",
    }),
    "pathway_lessons",
  );
});

test("uses content_items when no pathway rows exist, content exists, and no pathwayId filter is set", () => {
  assert.equal(
    pick({
      pathwaySampleExists: false,
      contentTotal: 3,
      pathwayIdFilter: null,
    }),
    "content_items",
  );
});

test("uses legacy_content_map when pathwayId filter is set but no pathway rows exist", () => {
  assert.equal(
    pick({
      pathwaySampleExists: false,
      contentTotal: 5,
      pathwayIdFilter: "pw-1",
    }),
    "legacy_content_map",
  );
});

test("uses legacy_content_map when neither pathway rows nor content items exist", () => {
  assert.equal(
    pick({
      pathwaySampleExists: false,
      contentTotal: 0,
      pathwayIdFilter: null,
    }),
    "legacy_content_map",
  );
});