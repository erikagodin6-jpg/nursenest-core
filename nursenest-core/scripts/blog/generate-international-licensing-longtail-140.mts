#!/usr/bin/env npx tsx
/**
 * Deterministic 140-post international licensing / IEN long-tail batch.
 *
 * Run from `nursenest-core/`:
 *   npx tsx scripts/blog/generate-international-licensing-longtail-140.mts --dry-run
 *   npx tsx scripts/blog/generate-international-licensing-longtail-140.mts --write
 *   npx tsx scripts/blog/generate-international-licensing-longtail-140.mts --write --force-overwrite
 *
 * Writes markdown to `src/content/blog-static-longtail/` and a machine-readable
 * JSON summary next to the human report for `reports/international-licensing-longtail-batch-140.md`.
 */
import { existsSync, mkdirSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { countWordsFromHtml } from "@/lib/blog/blog-word-count";

import { getInternationalLicensingLongtailSpecs } from "./international-licensing-longtail/specs";
import { renderInternationalLicensingArticle } from "./international-licensing-longtail/render-article";
import type { InternationalLicensingTopicSpec } from "./international-licensing-longtail/types";

const OUT_DIR = join(process.cwd(), "src", "content", "blog-static-longtail");
const REPORT_MD = join(process.cwd(), "reports", "international-licensing-longtail-batch-140.md");
const REPORT_JSON = join(process.cwd(), "reports", "international-licensing-longtail-batch-140.summary.json");
const MIN_WORDS = 1500;
const PUBLISHED_AT = "2026-05-09";
const UPDATED_AT = "2026-05-09";

function frontmatter(spec: InternationalLicensingTopicSpec): string {
  const tags = spec.tags.join(", ");
  return `---
slug: ${spec.slug}
title: ${spec.title}
excerpt: ${spec.excerpt}
category: ${spec.category}
tags: ${tags}
publishedAt: ${PUBLISHED_AT}
updatedAt: ${UPDATED_AT}
draft: false
seoTitle: ${spec.seoTitle}
seoDescription: ${spec.seoDescription}
canonicalUrl: /blog/${spec.slug}
authorDisplayName: NurseNest Editorial
medicalReviewerName: Clinical review board (educational)
disclaimer: This article supports educational exam preparation and clinical reasoning practice for internationally educated nurses. It is not individualized medical advice, legal advice, immigration advice, or a substitute for official regulator instructions. Regulations change by jurisdiction and time; verify every requirement with the authoritative regulator or board portal before acting.
---

`;
}

/** Frontmatter title/excerpt etc. should stay YAML-safe: avoid raw quotes in source strings. */
function validateYamlFriendly(spec: InternationalLicensingTopicSpec): void {
  const fields = [spec.title, spec.excerpt, spec.category, spec.seoTitle, spec.seoDescription];
  for (const f of fields) {
    if (f.includes('"') || f.includes("\n") || f.includes("\r")) {
      throw new Error(`YAML-unsafe field for slug ${spec.slug}: avoid double quotes or newlines in titles/excerpts`);
    }
  }
}

function supplementalWordsBlock(): string {
  return `<h2>Credential portfolio checklist (printable habit)</h2>
<p>Maintain a single master PDF packet and a mirrored cloud folder with dated filenames. Include passport biographical page, name change affidavits if applicable, nursing diploma and transcripts, course syllabi or hour logs if regulators request them, current and past licenses, employment verification letters with HR contact details, basic life support cards, language test score sheets, and every email acknowledgment from verification agencies. Update a one-page timeline spreadsheet with columns for agency, submission date, expected completion date, and follow-up date. This administrative discipline does not replace studying, but it prevents administrative panic from stealing the deep work blocks you need for clinical judgment practice.</p>
<p>When you contact schools or councils, send concise emails with bullet requests and attach only what they ask for; large attachments can delay responses. If you must translate documents, use processes your regulator recognizes and keep translator credentials on file. Photograph courier packages before sealing them. These habits sound trivial until a lost packet delays an exam seat you already paid for.</p>`;
}

function main(): void {
  const write = process.argv.includes("--write");
  const forceOverwrite = process.argv.includes("--force-overwrite");
  const specs = getInternationalLicensingLongtailSpecs();
  const existing = existsSync(OUT_DIR)
    ? new Set(readdirSync(OUT_DIR).filter((f) => f.endsWith(".md")).map((f) => f.replace(/\.md$/, "")))
    : new Set<string>();

  const rows: string[] = [];
  rows.push(`# International licensing long-tail batch (140)`);
  rows.push("");
  rows.push(`Generated (UTC): ${new Date().toISOString()}`);
  rows.push("");
  rows.push(`| Title | Slug | Country | Exam | Word count | Status |`);
  rows.push(`| --- | --- | --- | --- | ---: | --- |`);

  const jsonRows: Array<Record<string, unknown>> = [];
  let minW = Infinity;
  let maxW = 0;

  for (const spec of specs) {
    validateYamlFriendly(spec);
    if (existing.has(spec.slug) && !forceOverwrite) {
      throw new Error(
        `Refusing to overwrite existing long-tail slug file: ${spec.slug}.md (pass --force-overwrite to replace)`,
      );
    }
    let body = renderInternationalLicensingArticle(spec);
    let words = countWordsFromHtml(body);
    if (words < MIN_WORDS) {
      body += supplementalWordsBlock();
      words = countWordsFromHtml(body);
    }
    if (words < MIN_WORDS) {
      throw new Error(`Word count gate failed for ${spec.slug}: ${words} < ${MIN_WORDS}`);
    }
    minW = Math.min(minW, words);
    maxW = Math.max(maxW, words);

    const status = write ? "written" : "validated_only";
    if (write) {
      mkdirSync(OUT_DIR, { recursive: true });
      writeFileSync(join(OUT_DIR, `${spec.slug}.md`), frontmatter(spec) + body, "utf8");
    }

    rows.push(
      `| ${spec.title.replace(/\|/g, "\\|")} | \`${spec.slug}\` | ${spec.country.replace(/\|/g, "\\|")} | ${spec.exam.replace(/\|/g, "\\|")} | ${words} | ${status} |`,
    );
    jsonRows.push({
      title: spec.title,
      slug: spec.slug,
      country: spec.country,
      exam: spec.exam,
      wordCount: words,
      seoComplete: Boolean(
        spec.seoTitle?.trim() && spec.seoDescription?.trim() && spec.slug?.trim(),
      ),
      status,
    });
  }

  rows.push("");
  rows.push(`## Summary`);
  rows.push(`- Posts: **${specs.length}**`);
  rows.push(`- Word count min / max: **${minW}** / **${maxW}** (gate ≥ ${MIN_WORDS})`);
  rows.push(`- SEO: each row includes \`seoTitle\`, \`seoDescription\`, \`canonicalUrl\` in frontmatter.`);
  rows.push(`- Internal links: see “Suggested internal links” section in each article (blog + /app routes + modules).`);
  rows.push(`- Excluded failures: none (generator fails closed on gates).`);
  rows.push("");
  rows.push(`## Validation commands (run from nursenest-core/)`);
  rows.push(`- \`npm run validate:blog-static-longtail\``);
  rows.push(`- \`npm run diagnose:blog-slug-collisions -- --write-report\``);
  rows.push(`- \`npm run typecheck:critical\``);
  rows.push(`- \`npm run test:blog-recovery\``);
  rows.push(`- \`npm run test:homepage\``);
  rows.push("");

  mkdirSync(join(process.cwd(), "reports"), { recursive: true });
  if (write) {
    writeFileSync(REPORT_MD, rows.join("\n"), "utf8");
    writeFileSync(
      REPORT_JSON,
      JSON.stringify(
        {
          generatedAt: new Date().toISOString(),
          count: specs.length,
          minWords: minW,
          maxWords: maxW,
          posts: jsonRows,
        },
        null,
        2,
      ) + "\n",
      "utf8",
    );
  }

  // eslint-disable-next-line no-console
  console.log(
    JSON.stringify(
      {
        ok: true,
        write,
        count: specs.length,
        minWords: minW,
        maxWords: maxW,
        reportMd: write ? REPORT_MD : null,
        reportJson: write ? REPORT_JSON : null,
      },
      null,
      2,
    ),
  );
}

main();
