import assert from "node:assert/strict";
import test from "node:test";

import {
  GLOBAL_CONTENT_GOVERNANCE_STANDARDS,
  GLOBAL_CONTENT_LIFECYCLE_STATES,
  GLOBAL_CONTENT_QUALITY_MINIMUM_SCORE,
  GLOBAL_DUPLICATE_MANUAL_REVIEW_THRESHOLD,
  GLOBAL_REQUIRED_QUALITY_DIMENSIONS,
  GLOBAL_REQUIRED_REPORTS,
  GLOBAL_REQUIRED_REVIEW_GATES,
  getGlobalContentGovernanceStandard,
  isPublishableGlobalContentScore,
  requiresDuplicateManualReview,
  validateGlobalContentQualityGovernance,
} from "./global-content-quality-governance";

test("global governance standards enforce a 90/100 publication threshold for every content surface", () => {
  assert.equal(GLOBAL_CONTENT_QUALITY_MINIMUM_SCORE, 90);
  assert.deepEqual(validateGlobalContentQualityGovernance(), []);

  for (const standard of GLOBAL_CONTENT_GOVERNANCE_STANDARDS) {
    assert.equal(standard.minimumScore, 90, `${standard.assetType} must not publish below 90`);
    assert.ok(standard.hardRejects.length >= 2, `${standard.assetType} needs explicit rejection criteria`);
  }
});

test("global governance standards require every scoring dimension and audit report", () => {
  for (const standard of GLOBAL_CONTENT_GOVERNANCE_STANDARDS) {
    for (const dimension of GLOBAL_REQUIRED_QUALITY_DIMENSIONS) {
      assert.ok(standard.requiredDimensions.includes(dimension), `${standard.assetType} missing ${dimension}`);
    }
    for (const gate of GLOBAL_REQUIRED_REVIEW_GATES) {
      assert.ok(standard.requiredReviewGates.includes(gate), `${standard.assetType} missing ${gate}`);
    }
    for (const report of GLOBAL_REQUIRED_REPORTS) {
      assert.ok(standard.requiredReports.includes(report), `${standard.assetType} missing ${report}`);
    }
  }
});

test("global lifecycle prevents direct publication from draft", () => {
  assert.deepEqual(GLOBAL_CONTENT_LIFECYCLE_STATES, [
    "draft",
    "internal_review",
    "clinical_review",
    "educational_review",
    "seo_review",
    "ready_for_publication",
    "published",
    "archived",
  ]);
});

test("publishability and duplicate gates match the global quality requirement", () => {
  assert.equal(isPublishableGlobalContentScore(89), false);
  assert.equal(isPublishableGlobalContentScore(90), true);
  assert.equal(isPublishableGlobalContentScore(100), true);

  assert.equal(GLOBAL_DUPLICATE_MANUAL_REVIEW_THRESHOLD, 0.9);
  assert.equal(requiresDuplicateManualReview(0.89), false);
  assert.equal(requiresDuplicateManualReview(0.9), true);
});

test("localized teaching assets require localization review in addition to universal review gates", () => {
  for (const assetType of ["lesson", "question", "flashcard", "blog"] as const) {
    const standard = getGlobalContentGovernanceStandard(assetType);
    assert.ok(standard.requiredReviewGates.includes("localization_review"));
  }
});
