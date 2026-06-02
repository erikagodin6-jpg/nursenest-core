import test from "node:test";
import assert from "node:assert/strict";
import { auditContentScope, summarizeScopeCompliance, type ContentScopeAuditItem } from "./content-scope-auditor";

function item(overrides: Partial<ContentScopeAuditItem>): ContentScopeAuditItem {
  return {
    id: "item-1",
    surface: "question",
    title: "Which action is appropriate?",
    body: "The nurse reviews the patient presentation.",
    tier: "RN",
    exam: "NCLEX-RN",
    country: "US",
    careerType: "nursing",
    topic: "Safety",
    tags: [],
    ...overrides,
  };
}

test("flags ICU content in entry-level nursing pathways", () => {
  const findings = auditContentScope(
    item({
      body: "The patient is receiving vasopressor titration through an arterial line waveform in the ICU.",
      tier: "RPN",
      exam: "REX-PN",
      country: "CA",
    }),
  );

  assert.equal(findings.some((finding) => finding.issueType === "rpn_too_advanced"), true);
  assert.equal(findings.some((finding) => finding.severity === "critical"), true);
});

test("flags respiratory therapy technical content in nursing scope", () => {
  const findings = auditContentScope(
    item({
      body: "The item asks the RN to select a ventilator mode and perform PEEP titration.",
      tier: "RN",
      exam: "NCLEX-RN",
      country: "US",
    }),
  );

  assert.equal(findings.some((finding) => finding.issueType === "rt_content_in_nursing"), true);
});

test("flags NP content that is too basic", () => {
  const findings = auditContentScope(
    item({
      body: "The nurse practitioner question asks the learner to place the call bell within reach and take vital signs.",
      tier: "NP",
      exam: "CNPLE",
      country: "CA",
    }),
  );

  assert.equal(findings.some((finding) => finding.issueType === "np_too_basic"), true);
});

test("flags country mismatches", () => {
  const findings = auditContentScope(
    item({
      body: "The NCLEX item discusses CNO controlled acts and REx-PN registration.",
      tier: "RN",
      exam: "NCLEX-RN",
      country: "US",
    }),
  );

  assert.equal(findings.some((finding) => finding.issueType === "country_mismatch"), true);
});

test("flags exam mismatches", () => {
  const findings = auditContentScope(
    item({
      body: "This CNPLE teaching item repeatedly refers to NCLEX-RN candidate preparation.",
      tier: "NP",
      exam: "CNPLE",
      country: "CA",
    }),
  );

  assert.equal(findings.some((finding) => finding.issueType === "exam_mismatch"), true);
});

test("summarizes compliance without duplicate item counts", () => {
  const items = [
    item({ id: "a", body: "Clean NCLEX-RN content about pneumonia assessment." }),
    item({ id: "b", body: "RN content asks for ventilator mode and PEEP titration." }),
  ];
  const findings = items.flatMap(auditContentScope);
  const summary = summarizeScopeCompliance(items, findings);

  assert.equal(summary.totalItems, 2);
  assert.equal(summary.flaggedItems, 1);
  assert.equal(summary.bySurface.question.audited, 2);
  assert.equal(summary.bySurface.question.flagged, 1);
  assert.ok(summary.complianceScore < 100);
});

