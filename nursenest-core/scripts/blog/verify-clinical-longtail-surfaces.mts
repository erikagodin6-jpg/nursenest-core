#!/usr/bin/env npx tsx
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import {
  getPublishedBlogPostBySlug,
  getPublishedBlogPostsByCategoryPage,
  getPublishedBlogPostsPage,
  staticBlogSitemapSlugRows,
} from "../../src/lib/blog/safe-blog-queries";
import { listBlogStaticLongtailRecords } from "../../src/lib/blog/blog-static-longtail-load";

const slugs = [
  "siadh-vs-diabetes-insipidus-nursing-comparison",
  "dka-vs-hhs-nursing-priorities",
  "acute-kidney-injury-prerenal-intrinsic-postrenal",
  "left-sided-vs-right-sided-heart-failure",
  "sepsis-pathophysiology-early-nursing-recognition",
  "digoxin-toxicity-nursing-priorities",
  "warfarin-vs-heparin-nursing-comparison",
  "beta-blockers-mechanism-side-effects-nursing-teaching",
  "hyponatremia-symptoms-causes-nursing-priorities",
  "hypernatremia-causes-symptoms-nursing-care",
  "hypocalcemia-vs-hypercalcemia-nclex-guide",
  "metabolic-acidosis-vs-metabolic-alkalosis",
  "respiratory-acidosis-vs-respiratory-alkalosis",
  "copd-symptoms-treatment-nursing-care",
  "asthma-pathophysiology-emergency-nursing-interventions",
  "pulmonary-embolism-signs-symptoms-nursing-priorities",
  "deep-vein-thrombosis-nursing-guide",
  "stroke-ischemic-vs-hemorrhagic-nursing-care",
  "increased-intracranial-pressure-nursing-priorities",
  "seizure-disorders-treatment-nursing-care",
];

const bySlug = new Map(listBlogStaticLongtailRecords().map((r) => [r.slug, r]));
const index = await getPublishedBlogPostsPage(1, 500, undefined, { includeTotal: true });
const indexSlugs = new Set(index.posts.map((p) => p.slug));
const sitemapSlugs = new Set(staticBlogSitemapSlugRows().map((r) => r.slug));
const issues: string[] = [];
const rows: string[] = [];

for (const slug of slugs) {
  const record = bySlug.get(slug);
  if (!record) {
    issues.push(`${slug}: missing static record`);
    continue;
  }
  const detail = await getPublishedBlogPostBySlug(slug);
  if (!detail) issues.push(`${slug}: individual /blog/[slug] loader did not resolve`);
  else if ((detail.body ?? "").length < 1000) issues.push(`${slug}: detail body too short`);

  if (!indexSlugs.has(slug)) issues.push(`${slug}: not present in public blog index page loader`);

  const category = await getPublishedBlogPostsByCategoryPage(record.category, 1, 200);
  const categoryHit = category.posts.some((p) => p.slug === slug);
  if (!categoryHit) issues.push(`${slug}: not present in category hub "${record.category}"`);

  if (!sitemapSlugs.has(slug)) issues.push(`${slug}: missing from static sitemap slug rows`);

  rows.push(
    `- ${record.title} | /blog/${slug} | index=${indexSlugs.has(slug)} | category=${record.category}:${categoryHit} | detail=${Boolean(detail)} | sitemap=${sitemapSlugs.has(slug)}`,
  );
}

const report = [
  "# Clinical Long-Tail Surface Verification",
  "",
  `Generated: ${new Date().toISOString()}`,
  `Passed: ${issues.length === 0}`,
  "",
  "## Surface Rows",
  ...rows,
  "",
  "## Issues",
  issues.length ? issues.map((i) => `- ${i}`) : ["- None"],
  "",
].join("\n");

const reportPath = join(process.cwd(), "docs", "reports", "clinical-longtail-surface-verification.md");
mkdirSync(join(process.cwd(), "docs", "reports"), { recursive: true });
writeFileSync(reportPath, report, "utf8");
console.log(report);
console.log(`Report: ${reportPath}`);
if (issues.length) process.exit(1);
