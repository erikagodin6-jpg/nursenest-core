import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  NEW_ZEALAND_RN_CLINICAL_ASSESSMENT_REQUIREMENTS,
  NEW_ZEALAND_RN_CLINICAL_JUDGMENT_REQUIREMENTS,
  NEW_ZEALAND_RN_COMMUNITY_AND_PRIMARY_CARE_REQUIREMENTS,
  NEW_ZEALAND_RN_COMPETENCY_METADATA_CONTENT_TYPES,
  NEW_ZEALAND_RN_CORE_BLUEPRINT_DOMAINS,
  NEW_ZEALAND_RN_CULTURAL_SAFETY_REQUIREMENTS,
  NEW_ZEALAND_RN_IQN_STREAM_REQUIREMENTS,
  NEW_ZEALAND_RN_MATURE_INVENTORY_TARGETS,
  NEW_ZEALAND_RN_MEDICATION_GOVERNANCE_REQUIREMENTS,
  NEW_ZEALAND_RN_NCNZ_COMPETENCY_MAPPING,
  NEW_ZEALAND_RN_PATHWAY_READINESS_METADATA,
  NEW_ZEALAND_RN_PUBLICATION_LOCKS,
  NEW_ZEALAND_RN_REQUIRED_GOVERNANCE_REVIEWS,
  NEW_ZEALAND_RN_TE_TIRITI_REQUIREMENTS,
  buildNewZealandRnBlueprintGapSummary,
  summarizeNewZealandRnCoreBlueprintDomains,
  validateNewZealandRnBlueprintReadinessFramework,
} from "./new-zealand-rn-blueprint-readiness-framework";

describe("New Zealand RN blueprint readiness framework", () => {
  it("keeps the New Zealand RN pathway hidden, draft-only, admin-only, and noindex", () => {
    assert.deepEqual(validateNewZealandRnBlueprintReadinessFramework(), []);
    assert.equal(NEW_ZEALAND_RN_PATHWAY_READINESS_METADATA.internalHub, "/admin/global-expansion/hubs/nz/rn");
    assert.equal(NEW_ZEALAND_RN_PATHWAY_READINESS_METADATA.reservedPublicRoute, "/nz/rn");
    assert.equal(NEW_ZEALAND_RN_PATHWAY_READINESS_METADATA.visibility, "hidden");
    assert.equal(NEW_ZEALAND_RN_PATHWAY_READINESS_METADATA.publicationStatus, "draft");
    assert.equal(NEW_ZEALAND_RN_PATHWAY_READINESS_METADATA.indexing, "noindex");

    assert.equal(NEW_ZEALAND_RN_PUBLICATION_LOCKS.status, "draft");
    assert.equal(NEW_ZEALAND_RN_PUBLICATION_LOCKS.published, false);
    assert.equal(NEW_ZEALAND_RN_PUBLICATION_LOCKS.visibleInNavigation, false);
    assert.equal(NEW_ZEALAND_RN_PUBLICATION_LOCKS.learnerAccessible, false);
    assert.equal(NEW_ZEALAND_RN_PUBLICATION_LOCKS.launchReady, false);
    assert.equal(NEW_ZEALAND_RN_PUBLICATION_LOCKS.adminOnly, true);
    assert.equal(NEW_ZEALAND_RN_PUBLICATION_LOCKS.noindex, true);
    assert.equal(NEW_ZEALAND_RN_PUBLICATION_LOCKS.readyForPublication, false);
    assert.equal(NEW_ZEALAND_RN_PUBLICATION_LOCKS.defaultState, "DRAFT_ONLY");
  });

  it("uses the mature New Zealand RN inventory targets", () => {
    assert.equal(NEW_ZEALAND_RN_MATURE_INVENTORY_TARGETS.lessons, 500);
    assert.equal(NEW_ZEALAND_RN_MATURE_INVENTORY_TARGETS.flashcards, 7_000);
    assert.equal(NEW_ZEALAND_RN_MATURE_INVENTORY_TARGETS.questions, 4_000);
    assert.equal(NEW_ZEALAND_RN_MATURE_INVENTORY_TARGETS.simulations, 120);
    assert.equal(NEW_ZEALAND_RN_MATURE_INVENTORY_TARGETS.ngnStyleCases, 200);
    assert.equal(NEW_ZEALAND_RN_MATURE_INVENTORY_TARGETS.bowties, 125);
    assert.equal(NEW_ZEALAND_RN_MATURE_INVENTORY_TARGETS.matrixCases, 125);
  });

  it("preserves the supplied blueprint allocation and records remaining expansion inventory", () => {
    const totals = summarizeNewZealandRnCoreBlueprintDomains();
    const gaps = buildNewZealandRnBlueprintGapSummary();

    assert.equal(NEW_ZEALAND_RN_CORE_BLUEPRINT_DOMAINS.length, 12);
    assert.equal(totals.lessons, 630);
    assert.equal(totals.questions, 4_450);
    assert.equal(totals.flashcards, 7_150);
    assert.equal(totals.simulations, 120);
    assert.deepEqual(gaps.remaining, {
      lessons: -130,
      questions: -450,
      flashcards: -150,
      simulations: 0,
      ngnStyleCases: 200,
      bowties: 125,
      matrixCases: 125,
    });
  });

  it("captures NCNZ, Te Tiriti, cultural safety, community care, medication, assessment, and IQN requirements", () => {
    assert.deepEqual(NEW_ZEALAND_RN_NCNZ_COMPETENCY_MAPPING, [
      "Professional responsibility",
      "Management of nursing care",
      "Interpersonal relationships",
      "Interprofessional healthcare and quality improvement",
    ]);
    assert.ok(NEW_ZEALAND_RN_COMPETENCY_METADATA_CONTENT_TYPES.includes("CAT Exams"));
    assert.ok(NEW_ZEALAND_RN_TE_TIRITI_REQUIREMENTS.includes("Equity"));
    assert.ok(NEW_ZEALAND_RN_CULTURAL_SAFETY_REQUIREMENTS.includes("Power dynamics"));
    assert.ok(NEW_ZEALAND_RN_COMMUNITY_AND_PRIMARY_CARE_REQUIREMENTS.includes("General practice nursing"));
    assert.ok(NEW_ZEALAND_RN_MEDICATION_GOVERNANCE_REQUIREMENTS.includes("Controlled medication practices"));
    assert.ok(NEW_ZEALAND_RN_CLINICAL_ASSESSMENT_REQUIREMENTS.includes("Vital signs interpretation"));
    assert.ok(NEW_ZEALAND_RN_IQN_STREAM_REQUIREMENTS.includes("Cultural safety expectations"));
    assert.equal(NEW_ZEALAND_RN_CLINICAL_JUDGMENT_REQUIREMENTS.minimumCaseStudies, 200);
    assert.ok(NEW_ZEALAND_RN_CLINICAL_JUDGMENT_REQUIREMENTS.categories.includes("Te Tiriti applications"));
  });

  it("requires all governance reviews before publication can be considered", () => {
    for (const review of [
      "NCNZ competency review completed",
      "Cultural safety review completed",
      "Te Tiriti review completed",
      "Clinical review completed",
      "Editorial review completed",
      "SEO localization review completed",
    ]) {
      assert.ok(NEW_ZEALAND_RN_REQUIRED_GOVERNANCE_REVIEWS.includes(review));
    }
  });
});
