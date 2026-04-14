#!/usr/bin/env npx tsx
/**
 * Materializes long-form HTML from China or Korea 200-topic manifests into data/blog-content/{china-nursing|korea-nursing}/.
 * Filesystem only — not part of Next build.
 *
 * Usage (from nursenest-core/):
 *   npx tsx scripts/blog/materialize-china-korea-blog-content.mts --country china --dry-run
 *   npx tsx scripts/blog/materialize-china-korea-blog-content.mts --country korea --from 0 --limit 40 --batch-size 20
 *   npx tsx scripts/blog/materialize-china-korea-blog-content.mts --country china --lang en --theme nclex
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { wordCountFromHtml } from "./philippines-nle-blog-build-body";
import {
  REGIONAL_MIN_WORDS,
  buildChinaManifestBlogBody,
  buildKoreaManifestBlogBody,
  type ManifestBlogRow,
} from "./regional-manifest-blog-body";
import { filterManifestEntries, requiredSectionMarkersOk } from "./lib/china-korea-content-validate";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "../..");

const MANIFESTS: Record<string, string> = {
  china: join(ROOT, "data", "blog-manifest", "china-nursing-200.manifest.json"),
  korea: join(ROOT, "data", "blog-manifest", "korea-nursing-200.manifest.json"),
};

const OUT_SUB: Record<string, string> = {
  china: join(ROOT, "data", "blog-content", "china-nursing"),
  korea: join(ROOT, "data", "blog-content", "korea-nursing"),
};

function argVal(name: string): string | undefined {
  const i = process.argv.indexOf(name);
  if (i === -1) return undefined;
  return process.argv[i + 1];
}

function main() {
  const dryRun = process.argv.includes("--dry-run");
  const country = argVal("--country");
  if (!country || !MANIFESTS[country]) {
    console.error(
      "Usage: --country china|korea [--from N] [--limit N] [--batch-size N] [--lang CODE] [--theme SUBSTR] [--dry-run]",
    );
    process.exit(1);
  }

  const from = Math.max(0, parseInt(argVal("--from") ?? "0", 10) || 0);
  const limit = Math.max(1, parseInt(argVal("--limit") ?? "200", 10) || 200);
  const batchSize = Math.max(1, parseInt(argVal("--batch-size") ?? "50", 10) || 50);
  const lang = argVal("--lang");
  const theme = argVal("--theme");

  const raw = readFileSync(MANIFESTS[country]!, "utf8");
  const parsed = JSON.parse(raw) as { entries: ManifestBlogRow[] };
  const filtered = filterManifestEntries(parsed.entries, { lang, theme, from: 0, limit: parsed.entries.length });
  const entries = filtered.slice(from, from + limit);

  const outDir = OUT_SUB[country]!;
  if (!dryRun) mkdirSync(outDir, { recursive: true });

  let missingSections = 0;
  const batches: string[] = [];

  for (let b = 0; b * batchSize < entries.length; b += 1) {
    const slice = entries.slice(b * batchSize, (b + 1) * batchSize);
    const globalStart = from + b * batchSize;
    const doc = slice.map((row, j) => {
      const idx = globalStart + j;
      const bodyHtml =
        country === "china"
          ? buildChinaManifestBlogBody(row, idx + 1)
          : buildKoreaManifestBlogBody(row, idx + 1);
      const wc = wordCountFromHtml(bodyHtml);
      const { ok } = requiredSectionMarkersOk(bodyHtml);
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
    batches.push(filePath);

    if (!dryRun) {
      writeFileSync(
        filePath,
        JSON.stringify(
          {
            country,
            generatedAt: new Date().toISOString(),
            minWordsTarget: REGIONAL_MIN_WORDS,
            filters: { lang: lang ?? null, theme: theme ?? null },
            entries: doc,
          },
          null,
          2,
        ),
        "utf8",
      );
    }
  }

  console.log(
    `[materialize-cn-kr] country=${country} dryRun=${dryRun} rows=${entries.length} out=${outDir} batches=${batches.length} missingSectionSamples=${missingSections}`,
  );
  if (dryRun) {
    console.log("[materialize-cn-kr] dry-run: no files written");
  } else {
    batches.forEach((p) => console.log(`[materialize-cn-kr] wrote ${p}`));
  }
}

main();
