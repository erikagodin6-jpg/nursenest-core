import assert from "node:assert/strict";
import test from "node:test";

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
  getKnowledgeGraphEntity,
  listEntityRelationships,
  scoreKnowledgeGraphEntity,
} from "@/lib/seo/healthcare-knowledge-graph-entity-network";

test("entity registry covers the requested healthcare knowledge graph categories", () => {
  for (const entityType of [
    "Disease",
    "Medication",
    "Lab",
    "Clinical Skill",
    "Procedure",
    "Certification",
    "Program",
    "School",
    "Career",
    "Employer",
    "Healthcare Profession",
    "Body System",
    "Specialty",
    "Simulation",
    "Question",
    "Lesson",
    "Flashcard",
    "Care Plan",
  ] as const) {
    assert.ok(KNOWLEDGE_GRAPH_ENTITY_TYPES.includes(entityType));
  }
});

test("Heart Failure disease network connects clinical concepts and learning assets", () => {
  const relationships = listEntityRelationships("disease-heart-failure");
  const targets = relationships.map((relationship) => relationship.targetId);

  assert.ok(targets.includes("disease-pulmonary-edema"));
  assert.ok(targets.includes("lab-bnp"));
  assert.ok(targets.includes("medication-furosemide"));
  assert.ok(targets.includes("topic-cardiac-output"));
  assert.ok(targets.includes("disease-afib"));
  assert.ok(targets.includes("skill-echocardiography"));
  assert.ok(targets.includes("careplan-heart-failure"));
  assert.ok(targets.includes("lesson-heart-failure"));
  assert.ok(targets.includes("simulation-heart-failure"));
  assert.ok(targets.includes("question-heart-failure"));
});

test("medication and lab networks preserve requested Furosemide and BNP relationships", () => {
  const furosemideTargets = listEntityRelationships("medication-furosemide").map((relationship) => relationship.targetId);
  const bnpTargets = listEntityRelationships("lab-bnp").map((relationship) => relationship.targetId);

  assert.ok(furosemideTargets.includes("disease-heart-failure"));
  assert.ok(furosemideTargets.includes("disease-pulmonary-edema"));
  assert.ok(furosemideTargets.includes("topic-fluid-overload"));
  assert.ok(furosemideTargets.includes("lab-potassium"));
  assert.ok(furosemideTargets.includes("skill-medication-administration"));
  assert.ok(furosemideTargets.includes("skill-medication-safety"));
  assert.ok(furosemideTargets.includes("topic-patient-education"));

  assert.ok(bnpTargets.includes("disease-heart-failure"));
  assert.ok(bnpTargets.includes("topic-cardiac-output"));
  assert.ok(bnpTargets.includes("disease-pulmonary-edema"));
  assert.ok(bnpTargets.includes("topic-volume-overload"));
  assert.ok(bnpTargets.includes("specialty-cardiology"));
  assert.ok(bnpTargets.includes("lesson-bnp-interpretation"));
  assert.ok(bnpTargets.includes("case-heart-failure-bnp"));
});

test("profession, certification, career, school, and employer networks are explicit", () => {
  assert.equal(getKnowledgeGraphEntity("profession-nursing")?.entityType, "Healthcare Profession");
  assert.equal(getKnowledgeGraphEntity("profession-rt")?.entityType, "Healthcare Profession");
  assert.equal(getKnowledgeGraphEntity("certification-nclex")?.entityType, "Certification");
  assert.equal(getKnowledgeGraphEntity("career-rn")?.entityType, "Career");
  assert.equal(getKnowledgeGraphEntity("program-mcmaster-nursing")?.entityType, "Program");
  assert.equal(getKnowledgeGraphEntity("employer-hamilton-health-sciences")?.entityType, "Employer");

  assert.ok(listEntityRelationships("certification-nclex").some((relationship) => relationship.targetId === "topic-readiness"));
  assert.ok(listEntityRelationships("career-rn").some((relationship) => relationship.targetId === "topic-nursing-interview"));
  assert.ok(listEntityRelationships("program-mcmaster-nursing").some((relationship) => relationship.targetId === "school-mcmaster"));
  assert.ok(listEntityRelationships("employer-hamilton-health-sciences").some((relationship) => relationship.targetId === "topic-new-grad-programs"));
});

