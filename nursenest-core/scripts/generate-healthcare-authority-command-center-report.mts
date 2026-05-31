import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";

import {
  buildHealthcareAuthorityCommandCenter,
  buildTopicAuthorityRollup,
} from "../src/lib/seo/healthcare-authority-command-center";

const outPath = join(process.cwd(), "docs", "reports", "healthcare-authority-command-center.md");
const center = buildHealthcareAuthorityCommandCenter();
const topicRollup = buildTopicAuthorityRollup();

const money = (cents: number) => `$${(cents / 100).toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
const pct = (value: number) => `${Math.round(value * 1000) / 10}%`;

const markdown = `# Healthcare Authority Command Center

Generated: ${new Date().toISOString()}

## Objective

Create a single executive command center that combines SEO, EEAT, traffic, authority, indexation, AI visibility, conversions, revenue, content performance, and topic ownership into one operational dashboard.

## Executive Overview

| Metric | Value |
| --- | ---: |
| Organic traffic | ${center.executiveOverview.organicTraffic.toLocaleString()} |
| New users | ${center.executiveOverview.newUsers.toLocaleString()} |
| Accounts created | ${center.executiveOverview.accountsCreated.toLocaleString()} |
| Trials started | ${center.executiveOverview.trialsStarted.toLocaleString()} |
| Subscriptions | ${center.executiveOverview.subscriptions.toLocaleString()} |
| MRR | ${money(center.executiveOverview.mrrCents)} |
| ARR | ${money(center.executiveOverview.arrCents)} |
| Conversion rate | ${pct(center.executiveOverview.conversionRate)} |
| Traffic growth | ${pct(center.executiveOverview.trafficGrowth)} |
| Revenue growth | ${pct(center.executiveOverview.revenueGrowth)} |
| Authority growth | ${pct(center.executiveOverview.authorityGrowth)} |

## SEO Command Center

| Metric | Value |
| --- | ---: |
| Indexed pages | ${center.seo.indexedPages.toLocaleString()} |
| Non-indexed pages | ${center.seo.nonIndexedPages.toLocaleString()} |
| Crawled not indexed | ${center.seo.crawledNotIndexed.toLocaleString()} |
| Duplicate content | ${center.seo.duplicateContent.toLocaleString()} |
| Canonical issues | ${center.seo.canonicalIssues.toLocaleString()} |
| Orphan pages | ${center.seo.orphanPages.toLocaleString()} |
| Internal linking score | ${center.seo.internalLinkingScore}% |
| Schema coverage | ${center.seo.schemaCoverage}% |
| Breadcrumb coverage | ${center.seo.breadcrumbCoverage}% |

Top keywords:

${center.seo.topKeywords.map((keyword) => `- ${keyword}`).join("\n")}

Fastest-growing keywords:

${center.seo.fastestGrowingKeywords.map((keyword) => `- ${keyword}`).join("\n")}

## Topic Ownership Dashboard

| Topic | Ownership | Authority | Traffic | Conversions | Revenue | Build Priority |
| --- | ---: | ---: | ---: | ---: | ---: | --- |
${center.topicOwnership.map((row) => `| ${row.topic} | ${row.ownershipPercent}% | ${row.authorityScore}% | ${row.traffic.toLocaleString()} | ${row.conversions.toLocaleString()} | ${money(row.revenueCents)} | ${row.buildPriority} |`).join("\n")}

## Allied Health Command Center

| Profession | Authority | Traffic | Keywords | Conversions | Growth | Content Gaps |
| --- | ---: | ---: | ---: | ---: | ---: | --- |
${center.alliedHealth.map((row) => `| ${row.profession} | ${row.authorityScore}% | ${row.traffic.toLocaleString()} | ${row.keywords.toLocaleString()} | ${row.conversions.toLocaleString()} | ${pct(row.growth / 100)} | ${row.contentGaps.join(", ")} |`).join("\n")}

## Certification Command Center

| Certification | Traffic | Conversions | Content Coverage | Authority | Readiness |
| --- | ---: | ---: | ---: | ---: | ---: |
${center.certifications.map((row) => `| ${row.certification} | ${row.traffic.toLocaleString()} | ${row.conversions.toLocaleString()} | ${row.contentCoverage}% | ${row.authorityScore}% | ${row.readinessScore}% |`).join("\n")}

## AI Visibility Dashboard

