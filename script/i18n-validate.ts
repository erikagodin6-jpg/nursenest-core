#!/usr/bin/env npx tsx
/**
 * Validates merged runtime JSON after `npm run i18n:compile`.
 *
 * - All locales present under client/public/i18n and nursenest-core/public/i18n
 * - Client vs Next: identical key sets and values (Next uses `public/i18n/{lang}/*.json` public shards + `i18n-admin-only/{lang}/admin.json` staff shards)
 * - No `admin.json` under `public/i18n/{lang}/` (staff strings must not be web-static)
 * - Each locale: every key from tools/i18n/source/i18n-{lang}.ts exists in merged JSON
 * - Marketing locale overlays: same key set as tools/i18n/marketing/marketing-en.json (en has no overlay file)
 * - Placeholder parity: for every key, {{mustache}} placeholder names match English merged bundle
 * - Compiled file sizes: Next `public/i18n` per-shard and legacy monolith caps (i18n-translation-engineering-policy)
 *
 * Flags:
 * - `--strict` or `I18N_VALIDATE_STRICT=1` — empty string values are **errors** (not warnings).
 */
import { existsSync, readFileSync, readdirSync, statSync } from "fs";
import path from "path";
import {
  I18N_MAX_LEGACY_MONOLITH_FILE_BYTES,
  I18N_MAX_SHARD_FILE_BYTES,
} from "../shared/i18n-translation-engineering-policy";
import { DEFAULT_ADMIN_ONLY_I18N_ROOT, readMergedBundleFromNextPublicI18n } from "./lib/next-public-i18n-bundle";
import { I18N_LANGUAGES } from "./merge-marketing-i18n";
import { REPO_ROOT } from "./repo-root";

const ROOT = REPO_ROOT;
const CLIENT_I18N = path.join(ROOT, "client/public/i18n");
const NEXT_I18N = path.join(ROOT, "nursenest-core/public/i18n");
const SOURCE_DIR = path.join(ROOT, "tools/i18n/source");
const MARKETING_EN = path.join(ROOT, "tools/i18n/marketing/marketing-en.json");
const MARKETING_LOCALE_DIR = path.join(ROOT, "tools/i18n/marketing/locale");

function extractTranslationsFromSource(filePath: string): Record<string, string> | null {
  if (!existsSync(filePath)) return null;
  const source = readFileSync(filePath, "utf-8");
  const objectRegex =
    /(?:const\s+\w+\s*(?::\s*Record<string,\s*string>)?\s*=\s*|export\s+default\s+)\{([\s\S]*)\}\s*(?:as\s+const)?\s*;?\s*(?:export\s+default\s+\w+;?\s*)?$/;
  const match = source.match(objectRegex);
  if (!match) return null;
  const body = match[1];
  const result: Record<string, string> = {};
  /** Must match `script/compile-i18n.ts` — double-quoted values only. */
  const entryRegex = /["']([^"']+)["']\s*:\s*"((?:\\.|[^"\\])*)"/g;
  let m: RegExpExecArray | null;
  while ((m = entryRegex.exec(body)) !== null) {
    result[m[1]] = m[2].replace(/\\"/g, '"').replace(/\\'/g, "'").replace(/\\\\/g, "\\");
  }
  return result;
}

function loadJson(p: string): Record<string, string> | null {
  if (!existsSync(p)) return null;
  try {
    const raw = JSON.parse(readFileSync(p, "utf8"));
    if (raw && typeof raw === "object" && !Array.isArray(raw)) return raw as Record<string, string>;
  } catch {
    return null;
  }
  return null;
}

/** Placeholder *names* inside {{ }}, sorted uniquely (e.g. count, score). */
function placeholderNames(s: string): string[] {
  const re = /\{\{\s*([^}]+?)\s*\}\}/g;
  const names: string[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(s)) !== null) {
    names.push(m[1].trim());
  }
  return [...new Set(names)].sort();
}

/** When true, empty string values fail the build (recommended for production / CI). */
function strictEmptyMode(): boolean {
  return process.argv.includes("--strict") || process.env.I18N_VALIDATE_STRICT === "1";
}

