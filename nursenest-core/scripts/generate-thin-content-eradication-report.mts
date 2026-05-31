import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import {
  AUTHORITY_EXPANSION_REQUIREMENTS,
  auditIndexablePage,
  buildIndexationImpactSummary,
  buildThinContentDashboard,
  type ContentInventoryPage,
} from "../src/lib/seo/thin-content-eradication-engine";

function page(overrides: Partial<ContentInventoryPage>): ContentInventoryPage {
  return {
    url: "/conditions/heart-failure",
    title: "Heart Failure",
    kind: "Authority Page",
    indexable: true,
    wordCount: 3600,
    uniqueContentScore: 92,
    educationalValueScore: 94,
    internalLinkCount: 20,
    externalReferenceCount: 8,
    conversionPathCount: 4,
    duplicateGroupId: null,
    targetKeywordValue: "high",
    trafficPotential: "high",
    conversionPotential: "high",
    authorityCategory: "conditions",
    profession: "RN",
    contentBlocks: ["Definition", "Why It Matters", "Assessment", "Diagnostics", "Management", "Clinical Pearls", "Case Examples", "Common Mistakes", "Clinical Reasoning", "Exam Considerations", "Practice Applications", "Patient Scenarios", "FAQs", "References", "Related Topics"],
    bodyPreview: "Clinically detailed educational content with reasoning and references.",
    ...overrides,
  };
}

const inventory: ContentInventoryPage[] = [
  page({ url: "/conditions/heart-failure", title: "Heart Failure" }),
  page({
    url: "/conditions/sepsis",
    title: "Sepsis",
    wordCount: 820,
    internalLinkCount: 4,
    contentBlocks: ["Definition", "FAQs"],
    bodyPreview: "Sepsis basics with limited assessment and treatment detail.",
  }),
  page({
    url: "/rt/abg-interpretation",
    title: "ABG Interpretation For Respiratory Therapy",
    kind: "Career Page",
    authorityCategory: undefined,
    profession: "RT",
    wordCount: 720,
    educationalValueScore: 54,
    internalLinkCount: 3,
    contentBlocks: ["FAQs"],
    bodyPreview: "ABG interpretation overview for healthcare learners.",
  }),
  page({
    url: "/programmatic/heart-failure-copy",
    title: "Heart Failure Overview Copy",
    kind: "Programmatic Page",
    duplicateGroupId: "heart-failure-duplicates",
    uniqueContentScore: 30,
    targetKeywordValue: "low",
    trafficPotential: "low",
    conversionPotential: "low",
    wordCount: 700,
    bodyPreview: "Similar heart failure overview with little unique content.",
  }),
  page({
    url: "/blog/random-stub",
    title: "Random Stub",
    kind: "Blog Post",
    wordCount: 120,
    targetKeywordValue: "low",
    trafficPotential: "low",
    conversionPotential: "low",
    bodyPreview: "Coming soon placeholder scaffold content will be added later.",
  }),
];

const dashboard = buildThinContentDashboard(inventory);
const afterCleanup = buildThinContentDashboard(inventory.filter((item) => item.url !== "/blog/random-stub" && item.url !== "/programmatic/heart-failure-copy").map((item) => item.url === "/conditions/sepsis" ? page({ ...item, wordCount: 3200, internalLinkCount: 18, contentBlocks: ["Definition", "Why It Matters", "Assessment", "Diagnostics", "Management", "Clinical Pearls", "Case Examples", "Common Mistakes", "Clinical Reasoning", "Exam Considerations", "Practice Applications", "Patient Scenarios", "FAQs", "References", "Related Topics"] }) : item));
const impact = buildIndexationImpactSummary(dashboard, afterCleanup);
const results = inventory.map(auditIndexablePage);

function table(rows: readonly string[][]): string {
  return rows.map((row) => `| ${row.join(" |")} |`).join("\n");
}

const report = `# Thin Content Eradication & Authority Page Expansion Program

Generated: ${new Date().toISOString()}

## Implementation Summary

The thin content eradication foundation is implemented in \`src/lib/seo/thin-content-eradication-engine.ts\`.

It supports:

- Sitewide indexable-page inventory classification.
- Thin page detection for word count, target depth, internal links, educational value, unique content, placeholder language, scaffold content, generated filler, duplicate content, allied-health specificity, and missing authority blocks.
- Decision routing into EXPAND, MERGE, REDIRECT, NOINDEX, DELETE, or KEEP.
- Authority expansion requirements for disease, medication, care plan, clinical skill, lab, certification, career, and allied-health guide pages.
- Internal link expansion targets across lessons, flashcards, questions, simulations, skills, care plans, labs, medications, and certifications.
- Indexation impact metrics.

## Authority Expansion Requirements

${table([
  ["Category", "Target Words", "Internal Links", "Required Blocks"],
  ...AUTHORITY_EXPANSION_REQUIREMENTS.map((item) => [
    item.category,
    `${item.targetWords.min}-${item.targetWords.max}`,
    `${item.minimumInternalLinks.min}-${item.minimumInternalLinks.max}`,
    item.requiredBlocks.slice(0, 5).join(", "),
  ]),
])}

## Demo Dashboard

- Pages audited: ${dashboard.pagesAudited}
- Indexable pages: ${dashboard.indexablePages}
- Thin pages: ${dashboard.thinPages}
- Pages to expand: ${dashboard.pagesToExpand}
- Pages to merge: ${dashboard.pagesToMerge}
- Pages to redirect: ${dashboard.pagesToRedirect}
- Pages to noindex: ${dashboard.pagesToNoindex}
- Pages to delete: ${dashboard.pagesToDelete}
- Allied health weak pages: ${dashboard.alliedHealthWeakPages}
- Authority score: ${dashboard.authorityScore}/100
- Crawled-not-indexed risk: ${dashboard.crawledNotIndexedRisk}/100

## Page Decisions

${table([
  ["URL", "Kind", "Words", "Decision", "Severity", "Signals"],
  ...results.map((result) => [
    result.page.url,
    result.page.kind,
    String(result.page.wordCount),
    result.decision,
    result.severity,
    result.signals.join(", ") || "none",
  ]),
])}

## Indexation Impact Model

- Thin pages eliminated: ${impact.thinPagesEliminated}
- Pages expanded: ${impact.pagesExpanded}
- Pages redirected: ${impact.pagesRedirected}
- Pages removed: ${impact.pagesRemoved}
- Authority score change: ${impact.authorityScoreChange}
- Crawled-not-indexed risk change: ${impact.crawledNotIndexedRiskChange}

## Next Integration Points

1. Feed this engine with sitemap URLs, authority page registries, blog inventories, programmatic pages, and public lesson routes.
2. Add duplicate group IDs from the existing SEO duplicate guard.
3. Generate route-level remediation tickets for EXPAND, MERGE, REDIRECT, NOINDEX, and DELETE decisions.
4. Connect Search Console crawled-not-indexed rows to decision priority.
5. Re-run after each content cleanup sprint to measure indexation and authority improvement.
`;

const reportPath = path.join(process.cwd(), "docs/reports/thin-content-eradication-authority-expansion.md");
await mkdir(path.dirname(reportPath), { recursive: true });
await writeFile(reportPath, report);
console.log(`Wrote ${reportPath}`);

