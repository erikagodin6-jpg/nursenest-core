#!/usr/bin/env npx tsx
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import {
  listAllBlogStaticLongtailFileRecords,
} from "../../src/lib/blog/blog-static-longtail-load";
import { validateAllBlogStaticLongtailRecords } from "../../src/lib/blog/blog-static-longtail-validate";

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
] as const;

function countWords(html: string): number {
  return html.replace(/<[^>]+>/g, " ").trim().split(/\s+/).filter(Boolean).length;
}

const requiredSectionPatterns = [
  /<h2>.*?(why this topic|clinical overview).*?<\/h2>/i,
  /<h2>.*?pathophysiology.*?<\/h2>/i,
  /<h2>.*?(assessment|cues|lab).*?<\/h2>/i,
  /<h2>.*?nclex nursing priorities.*?<\/h2>/i,
  /<h2>.*?suggested internal links.*?<\/h2>/i,
  /<h2>.*?premium lesson cta.*?<\/h2>/i,
  /<h2>.*?faq schema questions.*?<\/h2>/i,
  /<h2>.*?apa-7 references.*?<\/h2>/i,
];

const all = listAllBlogStaticLongtailFileRecords();
const bySlug = new Map(all.map((x) => [x.record.slug, x]));
const issues: string[] = [];
const rows: string[] = [];

const baseIssues = validateAllBlogStaticLongtailRecords(
  slugs.flatMap((slug) => {
    const hit = bySlug.get(slug);
    return hit ? [{ file: hit.file, record: hit.record }] : [];
  }),
);
for (const issue of baseIssues) issues.push(`${issue.file}: ${issue.message}`);

for (const slug of slugs) {
  const hit = bySlug.get(slug);
  if (!hit) {
    issues.push(`${slug}: missing file`);
    continue;
  }
  const before = issues.length;
  const { file, record } = hit;
  const words = countWords(record.bodyHtml);
  const headingsOk = requiredSectionPatterns.every((pattern) => pattern.test(record.bodyHtml));
  const faqCount = (record.bodyHtml.match(/<h3>/g) ?? []).length;
  const refCount = (record.bodyHtml.match(/<h2>APA-7 References<\/h2>/g) ?? []).length
    ? (record.bodyHtml.match(/<p>.*?(doi\.org|https?:\/\/).*?<\/p>/g) ?? []).length
    : 0;
  const linkCount = (record.bodyHtml.match(/<a href="\/(?:blog|app)\//g) ?? []).length;
  const hasUnsafeAdvice = /\b(treat yourself|ignore symptoms|guaranteed cure|change your dose without|stop taking without)\b/i.test(record.bodyHtml);
  if (words < 1200 || words > 1600) issues.push(`${file}: word count ${words} outside 1200-1600`);
  if (!headingsOk) issues.push(`${file}: missing one or more required sections`);
  if (faqCount < 3) issues.push(`${file}: expected at least 3 FAQ questions, found ${faqCount}`);
  if (refCount < 1) issues.push(`${file}: expected at least 1 linked APA/reference entry, found ${refCount}`);
  if (linkCount < 3) issues.push(`${file}: expected at least 3 internal links, found ${linkCount}`);
  if (record.draft) issues.push(`${file}: still marked draft`);
  if (record.tags.length === 0) issues.push(`${file}: tags empty`);
  if (hasUnsafeAdvice) issues.push(`${file}: unsafe advice phrase detected`);
  rows.push(`- ${record.title} | ${record.slug} | words=${words} | status=${issues.length > before ? "blocked" : "published_static"} | url=/blog/${record.slug}`);
}

const seenTitles = new Map<string, string>();
for (const slug of slugs) {
  const hit = bySlug.get(slug);
  if (!hit) continue;
  const title = hit.record.title.trim().toLowerCase();
  const first = seenTitles.get(title);
  if (first) issues.push(`${hit.file}: duplicate title also in ${first}`);
  else seenTitles.set(title, hit.file);
}

const report = [
  "# Clinical Long-Tail Blog Batch Validation",
  "",
  `Generated: ${new Date().toISOString()}`,
  `Requested posts: ${slugs.length}`,
  `Passed: ${issues.length === 0}`,
  "",
  "## Posts",
  ...rows,
  "",
  "## Issues",
  issues.length ? issues.map((i) => `- ${i}`) : ["- None"],
  "",
].join("\n");

const reportPath = join(process.cwd(), "docs", "reports", "clinical-longtail-batch-validation.md");
mkdirSync(join(process.cwd(), "docs", "reports"), { recursive: true });
writeFileSync(reportPath, report, "utf8");
console.log(report);
console.log(`Report: ${reportPath}`);
if (issues.length) process.exit(1);
