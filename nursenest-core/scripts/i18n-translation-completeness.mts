#!/usr/bin/env npx tsx
/**
 * Static completeness pass for **user-facing** Next `public/i18n` bundles (no `admin` shard).
 * Complements Playwright locale smoke: catches structural issues before browsers run.
 *
 * - **Hard (exit 1):** invalid JSON, non-string/null values, `admin.json` under public/,
 *   placeholder name mismatch vs English, broken `{{`/`}}` pairs, duplicate keys within a shard.
 * - **Warnings (exit 0):** missing keys vs English shard, empty strings, extra keys vs English,
 *   value identical to English (possible fallback) — set `I18N_COMPLETENESS_STRICT=1` to fail on warnings.
 *
 * Run from `nursenest-core/` after `npm run i18n:compile` (or when shards exist):
 *   npm run qa:i18n:check
 */
import { existsSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { PUBLIC_I18N_SHARD_FILENAMES } from "../../shared/i18n-shard-policy";
import { I18N_LANGUAGES } from "../../script/merge-marketing-i18n";
import { readMergedBundleFromNextPublicI18n } from "../../script/lib/next-public-i18n-bundle";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PKG_ROOT = path.join(__dirname, "..");
const I18N_ROOT = path.join(PKG_ROOT, "public", "i18n");

const SOURCE_LOCALE = "en";

type ShardReport = {
  locale: string;
  file: string;
  missing: number;
  empty: number;
  extraVsEn: number;
  placeholderMismatch: number;
  hard: number;
  samples: {
    missing: string[];
    empty: string[];
    extraVsEn: string[];
    placeholderMismatch: string[];
    hard: string[];
  };
};

function placeholderNames(s: string): string[] {
  const re = /\{\{\s*([^}]+?)\s*\}\}/g;
  const names: string[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(s)) !== null) {
    names.push(m[1].trim());
  }
  return [...new Set(names)].sort();
}

function interpolationPairBroken(s: string): boolean {
  const o = (s.match(/\{\{/g) ?? []).length;
  const c = (s.match(/\}\}/g) ?? []).length;
  return o !== c;
}

function loadShardJson(fp: string): Record<string, string> | null {
  if (!existsSync(fp)) return null;
  try {
    const raw = JSON.parse(readFileSync(fp, "utf8"));
    if (!raw || typeof raw !== "object" || Array.isArray(raw)) return null;
    return raw as Record<string, string>;
  } catch {
    return null;
  }
}

function validateValueTypes(data: Record<string, string>, samples: string[]): number {
  let hard = 0;
  for (const [k, v] of Object.entries(data)) {
    if (v === null || v === undefined) {
      hard++;
      if (samples.length < 8) samples.push(`${k} (null/undefined)`);
    } else if (typeof v !== "string") {
      hard++;
      if (samples.length < 8) samples.push(`${k} (non-string)`);
    }
  }
  return hard;
}

function compareShard(
  locale: string,
  shardFile: string,
  enShard: Record<string, string> | null,
  locShard: Record<string, string> | null,
): ShardReport {
  const samples = {
    missing: [] as string[],
    empty: [] as string[],
    extraVsEn: [] as string[],
    placeholderMismatch: [] as string[],
    hard: [] as string[],
  };
  let missing = 0;
  let empty = 0;
  let extraVsEn = 0;
  let placeholderMismatch = 0;
  let hard = 0;

  if (!enShard || Object.keys(enShard).length === 0) {
    return {
      locale,
      file: shardFile,
      missing: 0,
      empty: 0,
      extraVsEn: 0,
      placeholderMismatch: 0,
      hard: 0,
      samples,
    };
  }

  if (!locShard) {
    missing = Object.keys(enShard).length;
    samples.missing = Object.keys(enShard).slice(0, 12);
    return {
      locale,
      file: shardFile,
      missing,
      empty: 0,
      extraVsEn: 0,
      placeholderMismatch: 0,
      hard: 0,
      samples,
    };
  }

  hard += validateValueTypes(locShard, samples.hard);

  const enKeys = Object.keys(enShard);
  const locKeys = new Set(Object.keys(locShard));

  for (const k of enKeys) {
    if (!locKeys.has(k)) {
      missing++;
      if (samples.missing.length < 12) samples.missing.push(k);
      continue;
    }
    const ev = enShard[k] ?? "";
    const lv = locShard[k] ?? "";
    if (lv.trim() === "") {
      empty++;
      if (samples.empty.length < 12) samples.empty.push(k);
    }
    const pe = JSON.stringify(placeholderNames(ev));
    const pl = JSON.stringify(placeholderNames(lv));
    if (pe !== pl) {
      placeholderMismatch++;
      hard++;
      if (samples.placeholderMismatch.length < 10) {
        samples.placeholderMismatch.push(`${k} (en ${pe} vs loc ${pl})`);
      }
    }
    if (interpolationPairBroken(lv)) {
      hard++;
      if (samples.hard.length < 10) samples.hard.push(`${k} (unbalanced {{ }})`);
    }
  }

  for (const k of locKeys) {
    if (!enKeys.includes(k)) {
      extraVsEn++;
      if (samples.extraVsEn.length < 12) samples.extraVsEn.push(k);
    }
  }

  return {
    locale,
    file: shardFile,
    missing,
    empty,
    extraVsEn,
    placeholderMismatch,
    hard,
    samples,
  };
}

