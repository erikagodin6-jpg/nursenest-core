import test from "node:test";
import assert from "node:assert/strict";

import { evaluateFacultyReviewGovernance } from "./faculty-review-governance";

test("fully approved multidisciplinary review becomes approved", () => {
  const result = evaluateFacultyReviewGovernance({
    reviews: [
      { role: "clinician", decision: "approved" },
      { role: "educator", decision: "approved" },
      { role: "psychometrician", decision: "approved" },
    ],
    psychometricScore: 92,
    clinicalQualityScore: 94,
    clinicalRiskFlags: 0,
  });

  assert.equal(result.governanceStatus, "approved");
  assert.equal(result.publishEligible, true);
});

test("missing required review remains pending/provisional", () => {
  const result = evaluateFacultyReviewGovernance({
    reviews: [
      { role: "clinician", decision: "approved" },
      { role: "educator", decision: "approved" },
    ],
    psychometricScore: 90,
    clinicalQualityScore: 90,
  });

  assert.ok(result.missingReviews.includes("psychometrician"));
});

test("rejection forces rejected state", () => {
  const result = evaluateFacultyReviewGovernance({
    reviews: [
      { role: "clinician", decision: "approved" },
      { role: "psychometrician", decision: "rejected" },
    ],
  });

  assert.equal(result.governanceStatus, "rejected");
  assert.equal(result.publishEligible, false);
});

test("high-risk item becomes restricted", () => {
  const result = evaluateFacultyReviewGovernance({
    reviews: [
      { role: "clinician", decision: "approved-with-revisions" },
      { role: "educator", decision: "approved" },
      { role: "psychometrician", decision: "approved" },
    ],
    clinicalRiskFlags: 4,
    psychometricScore: 88,
    clinicalQualityScore: 90,
  });

  assert.equal(result.governanceStatus, "restricted");
  assert.ok(result.recommendations.some((entry) => entry.includes("Restrict exposure")));
});
