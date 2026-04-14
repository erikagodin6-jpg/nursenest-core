#!/usr/bin/env npx tsx
/**
 * Materializes long-form HTML from regional 200-topic manifests in batches (filesystem only; no DB).
 * Does not run at build time.
 *
 * Usage (from nursenest-core/):
 *   npx tsx scripts/blog/materialize-regional-blog-batches.mts --region india --dry-run
 *   npx tsx scripts/blog/materialize-regional-blog-batches.mts --region middle-east --from 0 --limit 50
 *   npx tsx scripts/blog/materialize-regional-blog-batches.mts --region australia --batch-size 25
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { wordCountFromHtml } from "./philippines-nle-blog-build-body";
import {
  REGIONAL_MIN_WORDS,
  type ManifestBlogRow,
  buildBodyForRegion,
} from "./regional-manifest-blog-body";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "../..");

const MANIFESTS: Record<string, string> = {
  india: join(ROOT, "data", "blog-manifest", "india-nursing-200.manifest.json"),
  "middle-east": join(ROOT, "data", "blog-manifest", "middle-east-nursing-200.manifest.json"),
  australia: join(ROOT, "data", "blog-manifest", "australia-nursing-200.manifest.json"),
};

function argVal(name: string): string | undefined {
  const i = process.argv.indexOf(name);
  if (i === -1) return undefined;
  return process.argv[i + 1];
}

function main() {
  const dryRun = process.argv.includes("--dry-run");
  const region = argVal("--region");
  if (!region || !MANIFESTS[region]) {
    console.error("Usage: --region india|middle-east|australia [--from N] [--limit N] [--batch-size N] [--dry-run]");
    process.exit(1);
  }

  const from = Math.max(0, parseInt(argVal("--from") ?? "0", 10) || 0);
  const limit = Math.max(1, parseInt(argVal("--limit") ?? "200", 10) || 200);
  const batchSize = Math.max(1, parseInt(argVal("--batch-size") ?? "50", 10) || 50);

  const raw = readFileSync(MANIFESTS[region]!, "utf8");
  const parsed = JSON.parse(raw) as { entries: ManifestBlogRow[] };
  const entries = parsed.entries.slice(from, from + limit);

  const outDir = join(ROOT, "data", "blog-materialized", region);
  if (!dryRun) mkdirSync(outDir, { recursive: true });

  const langDist: Record<string, number> = {};
  const slugs = new Set<string>();
  const titles = new Map<string, number>();
  let missingSections = 0;

  const batches: { start: number; end: number; file: string }[] = [];
  for (let b = 0; b * batchSize < entries.length; b += 1) {
    const slice = entries.slice(b * batchSize, (b + 1) * batchSize);
    const globalStart = from + b * batchSize;
    const doc = slice.map((row, j) => {
      const idx = globalStart + j;
      langDist[row.language] = (langDist[row.language] ?? 0) + 1;
      if (slugs.has(row.slug)) {
        console.warn(`[warn] duplicate slug: ${row.slug}`);
      }
      slugs.add(row.slug);
      titles.set(row.title, (titles.get(row.title) ?? 0) + 1);

      const bodyHtml = buildBodyForRegion(region as "india" | "middle-east" | "australia", row, idx);
      const wc = wordCountFromHtml(bodyHtml);
      const ok =
        bodyHtml.includes("<h2>Summary</h2>") &&
        bodyHtml.includes("Practice spotlight") &&
        bodyHtml.includes("Internal links");
      if (!ok) missingSections += 1;

      return {
        slug: row.slug,
        title: row.title,
        language: row.language,
        primaryKeyword: row.primaryKeyword,
        wordCount: wc,
        bodyHtml,
      };
    });

    const fileName = `batch-${String(globalStart).padStart(3, "0")}-${String(globalStart + slice.length - 1).padStart(3, "0")}.json`;
    const filePath = join(outDir, fileName);
    batches.push({ start: globalStart, end: globalStart + slice.length - 1, file: filePath });

    if (!dryRun) {
      writeFileSync(
        filePath,
        JSON.stringify(
          {
            region,
            generatedAt: new Date().toISOString(),
            minWordsTarget: REGIONAL_MIN_WORDS,
            entries: doc,
          },
          null,
          2,
        ),
        "utf8",
      );
    }
  }

  const dupTitles = [...titles.entries()].filter(([, c]) => c > 1);
  const wcs = entries.map((row, j) =>
    wordCountFromHtml(buildBodyForRegion(region as "india" | "middle-east" | "australia", row, from + j)),
  );
  const minW = wcs.length ? Math.min(...wcs) : 0;
  const maxW = wcs.length ? Math.max(...wcs) : 0;
  const avgW = wcs.length ? wcs.reduce((a, b) => a + b, 0) / wcs.length : 0;

  console.log(`[materialize] region=${region} dryRun=${dryRun} rows=${entries.length}`);
  console.log(`[materialize] word count min=${minW} max=${maxW} avg=${avgW.toFixed(1)} (target ≥ ${REGIONAL_MIN_WORDS})`);
  console.log(`[materialize] language distribution: ${JSON.stringify(langDist)}`);
  console.log(`[materialize] duplicate titles in batch: ${dupTitles.length}`);
  if (dupTitles.length) console.log(dupTitles.slice(0, 5));
  console.log(`[materialize] entries missing required sections: ${missingSections}`);
  if (!dryRun) {
    batches.forEach((b) => console.log(`[materialize] wrote ${b.file}`));
  } else {
    console.log(`[materialize] dry-run: would write ${batches.length} batch file(s) to ${outDir}`);
  }
}

main();
