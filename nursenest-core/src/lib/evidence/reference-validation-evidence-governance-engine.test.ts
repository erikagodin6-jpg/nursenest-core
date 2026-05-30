import assert from "node:assert/strict";
import test from "node:test";
import {
  auditEvidenceGovernanceItem,
  buildReferenceValidationEvidenceGovernanceReport,
  extractEvidenceReferences,
  inferReferenceQualityLevel,
  type EvidenceGovernanceContentItem,
} from "@/lib/evidence/reference-validation-evidence-governance-engine";

const generatedAt = "2026-05-29T00:00:00.000Z";

const currentGuidelineQuestion: EvidenceGovernanceContentItem = {
  id: "q-sepsis-current",
  contentType: "question",
  title: "Sepsis escalation priority",
  pathway: "RN",
  tier: "RN",
  topic: "Sepsis",
  clinicalSpecialty: "Emergency Care",
  stem: "A client has suspected sepsis. Which finding requires escalation?",
  rationale: "Escalation is based on hypotension and worsening perfusion.",
  references: [
    {
      title: "Surviving Sepsis Campaign guideline",
      url: "https://example.org/sepsis-guideline",
      qualityLevel: "primary_guideline",
      publicationYear: 2024,
      locator: "Recommendations: initial resuscitation",
      accessStatus: "accessible",
    },
  ],
};

test("extractEvidenceReferences collects explicit, JSON, APA, and body references", () => {
  const references = extractEvidenceReferences({
    id: "lesson-cardiac",
    contentType: "lesson",
    title: "Cardiac assessment",
    rawReferences: [{ title: "Cardiac guideline", url: "https://example.org/cardiac" }],
    sourcesJson: [{ title: "Peer reviewed article", doi: "10.1000/test" }],
    apaReferences: ["Professional Association. (2025). ECG practice standard. https://example.org/ecg"],
    body: "See https://example.org/body-source for a learner-facing reference.",
  });

  assert.equal(references.length, 4);
  assert.equal(references.some((reference) => reference.extractedFrom === "rawReferences"), true);
  assert.equal(references.some((reference) => reference.extractedFrom === "sourcesJson"), true);
  assert.equal(references.some((reference) => reference.extractedFrom === "apaReferences"), true);
  assert.equal(references.some((reference) => reference.extractedFrom === "body"), true);
});

test("inferReferenceQualityLevel classifies source quality", () => {
  assert.equal(inferReferenceQualityLevel({ title: "AHA guideline for ACLS" }), "primary_guideline");
  assert.equal(inferReferenceQualityLevel({ title: "College regulatory professional standard" }), "regulatory_source");
  assert.equal(inferReferenceQualityLevel({ title: "JAMA peer reviewed article", doi: "10.1000/test" }), "peer_reviewed_article");
  assert.equal(inferReferenceQualityLevel({ title: "Wikipedia summary", url: "https://wikipedia.org/test" }), "low_quality_web_source");
});

test("evidence governance marks current high-quality guideline content publishable", async () => {
  const audit = await auditEvidenceGovernanceItem(currentGuidelineQuestion, { generatedAt });

  assert.equal(audit.publishable, true);
  assert.equal(audit.riskPriority, "high");
  assert.equal(audit.referenceQualityScore >= 90, true);
  assert.equal(audit.evidenceCurrencyScore >= 85, true);
  assert.equal(audit.flags.length, 0);
});

test("evidence governance blocks high-risk clinical content without citations", async () => {
  const audit = await auditEvidenceGovernanceItem(
    {
      id: "pharm-insulin-missing",
      contentType: "pharmacology",
      title: "Insulin safety",
      pathway: "RN",
      tier: "RN",
      topic: "Diabetes Pharmacology",
      body: "Insulin dose timing, hypoglycemia, and monitoring guidance.",
    },
    { generatedAt },
  );

  assert.equal(audit.publishable, false);
  assert.equal(audit.riskPriority, "high");
  assert.equal(audit.flags.includes("missing_reference"), true);
  assert.equal(audit.referenceQualityScore < 40, true);
});