/** Enforce max shard / monolith file sizes (see shared/i18n-translation-engineering-policy.ts). */
function validateCompiledTranslationFileSizes(nextI18nDir: string, errors: string[]): void {
  if (!existsSync(nextI18nDir)) return;
  for (const entry of readdirSync(nextI18nDir, { withFileTypes: true })) {
    const full = path.join(nextI18nDir, entry.name);
    if (entry.isFile() && entry.name.endsWith(".json")) {
      const st = statSync(full);
      if (st.size > I18N_MAX_LEGACY_MONOLITH_FILE_BYTES) {
        errors.push(
          `Translation file exceeds ${I18N_MAX_LEGACY_MONOLITH_FILE_BYTES} bytes (split shards or move content): ${path.relative(ROOT, full)}`,
        );
      }
      continue;
    }
    if (!entry.isDirectory()) continue;
    const locale = entry.name;
    for (const shard of readdirSync(full)) {
      if (!shard.endsWith(".json")) continue;
      const fp = path.join(full, shard);
      try {
        const st = statSync(fp);
        if (st.size > I18N_MAX_SHARD_FILE_BYTES) {
          errors.push(
            `[${locale}] shard file too large (${st.size} > ${I18N_MAX_SHARD_FILE_BYTES}): ${shard} — see docs/i18n-translation-engineering-policy.md`,
          );
        }
      } catch {
        errors.push(`[${locale}] unreadable shard: ${shard}`);
      }
    }
  }
}

