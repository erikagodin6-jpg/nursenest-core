import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  buildCompetencyFrameworkDashboard,
  buildLearnerCompetencyPassport,
  COMPETENCY_REGISTRY,
  DIGITAL_BADGES,
  listAvailableReadinessCertificates,
  listCompetenciesForProfession,
  listEarnedBadges,
  READINESS_CERTIFICATES,
  resolveCompetenciesForEducationalAsset,
  validateCompetencyRegistry,
  type CompetencyEvidence,
  type CompetencyProfession,
} from "@/lib/competencies/competency-registry";

const requiredProfessions: readonly CompetencyProfession[] = [
  "RN",
  "PN",
  "NP",
  "NEW_GRAD",
  "RESPIRATORY_THERAPY",
  "PARAMEDICINE",
  "MLT",
  "PT",
  "OT",
  "SOCIAL_WORK",
  "PSYCHOTHERAPY",
  "PSW",
];

describe("competency, badging, and digital credential framework", () => {
  it("defines valid competencies for every required profession", () => {
    assert.deepEqual(validateCompetencyRegistry(), []);

    for (const profession of requiredProfessions) {
      const competencies = listCompetenciesForProfession(profession);
      assert.ok(competencies.length > 0, `${profession} should have competency coverage`);
      assert.ok(
        competencies.every((competency) => competency.assessmentMethods.length > 0),
        `${profession} competencies should have assessment methods`,
      );
    }
  });

  it("maps educational assets to at least one competency through explicit ids or metadata", () => {
    const explicit = resolveCompetenciesForEducationalAsset({
      id: "lesson-med-safety",
      type: "lesson",
      competencyIds: ["rn_medication_safety"],
    });
    assert.equal(explicit[0]?.id, "rn_medication_safety");

    const inferred = resolveCompetenciesForEducationalAsset({
      id: "ecg-detective-demo",
      type: "ecg",
      profession: "RN",
      title: "ECG Foundations Detective Mode",
      tags: ["telemetry", "ecg"],
    });
    assert.ok(inferred.some((competency) => competency.id === "rn_ecg_foundations"));

    const fallback = resolveCompetenciesForEducationalAsset({
      id: "new-psw-lesson",
      type: "lesson",
      profession: "PSW",
      title: "New Resident Safety Lesson",
    });
    assert.ok(fallback.length >= 1);
    assert.equal(fallback[0]?.profession, "PSW");
  });

  it("builds learner competency passports with earned, in-progress, and attention states", () => {
    const evidence: CompetencyEvidence[] = [
      {
        competencyId: "rn_medication_safety",
        method: "knowledge",
        score: 0.92,
        sourceType: "question",
        sourceId: "q-1",
        completedAt: "2026-05-31T00:00:00.000Z",
      },
      {
        competencyId: "rn_medication_safety",
        method: "reasoning",
        score: 0.9,
        sourceType: "simulation",
        sourceId: "sim-1",
        completedAt: "2026-05-31T00:00:00.000Z",
      },
      {
        competencyId: "rn_medication_safety",
        method: "clinical_skill",
        score: 0.88,
        sourceType: "clinical_skill",
        sourceId: "skill-1",
        completedAt: "2026-05-31T00:00:00.000Z",
      },
      {
        competencyId: "rn_medication_safety",
        method: "documentation",
        score: 0.9,
        sourceType: "clinical_skill",
        sourceId: "doc-1",
        completedAt: "2026-05-31T00:00:00.000Z",
      },
      {
        competencyId: "rn_ecg_foundations",
        method: "knowledge",
        score: 0.7,
        sourceType: "ecg",
        sourceId: "ecg-1",
        completedAt: "2026-05-31T00:00:00.000Z",
      },
    ];

    const passport = buildLearnerCompetencyPassport({
      profession: "RN",
      evidence,
      previousOverallReadiness: 0.1,
      previousMasteryScore: 0.1,
    });

    assert.ok(passport.competenciesEarned.some((item) => item.competency.id === "rn_medication_safety"));
    assert.ok(passport.competenciesInProgress.some((item) => item.competency.id === "rn_ecg_foundations"));
    assert.ok(passport.competenciesRequiringAttention.length > 0);
    assert.equal(passport.readinessTrend, "improving");
    assert.equal(passport.masteryTrend, "improving");
  });

  it("keeps badges and readiness certificates evidence-based and non-licensure", () => {
    assert.ok(DIGITAL_BADGES.length >= 8);
    assert.ok(DIGITAL_BADGES.every((badge) => badge.evidenceBased));
    assert.ok(READINESS_CERTIFICATES.every((certificate) => certificate.disclaimer.includes("does not imply licensure")));

    const rnEvidence: CompetencyEvidence[] = COMPETENCY_REGISTRY
      .filter((competency) => competency.profession === "RN")
      .flatMap((competency) =>
        competency.assessmentMethods.map((method, index) => ({
          competencyId: competency.id,
          method,
          score: 0.92,
          sourceType: index % 2 === 0 ? "question" : "simulation",
          sourceId: `${competency.id}-${method}`,
          completedAt: "2026-05-31T00:00:00.000Z",
        }) satisfies CompetencyEvidence),
      );

    const passport = buildLearnerCompetencyPassport({
      profession: "RN",
      evidence: rnEvidence,
    });

    assert.ok(listEarnedBadges(passport).some((badge) => badge.id === "badge_medication_safety"));
    assert.ok(listAvailableReadinessCertificates(passport).some((certificate) => certificate.id === "certificate_nclex_rn_readiness"));
  });

  it("summarizes admin framework coverage for reporting and launch readiness", () => {
    const dashboard = buildCompetencyFrameworkDashboard();

    assert.equal(dashboard.competencyCoverage.professionsCovered, requiredProfessions.length);
    assert.equal(dashboard.badgeCoverage.totalBadges, DIGITAL_BADGES.length);
    assert.ok(dashboard.institutionalReadiness.supportedReports.includes("Competency Growth"));
    assert.ok(dashboard.institutionalReadiness.supportedReports.includes("Cohort Trends"));
    assert.ok(dashboard.launchReadiness.internalCertificateDisclaimer.includes("Internal NurseNest readiness indicator only"));
  });
});
