import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  INTERNATIONAL_RECOVERY_DUPLICATE_FINDINGS,
  INTERNATIONAL_RECOVERY_SOURCE_ROOTS,
  INTERNATIONAL_TRANSLATION_READY_QUEUE,
  RECOVERED_INTERNATIONAL_CONTENT_REGISTRY,
  buildInternationalInheritanceMap,
  buildInternationalRecoveryDashboard,
  buildInternationalReuseOpportunities,
  classifyInternationalContentCandidate,
  classifyInternationalContentCandidateForInheritance,
  validateInternationalRecoveryEngine,
} from "./international-content-recovery-classification-engine";

describe("international content recovery classification engine", () => {
  it("keeps every recovered asset draft, admin-only, hidden, noindex, and review-gated", () => {
    assert.deepEqual(validateInternationalRecoveryEngine(), []);

    for (const asset of RECOVERED_INTERNATIONAL_CONTENT_REGISTRY) {
      assert.equal(asset.status, "draft");
      assert.equal(asset.published, false);
      assert.equal(asset.adminOnly, true);
      assert.equal(asset.visibleInNavigation, false);
      assert.equal(asset.learnerAccessible, false);
      assert.equal(asset.launchReady, false);
      assert.equal(asset.noindex, true);
      assert.equal(asset.reviewStatus, "requires_review");
      assert.equal(asset.publicationStatus, "draft");
    }
  });

  it("declares the required recovery source roots", () => {
    for (const root of [
      "src/content/blog-static-longtail/",
      "src/content/pathway-lessons/",
      "src/content/questions/",
      "src/content/clinical-case-studies.json",
      "output/*",
      "data/blog-content/",
      "data/blog-manifest/",
      "tools/i18n/",
      "scripts/i18n/",
    ]) {
      assert.ok(INTERNATIONAL_RECOVERY_SOURCE_ROOTS.includes(root));
    }
  });

  it("classifies candidates into shared core and overlay buckets", () => {
    assert.equal(classifyInternationalContentCandidate("Heart Failure assessment and labs"), "GLOBAL_SHARED_CORE");
    assert.equal(classifyInternationalContentCandidate("NEWS2 and Duty of Candour"), "COUNTRY_SPECIFIC");
    assert.equal(classifyInternationalContentCandidate("NCLEX-RN NGN case"), "EXAM_SPECIFIC");
    assert.equal(classifyInternationalContentCandidate("Prescribing and differential diagnosis"), "ROLE_SPECIFIC");
    assert.equal(classifyInternationalContentCandidate("Spanish NCLEX glossary"), "LANGUAGE_SPECIFIC");
    assert.equal(classifyInternationalContentCandidate("unmapped imported draft"), "REQUIRES_REVIEW");
  });

  it("builds the international recovery dashboard", () => {
    const dashboard = buildInternationalRecoveryDashboard();
    assert.equal(dashboard.recoveryCount, RECOVERED_INTERNATIONAL_CONTENT_REGISTRY.length);
    assert.equal(dashboard.globalCoreCount, 3);
    assert.equal(dashboard.countryOverlayCount, 3);
    assert.equal(dashboard.roleOverlayCount, 1);
    assert.equal(dashboard.examOverlayCount, 1);
    assert.equal(dashboard.languageOverlayCount, 2);
    assert.equal(dashboard.duplicateCount, INTERNATIONAL_RECOVERY_DUPLICATE_FINDINGS.length);
    assert.equal(dashboard.reviewQueueCount, dashboard.recoveryCount);
    assert.equal(dashboard.draftInventoryCount, dashboard.recoveryCount);
    assert.equal(dashboard.translationReadyCount, INTERNATIONAL_TRANSLATION_READY_QUEUE.length);
    assert.equal(dashboard.readinessState, "recovery_classification_required_before_generation");
  });

  it("tracks duplicate and translation recovery queues", () => {
    assert.ok(INTERNATIONAL_RECOVERY_DUPLICATE_FINDINGS.some((finding) => finding.groupId === "duplicate-global-heart-failure"));
    assert.ok(INTERNATIONAL_RECOVERY_DUPLICATE_FINDINGS.some((finding) => finding.duplicateType === "localized_duplicate"));
    assert.ok(INTERNATIONAL_TRANSLATION_READY_QUEUE.some((asset) => asset.contentId === "recovered-global-heart-failure-core"));
    assert.ok(INTERNATIONAL_TRANSLATION_READY_QUEUE.some((asset) => asset.language === "fr"));
    assert.ok(INTERNATIONAL_TRANSLATION_READY_QUEUE.every((asset) => asset.publicationStatus === "draft"));
  });

  it("maps legacy classifications to inheritance-first overlay layers", () => {
    assert.equal(classifyInternationalContentCandidateForInheritance("Heart Failure assessment and labs"), "GLOBAL_SHARED_CORE");
    assert.equal(classifyInternationalContentCandidateForInheritance("NEWS2 and Duty of Candour"), "COUNTRY_OVERLAY");
    assert.equal(classifyInternationalContentCandidateForInheritance("Prescribing and differential diagnosis"), "ROLE_OVERLAY");
    assert.equal(classifyInternationalContentCandidateForInheritance("NCLEX-RN NGN case"), "EXAM_OVERLAY");
    assert.equal(classifyInternationalContentCandidateForInheritance("Spanish NCLEX glossary"), "LANGUAGE_OVERLAY");
  });

  it("builds inheritance map and reuse opportunities before generation", () => {
    const map = buildInternationalInheritanceMap();
    const heartFailure = map.find((entry) => entry.topic === "Heart Failure");
    assert.ok(heartFailure);
    assert.equal(heartFailure.inheritancePath, "Global Core -> Role Overlay -> Country Overlay -> Exam Overlay -> Language Overlay");
    assert.ok(heartFailure.globalCoreAssets.length > 0);
    assert.ok(heartFailure.roleOverlayAssets.length > 0);

    const opportunities = buildInternationalReuseOpportunities();
    assert.ok(opportunities.some((item) => item.topic === "Heart Failure"));
    assert.ok(opportunities.every((item) => item.recommendedAction !== "manual_review" || item.rationale.includes("manual review")));
  });
});
