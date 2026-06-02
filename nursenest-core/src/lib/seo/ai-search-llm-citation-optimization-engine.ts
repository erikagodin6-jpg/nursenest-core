import type { CertificationTracker } from "@/lib/seo/content-freshness-evergreen-authority-engine";
import type { HealthcareEntityType, StructuredSchemaType } from "@/lib/seo/eeat-entity-authority-architecture";

export type AiSearchSystem = "Google AI Overviews" | "ChatGPT" | "Perplexity" | "Claude" | "Gemini" | "Future AI Search";

export type AiReadabilityElement =
  | "definition"
  | "key_facts"
  | "clinical_relevance"
  | "profession_relevance"
  | "certification_relevance"
  | "main_takeaways";

export type AnswerFirstBlock = "quick_answer" | "expanded_answer" | "clinical_context" | "examples" | "related_concepts" | "faqs";

export type QaRetrievalHeading =
  | "what_is"
  | "why_does_it_occur"
  | "what_are_the_symptoms"
  | "how_is_it_diagnosed"
  | "how_is_it_treated";

export type DefinitionBlockTopic = "PEEP" | "ABG" | "COPD" | "Preload" | "Afterload" | "Cardiac Output" | "Sepsis";

export type AiExplanationBlock = "why_it_matters" | "common_mistakes" | "clinical_pearls" | "new_graduate_tips" | "exam_tips";

export type AiFriendlyTableType =
  | "comparison_table"
  | "differential_diagnosis_table"
  | "medication_comparison_table"
  | "certification_comparison_table"
  | "career_comparison_table";

export type AiCitationStatus = "not_tracked" | "monitoring" | "cited" | "citation_lost";

export type AlliedAiAuthorityProfession = "RT" | "Paramedic" | "OT" | "PT" | "MLT" | "PSW";

export type OriginalInsightType = "clinical_pearl" | "study_pearl" | "placement_pearl" | "career_insight";

export type AiReadablePageSignals = {
  url: string;
  title: string;
  readabilityElements: readonly AiReadabilityElement[];
  answerFirstBlocks: readonly AnswerFirstBlock[];
  qaHeadings: readonly QaRetrievalHeading[];
  definitionBlocks: readonly DefinitionBlockTopic[];
  entityTypesDefined: readonly HealthcareEntityType[];
  faqCount: number;
  explanationBlocks: readonly AiExplanationBlock[];
  tableTypes: readonly AiFriendlyTableType[];
  schemaTypes: readonly StructuredSchemaType[];
  originalInsights: readonly OriginalInsightType[];
  topicalAuthorityScore: number;
};

export type AiReadabilityAuditResult = {
  url: string;
  missingReadabilityElements: readonly AiReadabilityElement[];
  missingAnswerFirstBlocks: readonly AnswerFirstBlock[];
  missingQaHeadings: readonly QaRetrievalHeading[];
  missingDefinitionCoverage: boolean;
  missingEntityCoverage: boolean;
  missingFaqCoverage: boolean;
  missingExplanationBlocks: readonly AiExplanationBlock[];
  missingStructuredTables: boolean;
  improvements: readonly string[];
};

export type DefinitionBlockSeed = {
  term: DefinitionBlockTopic;
  requiredFields: readonly ["term", "plain_language_definition", "clinical_relevance", "profession_relevance", "related_entities", "common_confusion"];
};

export type EntityReinforcementSeed = {
  entityType: HealthcareEntityType;
  requiredRelationshipFields: readonly ["definition", "category", "related_entities", "related_learning_assets", "profession_relevance", "certification_relevance"];
};

export type AiCitationTrackingSeed = {
  system: AiSearchSystem;
  trackedMetrics: readonly ["pages_cited", "topics_cited", "questions_cited", "authority_growth", "brand_mentions"];
};

