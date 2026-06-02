import assert from "node:assert/strict";
import test from "node:test";

import {
  AI_CERTIFICATION_AUTHORITY_TARGETS,
  AI_CITATION_TRACKING_SEEDS,
  AI_EXPLANATION_BLOCKS,
  AI_FRIENDLY_TABLE_TYPES,
  AI_READABILITY_ELEMENTS,
  AI_READABLE_PAGE_SEEDS,
  AI_SEARCH_SYSTEMS,
  ALLIED_AI_AUTHORITY_TARGETS,
  ANSWER_FIRST_BLOCKS,
  DEFINITION_BLOCK_SEEDS,
  DEFINITION_BLOCK_TOPICS,
  ENTITY_REINFORCEMENT_SEEDS,
  ORIGINAL_INSIGHT_TYPES,
  QA_RETRIEVAL_HEADINGS,
  auditAiReadability,
  buildAiOverviewDashboard,
  buildAiSearchEngineDashboard,
  scoreLlmAuthority,
} from "./ai-search-llm-citation-optimization-engine";

test("AI search systems cover current and future AI-powered search targets", () => {
  for (const system of ["Google AI Overviews", "ChatGPT", "Perplexity", "Claude", "Gemini", "Future AI Search"]) {
    assert.ok(AI_SEARCH_SYSTEMS.includes(system), `${system} missing`);
  }
});

test("AI readability audit elements include definition, relevance, and takeaways", () => {
  assert.deepEqual(AI_READABILITY_ELEMENTS, ["definition", "key_facts", "clinical_relevance", "profession_relevance", "certification_relevance", "main_takeaways"]);
});

test("answer-first content blocks include direct and expanded answer structure", () => {
  assert.deepEqual(ANSWER_FIRST_BLOCKS, ["quick_answer", "expanded_answer", "clinical_context", "examples", "related_concepts", "faqs"]);
});

test("question and answer retrieval headings align with AI extraction patterns", () => {
  assert.deepEqual(QA_RETRIEVAL_HEADINGS, ["what_is", "why_does_it_occur", "what_are_the_symptoms", "how_is_it_diagnosed", "how_is_it_treated"]);
});

test("definition blocks cover requested high-value healthcare terms", () => {
  assert.deepEqual(DEFINITION_BLOCK_TOPICS, ["PEEP", "ABG", "COPD", "Preload", "Afterload", "Cardiac Output", "Sepsis"]);
  assert.ok(DEFINITION_BLOCK_SEEDS.every((seed) => seed.requiredFields.includes("plain_language_definition")));
  assert.ok(DEFINITION_BLOCK_SEEDS.every((seed) => seed.requiredFields.includes("related_entities")));
});

test("entity reinforcement covers diseases, medications, skills, labs, certifications, careers, programs, and professions", () => {
  const entityTypes = new Set(ENTITY_REINFORCEMENT_SEEDS.map((seed) => seed.entityType));
  for (const type of ["Disease", "Medication", "Skill", "Lab", "Certification", "Career", "Program", "DefinedTerm"]) {
    assert.ok(entityTypes.has(type), `${type} missing`);
  }
  assert.ok(ENTITY_REINFORCEMENT_SEEDS.every((seed) => seed.requiredRelationshipFields.includes("related_learning_assets")));
});

test("FAQ, clinical explanation, and table standards support AI citations", () => {
  assert.deepEqual(AI_EXPLANATION_BLOCKS, ["why_it_matters", "common_mistakes", "clinical_pearls", "new_graduate_tips", "exam_tips"]);
  assert.deepEqual(AI_FRIENDLY_TABLE_TYPES, ["comparison_table", "differential_diagnosis_table", "medication_comparison_table", "certification_comparison_table", "career_comparison_table"]);
});

test("AI citation tracking monitors pages, topics, questions, authority growth, and brand mentions", () => {
  assert.equal(AI_CITATION_TRACKING_SEEDS.length, AI_SEARCH_SYSTEMS.length);
  for (const seed of AI_CITATION_TRACKING_SEEDS) {
    assert.deepEqual(seed.trackedMetrics, ["pages_cited", "topics_cited", "questions_cited", "authority_growth", "brand_mentions"]);
  }
});

