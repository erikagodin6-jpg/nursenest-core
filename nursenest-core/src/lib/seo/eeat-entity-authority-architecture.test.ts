import assert from "node:assert/strict";
import test from "node:test";

import {
  BREADCRUMB_HIERARCHY_EXAMPLES,
  BREADCRUMB_SCHEMA_SURFACES,
  DEFINED_TERM_SCHEMA_SEEDS,
  EEAT_REQUIRED_FIELDS,
  ENTITY_RELATIONSHIP_SEEDS,
  INDEXABLE_PAGE_SURFACES,
  MEDICAL_CONTENT_SCHEMA_TYPES,
  ORGANIZATION_AUTHORITY_CONTRACT,
  REVIEWER_PROFILE_SEEDS,
  TOPICAL_AUTHORITY_LAYERS,
  buildEeatEntityAuthorityDashboard,
  calculateInternalAuthorityScore,
  detectOrphanAuthorityRisk,
} from "./eeat-entity-authority-architecture";

test("every requested indexable page surface requires breadcrumbs", () => {
  for (const surface of [
    "Lessons",
    "Disease Pages",
    "Medication Pages",
    "Care Plans",
    "Clinical Skills",
    "Career Guides",
    "School Pages",
    "Certification Pages",
    "Interview Pages",
    "Placement Pages",
    "Allied Health Pages",
    "NP Pages",
  ]) {
    assert.ok(INDEXABLE_PAGE_SURFACES.includes(surface), `${surface} missing`);
    assert.ok(BREADCRUMB_SCHEMA_SURFACES.includes(surface), `${surface} missing schema coverage`);
  }
});

test("breadcrumb hierarchy examples cover clinical, allied, admissions, and career paths", () => {
  assert.deepEqual(BREADCRUMB_HIERARCHY_EXAMPLES[0]?.crumbs, ["Homepage", "Nursing", "RN", "Cardiovascular", "Heart Failure", "Heart Failure Nursing Care Plan"]);
  assert.ok(BREADCRUMB_HIERARCHY_EXAMPLES.some((example) => example.crumbs.includes("Respiratory Therapy") && example.crumbs.includes("PEEP")));
  assert.ok(BREADCRUMB_HIERARCHY_EXAMPLES.some((example) => example.crumbs.includes("ATI TEAS") && example.crumbs.includes("Anatomy")));
  assert.ok(BREADCRUMB_HIERARCHY_EXAMPLES.some((example) => example.crumbs.includes("Career Center") && example.crumbs.includes("RN Salary Ontario")));
});

test("entity relationships store knowledge graph links beyond plain hyperlinks", () => {
  const heartFailure = ENTITY_RELATIONSHIP_SEEDS.find((seed) => seed.entity === "Heart Failure");
  assert.ok(heartFailure);
  assert.equal(heartFailure.entityType, "Disease");
  for (const related of ["BNP", "Furosemide", "Pulmonary Edema", "Echocardiogram", "Cardiac Output", "AFib"]) {
    assert.ok(heartFailure.relatedEntities.includes(related), `${related} missing`);
  }
  assert.ok(heartFailure.supportingContent.includes("Heart Failure Care Plan"));
  assert.ok(heartFailure.supportingContent.includes("Heart Failure Simulation"));
  assert.ok(heartFailure.supportingContent.includes("Heart Failure Questions"));
});

test("topical authority hierarchy includes all requested layers", () => {
  const layers = TOPICAL_AUTHORITY_LAYERS.map((node) => node.layer);
  assert.deepEqual(layers, ["profession", "certification", "body_system", "topic", "supporting_content"]);
  assert.ok(TOPICAL_AUTHORITY_LAYERS[0]?.examples.includes("Nursing"));
  assert.ok(TOPICAL_AUTHORITY_LAYERS[1]?.examples.includes("NCLEX"));
  assert.ok(TOPICAL_AUTHORITY_LAYERS[2]?.examples.includes("Cardiovascular"));
  assert.ok(TOPICAL_AUTHORITY_LAYERS[3]?.examples.includes("Sepsis"));
  assert.ok(TOPICAL_AUTHORITY_LAYERS[4]?.examples.includes("Simulations"));
});

test("EEAT required fields include author, reviewer, dates, content type, and evidence", () => {
  for (const field of ["author", "author_credentials", "reviewer", "reviewer_credentials", "review_date", "update_date", "content_type", "evidence_sources"]) {
    assert.ok(EEAT_REQUIRED_FIELDS.includes(field), `${field} missing`);
  }
});

test("reviewer profiles cover requested reviewer professions", () => {
  const credentials = new Set(REVIEWER_PROFILE_SEEDS.map((profile) => profile.credentials));
  for (const credential of ["RN", "NP", "RT", "Paramedic", "OT", "PT", "MLT"]) {
    assert.ok(credentials.has(credential), `${credential} missing`);
  }
  assert.ok(REVIEWER_PROFILE_SEEDS.every((profile) => profile.bioRequired && profile.pagesReviewedMetric));
});