export type AiOverviewDashboard = {
  pagesMostLikelyToBeCited: readonly string[];
  pagesAlreadyCited: readonly string[];
  missingFaqCoverage: readonly string[];
  missingDefinitionCoverage: readonly string[];
  missingEntityCoverage: readonly string[];
  averageAiReadinessScore: number;
};

export type LlmAuthorityScore = {
  aiCitationReadiness: number;
  entityStrength: number;
  answerQuality: number;
  structuredDataQuality: number;
  faqQuality: number;
  topicalAuthority: number;
  overallLlmReadiness: number;
};

export type AiSearchEngineDashboard = {
  aiSystems: number;
  readabilityElements: number;
  answerFirstBlocks: number;
  qaRetrievalHeadings: number;
  definitionBlocks: number;
  explanationBlocks: number;
  tableTypes: number;
  certificationTargets: number;
  alliedTargets: number;
  originalInsightTypes: number;
};

export const AI_SEARCH_SYSTEMS = ["Google AI Overviews", "ChatGPT", "Perplexity", "Claude", "Gemini", "Future AI Search"] as const satisfies readonly AiSearchSystem[];
export const AI_READABILITY_ELEMENTS = ["definition", "key_facts", "clinical_relevance", "profession_relevance", "certification_relevance", "main_takeaways"] as const satisfies readonly AiReadabilityElement[];
export const ANSWER_FIRST_BLOCKS = ["quick_answer", "expanded_answer", "clinical_context", "examples", "related_concepts", "faqs"] as const satisfies readonly AnswerFirstBlock[];
export const QA_RETRIEVAL_HEADINGS = ["what_is", "why_does_it_occur", "what_are_the_symptoms", "how_is_it_diagnosed", "how_is_it_treated"] as const satisfies readonly QaRetrievalHeading[];
export const DEFINITION_BLOCK_TOPICS = ["PEEP", "ABG", "COPD", "Preload", "Afterload", "Cardiac Output", "Sepsis"] as const satisfies readonly DefinitionBlockTopic[];
export const AI_EXPLANATION_BLOCKS = ["why_it_matters", "common_mistakes", "clinical_pearls", "new_graduate_tips", "exam_tips"] as const satisfies readonly AiExplanationBlock[];
export const AI_FRIENDLY_TABLE_TYPES = ["comparison_table", "differential_diagnosis_table", "medication_comparison_table", "certification_comparison_table", "career_comparison_table"] as const satisfies readonly AiFriendlyTableType[];
export const AI_CERTIFICATION_AUTHORITY_TARGETS = ["NCLEX", "REx-PN", "CNPLE", "FNP", "PMHNP", "AGPCNP", "WHNP", "PNP-PC", "TEAS", "HESI", "CASPER"] as const satisfies readonly CertificationTracker[];
export const ALLIED_AI_AUTHORITY_TARGETS = ["RT", "Paramedic", "OT", "PT", "MLT", "PSW"] as const satisfies readonly AlliedAiAuthorityProfession[];
export const ORIGINAL_INSIGHT_TYPES = ["clinical_pearl", "study_pearl", "placement_pearl", "career_insight"] as const satisfies readonly OriginalInsightType[];

export const DEFINITION_BLOCK_SEEDS: readonly DefinitionBlockSeed[] = DEFINITION_BLOCK_TOPICS.map((term) => ({
  term,
  requiredFields: ["term", "plain_language_definition", "clinical_relevance", "profession_relevance", "related_entities", "common_confusion"],
}));

export const ENTITY_REINFORCEMENT_SEEDS: readonly EntityReinforcementSeed[] = [
  entitySeed("Disease"),
  entitySeed("Medication"),
  entitySeed("Skill"),
  entitySeed("Lab"),
  entitySeed("Certification"),
  entitySeed("Career"),
  entitySeed("Program"),
  entitySeed("DefinedTerm"),
] as const;

