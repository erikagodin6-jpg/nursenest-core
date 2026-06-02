#!/usr/bin/env npx tsx
/**
 * Phase 4: validate all segmented sitemap routes offline (invokes App Router GET handlers).
 *
 * Env:
 * - `SITEMAP_VALIDATE_SEGMENT_BUDGET_MS` — max generation time per segment + index (default 240000).
 *
 * Exit 1 when validation errors exist (duplicate locs, invalid URLs, index mismatch, XML parse failures, 48k cap, time budget).
 */
import "./load-dotenv-for-cli.mts";
import {
  formatSitemapSegmentationReportMarkdown,
  runSitemapSegmentationValidation,
} from "@/lib/seo/sitemap-segment-validator";

async function main() {
  const report = await runSitemapSegmentationValidation({});
  const md = formatSitemapSegmentationReportMarkdown(report);

  console.log(md);

  if (report.errors.length > 0) {
    console.error(`\n[sitemap:validate] FAILED — ${report.errors.length} error(s)`);
    process.exit(1);
  }
  console.error("\n[sitemap:validate] OK");
}

main().catch((e) => {
  console.error("[sitemap:validate]", e);
  process.exit(1);
});
