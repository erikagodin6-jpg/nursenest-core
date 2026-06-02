#!/usr/bin/env npx tsx
/**
 * Deterministic generator: 30 anchors × 11 variants = 330 REx-PN RPN long-tail markdown posts.
 *
 * Run from nursenest-core/: `npx tsx scripts/blog/rex-pn-rpn-longtail/generate-batch.mts`
 *
 * Options:
 *   --dry-run       Print counts only, do not write files
 *   --verify-only   Recompute word counts for existing files, exit 1 if any < 1400 words
 */
import { mkdirSync, writeFileSync, readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { countWordsFromHtml } from "@/lib/blog/blog-word-count";
import { ANCHORS } from "./anchors-data";
import { VARIANTS } from "./variants-data";
import { buildLongtailBodyHtml } from "./body-build";

const __dirname = dirname(fileURLToPath(import.meta.url));
/** From `scripts/blog/rex-pn-rpn-longtail/` → app root `nursenest-core/` */
const APP_ROOT = join(__dirname, "..", "..", "..");
const OUT_DIR = join(APP_ROOT, "src", "content", "blog-static-longtail");

const MIN_WORDS = 1400;
const PUBLISHED_AT = "2026-05-09";
const UPDATED_AT = "2026-05-09";

function kebabFileName(slug: string): string {
  return `${slug}.md`;
}

function excerptFor(anchorTitle: string, variant: (typeof VARIANTS)[number]): string {
  const base = `${anchorTitle} — ${variant.titleSuffix}: Canadian PN/RPN scope, REx-PN-style traps, documentation, delegation, and escalation language for exam preparation (educational).`;
  return base.length > 320 ? `${base.slice(0, 317)}...` : base;
}

function seoTitleFor(fullTitle: string): string {
  const suffix = " | NurseNest";
  const max = 62;
  if (fullTitle.length + suffix.length <= max) return `${fullTitle}${suffix}`;
  let head = fullTitle.slice(0, max - suffix.length).trim();
  const cut = head.lastIndexOf(" ");
  if (cut > 28) head = head.slice(0, cut).trim();
  head = head.replace(/[:;,.\-–]+$/, "").trim();
  return `${head}${suffix}`;
}

function seoDescriptionFor(excerpt: string): string {
  if (excerpt.length <= 165) return excerpt;
  return `${excerpt.slice(0, 162).trim()}...`;
}

function tagsJson(anchorTags: string[]): string {
  const merged = Array.from(
    new Set(
      [
        ...anchorTags,
        "REx-PN",
        "RPN Canada",
        "PN Canada",
        "Practical nursing",
        "Canadian nursing",
        "Exam preparation",
      ].map((t) => t.trim()),
    ),
  ).filter(Boolean);
  return JSON.stringify(merged);
}

function buildFrontmatter(input: {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  tags: string;
  seoTitle: string;
  seoDescription: string;
}): string {
  return `---
slug: ${input.slug}
title: ${JSON.stringify(input.title)}
excerpt: ${JSON.stringify(input.excerpt)}
category: ${JSON.stringify(input.category)}
tags: ${input.tags}
publishedAt: ${PUBLISHED_AT}
updatedAt: ${UPDATED_AT}
seoTitle: ${JSON.stringify(input.seoTitle)}
seoDescription: ${JSON.stringify(input.seoDescription)}
canonicalUrl: /blog/${input.slug}
authorDisplayName: NurseNest Editorial
medicalReviewerName: Clinical review board (educational)
disclaimer: This article supports exam preparation and clinical reasoning practice. It is not individualized medical advice, a substitute for your institution's policies, or a treatment protocol. Always follow local scope, orders, and Canadian regulatory standards in real patient care.
---

`;
}

function combinations() {
  const rows: { slug: string; anchor: (typeof ANCHORS)[number]; variant: (typeof VARIANTS)[number]; title: string }[] = [];
  for (const anchor of ANCHORS) {
    for (const variant of VARIANTS) {
      const slug = `rex-pn-rpn-${anchor.slugBase}-${variant.slugSuffix}`;
      const title = `${anchor.titleCore}: ${variant.titleSuffix} (Canadian RPN REx-PN prep)`;
      rows.push({ slug, anchor, variant, title });
    }
  }
  return rows;
}

function wordCountBodyOnly(md: string): number {
  const trimmed = md.replace(/^\uFEFF/, "");
  if (!trimmed.startsWith("---")) return 0;
  const rest = trimmed.slice(trimmed.indexOf("\n") + 1);
  const end = rest.indexOf("\n---");
  if (end < 0) return 0;
  const body = rest.slice(end + 4).replace(/^\s*\n/, "");
  return countWordsFromHtml(body);
}

async function main(): Promise<void> {
  const dry = process.argv.includes("--dry-run");
  const verifyOnly = process.argv.includes("--verify-only");

  const rows = combinations();
  if (rows.length !== 330) {
    console.error(`Expected 330 combinations, got ${rows.length} (anchors=${ANCHORS.length} variants=${VARIANTS.length})`);
    process.exit(1);
  }

  if (verifyOnly) {
    const files = readdirSync(OUT_DIR)
      .filter((f) => f.startsWith("rex-pn-rpn-") && f.endsWith(".md"))
      .map((f) => join(OUT_DIR, f));
    if (!files.length) {
      console.error("No rex-pn-rpn-*.md files found for --verify-only");
      process.exit(1);
    }
    let bad = 0;
    for (const fp of files) {
      const raw = readFileSync(fp, "utf8");
      const wc = wordCountBodyOnly(raw);
      if (wc < MIN_WORDS) {
        console.error(`${fp}: ${wc} words (< ${MIN_WORDS})`);
        bad++;
      }
    }
    console.log(`Verified ${files.length} file(s), ${bad} below word floor.`);
    process.exit(bad ? 1 : 0);
    return;
  }

  if (dry) {
    console.log(`Would write ${rows.length} files to ${OUT_DIR}`);
    const sample = rows[0]!;
    const body = buildLongtailBodyHtml(sample.slug, sample.anchor, sample.variant);
    const wc = countWordsFromHtml(body);
    console.log(`Sample slug ${sample.slug} body words=${wc}`);
    process.exit(wc < MIN_WORDS ? 1 : 0);
    return;
  }

  mkdirSync(OUT_DIR, { recursive: true });
  let failures = 0;
  for (const row of rows) {
    const body = buildLongtailBodyHtml(row.slug, row.anchor, row.variant);
    const wc = countWordsFromHtml(body);
    if (wc < MIN_WORDS) {
      console.error(`FAIL word count ${wc} < ${MIN_WORDS}: ${row.slug}`);
      failures++;
      continue;
    }
    const excerpt = excerptFor(row.anchor.titleCore, row.variant);
    const fm = buildFrontmatter({
      slug: row.slug,
      title: row.title,
      excerpt,
      category: row.anchor.category,
      tags: tagsJson(row.anchor.tagSeeds),
      seoTitle: seoTitleFor(row.title),
      seoDescription: seoDescriptionFor(excerpt),
    });
    const outPath = join(OUT_DIR, kebabFileName(row.slug));
    writeFileSync(outPath, `${fm}${body}`, "utf8");
  }

  if (failures) {
    console.error(`Completed with ${failures} failure(s) — not all files written.`);
    process.exit(1);
  }
  console.log(`OK: wrote ${rows.length} REx-PN RPN long-tail markdown file(s).`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