function main(): void {
  const errors: string[] = [];
  const warnings: string[] = [];
  const strictEmpty = strictEmptyMode();

  if (!existsSync(MARKETING_EN)) {
    errors.push(`Missing ${path.relative(ROOT, MARKETING_EN)}`);
    mainEnd(errors, warnings);
    return;
  }
  const marketingEn = loadJson(MARKETING_EN);
  if (!marketingEn) {
    errors.push(`Invalid ${path.relative(ROOT, MARKETING_EN)}`);
    mainEnd(errors, warnings);
    return;
  }
  const marketingCanonicalKeys = new Set(Object.keys(marketingEn).sort());

  validateCompiledTranslationFileSizes(NEXT_I18N, errors);

  for (const lang of I18N_LANGUAGES) {
    if (lang !== "en") {
      const overlayPath = path.join(MARKETING_LOCALE_DIR, `marketing-${lang}.json`);
      if (!existsSync(overlayPath)) {
        errors.push(`Missing marketing overlay: ${path.relative(ROOT, overlayPath)}`);
        continue;
      }
      const overlay = loadJson(overlayPath);
      if (!overlay) {
        errors.push(`Invalid JSON: ${path.relative(ROOT, overlayPath)}`);
        continue;
      }
      const ok = new Set(Object.keys(overlay));
      for (const k of marketingCanonicalKeys) {
        if (!ok.has(k)) errors.push(`Marketing overlay missing key "${k}" (${lang})`);
      }
      for (const k of ok) {
        if (!marketingCanonicalKeys.has(k)) errors.push(`Marketing overlay extra/orphan key "${k}" (${lang})`);
      }
    }
  }

  const mergedEn = loadJson(path.join(CLIENT_I18N, "en.json"));
  if (!mergedEn) {
    errors.push(`Missing merged en.json — run npm run i18n:compile`);
    mainEnd(errors, warnings);
    return;
  }
  const canonicalMergedKeys = new Set(Object.keys(mergedEn));

  for (const lang of I18N_LANGUAGES) {
    const rel = `${lang}.json`;
    const cj = path.join(CLIENT_I18N, rel);
    if (!existsSync(cj)) {
      errors.push(`Missing or unreadable: ${path.relative(ROOT, cj)}`);
      continue;
    }

    const data = loadJson(cj);
    if (!data) {
      errors.push(`Invalid JSON: ${path.relative(ROOT, cj)}`);
      continue;
    }

    const leakedPublicAdmin = path.join(NEXT_I18N, lang, "admin.json");
    if (existsSync(leakedPublicAdmin)) {
      errors.push(
        `Staff i18n leak: remove ${path.relative(ROOT, leakedPublicAdmin)} (admin shard must not be under public/)`,
      );
    }
    const staffAdminShard = path.join(DEFAULT_ADMIN_ONLY_I18N_ROOT, lang, "admin.json");
    if (!existsSync(staffAdminShard)) {
      errors.push(`Missing staff shard (run npm run i18n:compile): ${path.relative(ROOT, staffAdminShard)}`);
    }

    const nextData = readMergedBundleFromNextPublicI18n(NEXT_I18N, lang);
    if (!nextData) {
      errors.push(`Missing or unreadable Next shard tree: ${path.relative(ROOT, path.join(NEXT_I18N, lang))}`);
      continue;
    }
    if (Object.keys(data).length < 50) {
      errors.push(`Suspiciously small key count for ${lang}: ${Object.keys(data).length}`);
    }

    const srcPath = path.join(SOURCE_DIR, `i18n-${lang}.ts`);
    const srcMap = extractTranslationsFromSource(srcPath);
    if (!srcMap) {
      errors.push(`Could not extract keys from ${path.relative(ROOT, srcPath)}`);
      continue;
    }
    // Locale TS files may contain keys removed from English; only require keys that exist in en merged bundle.
    const missingFromMerged = Object.keys(srcMap).filter((k) => k in mergedEn && !(k in data));
    if (missingFromMerged.length) {
      errors.push(
        `[${lang}] merged JSON missing ${missingFromMerged.length} keys from source TS (present in en bundle) (e.g. ${missingFromMerged.slice(0, 5).join(", ")})`,
      );
    }

    const mk = new Set(Object.keys(marketingEn));
    const notInMerged = [...mk].filter((k) => !(k in data));
    if (notInMerged.length) {
      errors.push(`[${lang}] merged JSON missing ${notInMerged.length} marketing-en key(s) (e.g. ${notInMerged.slice(0, 5).join(", ")})`);
    }

    const dataKeys = new Set(Object.keys(data));
    const nextKeys = new Set(Object.keys(nextData));
    if (canonicalMergedKeys.size !== dataKeys.size) {
      errors.push(`[${lang}] key count differs from en: ${dataKeys.size} vs ${canonicalMergedKeys.size}`);
    }
    for (const k of canonicalMergedKeys) {
      if (!dataKeys.has(k)) errors.push(`[${lang}] missing key vs en merged: "${k}"`);
    }
    for (const k of dataKeys) {
      if (!canonicalMergedKeys.has(k)) errors.push(`[${lang}] extra key vs en merged: "${k}"`);
    }

    if (nextKeys.size !== dataKeys.size) {
      errors.push(`[${lang}] Next shard merged key count differs from client: ${nextKeys.size} vs ${dataKeys.size}`);
    }
    for (const k of dataKeys) {
      if (data[k] !== nextData[k]) {
        errors.push(`[${lang}] client vs Next shard value mismatch for "${k}"`);
      }
    }

    for (const k of canonicalMergedKeys) {
      const enVal = mergedEn[k] ?? "";
      const locVal = data[k] ?? "";
      const pEn = placeholderNames(enVal);
      const pLoc = placeholderNames(locVal);
      if (JSON.stringify(pEn) !== JSON.stringify(pLoc)) {
        errors.push(
          `[${lang}] placeholder mismatch for "${k}": en [${pEn.join(", ")}] vs locale [${pLoc.join(", ")}]`,
        );
      }
    }

    const empty = Object.keys(data).filter((k) => (data[k] ?? "").trim() === "");
    if (empty.length) {
      const msg = `[${lang}] ${empty.length} empty string values (e.g. ${empty.slice(0, 12).join(", ")})`;
      if (strictEmpty) {
        errors.push(msg);
      } else {
        warnings.push(msg);
      }
    }
  }

  mainEnd(errors, warnings, strictEmpty);
}

function mainEnd(errors: string[], warnings: string[], strictEmpty: boolean): void {
  for (const w of warnings) console.warn("[warn]", w);
  if (errors.length) {
    console.error(strictEmpty ? "[i18n:validate] FAILED (strict)" : "[i18n:validate] FAILED");
    for (const e of errors) console.error(" ", e);
    process.exit(1);
  }
  console.log(
    `[i18n:validate] OK — ${I18N_LANGUAGES.length} locales; ${warnings.length} warnings${strictEmpty ? "; strict empty=on" : ""}`,
  );
}

main();