export const AI_CITATION_TRACKING_SEEDS: readonly AiCitationTrackingSeed[] = AI_SEARCH_SYSTEMS.map((system) => ({
  system,
  trackedMetrics: ["pages_cited", "topics_cited", "questions_cited", "authority_growth", "brand_mentions"],
}));

export const AI_READABLE_PAGE_SEEDS: readonly AiReadablePageSignals[] = [
  pageSeed("/healthcare/copd", "What is COPD?", ["COPD"], ["Disease", "Lab", "Medication"], 18, ["comparison_table", "differential_diagnosis_table"], 92),
  pageSeed("/healthcare/peep", "What is PEEP?", ["PEEP"], ["DefinedTerm", "Skill"], 14, ["comparison_table"], 88),
  pageSeed("/careers/respiratory-therapist-canada", "How do I become a respiratory therapist?", [], ["Career", "Program", "Certification"], 12, ["career_comparison_table"], 86),
  pageSeed("/exams/nclex-vs-rex-pn", "What is the difference between NCLEX and REx-PN?", [], ["Certification"], 16, ["certification_comparison_table"], 90),
] as const;

export function auditAiReadability(page: AiReadablePageSignals): AiReadabilityAuditResult {
  const missingReadabilityElements = AI_READABILITY_ELEMENTS.filter((element) => !page.readabilityElements.includes(element));
  const missingAnswerFirstBlocks = ANSWER_FIRST_BLOCKS.filter((block) => !page.answerFirstBlocks.includes(block));
  const missingQaHeadings = QA_RETRIEVAL_HEADINGS.filter((heading) => !page.qaHeadings.includes(heading));
  const missingExplanationBlocks = AI_EXPLANATION_BLOCKS.filter((block) => !page.explanationBlocks.includes(block));
  const improvements: string[] = [];
  if (missingReadabilityElements.length) improvements.push("Add explicit definition, key facts, relevance, and takeaway blocks.");
  if (missingAnswerFirstBlocks.length) improvements.push("Add answer-first sections near the top of the page.");
  if (missingQaHeadings.length) improvements.push("Add natural-language question headings aligned with AI retrieval patterns.");
  if (page.definitionBlocks.length === 0) improvements.push("Add a standardized definition block when the page introduces a definable entity.");
  if (page.entityTypesDefined.length === 0) improvements.push("Define page entities and explicit relationships.");
  if (page.faqCount < 10) improvements.push("Expand FAQ coverage to 10-25 relevant questions.");
  if (missingExplanationBlocks.length) improvements.push("Add clinical explanation blocks that demonstrate original educational value.");
  if (page.tableTypes.length === 0) improvements.push("Add AI-friendly comparison or differential tables.");
  return {
    url: page.url,
    missingReadabilityElements,
    missingAnswerFirstBlocks,
    missingQaHeadings,
    missingDefinitionCoverage: page.definitionBlocks.length === 0,
    missingEntityCoverage: page.entityTypesDefined.length === 0,
    missingFaqCoverage: page.faqCount < 10,
    missingExplanationBlocks,
    missingStructuredTables: page.tableTypes.length === 0,
    improvements,
  };
}

export function scoreLlmAuthority(page: AiReadablePageSignals): LlmAuthorityScore {
  const aiCitationReadiness = average(
    coverage(page.answerFirstBlocks.length, ANSWER_FIRST_BLOCKS.length),
    coverage(page.qaHeadings.length, QA_RETRIEVAL_HEADINGS.length),
    coverage(page.originalInsights.length, ORIGINAL_INSIGHT_TYPES.length),
  );
  const entityStrength = average(coverage(page.entityTypesDefined.length, 3), coverage(page.definitionBlocks.length, 1));
  const answerQuality = average(coverage(page.readabilityElements.length, AI_READABILITY_ELEMENTS.length), coverage(page.explanationBlocks.length, AI_EXPLANATION_BLOCKS.length));
  const structuredDataQuality = coverage(page.schemaTypes.length, 5);
  const faqQuality = coverage(page.faqCount, 25);
  const topicalAuthority = page.topicalAuthorityScore;
  const overallLlmReadiness = average(aiCitationReadiness, entityStrength, answerQuality, structuredDataQuality, faqQuality, topicalAuthority);
  return { aiCitationReadiness, entityStrength, answerQuality, structuredDataQuality, faqQuality, topicalAuthority, overallLlmReadiness };
}