function detectLeakedPublicAdmin(locale: string): string | null {
  const leak = path.join(I18N_ROOT, locale, "admin.json");
  if (existsSync(leak)) {
    return path.relative(PKG_ROOT, leak);
  }
  return null;
}

function main(): void {
  const strictWarnings = process.env.I18N_COMPLETENESS_STRICT === "1" || process.argv.includes("--strict");
  const enDir = path.join(I18N_ROOT, SOURCE_LOCALE);
  if (!existsSync(enDir)) {
    console.error(`[qa:i18n:check] Missing English shard directory: ${enDir}`);
    process.exit(1);
  }

  const enShards: Record<string, Record<string, string>> = {};
  for (const shard of PUBLIC_I18N_SHARD_FILENAMES) {
    const fp = path.join(enDir, `${shard}.json`);
    const j = loadShardJson(fp);
    if (j) {
      const keys = Object.keys(j);
      if (new Set(keys).size !== keys.length) {
        console.error(`[qa:i18n:check] HARD: duplicate keys in en/${shard}.json`);
        process.exit(1);
      }
      enShards[shard] = j;
    }
  }

  const mergedEn = readMergedBundleFromNextPublicI18n(I18N_ROOT, SOURCE_LOCALE, { adminOnlyRoot: null });
  if (!mergedEn || Object.keys(mergedEn).length < 100) {
    console.error("[qa:i18n:check] English merged bundle missing or too small — run i18n:compile from repo root.");
    process.exit(1);
  }

  const reports: ShardReport[] = [];
  const fallbackWarnings: string[] = [];
  let hardTotal = 0;
  let warnClass = 0;

  for (const locale of I18N_LANGUAGES) {
    if (locale === SOURCE_LOCALE) continue;

    const leak = detectLeakedPublicAdmin(locale);
    if (leak) {
      console.error(`[qa:i18n:check] HARD: staff shard must not be public: ${leak}`);
      hardTotal++;
    }

    const locDir = path.join(I18N_ROOT, locale);
    const legacyPath = path.join(I18N_ROOT, `${locale}.json`);
    const useLegacy =
      existsSync(legacyPath) && (!existsSync(locDir) || !statSync(locDir).isDirectory());

    if (useLegacy) {
      const loc = loadShardJson(legacyPath);
      if (!loc) {
        console.error(`[qa:i18n:check] HARD: invalid JSON ${legacyPath}`);
        hardTotal++;
        continue;
      }
      const sh: string[] = [];
      hardTotal += validateValueTypes(loc, sh);
      let missing = 0;
      let empty = 0;
      let ph = 0;
      const sm: string[] = [];
      const se: string[] = [];
      const sph: string[] = [];
      for (const k of Object.keys(mergedEn)) {
        if (!(k in loc)) {
          missing++;
          if (sm.length < 12) sm.push(k);
        } else {
          const ev = mergedEn[k] ?? "";
          const lv = loc[k] ?? "";
          if (lv.trim() === "") {
            empty++;
            if (se.length < 12) se.push(k);
          }
          if (JSON.stringify(placeholderNames(ev)) !== JSON.stringify(placeholderNames(lv))) {
            ph++;
            hardTotal++;
            if (sph.length < 8) sph.push(k);
          }
          if (interpolationPairBroken(lv)) {
            hardTotal++;
          }
        }
      }
      let extra = 0;
      const sx: string[] = [];
      for (const k of Object.keys(loc)) {
        if (!(k in mergedEn)) {
          extra++;
          if (sx.length < 12) sx.push(k);
        }
      }
      warnClass += missing + empty + extra;
      reports.push({
        locale,
        file: `${locale}.json (legacy monolith)`,
        missing,
        empty,
        extraVsEn: extra,
        placeholderMismatch: ph,
        hard: 0,
        samples: { missing: sm, empty: se, extraVsEn: sx, placeholderMismatch: sph, hard: [] },
      });
      continue;
    }

    if (!existsSync(locDir)) {
      console.warn(`[qa:i18n:check] warn: no bundle for locale "${locale}" (${path.relative(PKG_ROOT, locDir)})`);
      warnClass++;
      continue;
    }

    for (const shard of PUBLIC_I18N_SHARD_FILENAMES) {
      const enShard = enShards[shard] ?? null;
      const fp = path.join(locDir, `${shard}.json`);
      const locShard = loadShardJson(fp);
      if (!enShard || Object.keys(enShard).length === 0) continue;

      if (!locShard) {
        reports.push({
          locale,
          file: `${shard}.json`,
          missing: Object.keys(enShard).length,
          empty: 0,
          extraVsEn: 0,
          placeholderMismatch: 0,
          hard: 0,
          samples: {
            missing: Object.keys(enShard).slice(0, 8),
            empty: [],
            extraVsEn: [],
            placeholderMismatch: [],
            hard: [],
          },
        });
        warnClass += Object.keys(enShard).length;
        continue;
      }

      const dup = Object.keys(locShard);
      if (new Set(dup).size !== dup.length) {
        console.error(`[qa:i18n:check] HARD: duplicate keys in ${locale}/${shard}.json`);
        hardTotal++;
      }

      const r = compareShard(locale, `${shard}.json`, enShard, locShard);
      reports.push(r);
      hardTotal += r.hard;
      warnClass += r.missing + r.empty + r.extraVsEn;

      for (const k of Object.keys(enShard)) {
        if (!(k in locShard)) continue;
        const ev = enShard[k] ?? "";
        const lv = locShard[k] ?? "";
        if (lv === ev && ev.trim().length > 24 && /[a-z]{6,}/i.test(ev)) {
          if (fallbackWarnings.length < 40) fallbackWarnings.push(`${locale} ${shard}.json::${k}`);
        }
      }
    }

    const locMerged = readMergedBundleFromNextPublicI18n(I18N_ROOT, locale, { adminOnlyRoot: null });
    if (locMerged) {
      for (const [k, lv] of Object.entries(locMerged)) {
        const ev = mergedEn[k];
        if (ev === undefined) continue;
        if (
          lv === ev &&
          locale !== SOURCE_LOCALE &&
          ev.trim().length > 24 &&
          /[a-z]{6,}/i.test(ev) &&
          fallbackWarnings.length < 60
        ) {
          const tag = `${locale} merged::${k}`;
          if (!fallbackWarnings.includes(tag)) fallbackWarnings.push(tag);
        }
      }
    }
  }

  console.log("");
  console.log("=== qa:i18n:check (user-facing public shards vs en) ===");
  console.log(`Source: ${SOURCE_LOCALE} @ ${path.relative(PKG_ROOT, I18N_ROOT)}`);
  console.log("");

  for (const r of reports) {
    if (
      r.missing === 0 &&
      r.empty === 0 &&
      r.extraVsEn === 0 &&
      r.placeholderMismatch === 0 &&
      r.hard === 0
    ) {
      continue;
    }
    console.log(
      `${r.locale} | ${r.file} | missing: ${r.missing} | empty: ${r.empty} | extra vs en: ${r.extraVsEn} | placeholder Δ: ${r.placeholderMismatch} | hard: ${r.hard}`,
    );
    if (r.samples.missing.length) console.log(`  sample missing: ${r.samples.missing.join(", ")}`);
    if (r.samples.empty.length) console.log(`  sample empty: ${r.samples.empty.join(", ")}`);
    if (r.samples.extraVsEn.length) console.log(`  sample extra: ${r.samples.extraVsEn.join(", ")}`);
    if (r.samples.placeholderMismatch.length) {
      console.log(`  sample placeholder mismatch: ${r.samples.placeholderMismatch.slice(0, 4).join(" | ")}`);
    }
    if (r.samples.hard.length) console.log(`  sample hard: ${r.samples.hard.join(", ")}`);
    console.log("");
  }

  if (fallbackWarnings.length) {
    console.log(`[warn] Possible English copy (${fallbackWarnings.length} keys, sample):`);
    console.log(`  ${fallbackWarnings.slice(0, 15).join("\n  ")}`);
    console.log("");
  }

  if (hardTotal > 0) {
    console.error(`[qa:i18n:check] FAILED: ${hardTotal} hard issue(s) (see above)`);
    process.exit(1);
  }

  if (strictWarnings && warnClass > 0) {
    console.error(`[qa:i18n:check] FAILED (--strict): ${warnClass} warning-class issue(s)`);
    process.exit(1);
  }

  console.log(
    `[qa:i18n:check] OK — hard: 0; warning-class tally: ${warnClass}${strictWarnings ? "" : " (pass; set I18N_COMPLETENESS_STRICT=1 to fail on warnings)"}`,
  );
}

main();
