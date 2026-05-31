import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  FUTURE_INTERNATIONAL_RN_OVERLAY_MARKETS,
  GLOBAL_SHARED_BODY_SYSTEM_FRAMEWORK,
  GLOBAL_SHARED_CLINICAL_JUDGMENT_FRAMEWORK,
  GLOBAL_SHARED_CLINICAL_SKILLS_FRAMEWORK,
  GLOBAL_SHARED_CORE_FOUNDATION_AREAS,
  GLOBAL_SHARED_CORE_INVENTORY_TARGETS,
  GLOBAL_SHARED_CORE_PUBLICATION_LOCKS,
  GLOBAL_SHARED_FLASHCARD_OUTPUT_FRAMEWORK,
  GLOBAL_HEART_FAILURE_CORE_OVERLAY_EXAMPLE,
  GLOBAL_SHARED_PHARMACOLOGY_FRAMEWORK,
  INTERNATIONAL_RN_CONTENT_ARCHITECTURE_LAYERS,
  INTERNATIONAL_RN_COUNTRY_OVERLAYS,
  INTERNATIONAL_RN_DUPLICATE_CONTENT_AUDIT,
  INTERNATIONAL_RN_GENERATION_GOVERNANCE_RULES,
  INTERNATIONAL_RN_LANGUAGE_OVERLAY_FRAMEWORK,
  INTERNATIONAL_RN_REUSE_SAVINGS_ESTIMATES,
  calculateInternationalRnAggregateSavings,
  validateInternationalRnSharedCoreFramework,
} from "./international-rn-shared-core-framework";