export function buildAiOverviewDashboard(pages: readonly AiReadablePageSignals[] = AI_READABLE_PAGE_SEEDS, citedUrls: readonly string[] = []): AiOverviewDashboard {
  const scored = pages.map((page) => ({ page, score: scoreLlmAuthority(page).overallLlmReadiness }));
  const audits = pages.map(auditAiReadability);
  return {
    pagesMostLikelyToBeCited: scored.filter((item) => item.score >= 80).sort((a, b) => b.score - a.score).map((item) => item.page.url),
    pagesAlreadyCited: pages.filter((page) => citedUrls.includes(page.url)).map((page) => page.url),
    missingFaqCoverage: audits.filter((audit) => audit.missingFaqCoverage).map((audit) => audit.url),
    missingDefinitionCoverage: audits.filter((audit) => audit.missingDefinitionCoverage).map((audit) => audit.url),
    missingEntityCoverage: audits.filter((audit) => audit.missingEntityCoverage).map((audit) => audit.url),
    averageAiReadinessScore: Math.round(scored.reduce((sum, item) => sum + item.score, 0) / (scored.length || 1)),
  };
}

export function buildAiSearchEngineDashboard(): AiSearchEngineDashboard {
  return {
    aiSystems: AI_SEARCH_SYSTEMS.length,
    readabilityElements: AI_READABILITY_ELEMENTS.length,
    answerFirstBlocks: ANSWER_FIRST_BLOCKS.length,
    qaRetrievalHeadings: QA_RETRIEVAL_HEADINGS.length,
    definitionBlocks: DEFINITION_BLOCK_TOPICS.length,
    explanationBlocks: AI_EXPLANATION_BLOCKS.length,
    tableTypes: AI_FRIENDLY_TABLE_TYPES.length,
    certificationTargets: AI_CERTIFICATION_AUTHORITY_TARGETS.length,
    alliedTargets: ALLIED_AI_AUTHORITY_TARGETS.length,
    originalInsightTypes: ORIGINAL_INSIGHT_TYPES.length,
  };
}

function pageSeed(
  url: string,
  title: string,
  definitionBlocks: readonly DefinitionBlockTopic[],
  entityTypesDefined: readonly HealthcareEntityType[],
  faqCount: number,
  tableTypes: readonly AiFriendlyTableType[],
  topicalAuthorityScore: number,
): AiReadablePageSignals {
  return {
    url,
    title,
    readabilityElements: AI_READABILITY_ELEMENTS,
    answerFirstBlocks: ANSWER_FIRST_BLOCKS,
    qaHeadings: QA_RETRIEVAL_HEADINGS,
    definitionBlocks,
    entityTypesDefined,
    faqCount,
    explanationBlocks: AI_EXPLANATION_BLOCKS,
    tableTypes,
    schemaTypes: ["MedicalWebPage", "Article", "FAQPage", "BreadcrumbList", "DefinedTerm"],
    originalInsights: ORIGINAL_INSIGHT_TYPES,
    topicalAuthorityScore,
  };
}

function entitySeed(entityType: HealthcareEntityType): EntityReinforcementSeed {
  return {
    entityType,
    requiredRelationshipFields: ["definition", "category", "related_entities", "related_learning_assets", "profession_relevance", "certification_relevance"],
  };
}

function coverage(value: number, target: number): number {
  return Math.max(0, Math.min(100, Math.round((Math.min(value, target) / target) * 100)));
}

function average(...values: readonly number[]): number {
  return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
}
