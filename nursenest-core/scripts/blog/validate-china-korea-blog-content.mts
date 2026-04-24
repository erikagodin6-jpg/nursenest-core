#!/usr/bin/env npx tsx
import "../../src/lib/db/script-env-bootstrap";
/**
 * Validates China/Korea manifest rows (live HTML) and/or materialized JSON batches under data/blog-content/.
 *
 * Usage:
 *   npx tsx scripts/blog/validate-china-korea-blog-content.mts --country china
 *   npx tsx scripts/blog/validate-china-korea-blog-content.mts --materialized-dir data/blog-content/china-nursing
 */
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";
import { buildChinaManifestBlogBody, buildKoreaManifestBlogBody, type ManifestBlogRow } from "./regional-manifest-blog-body";
import {
  CHINA_KOREA_MIN_WORDS,
  firstParagraphText,
  validateMaterializedFile,
  type ManifestFile,
} from "./lib/china-korea-content-validate";
import { wordCountFromHtml } from "./philippines-nle-blog-build-body";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "../..");

const MANIFESTS: Record<string, string> = {
  china: join(ROOT, "data", "blog-manifest", "china-nursing-200.manifest.json"),
  korea: join(ROOT, "data", "blog-manifest", "korea-nursing-200.manifest.json"),
};

function argVal(name: string): string | undefined {
  const i = process.argv.indexOf(name);
  if (i === -1) return undefined;
  return process.argv[i + 1];
}

function validateManifestLive(country: "china" | "korea"): boolean {
  const raw = readFileSync(MANIFESTS[country]!, "utf8");
  const parsed = JSON.parse(raw) as { entries: ManifestBlogRow[] };
  const titles = new Map<string, string[]>();
  const intros = new Map<string, string[]>();
  let bad = 0;
  const wcs: number[] = [];

  for (let i = 0; i < parsed.entries.length; i += 1) {
    const row = parsed.entries[i]!;
    const body =
      country === "china"
        ? buildChinaManifestBlogBody(row, i + 1)
        : buildKoreaManifestBlogBody(row, i + 1);
    const wc = wordCountFromHtml(body);
    wcs.push(wc);
    if (wc < CHINA_KOREA_MIN_WORDS) bad += 1;
    const tk = row.title.trim().toLowerCase();
    const ts = titles.get(tk) ?? [];
    ts.push(row.slug);
    titles.set(tk, ts);
    const intro = firstParagraphText(body);
    const is = intros.get(intro) ?? [];
    is.push(row.slug);
    intros.set(intro, is);
  }

  const dupTitles = [...titles.entries()].filter(([, s]) => s.length > 1);
  const dupIntros = [...intros.entries()].filter(([k, s]) => k.length > 0 && s.length > 1);
  const minW = Math.min(...wcs);
  const maxW = Math.max(...wcs);
  const avgW = wcs.reduce((a, b) => a + b, 0) / wcs.length;

  console.log(`[validate-cn-kr] live manifest ${country}: ${parsed.entries.length} rows`);
  console.log(`[validate-cn-kr] word count min=${minW} max=${maxW} avg=${avgW.toFixed(1)} (target ≥ ${CHINA_KOREA_MIN_WORDS})`);
  console.log(`[validate-cn-kr] below min words: ${bad}`);
  console.log(`[validate-cn-kr] duplicate titles: ${dupTitles.length}`);
  console.log(`[validate-cn-kr] duplicate first-paragraph intros: ${dupIntros.length}`);

  return bad === 0 && dupTitles.length === 0 && dupIntros.length === 0;
}

function validateDir(dir: string): boolean {
  const files = readdirSync(dir).filter((f) => f.endsWith(".json"));
  if (files.length === 0) {
    console.log(`[validate-cn-kr] no JSON batches in ${dir} (skip file validation)`);
    return true;
  }
  let okAll = true;
  for (const f of files) {
    const data = JSON.parse(readFileSync(join(dir, f), "utf8")) as ManifestFile;
    const r = validateMaterializedFile(data, CHINA_KOREA_MIN_WORDS);
    console.log(`[validate-cn-kr] file ${f}: words min=${r.wordStats.min} max=${r.wordStats.max} avg=${r.wordStats.avg.toFixed(1)}`);
    if (r.dupSlugs.length) console.log(`[validate-cn-kr] duplicate slugs: ${r.dupSlugs.join(", ")}`);
    if (r.dupTitles.length) console.log(`[validate-cn-kr] dup titles sample: ${r.dupTitles[0]?.[0]?.slice(0, 60)}`);
    if (r.dupIntros.length) console.log(`[validate-cn-kr] dup intros: ${r.dupIntros.length} collision groups`);
    if (r.sectionFailures.length) {
      console.log(`[validate-cn-kr] section/word failures: ${r.sectionFailures.length}`);
      r.sectionFailures.slice(0, 5).forEach((x) => console.log(`  — ${x.slug}: ${x.missing.join("; ")}`));
      okAll = false;
    }
    if (r.dupSlugs.length || r.dupTitles.length || r.dupIntros.length) okAll = false;
  }
  return okAll;
}

function main() {
  const dir = argVal("--materialized-dir");
  const country = argVal("--country") as "china" | "korea" | undefined;

  let ok = true;
  if (dir) {
    ok = validateDir(dir.startsWith("/") ? dir : join(ROOT, dir)) && ok;
  }
  if (country && MANIFESTS[country]) {
    ok = validateManifestLive(country) && ok;
  }
  if (!dir && !country) {
    console.error("Provide --country china|korea and/or --materialized-dir …");
    process.exit(1);
  }
  if (!ok) process.exit(1);
}

main();
