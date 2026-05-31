import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";

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
} from "../src/lib/seo/eeat-entity-authority-architecture";

const outPath = join(process.cwd(), "docs", "reports", "eeat-breadcrumb-entity-authority-architecture.md");
const dashboard = buildEeatEntityAuthorityDashboard();
const perfectScore = calculateInternalAuthorityScore({
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
const orphanRisk = detectOrphanAuthorityRisk({
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

const markdown = `# EEAT, Breadcrumb & Entity Authority Architecture

Generated: ${new Date().toISOString()}

## Objective

Transform NurseNest from a collection of pages into a healthcare authority network Google and AI search systems can understand. This architecture standardizes breadcrumbs, schema, EEAT fields, entity relationships, topical hierarchy, reviewer authority, organization authority, and orphan page remediation.

## Registry Summary

| Metric | Count |
| --- | ---: |
| Indexable page surfaces | ${dashboard.pageSurfaces} |
| Breadcrumb examples | ${dashboard.breadcrumbExamples} |
| Entity relationship seeds | ${dashboard.entityRelationships} |
| Authority layers | ${dashboard.authorityLayers} |
| Reviewer profile seeds | ${dashboard.reviewerProfiles} |
| Schema types | ${dashboard.schemaTypes} |
| DefinedTerm seeds | ${dashboard.definedTerms} |
| Organization authority ready | ${dashboard.organizationAuthorityReady ? "Yes" : "No"} |

## Breadcrumb Standard

Every indexable page must include visible breadcrumbs, BreadcrumbList schema, and a consistent hierarchy.

Indexable surfaces:

${INDEXABLE_PAGE_SURFACES.map((surface) => `- ${surface}`).join("\n")}

Schema breadcrumb surfaces:

${BREADCRUMB_SCHEMA_SURFACES.map((surface) => `- ${surface}`).join("\n")}

## Breadcrumb Examples

${BREADCRUMB_HIERARCHY_EXAMPLES.map((example) => `- ${example.label}: ${example.crumbs.join(" > ")}`).join("\n")}

## Entity Relationship Seeds

| Entity | Type | Related Entities | Supporting Content |
| --- | --- | --- | --- |
${ENTITY_RELATIONSHIP_SEEDS.map((seed) => `| ${seed.entity} | ${seed.entityType} | ${seed.relatedEntities.join(", ")} | ${seed.supportingContent.join(", ")} |`).join("\n")}

## Topical Authority Hierarchy

| Layer | Label | Examples |
| --- | --- | --- |
${TOPICAL_AUTHORITY_LAYERS.map((layer) => `| ${layer.layer} | ${layer.label} | ${layer.examples.join(", ")} |`).join("\n")}

## EEAT Required Fields

${EEAT_REQUIRED_FIELDS.map((field) => `- ${field}`).join("\n")}

## Reviewer Authority

| Reviewer | Credentials | Specialty | Bio | Pages Reviewed Metric |
| --- | --- | --- | --- | --- |
${REVIEWER_PROFILE_SEEDS.map((profile) => `| ${profile.displayName} | ${profile.credentials} | ${profile.specialty} | ${profile.bioRequired ? "Required" : "Optional"} | ${profile.pagesReviewedMetric ? "Required" : "Optional"} |`).join("\n")}

## Organization Authority

${Object.entries(ORGANIZATION_AUTHORITY_CONTRACT).map(([key, enabled]) => `- ${key}: ${enabled ? "required" : "not required"}`).join("\n")}

## Medical Content Schema

${MEDICAL_CONTENT_SCHEMA_TYPES.map((schema) => `- ${schema}`).join("\n")}

## DefinedTerm System

| Term | Schema | Related Entities |
| --- | --- | --- |
${DEFINED_TERM_SCHEMA_SEEDS.map((seed) => `| ${seed.term} | ${seed.schemaType} | ${seed.relatedEntities.join(", ")} |`).join("\n")}

## Internal Authority Score

Example full-coverage score:

| Metric | Score |
| --- | ---: |
| Breadcrumb Coverage | ${perfectScore.breadcrumbCoverage}% |
| Schema Coverage | ${perfectScore.schemaCoverage}% |
| Author Coverage | ${perfectScore.authorCoverage}% |
| Reviewer Coverage | ${perfectScore.reviewerCoverage}% |
| Entity Coverage | ${perfectScore.entityCoverage}% |
| Knowledge Graph Readiness | ${perfectScore.knowledgeGraphReadiness}% |
| Topical Authority Score | ${perfectScore.topicalAuthorityScore}% |
| EEAT Score | ${perfectScore.eeatScore}% |

## Orphan Page Detection

Example weak-page risk:

${Object.entries(orphanRisk).map(([key, value]) => `- ${key}: ${value ? "Yes" : "No"}`).join("\n")}

## AI Search Readiness

The standard supports:

- Entity clarity
- Structured definitions
- Strong hierarchy
- Semantic relationships
- Breadcrumb context
- Person and reviewer context
- Organization identity
- Internal link context

## Guardrails

- No indexable page should ship without visible breadcrumbs and BreadcrumbList schema.
- Clinical pages require author, reviewer, credentials, review date, update date, content type, and evidence sources.
- Entity relationships should be stored explicitly instead of relying only on visual links.
- Reviewer profiles should expose bio, credentials, specialty, and pages-reviewed metrics.
- Organization schema should include sameAs, educational focus, professional focus, healthcare focus, and SearchAction.
- Glossary terms should emit DefinedTerm schema where appropriate.
- Pages with weak hierarchy, weak breadcrumbs, weak entity connections, or weak internal links require remediation.
`;

await mkdir(dirname(outPath), { recursive: true });
await writeFile(outPath, markdown);
console.log(`Wrote ${outPath}`);