test("evidence governance verifies reference accessibility with a fetcher", async () => {
  const fetcher = async (url: string | URL | Request, init?: RequestInit) => {
    const href = String(url);
    if (href.includes("broken")) return new Response(null, { status: 404 });
    if (href.includes("unavailable")) throw new Error("network unavailable");
    if (init?.method === "HEAD" && href.includes("head-blocked")) return new Response(null, { status: 405 });
    return new Response("ok", { status: 200 });
  };

  const report = await buildReferenceValidationEvidenceGovernanceReport(
    [
      currentGuidelineQuestion,
      {
        id: "ecg-broken",
        contentType: "ecg",
        title: "STEMI ECG recognition",
        pathway: "ECGCore",
        tier: "RN",
        topic: "Cardiac ECG",
        body: "Recognize STEMI and escalate immediately.",
        references: [
          {
            title: "Broken STEMI guideline",
            url: "https://example.org/broken",
            qualityLevel: "primary_guideline",
            publicationYear: 2023,
            locator: "STEMI section",
          },
          {
            title: "Temporarily unavailable ECG reference",
            url: "https://example.org/unavailable",
            qualityLevel: "professional_association",
            publicationYear: 2023,
            locator: "ECG section",
          },
          {
            title: "HEAD blocked but GET works",
            url: "https://example.org/head-blocked",
            qualityLevel: "professional_association",
            publicationYear: 2023,
            locator: "ECG section",
          },
        ],
      },
    ],
    { generatedAt, verifyAccess: true, fetcher: fetcher as typeof fetch },
  );

  const ecg = report.items.find((item) => item.id === "ecg-broken");
  assert.ok(ecg);
  assert.equal(ecg.flags.includes("broken_reference"), true);
  assert.equal(ecg.flags.includes("unavailable_reference"), true);
  assert.equal(ecg.references.some((reference) => reference.url?.includes("head-blocked") && reference.accessStatus === "accessible"), true);
  assert.equal(report.dashboard.brokenReferences, 1);
  assert.equal(report.dashboard.unavailableReferences, 1);
  assert.equal(report.brokenReferenceQueue.some((item) => item.itemId === "ecg-broken"), true);
});

test("evidence governance reports outdated, duplicate, and low-quality references", async () => {
  const report = await buildReferenceValidationEvidenceGovernanceReport(
    [
      {
        id: "maternal-hemorrhage",
        contentType: "lesson",
        title: "Maternal hemorrhage response",
        pathway: "RN",
        tier: "RN",
        topic: "Maternal Child",
        body: "Maternal hemorrhage recognition and emergency escalation.",
        references: [
          {
            title: "Old postpartum hemorrhage guideline",
            url: "https://example.org/pph",
            publicationYear: 2018,
            qualityLevel: "primary_guideline",
            locator: "Hemorrhage section",
            accessStatus: "accessible",
          },
          {
            title: "Old postpartum hemorrhage guideline",
            url: "https://example.org/pph",
            publicationYear: 2018,
            qualityLevel: "primary_guideline",
            locator: "Hemorrhage section",
            accessStatus: "accessible",
          },
          {
            title: "Healthline blog overview",
            url: "https://healthline.com/example",
            publicationYear: 2020,
            qualityLevel: "low_quality_web_source",
            accessStatus: "accessible",
          },
        ],
      },
    ],
    { generatedAt },
  );

  const item = report.items[0];
  assert.equal(item.publishable, false);
  assert.equal(item.flags.includes("outdated_reference"), true);
  assert.equal(item.flags.includes("duplicate_reference"), true);
  assert.equal(item.flags.includes("low_quality_reference"), true);
  assert.equal(report.dashboard.outdatedReferences, 1);
  assert.equal(report.dashboard.duplicateReferences, 1);
  assert.equal(report.dashboard.lowQualityReferences, 1);
  assert.equal(report.highRiskClinicalReviewQueue.length, 1);
});

test("evidence governance builds dashboard rollups and queues", async () => {
  const report = await buildReferenceValidationEvidenceGovernanceReport(
    [
      currentGuidelineQuestion,
      {
        id: "teas-reading",
        contentType: "teas",
        title: "Reading inference",
        pathway: "TEAS",
        tier: "PreNursing",
        topic: "Reading",
        rawReferences: [{ title: "TEAS textbook", publicationYear: 2022, qualityLevel: "textbook" }],
      },
      {
        id: "loft-no-ref",
        contentType: "loft",
        title: "Critical care LOFT case",
        pathway: "NP",
        tier: "NP",
        topic: "Critical Care",
        body: "Shock, vasopressors, and emergency escalation.",
      },
    ],
    { generatedAt },
  );

  assert.equal(report.dashboard.totalContentItems, 3);
  assert.equal(report.dashboard.totalReferences, 2);
  assert.equal(report.dashboard.contentWithoutCitations, 1);
  assert.equal(report.missingReferenceQueue.some((item) => item.itemId === "loft-no-ref"), true);
  assert.equal(report.highRiskClinicalReviewQueue.some((item) => item.itemId === "loft-no-ref"), true);
  assert.equal(report.byContentType.question.count, 1);
  assert.equal(report.byPathway.RN.count, 1);
});
