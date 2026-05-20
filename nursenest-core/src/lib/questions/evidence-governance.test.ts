import test from "node:test";
import assert from "node:assert/strict";

import { evaluateEvidenceGovernance } from "./evidence-governance";

test("missing evidence sources fails governance", () => {
  const result = evaluateEvidenceGovernance({
    sources: [],
  });

  assert.equal(result.confidenceBand, "low");
  assert.ok(result.issues.some((issue) => issue.code === "NO_SOURCES"));
});

test("high-quality modern guideline sources achieve high confidence", () => {
  const result = evaluateEvidenceGovernance({
    currentYear: 2026,
    sources: [
      {
        authority: "aha",
        title: "AHA ACLS Guidelines",
        publicationYear: 2025,
        version: "2025",
        url: "https://example.org/aha",
      },
      {
        authority: "uptodate",
        title: "Acute Coronary Syndrome",
        publicationYear: 2026,
        version: "2026.1",
        url: "https://example.org/uptodate",
      },
    ],
  });

  assert.equal(result.confidenceBand, "high");
  assert.equal(result.recommendedReview, false);
});

test("outdated source triggers review", () => {
  const result = evaluateEvidenceGovernance({
    currentYear: 2026,
    sources: [
      {
        authority: "aha",
        title: "Legacy ACLS Guidance",
        publicationYear: 2014,
        version: "2014",
        url: "https://example.org/legacy",
      },
    ],
  });

  assert.ok(result.issues.some((issue) => issue.code === "OUTDATED_GUIDELINE"));
  assert.equal(result.recommendedReview, true);
});

test("low-authority source lowers confidence", () => {
  const result = evaluateEvidenceGovernance({
    currentYear: 2026,
    sources: [
      {
        authority: "other",
        title: "Unverified Blog",
        publicationYear: 2025,
        version: "1",
        url: "https://example.org/blog",
      },
    ],
  });

  assert.ok(result.issues.some((issue) => issue.code === "LOW_AUTHORITY_SOURCE"));
});
