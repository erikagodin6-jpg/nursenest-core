import assert from "node:assert/strict";
import { test } from "node:test";
import {
  inferLessonBlueprintDomain,
  inferLessonCatalogType,
} from "./lesson-blueprint-coverage-dashboard";

test("inferLessonBlueprintDomain: pad slug embeds full domain id", () => {
  assert.equal(
    inferLessonBlueprintDomain("bp26-usnp-pad-000-safety_and_infection-cardiovascular", []),
    "safety_and_infection",
  );
});

test("inferLessonBlueprintDomain: wave code maps to domain", () => {
  assert.equal(inferLessonBlueprintDomain("bp26-carpn-mo-legal-scope", []), "management_of_care");
  assert.equal(inferLessonBlueprintDomain("bp26-carpn-pa-htn-crisis", []), "physiological_adaptation");
});

test("inferLessonCatalogType", () => {
  assert.equal(inferLessonCatalogType("fluid-balance-acute-care"), "catalog_legacy");
  assert.equal(inferLessonCatalogType("bp26-carpn-pa-htn-crisis"), "blueprint_wave_curated");
  assert.equal(inferLessonCatalogType("bp26-usnp-pad-000-safety_and_infection-x"), "blueprint_wave_padded");
});
