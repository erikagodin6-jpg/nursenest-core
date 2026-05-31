import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";

import {
  INTERNAL_LINK_GROUPS,
  KNOWLEDGE_GRAPH_ENTITIES,
  KNOWLEDGE_GRAPH_ENTITY_TYPES,
  KNOWLEDGE_GRAPH_SCHEMA_TYPES,
  TOPICAL_AUTHORITY_CLUSTERS,
  buildInternalLinkGraph,
  buildKnowledgeGraphDashboard,
  calculateTopicalAuthorityScores,
  detectOrphanEntities,
  scoreKnowledgeGraphEntity,
} from "../src/lib/seo/healthcare-knowledge-graph-entity-network";

const outPath = join(process.cwd(), "docs", "reports", "healthcare-knowledge-graph-entity-network.md");
const dashboard = buildKnowledgeGraphDashboard();
const topicalScores = calculateTopicalAuthorityScores();
const orphanEntities = detectOrphanEntities();
const heartFailureLinks = buildInternalLinkGraph("disease-heart-failure");

const markdown = `# Healthcare Knowledge Graph & Entity Network

Generated: ${new Date().toISOString()}

## Objective

Create a structured healthcare knowledge graph that helps Google, AI Overviews, ChatGPT, Gemini, Perplexity, Claude, Bing, and future retrieval systems understand what NurseNest knows, how topics connect, where expertise exists, and which entities are authoritative.

## Dashboard

| Metric | Value |
| --- | ---: |
| Entity count | ${dashboard.entityCount} |
| Relationship count | ${dashboard.relationshipCount} |
| Entity type registry | ${dashboard.entityTypes} |
| Schema types | ${dashboard.schemaTypes} |
| Authority clusters | ${dashboard.authorityClusters} |
| Orphan entities | ${dashboard.orphanEntities} |
| Internal link groups | ${dashboard.internalLinkGroups} |
| Average authority score | ${dashboard.averageAuthorityScore}% |
| AI retrieval optimization ready | ${dashboard.aiRetrievalOptimizationReady ? "Yes" : "No"} |

## Entity Registry

${KNOWLEDGE_GRAPH_ENTITY_TYPES.map((entityType) => `- ${entityType}`).join("\n")}

## Canonical Entity Seeds

| Entity | Type | Canonical Path | Aliases | Clusters | Relationships | Authority Score |
| --- | --- | --- | --- | --- | ---: | ---: |
${KNOWLEDGE_GRAPH_ENTITIES.map((entity) => {
  const score = scoreKnowledgeGraphEntity(entity);
  return `| ${entity.name} | ${entity.entityType} | ${entity.canonicalPath} | ${entity.aliases.join(", ") || "-"} | ${entity.authorityClusters.join(", ")} | ${entity.relationships.length} | ${score.authorityScore}% |`;
}).join("\n")}

## Disease Network Example: Heart Failure

| Target | Relationship | Evidence |
| --- | --- | --- |
${(KNOWLEDGE_GRAPH_ENTITIES.find((entity) => entity.id === "disease-heart-failure")?.relationships ?? []).map((relationship) => {
  const target = KNOWLEDGE_GRAPH_ENTITIES.find((entity) => entity.id === relationship.targetId);
  return `| ${target?.name ?? relationship.targetId} | ${relationship.type} | ${relationship.evidence} |`;
}).join("\n")}

## Medication Network Example: Furosemide

| Target | Relationship | Evidence |
| --- | --- | --- |
${(KNOWLEDGE_GRAPH_ENTITIES.find((entity) => entity.id === "medication-furosemide")?.relationships ?? []).map((relationship) => {
  const target = KNOWLEDGE_GRAPH_ENTITIES.find((entity) => entity.id === relationship.targetId);
  return `| ${target?.name ?? relationship.targetId} | ${relationship.type} | ${relationship.evidence} |`;
}).join("\n")}

## Lab Network Example: BNP

| Target | Relationship | Evidence |
| --- | --- | --- |
${(KNOWLEDGE_GRAPH_ENTITIES.find((entity) => entity.id === "lab-bnp")?.relationships ?? []).map((relationship) => {
  const target = KNOWLEDGE_GRAPH_ENTITIES.find((entity) => entity.id === relationship.targetId);
  return `| ${target?.name ?? relationship.targetId} | ${relationship.type} | ${relationship.evidence} |`;
}).join("\n")}

## Internal Link Graph

Every public authority page should be able to surface the following related-content groups:

${INTERNAL_LINK_GROUPS.map((group) => `- ${group}`).join("\n")}

Heart Failure generated link groups:

${Object.entries(heartFailureLinks).map(([group, entities]) => `- ${group}: ${entities.map((entity) => entity.name).join(", ") || "No matched canonical entity yet"}`).join("\n")}

## Schema Expansion

${KNOWLEDGE_GRAPH_SCHEMA_TYPES.map((schemaType) => `- ${schemaType}`).join("\n")}

## Topical Authority Scores

| Cluster | Entity Count | Relationship Count | Average Authority | Weak Relationship Entities |
| --- | ---: | ---: | ---: | ---: |
${topicalScores.map((score) => `| ${score.cluster} | ${score.entityCount} | ${score.relationshipCount} | ${score.averageAuthorityScore}% | ${score.missingRelationshipCount} |`).join("\n")}

## Orphan Detection

${orphanEntities.length === 0 ? "No seeded orphan entities detected." : orphanEntities.map((risk) => `- ${risk.entityName}: remediation required`).join("\n")}

## AI Retrieval Optimization

The graph stores:

- Canonical entity IDs
- Canonical paths
- Entity aliases
- Entity types
- Schema types
- Evidence-backed relationships
- Authority clusters
- Internal link groups
- Orphan entity signals
- Topical authority scores

## Governance

- Relationship evidence is required so links are meaningful, not random.
- Entity pages should expose definitions, schema, breadcrumbs, and related entities.
- Orphan entities require remediation before publication.
- Internal links should be generated from stored relationships instead of manually hardcoded page lists.
- Topical authority scores should guide SEO, content expansion, and AI retrieval priorities.
`;

await mkdir(dirname(outPath), { recursive: true });
await writeFile(outPath, markdown);
console.log(`Wrote ${outPath}`);
