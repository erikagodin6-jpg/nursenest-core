import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  AUSTRALIA_RN_ABORIGINAL_AND_TORRES_STRAIT_ISLANDER_HEALTH_REQUIREMENTS,
  AUSTRALIA_RN_CLINICAL_JUDGMENT_REQUIREMENTS,
  AUSTRALIA_RN_CLINICAL_REQUIREMENTS,
  AUSTRALIA_RN_CORE_BLUEPRINT_DOMAINS,
  AUSTRALIA_RN_IQNM_STREAM_REQUIREMENTS,
  AUSTRALIA_RN_MATURE_INVENTORY_TARGETS,
  AUSTRALIA_RN_MEDICATION_GOVERNANCE_REQUIREMENTS,
  AUSTRALIA_RN_NMBA_STANDARDS_MAPPING,
  AUSTRALIA_RN_PATHWAY_READINESS_METADATA,
  AUSTRALIA_RN_PUBLICATION_LOCKS,
  AUSTRALIA_RN_REQUIRED_GOVERNANCE_REVIEWS,
  AUSTRALIA_RN_RURAL_AND_REMOTE_REQUIREMENTS,
  buildAustraliaRnBlueprintGapSummary,
  summarizeAustraliaRnCoreBlueprintDomains,
  validateAustraliaRnBlueprintReadinessFramework,
} from "./australia-rn-blueprint-readiness-framework";

describe("Australia RN blueprint readiness framework", () => {
  it("keeps the Australia RN pathway hidden, draft-only, admin-only, and noindex", () => {
    assert.deepEqual(validateAustraliaRnBlueprintReadinessFramework(), []);
    assert.equal(AUSTRALIA_RN_PATHWAY_READINESS_METADATA.internalHub, "/admin/global-expansion/hubs/au/rn");
    assert.equal(AUSTRALIA_RN_PATHWAY_READINESS_METADATA.reservedPublicRoute, "/au/rn");
    assert.equal(AUSTRALIA_RN_PATHWAY_READINESS_METADATA.visibility, "hidden");
    assert.equal(AUSTRALIA_RN_PATHWAY_READINESS_METADATA.publicationStatus, "draft");
    assert.equal(AUSTRALIA_RN_PATHWAY_READINESS_METADATA.indexing, "noindex");

    assert.equal(AUSTRALIA_RN_PUBLICATION_LOCKS.status, "draft");
    assert.equal(AUSTRALIA_RN_PUBLICATION_LOCKS.published, false);
    assert.equal(AUSTRALIA_RN_PUBLICATION_LOCKS.visibleInNavigation, false);
    assert.equal(AUSTRALIA_RN_PUBLICATION_LOCKS.learnerAccessible, false);
    assert.equal(AUSTRALIA_RN_PUBLICATION_LOCKS.launchReady, false);
    assert.equal(AUSTRALIA_RN_PUBLICATION_LOCKS.adminOnly, true);
    assert.equal(AUSTRALIA_RN_PUBLICATION_LOCKS.noindex, true);
    assert.equal(AUSTRALIA_RN_PUBLICATION_LOCKS.readyForPublication, false);
    assert.equal(AUSTRALIA_RN_PUBLICATION_LOCKS.defaultState, "DRAFT_ONLY");
  });

  it("uses the mature Australia RN inventory targets", () => {
    assert.equal(AUSTRALIA_RN_MATURE_INVENTORY_TARGETS.lessons, 600);
    assert.equal(AUSTRALIA_RN_MATURE_INVENTORY_TARGETS.flashcards, 8_000);
    assert.equal(AUSTRALIA_RN_MATURE_INVENTORY_TARGETS.questions, 5_000);
    assert.equal(AUSTRALIA_RN_MATURE_INVENTORY_TARGETS.simulations, 150);
    assert.equal(AUSTRALIA_RN_MATURE_INVENTORY_TARGETS.ngnStyleCases, 250);
    assert.equal(AUSTRALIA_RN_MATURE_INVENTORY_TARGETS.bowties, 150);
    assert.equal(AUSTRALIA_RN_MATURE_INVENTORY_TARGETS.matrixCases, 150);
  });

  it("preserves the supplied blueprint allocation and records remaining expansion inventory", () => {
    const totals = summarizeAustraliaRnCoreBlueprintDomains();
    const gaps = buildAustraliaRnBlueprintGapSummary();

    assert.equal(AUSTRALIA_RN_CORE_BLUEPRINT_DOMAINS.length, 12);
    assert.equal(totals.lessons, 720);
    assert.equal(totals.questions, 4_900);
    assert.equal(totals.flashcards, 8_100);
    assert.equal(totals.simulations, 150);
    assert.deepEqual(gaps.remaining, {
      lessons: -120,
      questions: 100,
      flashcards: -100,
      simulations: 0,
      ngnStyleCases: 250,
      bowties: 150,
      matrixCases: 150,
    });
  });

  it("captures NMBA, Ahpra, cultural safety, rural practice, medication governance, and IQNM requirements", () => {
    assert.equal(AUSTRALIA_RN_NMBA_STANDARDS_MAPPING.length, 7);
    assert.ok(AUSTRALIA_RN_CLINICAL_REQUIREMENTS.includes("Ahpra professional expectations"));
    assert.ok(AUSTRALIA_RN_CLINICAL_REQUIREMENTS.includes("Cultural safety principles"));
    assert.ok(AUSTRALIA_RN_ABORIGINAL_AND_TORRES_STRAIT_ISLANDER_HEALTH_REQUIREMENTS.includes("Historical context affecting healthcare"));
    assert.ok(AUSTRALIA_RN_RURAL_AND_REMOTE_REQUIREMENTS.includes("Retrieval services"));
    assert.ok(AUSTRALIA_RN_MEDICATION_GOVERNANCE_REQUIREMENTS.includes("Schedule classifications"));
    assert.ok(AUSTRALIA_RN_IQNM_STREAM_REQUIREMENTS.includes("Clinical adaptation"));
    assert.equal(AUSTRALIA_RN_CLINICAL_JUDGMENT_REQUIREMENTS.minimumCaseStudies, 250);
    assert.ok(AUSTRALIA_RN_CLINICAL_JUDGMENT_REQUIREMENTS.categories.includes("Cultural safety situations"));
  });

  it("requires all governance reviews before publication can be considered", () => {
    for (const review of [
      "NMBA standards review completed",
      "Ahpra review completed",
      "Australian terminology review completed",
      "Clinical review completed",
      "Editorial review completed",
      "SEO localization review completed",
    ]) {
      assert.ok(AUSTRALIA_RN_REQUIRED_GOVERNANCE_REVIEWS.includes(review));
    }
  });
});
