import assert from "node:assert/strict";
import test from "node:test";
import {
  auditContentFreshnessClinicalCurrencyItem,
  buildContentFreshnessClinicalCurrencyReport,
  classifyClinicalVolatility,
  type ClinicalCurrencyContentItem,
} from "@/lib/content-quality/content-freshness-clinical-currency-engine";

const now = "2026-05-29T00:00:00.000Z";

const currentDocumentationLesson: ClinicalCurrencyContentItem = {
  id: "lesson-documentation-sbar",
  contentType: "lesson",
  title: "SBAR documentation basics",
  pathway: "NewGrad",
  tier: "NewGrad",
  topic: "Communication",
  clinicalSpecialty: "Professional Practice",
  body: "Professional documentation and communication patterns for handoff.",
  createdAt: "2025-01-01T00:00:00.000Z",
  updatedAt: "2026-02-01T00:00:00.000Z",
  lastReviewedAt: "2026-02-15T00:00:00.000Z",
  reviewer: "Clinical educator",
  references: [
    {
      title: "Professional communication standard",
      qualityLevel: "professional_association",
      publicationYear: 2024,
      lastValidatedAt: "2026-02-15T00:00:00.000Z",
      accessStatus: "accessible",
    },
  ],
};

test("CFCCE assigns review cycles from volatility classification", () => {
  const low = auditContentFreshnessClinicalCurrencyItem(currentDocumentationLesson, { generatedAt: now });
  const moderate = auditContentFreshnessClinicalCurrencyItem(
    {
      ...currentDocumentationLesson,
      id: "lesson-assessment",
      topic: "Health Assessment",
      body: "Assessment, care planning, and patient education for stable presentations.",
      explicitVolatility: "moderate",
    },
    { generatedAt: now },
  );
  const high = auditContentFreshnessClinicalCurrencyItem(
    {
      ...currentDocumentationLesson,
      id: "pharm-insulin",
      contentType: "pharmacology",
      topic: "Diabetes Pharmacology",
      body: "Insulin safety, hypoglycemia, monitoring, contraindications, and high-alert medication teaching.",
    },
    { generatedAt: now },
  );

  assert.equal(classifyClinicalVolatility(currentDocumentationLesson), "low");
  assert.equal(low.reviewCadenceMonths, 36);
  assert.equal(moderate.reviewCadenceMonths, 24);
  assert.equal(high.reviewCadenceMonths, 12);
});

test("CFCCE keeps recently reviewed low-volatility content current", () => {
  const audit = auditContentFreshnessClinicalCurrencyItem(currentDocumentationLesson, { generatedAt: now });

  assert.equal(audit.status, "current");
  assert.equal(audit.volatility, "low");
  assert.equal(audit.freshnessScore >= 85, true);
  assert.equal(audit.referenceFlags.length, 0);
});

test("CFCCE escalates stale high-risk pharmacology content with missing safety elements", () => {
  const audit = auditContentFreshnessClinicalCurrencyItem(
    {
      id: "pharm-warfarin",
      contentType: "pharmacology",
      title: "Warfarin monitoring",
      pathway: "RN",
      tier: "RN",
      topic: "Anticoagulants",
      clinicalSpecialty: "Pharmacology",
      body: "Warfarin teaching overview.",
      createdAt: "2021-01-01T00:00:00.000Z",
      updatedAt: "2022-01-01T00:00:00.000Z",
      lastReviewedAt: "2022-04-01T00:00:00.000Z",
      reviewer: "Clinical educator",
      references: [
        {
          title: "Old anticoagulation article",
          qualityLevel: "peer_reviewed_article",
          publicationYear: 2019,
          lastValidatedAt: "2022-04-01T00:00:00.000Z",
          accessStatus: "accessible",
        },
      ],
      pharmacology: {
        drugClasses: ["Anticoagulants"],
        indications: ["Thromboembolism prevention"],
        teachingPoints: ["Take at the same time daily"],
      },
    },
    { generatedAt: now },
  );

  assert.equal(audit.status, "critical_review_required");
  assert.equal(audit.volatility, "high");
  assert.equal(audit.referenceFlags.includes("outdated_reference"), true);
  assert.equal(audit.pharmacologyFlags.includes("missing_monitoring_guidance"), true);
  assert.equal(audit.pharmacologyFlags.includes("missing_contraindications"), true);
  assert.equal(audit.pharmacologyFlags.includes("missing_safety_information"), true);
  assert.equal(audit.pharmacologyFlags.includes("potentially_outdated_medication_guidance"), true);
});

