#!/usr/bin/env npx tsx
/**
 * Quality report for Philippines NLE blog seed bodies (no DB).
 *
 * Usage (from nursenest-core/):
 *   npx tsx scripts/blog/validate-philippines-nle-blog-seeds.mts
 */
import {
  MIN_WORDS,
  PHILIPPINES_NLE_BLOG_TOPICS,
  buildPhilippinesBlogBody,
  wordCountFromHtml,
} from "./philippines-nle-blog-seed-catalog";

function firstParagraphHtml(html: string): string {
  const m = html.match(/<p[^>]*>([\s\S]*?)<\/p>/);
  return m ? m[1]!.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim() : "";
}

function needsMigrationSection(angle: string): boolean {
  return angle === "us-migration" || angle === "ca-migration" || angle === "nclex";
}

function main() {
  const counts: number[] = [];
  const titles = new Map<string, string[]>();
  const intros = new Map<string, string[]>();
  let missingInternal = 0;
  let missingPractice = 0;
  let missingSummary = 0;
  let missingMigration = 0;
  let belowMin = 0;

  for (const t of PHILIPPINES_NLE_BLOG_TOPICS) {
    const body = buildPhilippinesBlogBody(t);
    const wc = wordCountFromHtml(body);
    counts.push(wc);
    if (wc < MIN_WORDS) belowMin += 1;

    const titleKey = t.title.trim().toLowerCase();
    const prevT = titles.get(titleKey) ?? [];
    prevT.push(t.slug);
    titles.set(titleKey, prevT);

    const intro = firstParagraphHtml(body).toLowerCase();
    const prevI = intros.get(intro) ?? [];
    prevI.push(t.slug);
    intros.set(intro, prevI);

    if (!body.includes("Internal links for next steps")) missingInternal += 1;
    if (!body.includes("Practice spotlight")) missingPractice += 1;
    if (!body.includes("<h2>Summary</h2>")) missingSummary += 1;

    if (needsMigrationSection(t.angle) && !body.includes("If you plan to work")) {
      missingMigration += 1;
    }
  }

  const dupTitles = [...titles.entries()].filter(([, slugs]) => slugs.length > 1);
  const dupIntros = [...intros.entries()].filter(([, slugs]) => slugs.length > 1);

  const minC = Math.min(...counts);
  const maxC = Math.max(...counts);
  const avgC = counts.reduce((a, b) => a + b, 0) / counts.length;

  console.log(`[validate-ph-nle] topics: ${PHILIPPINES_NLE_BLOG_TOPICS.length}`);
  console.log(`[validate-ph-nle] word count min: ${minC}  max: ${maxC}  avg: ${avgC.toFixed(1)}  (target ≥ ${MIN_WORDS})`);
  console.log(`[validate-ph-nle] below ${MIN_WORDS} words: ${belowMin}`);
  console.log(`[validate-ph-nle] duplicate titles: ${dupTitles.length} distinct collisions`);
  if (dupTitles.length) {
    for (const [k, sl] of dupTitles.slice(0, 8)) {
      console.log(`  — "${k.slice(0, 72)}…" → ${sl.join(", ")}`);
    }
  }
  console.log(`[validate-ph-nle] duplicate first-paragraph intros: ${dupIntros.length} distinct collisions`);
  if (dupIntros.length) {
    for (const [, sl] of dupIntros.slice(0, 5)) {
      console.log(`  — slugs: ${sl.join(", ")}`);
    }
  }
  console.log(`[validate-ph-nle] missing "Internal links" block: ${missingInternal}`);
  console.log(`[validate-ph-nle] missing practice spotlight: ${missingPractice}`);
  console.log(`[validate-ph-nle] missing Summary h2: ${missingSummary}`);
  console.log(`[validate-ph-nle] migration angles missing migration heading: ${missingMigration}`);

  const ok =
    belowMin === 0 &&
    dupTitles.length === 0 &&
    dupIntros.length === 0 &&
    missingInternal === 0 &&
    missingPractice === 0 &&
    missingSummary === 0 &&
    missingMigration === 0;

  if (!ok) {
    process.exitCode = 1;
  }
}

main();
