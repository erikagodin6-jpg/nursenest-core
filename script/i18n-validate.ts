#!/usr/bin/env npx tsx
/**
 * Validates merged runtime JSON after `npm run i18n:compile`.
 * - All 20 locales present under client/public/i18n and nursenest-core/public/i18n
 * - Valid JSON, non-trivial size
 * - For each locale, every key extracted from `tools/i18n/source/i18n-{lang}.ts` exists in merged JSON
 * - Client vs Next mirror: same key count and identical key sets
 *
 * Note: Locales do not share identical keysets vs English in source (different TS tables);
 * we do not require en parity for non-English JSON.
 */
import { existsSync, readFileSync } from "fs";
import path from "path";
import { I18N_LANGUAGES } from "./merge-marketing-i18n";

const ROOT = path.resolve(process.cwd());
const CLIENT_I18N = path.join(ROOT, "client/public/i18n");
const NEXT_I18N = path.join(ROOT, "nursenest-core/public/i18n");
const SOURCE_DIR = path.join(ROOT, "tools/i18n/source");

function extractTranslationsFromSource(filePath: string): Record<string, string> | null {
  if (!existsSync(filePath)) return null;
  const source = readFileSync(filePath, "utf-8");
  const objectRegex =
    /(?:const\s+\w+\s*(?::\s*Record<string,\s*string>)?\s*=\s*|export\s+default\s+)\{([\s\S]*)\}\s*(?:as\s+const)?\s*;?\s*(?:export\s+default\s+\w+;?\s*)?$/;
  const match = source.match(objectRegex);
  if (!match) return null;
  const body = match[1];
  const result: Record<string, string> = {};
  const entryRegex = /["']([^"']+)["']\s*:\s*["'`]((?:[^"'`\\]|\\.)*)["'`]/g;
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

function main(): void {
  const errors: string[] = [];
  const warnings: string[] = [];

  for (const lang of I18N_LANGUAGES) {
    const rel = `${lang}.json`;
    const cj = path.join(CLIENT_I18N, rel);
    const nj = path.join(NEXT_I18N, rel);
    const data = loadJson(cj);
    if (!data) {
      errors.push(`Missing or invalid JSON: ${path.relative(ROOT, cj)}`);
      continue;
    }
    if (Object.keys(data).length < 50) {
      errors.push(`Suspiciously small key count for ${lang}: ${Object.keys(data).length}`);
    }

    const nextData = loadJson(nj);
    if (!nextData) {
      errors.push(`Missing or invalid Next mirror: ${path.relative(ROOT, nj)}`);
      continue;
    }
    const ck = new Set(Object.keys(data));
    const nk = new Set(Object.keys(nextData));
    if (ck.size !== nk.size) {
      errors.push(`Key count mismatch client vs next for ${lang}: ${ck.size} vs ${nk.size}`);
    }
    for (const k of ck) {
      if (!nk.has(k)) errors.push(`Next JSON missing key "${k}" (${lang})`);
    }
    for (const k of nk) {
      if (!ck.has(k)) errors.push(`Client JSON missing key "${k}" (${lang})`);
    }

    const srcPath = path.join(SOURCE_DIR, `i18n-${lang}.ts`);
    const srcMap = extractTranslationsFromSource(srcPath);
    if (!srcMap) {
      errors.push(`Could not extract keys from ${path.relative(ROOT, srcPath)}`);
      continue;
    }
    const missingFromMerged = Object.keys(srcMap).filter((k) => !(k in data));
    if (missingFromMerged.length) {
      errors.push(
        `[${lang}] merged JSON missing ${missingFromMerged.length} keys from source TS (e.g. ${missingFromMerged.slice(0, 5).join(", ")})`,
      );
    }

    const empty = Object.keys(data).filter((k) => (data[k] ?? "").trim() === "");
    if (empty.length) {
      warnings.push(`[${lang}] ${empty.length} empty string values (e.g. ${empty.slice(0, 6).join(", ")})`);
    }
  }

  for (const w of warnings) console.warn("[warn]", w);
  if (errors.length) {
    console.error("[i18n:validate] FAILED");
    for (const e of errors) console.error(" ", e);
    process.exit(1);
  }
  console.log(`[i18n:validate] OK — ${I18N_LANGUAGES.length} locales; ${warnings.length} warnings`);
}

main();