| Metric | Value |
| --- | ---: |
| AI citation readiness | ${center.aiVisibility.aiCitationReadiness}% |
| Entity coverage | ${center.aiVisibility.entityCoverage}% |
| Definition coverage | ${center.aiVisibility.definitionCoverage}% |
| FAQ coverage | ${center.aiVisibility.faqCoverage}% |
| Knowledge graph strength | ${center.aiVisibility.knowledgeGraphStrength}% |

AI Overview opportunities:

${center.aiVisibility.aiOverviewOpportunities.map((url) => `- ${url}`).join("\n")}

AI mention tracking:

${center.aiVisibility.aiMentionTracking.map((system) => `- ${system}`).join("\n")}

## EEAT Dashboard

| Metric | Score |
| --- | ---: |
| Author coverage | ${center.eeat.authorCoverage}% |
| Reviewer coverage | ${center.eeat.reviewerCoverage}% |
| Clinical review coverage | ${center.eeat.clinicalReviewCoverage}% |
| Freshness coverage | ${center.eeat.freshnessCoverage}% |
| Reference coverage | ${center.eeat.referenceCoverage}% |
| Schema coverage | ${center.eeat.schemaCoverage}% |
| Trust score | ${center.eeat.trustScore}% |
| Authority score | ${center.eeat.authorityScore}% |

## Conversion Command Center

| Metric | Value |
| --- | ---: |
| Visitor to account | ${pct(center.conversion.visitorToAccountRate)} |
| Account to trial | ${pct(center.conversion.accountToTrialRate)} |
| Trial to paid | ${pct(center.conversion.trialToPaidRate)} |
| Paid to renewal | ${pct(center.conversion.paidToRenewalRate)} |
| Revenue attribution | ${money(center.conversion.revenueAttributionCents)} |

Content attribution:

${center.conversion.contentAttribution.map((item) => `- ${item}`).join("\n")}

Profession attribution:

${center.conversion.professionAttribution.map((item) => `- ${item}`).join("\n")}

## Content Performance

| Surface | Leaders | Traffic | Conversions | Revenue |
| --- | --- | ---: | ---: | ---: |
${center.contentPerformance.map((row) => `| ${row.surface} | ${row.leaders.join(", ")} | ${row.traffic.toLocaleString()} | ${row.conversions.toLocaleString()} | ${money(row.revenueCents)} |`).join("\n")}

## Opportunity Engine

${center.opportunities.map((row) => `- ${row.question} ${row.recommendation} Impact: ${row.expectedImpact}. Priority score: ${row.priorityScore}.`).join("\n")}

## Alert Center

| Alert | Severity | Trigger | Owner Action |
| --- | --- | --- | --- |
${center.alerts.map((alert) => `| ${alert.type} | ${alert.severity} | ${alert.trigger} | ${alert.ownerAction} |`).join("\n")}

## Executive Scorecard

| Score | Value |
| --- | ---: |
| Traffic score | ${center.scorecard.trafficScore}% |
| Authority score | ${center.scorecard.authorityScore}% |
| EEAT score | ${center.scorecard.eeatScore}% |
| AI readiness score | ${center.scorecard.aiReadinessScore}% |
| Conversion score | ${center.scorecard.conversionScore}% |
| Revenue score | ${center.scorecard.revenueScore}% |
| International expansion score | ${center.scorecard.internationalExpansionScore}% |
| Allied health score | ${center.scorecard.alliedHealthScore}% |
| Overall business score | ${center.scorecard.overallBusinessScore}% |

## Knowledge Graph Authority Rollup

| Cluster | Score |
| --- | ---: |
${topicRollup.map((row) => `| ${row.cluster} | ${row.score}% |`).join("\n")}

## Executive Questions Answered

- What is growing? Use traffic growth, fastest-growing keywords, allied growth, and topic authority movement.
- What is failing? Use alert center, non-indexed pages, crawled-not-indexed pages, orphan pages, schema issues, and conversion drops.
- What should we build next? Use opportunity recommendations ranked by priority score.
- What is generating revenue? Use content, profession, certification, and page revenue attribution.
- What is generating traffic? Use SEO command center, topic ownership, and content performance surfaces.
- What is generating authority? Use topic ownership, EEAT, knowledge graph rollup, and AI visibility.

## Guardrails

- Stripe remains billing source of truth for revenue.
- Search Console remains query and indexation source of truth.
- The command center should aggregate existing systems instead of creating parallel SEO, conversion, or analytics logic.
- Alerts should fail loudly when traffic, conversion, authority, schema, indexation, subscriptions, or Stripe webhooks degrade.
`;

await mkdir(dirname(outPath), { recursive: true });
await writeFile(outPath, markdown);
console.log(`Wrote ${outPath}`);
