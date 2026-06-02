#!/usr/bin/env node
/**
 * Focused SEO regression guardrails.
 *
 * Keep this runner stable for CI: it intentionally avoids broad globs like `src/lib/seo/*.test.ts`,
 * because that glob includes heavier/env-sensitive legacy tests tracked separately in the Phase 8 report.
 */
import { spawnSync } from "node:child_process";

const steps = [
  ["sitemap validation", "npm", ["run", "sitemap:validate"]],
  ["sitemap report", "npm", ["run", "sitemap:report"]],
  [
    "robots/sitemap contracts",
    "node",
    [
      "--import",
      "tsx",
      "--test",
      "src/app/robots.txt/route.test.ts",
      "src/lib/seo/robots-route-source.contract.test.ts",
      "src/lib/seo/sitemap-index.contract.test.ts",
      "src/lib/seo/sitemap-segment-dedupe.contract.test.ts",
      "src/lib/seo/sitemap-public-index-filter.test.ts",
      "src/lib/seo/sitemap-merged-route.test.ts",
      "src/lib/seo/sitemap-phase2-segmentation.contract.test.ts",
      "src/lib/seo/sitemap-phase3-segmentation.contract.test.ts",
      "src/lib/seo/sitemap-segment-validator.test.ts",
      "src/lib/seo/sitemap-rn-pn-core-pathways.contract.test.ts",
      "src/lib/seo/sitemap-allied.contract.test.ts",
      "src/app/sitemap-new-grad.xml/sitemap-new-grad.contract.test.ts",
    ],
  ],
  [
    "canonical/hreflang/localized SEO",
    "node",
    [
      "--import",
      "tsx",
      "--test",
      "src/lib/seo/marketing-alternates.test.ts",
      "src/lib/seo/exam-pathway-hub-alternates.test.ts",
      "src/lib/seo/localized-seo-readiness.test.ts",
      "src/lib/seo/public-url-validator.test.ts",
      "src/lib/seo/safe-marketing-metadata.test.ts",
    ],
  ],
  [
    "breadcrumb governance scan",
    "node",
    ["scripts/breadcrumb-governance-scan.mjs"],
  ],
  [
    "semantic navigation static release gate",
    "node",
    [
      "--import",
      "tsx",
      "src/lib/breadcrumbs/governance/semantic-navigation-release-gate.ts",
    ],
  ],
  [
    "breadcrumb/internal-link schema",
    "node",
    [
      "--import",
      "tsx",
      "--test",
      "src/components/seo/breadcrumb-json-ld.test.tsx",
      "src/components/blog/blog-post-distribution-footer.test.tsx",
      "src/lib/seo/breadcrumb-i18n.test.ts",
      "src/lib/seo/pathway-breadcrumbs.test.ts",
      "src/lib/breadcrumbs/breadcrumb-intent.test.ts",
      "src/lib/breadcrumbs/schema-ownership.test.ts",
      "src/lib/breadcrumbs/layout-fallback-policy.test.ts",
      "src/lib/breadcrumbs/breadcrumb-governance.test.ts",
      "src/lib/breadcrumbs/ecg-academy-governance.contract.test.ts",
      "src/lib/breadcrumbs/breadcrumb-schema-e2e.contract.test.ts",
      "src/lib/breadcrumbs/structured-data-governance.contract.test.ts",
      "src/lib/breadcrumbs/pathname-normalization.contract.test.ts",
      "src/lib/breadcrumbs/navigation-analytics.contract.test.ts",
      "src/lib/breadcrumbs/reasoning-chain.contract.test.ts",
      "src/lib/breadcrumbs/glossary-governance.contract.test.ts",
      "src/lib/breadcrumbs/residual-authority-governance.contract.test.ts",
      "src/lib/breadcrumbs/governance/seo-surface-governance.contract.test.ts",
      "src/lib/breadcrumbs/governance/runtime-semantic-integrity.contract.test.ts",
      "src/lib/breadcrumbs/governance/semantic-telemetry-lineage.contract.test.ts",
      "src/lib/breadcrumbs/governance/semantic-route-coverage.contract.test.ts",
      "src/lib/breadcrumbs/governance/ontology-runtime-integrity.contract.test.ts",
      "src/lib/breadcrumbs/governance/telemetry-lineage.contract.test.ts",
      "src/lib/breadcrumbs/governance/graph-continuity-observability.contract.test.ts",
      "src/lib/breadcrumbs/governance/client-navigation-governance.contract.test.ts",
      "src/lib/lessons/marketing-lesson-path-guard.test.ts",
    ],
  ],
];

for (const [label, bin, args] of steps) {
  console.error(`\n[seo:guardrails] ${label}`);
  const result = spawnSync(bin, args, { stdio: "inherit", shell: process.platform === "win32" });
  if (result.status !== 0) {
    console.error(`[seo:guardrails] FAILED: ${label}`);
    process.exit(result.status ?? 1);
  }
}

console.error("\n[seo:guardrails] OK");