test("CFCCE flags broken, duplicate, low-quality, and outdated references", () => {
  const report = buildContentFreshnessClinicalCurrencyReport(
    [
      {
        id: "question-sepsis",
        contentType: "question",
        title: "Sepsis escalation",
        pathway: "RN",
        tier: "RN",
        topic: "Sepsis",
        clinicalSpecialty: "Emergency Care",
        body: "Recognize sepsis deterioration and escalation priorities.",
        createdAt: "2023-01-01T00:00:00.000Z",
        updatedAt: "2024-01-01T00:00:00.000Z",
        lastReviewedAt: "2024-01-01T00:00:00.000Z",
        reviewer: "Clinical educator",
        references: [
          {
            title: "Sepsis guideline",
            url: "https://example.invalid/sepsis",
            qualityLevel: "primary_guideline",
            publicationYear: 2020,
            accessStatus: "broken",
            lastValidatedAt: "2024-01-01T00:00:00.000Z",
          },
          {
            title: "Sepsis guideline",
            url: "https://example.invalid/sepsis",
            qualityLevel: "primary_guideline",
            publicationYear: 2020,
            accessStatus: "broken",
            lastValidatedAt: "2024-01-01T00:00:00.000Z",
          },
          {
            title: "Sepsis blog summary",
            url: "https://example.invalid/blog",
            qualityLevel: "low_quality_web_source",
            publicationYear: 2016,
            accessStatus: "accessible",
          },
        ],
      },
      currentDocumentationLesson,
    ],
    { generatedAt: now },
  );

  assert.equal(report.totalItems, 2);
  assert.equal(report.dashboard.brokenReferences, 1);
  assert.equal(report.dashboard.duplicateReferences, 1);
  assert.equal(report.dashboard.lowQualityReferences, 1);
  assert.equal(report.dashboard.outdatedReferences, 1);
  assert.equal(report.referenceQueues.broken.some((item) => item.itemId === "question-sepsis"), true);
  assert.equal(report.referenceQueues.outdated.some((item) => item.itemId === "question-sepsis"), true);
});

test("CFCCE identifies ECG currency gaps and dashboard alert counts", () => {
  const report = buildContentFreshnessClinicalCurrencyReport(
    [
      {
        id: "ecg-pacemaker",
        contentType: "ecg",
        title: "Pacemaker failure recognition",
        pathway: "ECGAdvanced",
        tier: "AdvancedECG",
        topic: "Pacemakers",
        clinicalSpecialty: "ECG",
        body: "Pacemaker rhythm recognition and nursing escalation.",
        createdAt: "2020-01-01T00:00:00.000Z",
        updatedAt: "2021-01-01T00:00:00.000Z",
        lastReviewedAt: "2021-01-01T00:00:00.000Z",
        references: [
          {
            title: "ECG professional association guide",
            qualityLevel: "professional_association",
            publicationYear: 2021,
            accessStatus: "accessible",
            lastValidatedAt: "2021-01-01T00:00:00.000Z",
          },
        ],
        ecg: {
          pacemaker: false,
          twelveLead: false,
          interpretationPractice: false,
        },
      },
      currentDocumentationLesson,
    ],
    { generatedAt: now },
  );

  const ecg = report.items.find((item) => item.id === "ecg-pacemaker");
  assert.ok(ecg);
  assert.equal(ecg.status, "critical_review_required");
  assert.equal(ecg.ecgFlags.includes("incomplete_pacemaker_coverage"), true);
  assert.equal(ecg.ecgFlags.includes("incomplete_12_lead_coverage"), true);
  assert.equal(ecg.ecgFlags.includes("missing_interpretation_practice"), true);
  assert.equal(report.dashboard.alertCounts.ecg_review_needed, 1);
  assert.equal(report.reviewQueues.critical_clinical_review.some((item) => item.itemId === "ecg-pacemaker"), true);
});

test("CFCCE builds executive dashboard percentages and review queues", () => {
  const report = buildContentFreshnessClinicalCurrencyReport(
    [
      currentDocumentationLesson,
      {
        id: "critical-missing-ref",
        contentType: "clinical_skill",
        title: "Septic shock rapid response",
        pathway: "NewGrad",
        tier: "NewGrad",
        topic: "Sepsis",
        clinicalSpecialty: "Emergency Care",
        body: "Septic shock rapid response and escalation.",
        createdAt: "2022-01-01T00:00:00.000Z",
        updatedAt: "2022-01-01T00:00:00.000Z",
        clinicalRisk: "critical",
        guidelineSensitivity: "high",
        references: [],
      },
      {
        id: "soon-review",
        contentType: "blog_post",
        title: "Professionalism study tips",
        pathway: "Marketing",
        tier: "Public",
        topic: "Professionalism",
        createdAt: "2023-01-01T00:00:00.000Z",
        updatedAt: "2024-01-01T00:00:00.000Z",
        lastReviewedAt: "2023-07-01T00:00:00.000Z",
        references: [
          {
            title: "Professionalism textbook",
            qualityLevel: "textbook",
            publicationYear: 2021,
            accessStatus: "accessible",
          },
        ],
      },
    ],
    { generatedAt: now },
  );

  assert.equal(report.totalItems, 3);
  assert.equal(report.dashboard.currentContentPercent, 33.3);
  assert.equal(report.dashboard.criticalReviewPercent, 33.3);
  assert.equal(report.dashboard.contentWithoutReferences, 1);
  assert.equal(report.reviewQueues.critical_clinical_review.some((item) => item.itemId === "critical-missing-ref"), true);
  assert.equal(report.dashboard.alertCounts.clinical_currency_risk >= 1, true);
  assert.equal(report.byPathway.NewGrad.count, 2);
  assert.equal(report.byTopic.Sepsis.critical, 1);
});