describe("international RN shared core framework", () => {
  it("keeps GLOBAL_SHARED_CORE hidden, draft-only, admin-only, and noindex", () => {
    assert.deepEqual(validateInternationalRnSharedCoreFramework(), []);
    assert.equal(GLOBAL_SHARED_CORE_PUBLICATION_LOCKS.status, "draft");
    assert.equal(GLOBAL_SHARED_CORE_PUBLICATION_LOCKS.published, false);
    assert.equal(GLOBAL_SHARED_CORE_PUBLICATION_LOCKS.visibleInNavigation, false);
    assert.equal(GLOBAL_SHARED_CORE_PUBLICATION_LOCKS.learnerAccessible, false);
    assert.equal(GLOBAL_SHARED_CORE_PUBLICATION_LOCKS.launchReady, false);
    assert.equal(GLOBAL_SHARED_CORE_PUBLICATION_LOCKS.adminOnly, true);
    assert.equal(GLOBAL_SHARED_CORE_PUBLICATION_LOCKS.noindex, true);
    assert.equal(GLOBAL_SHARED_CORE_PUBLICATION_LOCKS.readyForPublication, false);
  });

  it("defines minimum shared core inventory targets", () => {
    assert.equal(GLOBAL_SHARED_CORE_INVENTORY_TARGETS.lesson, 2_000);
    assert.equal(GLOBAL_SHARED_CORE_INVENTORY_TARGETS.flashcard, 25_000);
    assert.equal(GLOBAL_SHARED_CORE_INVENTORY_TARGETS.question, 40_000);
    assert.equal(GLOBAL_SHARED_CORE_INVENTORY_TARGETS.simulation, 500);
    assert.equal(GLOBAL_SHARED_CORE_INVENTORY_TARGETS.ngn_case, 1_000);
  });

  it("covers shared foundation, body system, skill, pharmacology, clinical judgment, and flashcard frameworks", () => {
    assert.ok(GLOBAL_SHARED_CORE_FOUNDATION_AREAS.some((area) => area.id === "pathophysiology"));
    assert.ok(GLOBAL_SHARED_CORE_FOUNDATION_AREAS.some((area) => area.id === "clinical-judgment"));
    assert.equal(GLOBAL_SHARED_BODY_SYSTEM_FRAMEWORK.length, 16);
    assert.ok(GLOBAL_SHARED_BODY_SYSTEM_FRAMEWORK.some((area) => area.title === "Cardiovascular"));
    assert.ok(GLOBAL_SHARED_CLINICAL_SKILLS_FRAMEWORK.some((area) => area.title === "PICC Care"));
    assert.ok(GLOBAL_SHARED_PHARMACOLOGY_FRAMEWORK.some((area) => area.title === "Critical Care Medications"));
    assert.ok(GLOBAL_SHARED_CLINICAL_JUDGMENT_FRAMEWORK.includes("Adaptive Learning Metadata"));
    assert.ok(GLOBAL_SHARED_FLASHCARD_OUTPUT_FRAMEWORK.includes("Memory Anchors"));
  });

  it("uses overlays instead of duplicate source content", () => {
    const layerNames = new Set(INTERNATIONAL_RN_CONTENT_ARCHITECTURE_LAYERS.map((layer) => layer.layer));
    for (const layer of ["core_content", "country_overlay", "language_overlay", "exam_overlay", "role_overlay"] as const) {
      assert.ok(layerNames.has(layer));
    }
    for (const layer of INTERNATIONAL_RN_CONTENT_ARCHITECTURE_LAYERS) {
      assert.equal(layer.mayDuplicateSourceContent, false);
    }

    const uk = INTERNATIONAL_RN_COUNTRY_OVERLAYS.find((overlay) => overlay.countryCode === "GB");
    const au = INTERNATIONAL_RN_COUNTRY_OVERLAYS.find((overlay) => overlay.countryCode === "AU");
    const nz = INTERNATIONAL_RN_COUNTRY_OVERLAYS.find((overlay) => overlay.countryCode === "NZ");
    assert.ok(uk?.requiredDomains.includes("NEWS2"));
    assert.ok(au?.requiredDomains.includes("Aboriginal and Torres Strait Islander Health"));
    assert.ok(nz?.requiredDomains.includes("Te Tiriti o Waitangi"));
  });

  it("models heart failure as one global core with role, country, and language overlays", () => {
    assert.equal(GLOBAL_HEART_FAILURE_CORE_OVERLAY_EXAMPLE.coreId, "global-heart-failure-core");
    assert.equal(GLOBAL_HEART_FAILURE_CORE_OVERLAY_EXAMPLE.sourceLayer, "GLOBAL_SHARED_CORE");
    assert.equal(GLOBAL_HEART_FAILURE_CORE_OVERLAY_EXAMPLE.duplicateCountryLessonsRequired, false);
    assert.deepEqual(
      GLOBAL_HEART_FAILURE_CORE_OVERLAY_EXAMPLE.roleOverlays.find((overlay) => overlay.role === "PN")?.focus,
      ["Recognition", "Assessment", "Monitoring", "Basic medications", "Escalation"],
    );
    assert.ok(
      GLOBAL_HEART_FAILURE_CORE_OVERLAY_EXAMPLE.roleOverlays
        .find((overlay) => overlay.role === "RN")
        ?.focus.includes("Clinical judgment"),
    );
    assert.ok(
      GLOBAL_HEART_FAILURE_CORE_OVERLAY_EXAMPLE.roleOverlays
        .find((overlay) => overlay.role === "NP")
        ?.focus.includes("Guideline-directed therapy"),
    );
    assert.deepEqual(GLOBAL_HEART_FAILURE_CORE_OVERLAY_EXAMPLE.countryOverlays, [
      "UK Overlay",
      "Australia Overlay",
      "Canada Overlay",
      "US Overlay",
    ]);
    assert.deepEqual(GLOBAL_HEART_FAILURE_CORE_OVERLAY_EXAMPLE.languageOverlays, ["French Overlay", "Spanish Overlay"]);
    assert.equal(GLOBAL_HEART_FAILURE_CORE_OVERLAY_EXAMPLE.publicationLocks.noindex, true);
  });

  it("supports future countries and translation overlays without copying country-specific pages", () => {
    assert.ok(FUTURE_INTERNATIONAL_RN_OVERLAY_MARKETS.includes("Ireland"));
    assert.ok(FUTURE_INTERNATIONAL_RN_OVERLAY_MARKETS.includes("UAE DHA"));
    assert.ok(FUTURE_INTERNATIONAL_RN_OVERLAY_MARKETS.includes("Philippines"));
    assert.ok(INTERNATIONAL_RN_LANGUAGE_OVERLAY_FRAMEWORK.includes("French"));
    assert.ok(INTERNATIONAL_RN_LANGUAGE_OVERLAY_FRAMEWORK.includes("Spanish"));
    assert.ok(INTERNATIONAL_RN_LANGUAGE_OVERLAY_FRAMEWORK.includes("Chinese"));
  });

  it("records evidence-backed duplicate and reuse savings signals", () => {
    assert.ok(INTERNATIONAL_RN_DUPLICATE_CONTENT_AUDIT.evidenceSources.includes("docs/global-content-reuse-map.md"));
    assert.ok(INTERNATIONAL_RN_DUPLICATE_CONTENT_AUDIT.existingSignals.some((signal) => signal.signal === "Sepsis"));
    assert.ok(INTERNATIONAL_RN_DUPLICATE_CONTENT_AUDIT.knownDuplicateFindings.some((finding) => finding.includes("250 near-duplicate")));
    assert.equal(INTERNATIONAL_RN_REUSE_SAVINGS_ESTIMATES.length, 3);

    const aggregate = calculateInternationalRnAggregateSavings();
    assert.equal(aggregate.sourceItems, 19_500);
    assert.equal(aggregate.duplicatedItemsAvoided, 78_000);
    assert.ok(aggregate.averageReusePercent >= 70);
    assert.ok(aggregate.averageMaintenanceReductionPercent >= 65);
  });

  it("blocks duplicate generation when shared core content exists", () => {
    for (const rule of [
      "No duplicate lesson creation when shared core content exists.",
      "No duplicate flashcard creation when shared core content exists.",
      "No duplicate question creation when shared core content exists.",
      "No duplicate simulation creation when shared core content exists.",
    ]) {
      assert.ok(INTERNATIONAL_RN_GENERATION_GOVERNANCE_RULES.includes(rule));
    }
  });
});