test("organization authority contract requires sameAs and business/education/professional/healthcare focus", () => {
  assert.equal(ORGANIZATION_AUTHORITY_CONTRACT.organizationSchema, true);
  assert.equal(ORGANIZATION_AUTHORITY_CONTRACT.websiteSchema, true);
  assert.equal(ORGANIZATION_AUTHORITY_CONTRACT.searchAction, true);
  assert.equal(ORGANIZATION_AUTHORITY_CONTRACT.educationalOrganizationSchema, true);
  assert.equal(ORGANIZATION_AUTHORITY_CONTRACT.sameAsRequired, true);
  assert.equal(ORGANIZATION_AUTHORITY_CONTRACT.businessInformationRequired, true);
  assert.equal(ORGANIZATION_AUTHORITY_CONTRACT.educationalFocusRequired, true);
  assert.equal(ORGANIZATION_AUTHORITY_CONTRACT.professionalFocusRequired, true);
  assert.equal(ORGANIZATION_AUTHORITY_CONTRACT.healthcareFocusRequired, true);
});

test("medical content schema registry includes requested schema types", () => {
  for (const schema of ["MedicalWebPage", "Article", "FAQPage", "BreadcrumbList", "Organization", "WebSite", "SearchAction", "EducationalOrganization", "Course", "HowTo", "DefinedTerm", "Review", "Person"]) {
    assert.ok(MEDICAL_CONTENT_SCHEMA_TYPES.includes(schema), `${schema} missing`);
  }
});

test("defined term system supports glossary terms with DefinedTerm schema", () => {
  const terms = new Set(DEFINED_TERM_SCHEMA_SEEDS.map((seed) => seed.term));
  for (const term of ["Preload", "Afterload", "PEEP", "ABG", "Cardiac Output", "COPD", "Sepsis"]) {
    assert.ok(terms.has(term), `${term} missing`);
  }
  assert.ok(DEFINED_TERM_SCHEMA_SEEDS.every((seed) => seed.schemaType === "DefinedTerm"));
});

test("internal authority scoring rewards breadcrumbs, schema, EEAT, entities, and links", () => {
  const score = calculateInternalAuthorityScore({
    visibleBreadcrumbs: true,
    schemaBreadcrumbs: true,
    consistentHierarchy: true,
    authorDisplayed: true,
    authorCredentialsDisplayed: true,
    reviewerDisplayed: true,
    reviewerCredentialsDisplayed: true,
    reviewDateDisplayed: true,
    updateDateDisplayed: true,
    evidenceSourcesDisplayed: true,
    entityRelationshipsStored: true,
    internalLinks: 18,
    schemaTypes: ["MedicalWebPage", "Article", "FAQPage", "BreadcrumbList", "Organization"],
  });
  assert.deepEqual(score, {
    breadcrumbCoverage: 100,
    schemaCoverage: 100,
    authorCoverage: 100,
    reviewerCoverage: 100,
    entityCoverage: 100,
    knowledgeGraphReadiness: 100,
    topicalAuthorityScore: 100,
    eeatScore: 100,
  });
});

test("orphan page detection flags weak hierarchy, breadcrumbs, entities, and links", () => {
  const risk = detectOrphanAuthorityRisk({
    visibleBreadcrumbs: false,
    schemaBreadcrumbs: false,
    consistentHierarchy: false,
    authorDisplayed: true,
    authorCredentialsDisplayed: true,
    reviewerDisplayed: false,
    reviewerCredentialsDisplayed: false,
    reviewDateDisplayed: false,
    updateDateDisplayed: true,
    evidenceSourcesDisplayed: false,
    entityRelationshipsStored: false,
    internalLinks: 2,
    schemaTypes: ["Article"],
  });
  assert.equal(risk.weakHierarchy, true);
  assert.equal(risk.weakBreadcrumbStructure, true);
  assert.equal(risk.weakEntityConnections, true);
  assert.equal(risk.weakInternalLinks, true);
  assert.equal(risk.requiresRemediation, true);
});

test("dashboard reports authority architecture coverage", () => {
  const dashboard = buildEeatEntityAuthorityDashboard();
  assert.equal(dashboard.pageSurfaces, INDEXABLE_PAGE_SURFACES.length);
  assert.equal(dashboard.breadcrumbExamples, BREADCRUMB_HIERARCHY_EXAMPLES.length);
  assert.equal(dashboard.entityRelationships, ENTITY_RELATIONSHIP_SEEDS.length);
  assert.equal(dashboard.authorityLayers, TOPICAL_AUTHORITY_LAYERS.length);
  assert.equal(dashboard.reviewerProfiles, REVIEWER_PROFILE_SEEDS.length);
  assert.equal(dashboard.schemaTypes, MEDICAL_CONTENT_SCHEMA_TYPES.length);
  assert.equal(dashboard.definedTerms, DEFINED_TERM_SCHEMA_SEEDS.length);
  assert.equal(dashboard.organizationAuthorityReady, true);
});
