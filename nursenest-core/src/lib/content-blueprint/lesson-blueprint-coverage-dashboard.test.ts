import assert from "node:assert/strict";
import { test } from "node:test";
import {
  inferLessonBlueprintDomain,
  inferLessonCatalogType,
} from "./lesson-blueprint-coverage-dashboard";

test("inferLessonBlueprintDomain: pad slug embeds full domain id", () => {
  assert.equal(
    inferLessonBlueprintDomain({ slug: "bp26-usnp-pad-000-safety_and_infection-cardiovascular", sections: [] }),
    "safety_and_infection",
  );
});

test("inferLessonBlueprintDomain: wave code maps to domain", () => {
  assert.equal(inferLessonBlueprintDomain({ slug: "bp26-carpn-mo-legal-scope", sections: [] }), "management_of_care");
  assert.equal(inferLessonBlueprintDomain({ slug: "bp26-carpn-pa-htn-crisis", sections: [] }), "physiological_adaptation");
});

test("inferLessonBlueprintDomain: legacy row uses topic/title haystack", () => {
  assert.equal(
    inferLessonBlueprintDomain({
      slug: "fluid-balance-acute-care",
      topic: "Fluids & electrolytes",
      topicSlug: "fluids-electrolytes",
      title: "Fluid balance",
      sections: [],
    }),
    "physiological_adaptation",
  );
});

test("inferLessonCatalogType", () => {
  assert.equal(inferLessonCatalogType("fluid-balance-acute-care"), "catalog_legacy");
  assert.equal(inferLessonCatalogType("bp26-carpn-pa-htn-crisis"), "blueprint_wave_curated");
  assert.equal(inferLessonCatalogType("bp26-usnp-pad-000-safety_and_infection-x"), "blueprint_wave_padded");
});
