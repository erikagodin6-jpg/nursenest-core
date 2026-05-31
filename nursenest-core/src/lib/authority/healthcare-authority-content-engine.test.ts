import assert from "node:assert/strict";
import test from "node:test";
import {
  AUTHORITY_CATEGORY_META,
  AUTHORITY_CONTENT_PHASE_TARGETS,
  CLINICAL_AUTHORITY_MINIMUM_PUBLICATION_SCORE,
  CLINICAL_AUTHORITY_STANDARD,
  buildAuthorityContentDashboard,
  buildAuthorityJsonLd,
  getAuthorityPage,
  getAuthorityPages,
  getAuthorityPagesByCategory,
  listAuthorityContentPaths,
  searchAuthorityContent,
  validateClinicalAuthorityStandard,
  validateAuthorityPage,
} from "@/lib/authority/healthcare-authority-content-engine";

test("authority content engine exposes every required library category", () => {
  assert.deepEqual(Object.keys(AUTHORITY_CATEGORY_META).sort(), [
    "allied-careers",
    "allied-study",
    "care-plans",
    "certifications",
    "clinical-skills",
    "conditions",
    "interview-prep",
    "labs",
    "medications",
    "placements",
  ]);
});

test("authority pages include EEAT governance and pass the quality gate", () => {
  const pages = getAuthorityPages();
  assert.ok(pages.length >= 10);

  for (const page of pages) {
    assert.ok(page.reviewer.name);
    assert.ok(page.reviewer.credentials);
    assert.ok(page.governance.updatedAt);
    assert.ok(page.governance.reviewCycleDue);
    assert.ok(page.references.length >= 2);
    assert.ok(page.related.length >= 3);

    const quality = validateAuthorityPage(page);
    assert.equal(quality.publishReady, true, `${page.slug}: ${quality.issues.join(", ")}`);
    assert.ok(quality.score >= 85);
  }
});

test("clinical authority standard enforces depth, completeness, and 90-point publication threshold", () => {
  assert.equal(CLINICAL_AUTHORITY_MINIMUM_PUBLICATION_SCORE, 90);
  assert.equal(CLINICAL_AUTHORITY_STANDARD.conditions.wordTarget.min, 3000);
  assert.equal(CLINICAL_AUTHORITY_STANDARD.medications.wordTarget.min, 2500);
  assert.equal(CLINICAL_AUTHORITY_STANDARD["care-plans"].wordTarget.min, 2000);
  assert.equal(CLINICAL_AUTHORITY_STANDARD["clinical-skills"].wordTarget.min, 2500);
  assert.equal(CLINICAL_AUTHORITY_STANDARD.certifications.wordTarget.min, 4000);

  const heartFailure = getAuthorityPage("conditions", "heart-failure");
  assert.ok(heartFailure);
  const audit = validateClinicalAuthorityStandard(heartFailure);
  assert.equal(audit.minimumPublicationScore, 90);
  assert.equal(audit.publishReady, false);
  assert.ok(audit.wordCount < CLINICAL_AUTHORITY_STANDARD.conditions.wordTarget.min);
  assert.ok(audit.issues.includes("below_minimum_depth_target"));
  assert.ok(audit.missingElements.includes("Why This Matters Clinically"));
});

test("every authority library has a live seed page and phase-one target", () => {
  for (const category of Object.keys(AUTHORITY_CATEGORY_META)) {
    const pages = getAuthorityPagesByCategory(category as keyof typeof AUTHORITY_CATEGORY_META);
    assert.ok(pages.length > 0, `${category} should have at least one seed page`);
    assert.ok(AUTHORITY_CONTENT_PHASE_TARGETS[category as keyof typeof AUTHORITY_CATEGORY_META].phaseOneTarget > pages.length);
  }
});

test("authority search supports synonyms and medical shorthand", () => {
  assert.equal(searchAuthorityContent("CHF")[0]?.slug, "heart-failure");
  assert.equal(searchAuthorityContent("Lasix")[0]?.slug, "furosemide");
  assert.equal(searchAuthorityContent("K+")[0]?.slug, "potassium");
  assert.equal(searchAuthorityContent("respiratory therapist Canada")[0]?.slug, "respiratory-therapist-canada");
  assert.equal(searchAuthorityContent("NCLEX-RN")[0]?.slug, "nclex-rn-study-guide");
});

test("authority detail pages can emit MedicalWebPage, FAQ, Article, and Organization schema", () => {
  const page = getAuthorityPage("conditions", "heart-failure");
  assert.ok(page);

  const graph = buildAuthorityJsonLd(page);
  assert.equal(graph[0]["@type"], "MedicalWebPage");
  assert.equal(graph[1]["@type"], "FAQPage");
  assert.equal(graph[2]["@type"], "Article");
  assert.equal(graph[3]["@type"], "Organization");
  assert.match(JSON.stringify(graph), /Heart Failure/);
  assert.match(JSON.stringify(graph), /NurseNest/);
});

test("authority dashboard tracks content targets and sitemap paths", () => {
  const dashboard = buildAuthorityContentDashboard();
  assert.equal(dashboard.totalPublishedPages, getAuthorityPages().length);
  assert.equal(dashboard.totalPhaseOneTarget, 2650);
  assert.ok(dashboard.totalLongTermTarget >= 12000);
  assert.equal(dashboard.rows.length, Object.keys(AUTHORITY_CATEGORY_META).length);
  assert.ok(dashboard.rows.every((row) => row.eeatCoverage === 100));
  assert.ok(dashboard.rows.every((row) => row.clinicalAuthorityCoverage === 0));
  assert.ok(dashboard.rows.every((row) => row.averageClinicalAuthorityScore < 90));

  const paths = listAuthorityContentPaths();
  assert.ok(paths.includes("/healthcare"));
  assert.ok(paths.includes("/healthcare/conditions/heart-failure"));
  assert.ok(paths.includes("/healthcare/certifications/nclex-rn-study-guide"));
});
