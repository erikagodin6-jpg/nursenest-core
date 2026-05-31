import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";

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
  ENTITY_REINFORCEMENT_SEEDS,
  ORIGINAL_INSIGHT_TYPES,
  QA_RETRIEVAL_HEADINGS,
  auditAiReadability,
  buildAiOverviewDashboard,
  buildAiSearchEngineDashboard,
  scoreLlmAuthority,
} from "../src/lib/seo/ai-search-llm-citation-optimization-engine";

const outPath = join(process.cwd(), "docs", "reports", "ai-search-ai-overview-llm-citation-optimization-engine.md");
const engineDashboard = buildAiSearchEngineDashboard();
const overviewDashboard = buildAiOverviewDashboard(AI_READABLE_PAGE_SEEDS, ["/healthcare/copd"]);
const audits = AI_READABLE_PAGE_SEEDS.map(auditAiReadability);
const scores = AI_READABLE_PAGE_SEEDS.map((page) => ({ page, score: scoreLlmAuthority(page) }));

const markdown = `# AI Search, AI Overview & LLM Citation Optimization Engine

Generated: ${new Date().toISOString()}

## Objective

Position NurseNest to become a frequently cited healthcare education source across Google AI Overviews, ChatGPT, Perplexity, Claude, Gemini, and future AI-powered search systems. The goal is authority, citations, brand discovery, traffic, and trust beyond traditional rankings alone.

## Registry Summary

| Metric | Count |
| --- | ---: |
| AI search systems | ${engineDashboard.aiSystems} |
| AI readability elements | ${engineDashboard.readabilityElements} |
| Answer-first blocks | ${engineDashboard.answerFirstBlocks} |
| Q&A retrieval headings | ${engineDashboard.qaRetrievalHeadings} |
| Definition block topics | ${engineDashboard.definitionBlocks} |
| Clinical explanation blocks | ${engineDashboard.explanationBlocks} |
| AI-friendly table types | ${engineDashboard.tableTypes} |
| Certification targets | ${engineDashboard.certificationTargets} |
| Allied health targets | ${engineDashboard.alliedTargets} |
| Original insight types | ${engineDashboard.originalInsightTypes} |

## AI Search Systems

${AI_SEARCH_SYSTEMS.map((system) => `- ${system}`).join("\n")}

## AI Readability Audit

AI systems should be able to identify:

${AI_READABILITY_ELEMENTS.map((element) => `- ${element}`).join("\n")}

## Answer-First Content

Every authority page should include:

${ANSWER_FIRST_BLOCKS.map((block) => `- ${block}`).join("\n")}

## Question & Answer Structure

Recommended retrieval headings:

${QA_RETRIEVAL_HEADINGS.map((heading) => `- ${heading}`).join("\n")}

## Definition Blocks

| Term | Required Fields |
| --- | --- |
${DEFINITION_BLOCK_SEEDS.map((seed) => `| ${seed.term} | ${seed.requiredFields.join(", ")} |`).join("\n")}

## Entity Reinforcement

| Entity Type | Required Relationship Fields |
| --- | --- |
${ENTITY_REINFORCEMENT_SEEDS.map((seed) => `| ${seed.entityType} | ${seed.requiredRelationshipFields.join(", ")} |`).join("\n")}

## FAQ Expansion

Every authority page should target 10-25 relevant FAQs to support featured snippets, People Also Ask, AI Overview extraction, and LLM retrieval.

## Clinical Explanation Blocks

${AI_EXPLANATION_BLOCKS.map((block) => `- ${block}`).join("\n")}

## AI-Friendly Tables

${AI_FRIENDLY_TABLE_TYPES.map((table) => `- ${table}`).join("\n")}

## AI Citation Tracking

| System | Metrics |
| --- | --- |
${AI_CITATION_TRACKING_SEEDS.map((seed) => `| ${seed.system} | ${seed.trackedMetrics.join(", ")} |`).join("\n")}

## Certification Authority Targets

${AI_CERTIFICATION_AUTHORITY_TARGETS.map((target) => `- ${target}`).join("\n")}

## Allied Health Authority Targets

${ALLIED_AI_AUTHORITY_TARGETS.map((target) => `- ${target}`).join("\n")}

## Original Insights

${ORIGINAL_INSIGHT_TYPES.map((type) => `- ${type}`).join("\n")}

## AI Overview Dashboard

| Metric | Value |
| --- | --- |
| Pages Most Likely To Be Cited | ${overviewDashboard.pagesMostLikelyToBeCited.join(", ")} |
| Pages Already Cited | ${overviewDashboard.pagesAlreadyCited.join(", ")} |
| Missing FAQ Coverage | ${overviewDashboard.missingFaqCoverage.join(", ") || "None"} |
| Missing Definition Coverage | ${overviewDashboard.missingDefinitionCoverage.join(", ") || "None"} |
| Missing Entity Coverage | ${overviewDashboard.missingEntityCoverage.join(", ") || "None"} |
| Average AI Readiness Score | ${overviewDashboard.averageAiReadinessScore}% |

## LLM Authority Scores

| Page | Citation Readiness | Entity Strength | Answer Quality | Structured Data | FAQ Quality | Topical Authority | Overall |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
${scores.map(({ page, score }) => `| ${page.url} | ${score.aiCitationReadiness}% | ${score.entityStrength}% | ${score.answerQuality}% | ${score.structuredDataQuality}% | ${score.faqQuality}% | ${score.topicalAuthority}% | ${score.overallLlmReadiness}% |`).join("\n")}

## Readability Audit Findings

| Page | Improvements |
| --- | --- |
${audits.map((audit) => `| ${audit.url} | ${audit.improvements.join("; ") || "No major gaps in sample signals."} |`).join("\n")}

## Guardrails

- Authority pages should answer directly before expanding.
- Pages should use natural-language question headings that match learner search behavior.
- Definition blocks should be structured, concise, clinically relevant, and connected to explicit entities.
- FAQ coverage should be useful and reviewed, not filler.
- Tables should clarify comparisons, differentials, medication choices, certifications, or careers.
- Clinical pearls, study pearls, placement pearls, and career insights should add original educational value.
- AI citation tracking should monitor pages, topics, questions, brand mentions, and authority growth.
`;

await mkdir(dirname(outPath), { recursive: true });
await writeFile(outPath, markdown);
console.log(`Wrote ${outPath}`);
