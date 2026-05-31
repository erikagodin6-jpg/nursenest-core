import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  GLOBAL_NURSING_CORE_LIBRARY,
  listCountrySpecificNursingCoreTopics,
  listGlobalReusableNursingCoreTopics,
  validateGlobalNursingCoreLibrary,
} from "./global-nursing-core-library";
import {
  buildHiddenInternationalDraftMetadata,
  HIDDEN_INTERNATIONAL_PIPELINE_TARGETS,
  validateHiddenInternationalPipelineTargets,
} from "./hidden-international-content-pipeline";
import {
  INTERNATIONAL_SCREENSHOT_LIBRARY,
  validateInternationalScreenshotLibrary,
} from "./international-marketing-screenshot-library";
import {
  HIDDEN_INTERNATIONAL_CONTENT_INVENTORY,
  validateHiddenInternationalContentInventory,
} from "./hidden-international-content-inventory";

describe("hidden international content foundation", () => {
  it("keeps global nursing core topics draft-only and hidden", () => {
    assert.deepEqual(validateGlobalNursingCoreLibrary(), []);
    assert.ok(GLOBAL_NURSING_CORE_LIBRARY.length >= 12);
    for (const topic of GLOBAL_NURSING_CORE_LIBRARY) {
      assert.equal(topic.draftOnly, true);
      assert.equal(topic.published, false);
      assert.equal(topic.visibleInNavigation, false);
      assert.equal(topic.learnerAccessible, false);
      assert.equal(topic.launchReady, false);
    }
  });

  it("separates reusable global topics from country-specific overlays", () => {
    assert.ok(listGlobalReusableNursingCoreTopics().some((topic) => topic.id === "heart-failure"));
    assert.ok(listGlobalReusableNursingCoreTopics().some((topic) => topic.id === "sepsis"));
    assert.ok(listCountrySpecificNursingCoreTopics().some((topic) => topic.id === "delegation"));
    assert.ok(listCountrySpecificNursingCoreTopics().some((topic) => topic.id === "health-system-structure"));
  });

  it("defines draft-only targets for U.S., UK, Australia, and New Zealand", () => {
    assert.deepEqual(validateHiddenInternationalPipelineTargets(), []);
    const targetKeys = new Set(HIDDEN_INTERNATIONAL_PIPELINE_TARGETS.map((target) => `${target.countryCode}:${target.kind}`));
    for (const key of ["US:lesson", "US:flashcard", "US:practice_question", "GB:lesson", "AU:lesson", "NZ:lesson"]) {
      assert.ok(targetKeys.has(key), `expected target ${key}`);
    }
    for (const target of HIDDEN_INTERNATIONAL_PIPELINE_TARGETS) {
      const meta = buildHiddenInternationalDraftMetadata(target);
      assert.equal(meta.status, "draft");
      assert.equal(meta.published, false);
      assert.equal(meta.visibleInNavigation, false);
      assert.equal(meta.learnerAccessible, false);
      assert.equal(meta.launchReady, false);
      assert.equal(meta.adminOnly, true);
      assert.equal(meta.noindex, true);
    }
  });

  it("keeps international screenshots hidden and unreferenced publicly", () => {
    assert.deepEqual(validateInternationalScreenshotLibrary(), []);
    assert.ok(INTERNATIONAL_SCREENSHOT_LIBRARY.length >= 4);
    for (const asset of INTERNATIONAL_SCREENSHOT_LIBRARY) {
      assert.equal(asset.publicReferenceAllowed, false);
      assert.equal(asset.adminOnly, true);
      assert.match(asset.filePath, /^\/images\/international\//);
    }
  });

  it("stores recovered international inventory as unpublished admin-only candidates", () => {
    assert.deepEqual(validateHiddenInternationalContentInventory(), []);
    assert.ok(HIDDEN_INTERNATIONAL_CONTENT_INVENTORY.length >= 8);
    assert.ok(HIDDEN_INTERNATIONAL_CONTENT_INVENTORY.some((entry) => entry.scope === "global"));
    assert.ok(HIDDEN_INTERNATIONAL_CONTENT_INVENTORY.some((entry) => entry.scope === "united_kingdom"));
    assert.ok(HIDDEN_INTERNATIONAL_CONTENT_INVENTORY.some((entry) => entry.scope === "australia"));
    for (const entry of HIDDEN_INTERNATIONAL_CONTENT_INVENTORY) {
      assert.equal(entry.published, false);
      assert.equal(entry.launchReady, false);
      assert.equal(entry.visibleInNavigation, false);
      assert.equal(entry.indexable, false);
      assert.equal(entry.adminOnly, true);
    }
  });
});