test("internal link graph groups related entities by SEO surface", () => {
  const graph = buildInternalLinkGraph("disease-heart-failure");

  for (const group of INTERNAL_LINK_GROUPS) {
    assert.ok(Array.isArray(graph[group]));
  }

  assert.ok(graph["Related Diseases"].some((entity) => entity.id === "disease-pulmonary-edema"));
  assert.ok(graph["Related Medications"].some((entity) => entity.id === "medication-furosemide"));
});

test("schema expansion includes medical, educational, breadcrumb, article, and search schema types", () => {
  for (const schemaType of ["DefinedTerm", "MedicalCondition", "Drug", "Person", "Organization", "EducationalOrganization", "Course", "FAQPage", "Review", "BreadcrumbList", "Article", "WebSite", "SearchAction"] as const) {
    assert.ok(KNOWLEDGE_GRAPH_SCHEMA_TYPES.includes(schemaType));
  }
});

test("orphan detection flags weak entities and leaves seeded registry clean", () => {
  assert.deepEqual(detectOrphanEntities(), []);

  const weak = detectOrphanEntities([
    {
      id: "weak-topic",
      name: "Weak Topic",
      entityType: "Disease",
      canonicalPath: "",
      aliases: [],
      definitionRequired: false,
      schemaTypes: ["Article"],
      authorityClusters: ["Cardiology"],
      relationships: [],
    },
  ]);

  assert.equal(weak.length, 1);
  assert.equal(weak[0]?.requiresRemediation, true);
  assert.equal(weak[0]?.weakRelationships, true);
  assert.equal(weak[0]?.missingCanonicalPath, true);
  assert.equal(weak[0]?.missingDefinition, true);
  assert.equal(weak[0]?.weakSchema, true);
});

test("topical authority scoring covers requested executive clusters", () => {
  const scores = calculateTopicalAuthorityScores();
  const clusters = scores.map((score) => score.cluster);

  for (const cluster of TOPICAL_AUTHORITY_CLUSTERS) {
    assert.ok(clusters.includes(cluster));
  }

  assert.ok(scores.find((score) => score.cluster === "Cardiology")?.relationshipCount);
  assert.ok(scores.find((score) => score.cluster === "RT")?.entityCount);
});

test("knowledge graph dashboard summarizes relationships, authority, and AI retrieval readiness", () => {
  const heartFailure = getKnowledgeGraphEntity("disease-heart-failure");
  assert.ok(heartFailure);
  assert.ok(scoreKnowledgeGraphEntity(heartFailure).authorityScore >= 90);

  const dashboard = buildKnowledgeGraphDashboard();
  assert.equal(dashboard.entityTypes, KNOWLEDGE_GRAPH_ENTITY_TYPES.length);
  assert.equal(dashboard.schemaTypes, KNOWLEDGE_GRAPH_SCHEMA_TYPES.length);
  assert.equal(dashboard.authorityClusters, TOPICAL_AUTHORITY_CLUSTERS.length);
  assert.equal(dashboard.orphanEntities, 0);
  assert.ok(dashboard.entityCount >= 10);
  assert.ok(dashboard.relationshipCount > dashboard.entityCount * 3);
  assert.ok(dashboard.averageAuthorityScore >= 80);
  assert.equal(dashboard.aiRetrievalOptimizationReady, true);
});

test("all seeded relationships include evidence strings for review and AI retrieval context", () => {
  for (const entity of KNOWLEDGE_GRAPH_ENTITIES) {
    for (const relationship of entity.relationships) {
      assert.ok(relationship.evidence.length > 20);
    }
  }
});
