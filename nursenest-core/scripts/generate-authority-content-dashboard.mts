import { writeFileSync } from "node:fs";
import { join } from "node:path";
import {
  AUTHORITY_CATEGORY_META,
  buildAuthorityContentDashboard,
} from "../src/lib/authority/healthcare-authority-content-engine";

const dashboard = buildAuthorityContentDashboard();

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
  "",
  "## Library Coverage",
  "",
  "| Library | Published | Phase-One Target | Long-Term Target | Draft Gap | Awaiting Review | EEAT | Clinical Authority | Avg Authority Score | Schema | Internal Links/Page | Monetization |",
  "| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- |",
  ...dashboard.rows.map((row) =>
    [
      AUTHORITY_CATEGORY_META[row.category].title,
      row.publishedPages,
      row.phaseOneTarget,
      row.longTermTarget,
      row.draftGap,
      row.pagesAwaitingReview,
      `${row.eeatCoverage}%`,
      `${row.clinicalAuthorityCoverage}%`,
      `${row.averageClinicalAuthorityScore}/100`,
      `${row.schemaCoverage}%`,
      row.internalLinkAverage,
      row.monetizationReadiness,
    ].join(" | ").replace(/^/, "| ").replace(/$/, " |"),
  ),
  "",
  "## Notes",
  "",
  "- This dashboard tracks architecture readiness and live seed coverage, not final content volume.",
  "- `Clinical Authority` means pages satisfy the full NurseNest clinical authority standard: target depth, required elements, strong references, deep internal linking, and clinical review.",
  "- `Awaiting Review` means the page has EEAT fields and references but still needs clinician review before being positioned as fully clinically reviewed.",
  "- Phase-one gaps should be filled through reviewed, meaningful pages only. Do not generate thin pages simply to close a numeric target.",
  "- Every new page should preserve internal links to related healthcare library pages and relevant NurseNest learning products.",
  "",
];

writeFileSync(join(process.cwd(), "docs/content-authority-dashboard.md"), lines.join("\n"));
