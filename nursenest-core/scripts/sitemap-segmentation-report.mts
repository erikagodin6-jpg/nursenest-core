#!/usr/bin/env npx tsx
/**
 * Phase 4: run sitemap segmentation validation and write `docs/reports/sitemap-segmentation-validation.md`.
 * Uses the same validation as `npm run sitemap:validate`.
 *
 * Exit code follows validation (1 if errors).
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import "./load-dotenv-for-cli.mts";
import {
  formatSitemapSegmentationReportMarkdown,
  runSitemapSegmentationValidation,
} from "@/lib/seo/sitemap-segment-validator";

const packageRoot = resolve(fileURLToPath(new URL(".", import.meta.url)), "..");
const reportPath = resolve(packageRoot, "docs/reports/sitemap-segmentation-validation.md");

async function main() {
  const report = await runSitemapSegmentationValidation({});
  const md = formatSitemapSegmentationReportMarkdown(report);

  mkdirSync(dirname(reportPath), { recursive: true });
  writeFileSync(reportPath, md, "utf8");

  console.log(`Wrote ${reportPath}`);
  console.log(md);

  if (report.errors.length > 0) {
    console.error(`\n[sitemap:report] FAILED — ${report.errors.length} error(s)`);
    process.exit(1);
  }
  console.error("\n[sitemap:report] OK");
}

main().catch((e) => {
  console.error("[sitemap:report]", e);
  process.exit(1);
});
