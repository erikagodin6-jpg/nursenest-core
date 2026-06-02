import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  buildUkRnBlueprintGapSummary,
  summarizeUkRnCoreBlueprintDomains,
  UK_RN_CLINICAL_JUDGMENT_REQUIREMENTS,
  UK_RN_CORE_BLUEPRINT_DOMAINS,
  UK_RN_MATURE_INVENTORY_TARGETS,
  UK_RN_MEDICATION_GOVERNANCE_REQUIREMENTS,
  UK_RN_OSCE_BLUEPRINT_DOMAINS,
  UK_RN_PATHWAY_READINESS_METADATA,
  UK_RN_PUBLICATION_LOCKS,
  UK_RN_REQUIRED_GOVERNANCE_REVIEWS,
  UK_RN_SAFEGUARDING_REQUIREMENTS,
  UK_RN_TERMINOLOGY_EXPECTATIONS,
  validateUkRnBlueprintReadinessFramework,
} from "./uk-rn-blueprint-readiness-framework";

describe("UK RN blueprint readiness framework", () => {
  it("keeps the UK RN pathway hidden, draft-only, admin-only, and noindex", () => {
    assert.deepEqual(validateUkRnBlueprintReadinessFramework(), []);
    assert.equal(UK_RN_PATHWAY_READINESS_METADATA.internalHub, "/admin/global-expansion/hubs/uk/rn");
    assert.equal(UK_RN_PATHWAY_READINESS_METADATA.reservedPublicRoute, "/uk/rn");
    assert.equal(UK_RN_PATHWAY_READINESS_METADATA.visibility, "hidden");
    assert.equal(UK_RN_PATHWAY_READINESS_METADATA.publicationStatus, "draft");
    assert.equal(UK_RN_PATHWAY_READINESS_METADATA.indexing, "noindex");

    assert.equal(UK_RN_PUBLICATION_LOCKS.status, "draft");
    assert.equal(UK_RN_PUBLICATION_LOCKS.published, false);
    assert.equal(UK_RN_PUBLICATION_LOCKS.visibleInNavigation, false);
    assert.equal(UK_RN_PUBLICATION_LOCKS.learnerAccessible, false);
    assert.equal(UK_RN_PUBLICATION_LOCKS.launchReady, false);
    assert.equal(UK_RN_PUBLICATION_LOCKS.adminOnly, true);
    assert.equal(UK_RN_PUBLICATION_LOCKS.noindex, true);
    assert.equal(UK_RN_PUBLICATION_LOCKS.readyForPublication, false);
    assert.equal(UK_RN_PUBLICATION_LOCKS.defaultState, "DRAFT_ONLY");
  });

  it("uses the mature UK RN CBT and OSCE inventory targets", () => {
    assert.equal(UK_RN_MATURE_INVENTORY_TARGETS.lessons, 750);
    assert.equal(UK_RN_MATURE_INVENTORY_TARGETS.flashcards, 10_000);
    assert.equal(UK_RN_MATURE_INVENTORY_TARGETS.questions, 5_000);
    assert.equal(UK_RN_MATURE_INVENTORY_TARGETS.simulations, 200);
    assert.equal(UK_RN_MATURE_INVENTORY_TARGETS.osceStations, 250);
    assert.equal(UK_RN_MATURE_INVENTORY_TARGETS.ngnStyleCases, 250);
    assert.equal(UK_RN_MATURE_INVENTORY_TARGETS.bowties, 150);
    assert.equal(UK_RN_MATURE_INVENTORY_TARGETS.matrixCases, 150);
  });

  it("preserves the supplied domain allocation and records remaining expansion inventory", () => {
    const totals = summarizeUkRnCoreBlueprintDomains();
    const gaps = buildUkRnBlueprintGapSummary();

    assert.equal(UK_RN_CORE_BLUEPRINT_DOMAINS.length, 15);
    assert.equal(totals.lessons, 770);
    assert.equal(totals.questions, 4_825);
    assert.equal(totals.flashcards, 8_150);
    assert.equal(totals.simulations, 173);
    assert.deepEqual(gaps.remaining, {
      lessons: -20,
      questions: 175,
      flashcards: 1_850,
      simulations: 27,
      osceStations: 250,
      ngnStyleCases: 250,
      bowties: 150,
      matrixCases: 150,
    });
  });

  it("captures UK-specific terminology, medication governance, safeguarding, and OSCE requirements", () => {
    for (const term of ["A&E", "NEWS2", "SBAR", "Duty of Candour", "NHS pathways"]) {
      assert.ok(UK_RN_TERMINOLOGY_EXPECTATIONS.use.includes(term));
    }

    for (const requirement of ["Controlled Drugs", "Patient Group Directions", "Medicines Reconciliation"]) {
      assert.ok(UK_RN_MEDICATION_GOVERNANCE_REQUIREMENTS.includes(requirement));
    }

    for (const requirement of ["Adults at Risk", "Child Protection", "Modern Slavery Awareness"]) {
      assert.ok(UK_RN_SAFEGUARDING_REQUIREMENTS.includes(requirement));
    }

    assert.ok(UK_RN_OSCE_BLUEPRINT_DOMAINS.some((domain) => domain.domain === "Assessment"));
    assert.ok(UK_RN_OSCE_BLUEPRINT_DOMAINS.some((domain) => domain.requirements.includes("Capacity and consent")));
    assert.ok(UK_RN_OSCE_BLUEPRINT_DOMAINS.some((domain) => domain.requirements.includes("Specimen collection")));
    assert.equal(UK_RN_CLINICAL_JUDGMENT_REQUIREMENTS.minimumCaseStudies, 250);
    assert.ok(UK_RN_CLINICAL_JUDGMENT_REQUIREMENTS.categories.includes("Communication failures"));
  });

  it("requires all governance reviews before publication can be considered", () => {
    for (const review of [
      "NMC blueprint review completed",
      "UK terminology audit completed",
      "Clinical review completed",
      "Editorial review completed",
      "SEO localization review completed",
      "Translation review completed (future)",
    ]) {
      assert.ok(UK_RN_REQUIRED_GOVERNANCE_REVIEWS.includes(review));
    }
  });
});
