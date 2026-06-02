import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";

import {
  FAQ_HUB_SEEDS,
  SEARCH_INTENT_QUESTION_SEEDS,
  buildFaqHubQuestions,
  buildSearchIntentAnswerContract,
  buildSearchIntentDashboard,
  scoreSearchIntentOpportunity,
} from "../src/lib/seo/healthcare-search-intent-domination-engine";

const outPath = join(process.cwd(), "docs", "reports", "healthcare-search-intent-domination-engine.md");
const dashboard = buildSearchIntentDashboard();

const topQuestions = [...SEARCH_INTENT_QUESTION_SEEDS]
  .map((question) => ({ ...question, opportunityScore: scoreSearchIntentOpportunity(question) }))
  .sort((a, b) => b.opportunityScore - a.opportunityScore)
  .slice(0, 12);

const sampleContract = buildSearchIntentAnswerContract(SEARCH_INTENT_QUESTION_SEEDS[0]!);

const markdown = `# Healthcare Search Intent Domination Engine

Generated: ${new Date().toISOString()}

## Objective

Build NurseNest into a healthcare learner question-and-answer authority system for Google searches, AI Overview citations, featured snippets, People Also Ask, voice search, and long-tail discovery.

The operating principle is simple: learners search questions before they search broad topics.

## Question Database Contract

Each question tracks:

- Question
- Profession
- Topic
- Search intent
- Search volume
- Difficulty
- Traffic opportunity
- Conversion opportunity
- Cluster
- Answer status
- Visibility targets

## Seed Inventory

| Metric | Count |
| --- | ---: |
| Current seed questions | ${dashboard.totalQuestions} |
| Year 1 target | ${dashboard.yearOneTarget.toLocaleString()} |
| Remaining to Year 1 target | ${dashboard.remainingToYearOneTarget.toLocaleString()} |
| Draft backlog | ${dashboard.draftBacklog} |
| Review backlog | ${dashboard.reviewBacklog} |
| Refresh backlog | ${dashboard.refreshBacklog} |

## Questions By Profession

${Object.entries(dashboard.questionsByProfession).map(([profession, count]) => `- ${profession}: ${count}`).join("\n")}

## Questions By Intent

${Object.entries(dashboard.questionsByIntent).map(([intent, count]) => `- ${intent}: ${count}`).join("\n")}

## Highest Opportunity Questions

| Question | Profession | Intent | Cluster | Traffic | Conversion | Score |
| --- | --- | --- | --- | ---: | ---: | ---: |
${topQuestions.map((question) => `| ${question.question} | ${question.profession} | ${question.searchIntent} | ${question.cluster} | ${question.trafficOpportunity} | ${question.conversionOpportunity} | ${question.opportunityScore} |`).join("\n")}

## Required Answer Structure

Every answer page must include:

${sampleContract.requiredBlocks.map((block) => `- ${block}`).join("\n")}

## AI Overview And Snippet Optimization

${sampleContract.aiOverviewGuidance.map((item) => `- ${item}`).join("\n")}

## Internal Linking Requirements

Every question page links to:

${sampleContract.relatedResources.map((resource) => `- ${resource}`).join("\n")}

## Conversion Path Requirements

- Account creation CTA: ${sampleContract.accountCreationCta}
- Trial CTA: ${sampleContract.trialCta}
- Subscription CTA: ${sampleContract.subscriptionCta}

## FAQ Hubs

${FAQ_HUB_SEEDS.map((hub) => {
  const questions = buildFaqHubQuestions(hub);
  return `### ${hub.title}

- Cluster: ${hub.cluster}
- Profession: ${hub.profession}
- Canonical path: ${hub.canonicalPath}
- Questions: ${questions.map((question) => question.question).join("; ")}
`;
}).join("\n")}

## Acquisition Guardrails

- Build around natural-language learner questions, not keyword-only topics.
- Prefer one excellent answer page over many shallow variants.
- Keep answer blocks direct enough for snippets while preserving clinical depth.
- Link every answer to relevant premium training surfaces.
- Use account creation only when saving, planning, tracking, or practicing creates real learner value.
- Do not publish unreviewed medical, exam, or clinical claims.
`;

await mkdir(dirname(outPath), { recursive: true });
await writeFile(outPath, markdown);
console.log(`Wrote ${outPath}`);