test("certification and allied targets cover requested authority areas", () => {
  for (const cert of ["NCLEX", "REx-PN", "CNPLE", "FNP", "PMHNP", "AGPCNP", "WHNP", "PNP-PC", "TEAS", "HESI", "CASPER"]) {
    assert.ok(AI_CERTIFICATION_AUTHORITY_TARGETS.includes(cert), `${cert} missing`);
  }
  for (const profession of ["RT", "Paramedic", "OT", "PT", "MLT", "PSW"]) {
    assert.ok(ALLIED_AI_AUTHORITY_TARGETS.includes(profession), `${profession} missing`);
  }
});

test("original insights include clinical, study, placement, and career pearls", () => {
  assert.deepEqual(ORIGINAL_INSIGHT_TYPES, ["clinical_pearl", "study_pearl", "placement_pearl", "career_insight"]);
});

test("AI readability audit identifies missing blocks and generates improvements", () => {
  const audit = auditAiReadability({
    url: "/weak",
    title: "Weak Page",
    readabilityElements: ["definition"],
    answerFirstBlocks: ["quick_answer"],
    qaHeadings: ["what_is"],
    definitionBlocks: [],
    entityTypesDefined: [],
    faqCount: 3,
    explanationBlocks: ["why_it_matters"],
    tableTypes: [],
    schemaTypes: ["Article"],
    originalInsights: [],
    topicalAuthorityScore: 40,
  });
  assert.equal(audit.missingDefinitionCoverage, true);
  assert.equal(audit.missingEntityCoverage, true);
  assert.equal(audit.missingFaqCoverage, true);
  assert.equal(audit.missingStructuredTables, true);
  assert.ok(audit.improvements.length >= 6);
});

test("LLM authority score rewards answer quality, entities, schema, FAQ, and topical authority", () => {
  const score = scoreLlmAuthority(AI_READABLE_PAGE_SEEDS[0]!);
  assert.ok(score.aiCitationReadiness >= 90);
  assert.ok(score.entityStrength >= 90);
  assert.ok(score.answerQuality >= 90);
  assert.equal(score.structuredDataQuality, 100);
  assert.ok(score.faqQuality >= 70);
  assert.ok(score.overallLlmReadiness >= 85);
});

test("AI overview dashboard reports likely cited pages and coverage gaps", () => {
  const dashboard = buildAiOverviewDashboard(AI_READABLE_PAGE_SEEDS, ["/healthcare/copd"]);
  assert.ok(dashboard.pagesMostLikelyToBeCited.includes("/healthcare/copd"));
  assert.deepEqual(dashboard.pagesAlreadyCited, ["/healthcare/copd"]);
  assert.ok(dashboard.averageAiReadinessScore >= 80);
});

test("engine dashboard summarizes optimization coverage", () => {
  const dashboard = buildAiSearchEngineDashboard();
  assert.equal(dashboard.aiSystems, AI_SEARCH_SYSTEMS.length);
  assert.equal(dashboard.readabilityElements, AI_READABILITY_ELEMENTS.length);
  assert.equal(dashboard.answerFirstBlocks, ANSWER_FIRST_BLOCKS.length);
  assert.equal(dashboard.qaRetrievalHeadings, QA_RETRIEVAL_HEADINGS.length);
  assert.equal(dashboard.definitionBlocks, DEFINITION_BLOCK_TOPICS.length);
  assert.equal(dashboard.explanationBlocks, AI_EXPLANATION_BLOCKS.length);
  assert.equal(dashboard.tableTypes, AI_FRIENDLY_TABLE_TYPES.length);
  assert.equal(dashboard.certificationTargets, AI_CERTIFICATION_AUTHORITY_TARGETS.length);
  assert.equal(dashboard.alliedTargets, ALLIED_AI_AUTHORITY_TARGETS.length);
  assert.equal(dashboard.originalInsightTypes, ORIGINAL_INSIGHT_TYPES.length);
});
