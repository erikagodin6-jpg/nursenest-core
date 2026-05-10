#!/usr/bin/env npx tsx
/**
 * Generates repo-backed RT long-tail markdown under src/content/blog-static-longtail/.
 * Run from nursenest-core/: npx tsx scripts/blog/generate-rt-longtail-files.mts
 *
 * Options: --dry-run (validate word counts only), --force (overwrite existing matching slugs)
 */
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { buildLongtailBodyHtml, countWordsInHtmlBody } from "./rt-longtail/body-builder";
import { getRtLongtailTopicManifest } from "./rt-longtail/manifest";

const __dirname = dirname(fileURLToPath(import.meta.url));
const APP_ROOT = join(__dirname, "..", "..");
const LONGTAIL_DIR = join(APP_ROOT, "src", "content", "blog-static-longtail");

function yq(s: string): string {
  return JSON.stringify(s);
}

function buildMarkdown(topic: ReturnType<typeof getRtLongtailTopicManifest>[number], bodyHtml: string): string {
  const slug = topic.slug.trim();
  const disclaimer =
    "This article supports respiratory therapy education and exam preparation. It is not individualized medical advice, a substitute for your institution's policies, or a treatment protocol. Always follow local scope, orders, and monitoring standards in real patient care.";
  const seoTitle = `${topic.title} | NurseNest`;
  return `---
slug: ${slug}
title: ${yq(topic.title)}
excerpt: ${yq(topic.excerpt)}
category: ${yq(topic.category)}
tags: ${JSON.stringify(topic.tags)}
publishedAt: 2026-05-09
updatedAt: 2026-05-09
seoTitle: ${yq(seoTitle)}
seoDescription: ${yq(topic.excerpt)}
canonicalUrl: /blog/${slug}
authorDisplayName: NurseNest Editorial
medicalReviewerName: Clinical review board (educational)
disclaimer: ${yq(disclaimer)}
---

${bodyHtml}
`;
}

function main(): void {
  const dry = process.argv.includes("--dry-run");
  const force = process.argv.includes("--force");
  const topics = getRtLongtailTopicManifest();
  const allSlugs = topics.map((t) => t.slug);

  let minW = 1e9;
  let maxW = 0;
  let pass = 0;
  let fail = 0;

  for (const topic of topics) {
    const body = buildLongtailBodyHtml(topic, allSlugs);
    const w = countWordsInHtmlBody(body);
    minW = Math.min(minW, w);
    maxW = Math.max(maxW, w);
    const ok = w >= 1200 && w <= 1800;
    if (ok) pass += 1;
    else fail += 1;

    if (dry) continue;

    const path = join(LONGTAIL_DIR, `${topic.slug}.md`);
    if (existsSync(path) && !force) {
      throw new Error(`Refusing to overwrite ${path} (pass --force to replace).`);
    }
    mkdirSync(LONGTAIL_DIR, { recursive: true });
    writeFileSync(path, buildMarkdown(topic, body), "utf8");
  }

  console.log(`topics=${topics.length} wordRange=${minW}-${maxW} bandPass=${pass} bandFail=${fail}`);
  if (fail > 0) {
    console.error("Word count outside 1200–1800 for one or more topics; tune body-builder.");
    process.exit(1);
  }
  if (dry) process.exit(0);
}

main();
