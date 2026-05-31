import { writeFileSync } from "node:fs";
import { join } from "node:path";
import {
  AUTHORITY_CATEGORY_META,
  AUTHORITY_CONTENT_ROADMAP,
  AUTHORITY_TOPIC_CLUSTERS,
  buildAuthorityContentDashboard,
  buildAuthorityClusterDashboard,
  buildContentProductionCalendar,
  buildContentProductionDashboard,
} from "../src/lib/authority/healthcare-authority-content-engine";

const dashboard = buildAuthorityContentDashboard();
const clusterDashboard = buildAuthorityClusterDashboard();
const productionDashboard = buildContentProductionDashboard();
const productionCalendar = buildContentProductionCalendar();
const calendarWindows = (["30-day", "90-day", "180-day", "365-day"] as const).map((window) => {
  const items = productionCalendar.filter((item) => item.window === window);
  return {
    window,
    count: items.length,
    averageTraffic: Math.round(items.reduce((sum, item) => sum + item.trafficOpportunityScore, 0) / Math.max(1, items.length)),
    averageRevenue: Math.round(items.reduce((sum, item) => sum + item.revenueOpportunityScore, 0) / Math.max(1, items.length)),
  };
});

const lines = [
  "# Content Authority Dashboard",
  "",
  `Generated: ${dashboard.generatedAt}`,
  "",
  "## Executive Summary",
  "",
  `- Published authority pages: ${dashboard.totalPublishedPages}`,
  `- Phase-one target pages: ${dashboard.totalPhaseOneTarget}`,
  `- Long-term target pages: ${dashboard.totalLongTermTarget}`,
  `- Draft gap to phase one: ${dashboard.rows.reduce((sum, row) => sum + row.draftGap, 0)}`,
  `- Average clinical authority score: ${Math.round(dashboard.rows.reduce((sum, row) => sum + row.averageClinicalAuthorityScore, 0) / Math.max(1, dashboard.rows.length))}/100`,
  `- Topic clusters planned: ${clusterDashboard.totalClusters}`,
  `- Phase-one topic clusters: ${clusterDashboard.phaseOneClusters}`,
  `- Average cluster completion: ${clusterDashboard.averageClusterCompletion}%`,
  `- Content production workflow stages: ${productionDashboard.workflowStages.length}`,
  `- Content briefs ready: ${productionDashboard.briefsReady}`,
  `- Content calendar items: ${productionDashboard.calendarItems}`,
  "",
  "## Library Coverage",
  "",
  "| Library | Published | Planned | Phase-One Target | Long-Term Target | Draft Gap | Awaiting Review | EEAT | Clinical Authority | Avg Authority Score | Keyword Coverage | Profession Coverage | Topic Coverage | Traffic Opportunity | Schema | Internal Links/Page | Monetization |",
  "| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: | --- |",
  ...dashboard.rows.map((row) =>
    [
      AUTHORITY_CATEGORY_META[row.category].title,
      row.publishedPages,
      row.plannedPages,
      row.phaseOneTarget,
      row.longTermTarget,
      row.draftGap,
      row.pagesAwaitingReview,
      `${row.eeatCoverage}%`,
      `${row.clinicalAuthorityCoverage}%`,
      `${row.averageClinicalAuthorityScore}/100`,
      `${row.keywordCoverage}%`,
      `${row.professionCoverage}%`,
      `${row.topicCoverage}%`,
      row.estimatedTrafficOpportunity,
      `${row.schemaCoverage}%`,
      row.internalLinkAverage,
      row.monetizationReadiness,
    ].join(" | ").replace(/^/, "| ").replace(/$/, " |"),
    ),
  "",
  "## Production Pipeline",
  "",
  `Workflow: ${productionDashboard.workflowStages.join(" -> ")}`,
  "",
  "| Window | Planned Items | Average Traffic Score | Average Revenue Score |",
  "| --- | ---: | ---: | ---: |",
  ...calendarWindows.map((row) =>
    [row.window, row.count, row.averageTraffic, row.averageRevenue].join(" | ").replace(/^/, "| ").replace(/$/, " |"),
  ),
  "",
  "## Allied Health Production Queues",
  "",
  "| Profession | Pages Planned | Drafted | Reviewed | Published | Traffic Potential | Cluster Completion |",
  "| --- | ---: | ---: | ---: | ---: | --- | ---: |",
  ...productionDashboard.alliedQueues.map((queue) =>
    [
      queue.profession,
      queue.pagesPlanned,
      queue.pagesDrafted,
      queue.pagesReviewed,
      queue.pagesPublished,
      queue.trafficPotential,
      `${queue.clusterCompletion}%`,
    ].join(" | ").replace(/^/, "| ").replace(/$/, " |"),
  ),
  "",
  "## Topic Cluster Readiness",
  "",
  "| Cluster | Profession | Priority | Target Pages | Planned Pages | Published Pages | Cluster Completion | Internal Linking | Keyword Coverage | Traffic Potential | Revenue Potential | EEAT | Monetization | Publication Readiness |",
  "| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- | --- | ---: | --- | ---: |",
  ...clusterDashboard.rows.map((row) =>
    [
      row.pillarTitle,
      row.profession,
      row.priority,
      row.targetSupportingPages,
      row.plannedSupportingPages,
      row.publishedPages,
      `${row.clusterCompletion}%`,
      `${row.internalLinkingScore}%`,
      `${row.keywordCoverage}%`,
      row.trafficPotential,
      row.revenuePotential,
      `${row.eeatScore}%`,
      row.monetizationReadiness,
      `${row.publicationReadiness}%`,
    ].join(" | ").replace(/^/, "| ").replace(/$/, " |"),
  ),
  "",
  "## High-Opportunity Roadmap",
  "",
  "| Priority Page | Library | Profession | Topic Cluster | Monetization Intent |",
  "| --- | --- | --- | --- | --- |",
  ...AUTHORITY_CONTENT_ROADMAP.filter((entry) => entry.trafficOpportunity === "high")
    .slice(0, 40)
    .map((entry) =>
      [
        entry.title,
        AUTHORITY_CATEGORY_META[entry.category].title,
        entry.profession,
        entry.topicCluster,
        entry.monetizationIntent,
      ].join(" | ").replace(/^/, "| ").replace(/$/, " |"),
    ),
  "",
  "## Notes",
  "",
  `- Topic cluster registry currently models ${AUTHORITY_TOPIC_CLUSTERS.length} pillar clusters with supporting page inventories.`,
  "- This dashboard tracks architecture readiness and live seed coverage, not final content volume.",
  "- `Clinical Authority` means pages satisfy the full NurseNest clinical authority standard: target depth, required elements, strong references, deep internal linking, and clinical review.",
  "- `Awaiting Review` means the page has EEAT fields and references but still needs clinician review before being positioned as fully clinically reviewed.",
  "- Phase-one gaps should be filled through reviewed, meaningful pages only. Do not generate thin pages simply to close a numeric target.",
  "- Every new page should preserve internal links to related healthcare library pages and relevant NurseNest learning products.",
  "",
];

writeFileSync(join(process.cwd(), "docs/content-authority-dashboard.md"), lines.join("\n"));
