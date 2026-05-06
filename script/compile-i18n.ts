import { existsSync, writeFileSync, mkdirSync, readFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import {
  APP_ROOT,
  CLIENT_PUBLIC_I18N_DIR,
  NEXT_PUBLIC_I18N_SHARD_ROOT,
  REPO_ROOT,
  REPO_ROOT_FROM_SCRIPT,
} from "./repo-root";
import { readMergedBundleFromNextPublicI18n } from "./lib/next-public-i18n-bundle";

const LANGUAGES = [
  "en", "fr", "tl", "hi", "es", "zh", "zh-tw", "ar", "ko",
  "pt", "pa", "vi", "ht", "ur", "ja", "fa", "de", "th", "tr", "id", "it", "ru",
];

function extractTranslationsFromSource(filePath: string): Record<string, string> | null {
  const source = readFileSync(filePath, "utf-8");

  const objectRegex = /(?:const\s+\w+\s*(?::\s*Record<string,\s*string>)?\s*=\s*|export\s+default\s+)\{([\s\S]*)\}\s*(?:as\s+const)?\s*;?\s*(?:export\s+default\s+\w+;?\s*)?$/;
  const match = source.match(objectRegex);
  if (!match) return null;

  const body = match[1];
  const result: Record<string, string> = {};
  /** Values are double-quoted; allow `'` inside (e.g. "You've used …") and `\"` escapes. */
  const entryRegex = /["']([^"']+)["']\s*:\s*"((?:\\.|[^"\\])*)"/g;
  let m: RegExpExecArray | null;
  while ((m = entryRegex.exec(body)) !== null) {
    result[m[1]] = m[2].replace(/\\"/g, '"').replace(/\\'/g, "'").replace(/\\\\/g, "\\");
  }
  return result;
}

/** Canonical monolith key set = English. Missing locale keys → English fallback; keys not in en → dropped. */
function alignMonolithToEnglishCanonical(
  en: Record<string, string>,
  lang: Record<string, string>,
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const k of Object.keys(en)) {
    out[k] = lang[k] ?? en[k];
  }
  return out;
}

const SHARD_FALLBACK_ENV = "NN_I18N_ALLOW_SHARD_FALLBACK";

function shardFallbackEnabled(): boolean {
  return /^(1|true|yes)$/i.test(process.env[SHARD_FALLBACK_ENV] ?? "");
}

/** Deterministic JSON: sorted keys (used for shard-sourced bundles). */
function stringifySortedFlatBundle(flat: Record<string, string>): string {
  const sorted: Record<string, string> = {};
  for (const k of Object.keys(flat).sort()) {
    sorted[k] = flat[k]!;
  }
  return JSON.stringify(sorted);
}

function tryLoadFromTsSource(root: string, lang: string): Record<string, string> | null {
  const filePath = path.join(root, `tools/i18n/source/i18n-${lang}.ts`);
  if (!existsSync(filePath)) return null;
  try {
    const data = extractTranslationsFromSource(filePath);
    if (!data || typeof data !== "object") return null;
    if (Object.keys(data).length < 10) return null;
    return data;
  } catch {
    return null;
  }
}

function tryLoadFromNextPublicShards(lang: string): Record<string, string> | null {
  const nextI18nDir = NEXT_PUBLIC_I18N_SHARD_ROOT;
  try {
    const merged = readMergedBundleFromNextPublicI18n(nextI18nDir, lang, { adminOnlyRoot: null });
    if (!merged || typeof merged !== "object") return null;
    if (Object.keys(merged).length < 10) return null;
    return merged;
  } catch {
    return null;
  }
}

export async function compileI18n() {
  const scriptDir = path.dirname(fileURLToPath(import.meta.url));
  const enPathPrimary = path.join(REPO_ROOT, "tools/i18n/source/i18n-en.ts");
  const shardFb = shardFallbackEnabled();

  console.log(`[i18n] compile: repo root (resolved)=${REPO_ROOT}`);
  console.log(`[i18n] compile: repo root (script parent)=${REPO_ROOT_FROM_SCRIPT}`);
  console.log(`[i18n] compile: process.cwd()=${process.cwd()}`);
  console.log(`[i18n] compile: script dir=${scriptDir}`);
  console.log(`[i18n] compile: appRoot (resolved)=${APP_ROOT}`);
  console.log(`[i18n] compile: English TS source (primary)=${enPathPrimary}`);
  console.log(`[i18n] compile: English TS exists=${existsSync(enPathPrimary)}`);
  console.log(
    `[i18n] compile: ${SHARD_FALLBACK_ENV}=${shardFb ? "1 (shard fallback allowed)" : "unset/false"}`,
  );

  const outDir = CLIENT_PUBLIC_I18N_DIR;
  mkdirSync(outDir, { recursive: true });
  const errors: string[] = [];
  let totalKeys = 0;

  let enData: Record<string, string> | null = tryLoadFromTsSource(REPO_ROOT, "en");
  let enSource: "tools-ts" | "next-public-shards" = "tools-ts";

  if (!enData && shardFb) {
    enData = tryLoadFromNextPublicShards("en");
    if (enData) {
      enSource = "next-public-shards";
      console.warn(
        `[i18n] WARNING: English monolith loaded from Next public i18n shards (emergency fallback). Restore tools/i18n/source/i18n-en.ts in the build context.`,
      );
    }
  }

  if (!enData) {
    if (!existsSync(enPathPrimary)) {
      errors.push(`i18n-en.ts: missing file at ${enPathPrimary}`);
    } else {
      errors.push(`i18n-en.ts: could not extract translations or too few keys`);
    }
    if (shardFb) {
      errors.push(
        `i18n-en: shard fallback did not yield a bundle (check ${path.join(NEXT_PUBLIC_I18N_SHARD_ROOT, "en")} or en.json)`,
      );
    } else {
      errors.push(
        `i18n-en: set ${SHARD_FALLBACK_ENV}=1 only as emergency if committed shards exist but tools/ is absent`,
      );
    }
    console.error("[i18n] Compilation errors:\n  " + errors.join("\n  "));
    throw new Error(`i18n compilation failed: missing canonical English monolith`);
  }
  console.log(`[i18n] compile: English source used=${enSource}`);

  for (const lang of LANGUAGES) {
    try {
      let data = tryLoadFromTsSource(REPO_ROOT, lang);
      let langSource: "tools-ts" | "next-public-shards" = "tools-ts";
      if (!data && shardFb) {
        data = tryLoadFromNextPublicShards(lang);
        if (data) {
          langSource = "next-public-shards";
          console.warn(
            `[i18n] WARNING: locale "${lang}" loaded from Next public shards (${SHARD_FALLBACK_ENV}=1). Prefer tools/i18n/source/i18n-${lang}.ts.`,
          );
        }
      }
      if (!data) {
        errors.push(`i18n-${lang}.ts: could not extract translations (and shard fallback unavailable or empty)`);
        continue;
      }
      const aligned = lang === "en" ? data : alignMonolithToEnglishCanonical(enData, data);
      totalKeys += Object.keys(aligned).length;
      const payload =
        langSource === "next-public-shards" ? stringifySortedFlatBundle(aligned) : JSON.stringify(aligned);
      writeFileSync(path.join(outDir, `${lang}.json`), payload);
    } catch (err) {
      errors.push(`i18n-${lang}.ts: ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  if (errors.length > 0) {
    console.error("[i18n] Compilation errors:\n  " + errors.join("\n  "));
    throw new Error(`i18n compilation failed: ${errors.length} error(s)`);
  }
  console.log(`compiled ${LANGUAGES.length} i18n files to JSON (${totalKeys} total keys; ${Object.keys(enData).length} keys per locale after en alignment)`);

  const { normalizeMarketingLocaleOverlays } = await import("./normalize-marketing-locale-overlays");
  const norm = normalizeMarketingLocaleOverlays();
  console.log(
    `[i18n] normalized marketing locale overlays: ${norm.files} file(s), ${norm.keys} canonical keys (marketing-en.json)`,
  );

  const { mergeMarketingIntoI18n } = await import("./merge-marketing-i18n");
  mergeMarketingIntoI18n();
  console.log(
    `[i18n] merged marketing strings into ${path.relative(REPO_ROOT, CLIENT_PUBLIC_I18N_DIR) || "."} and ${path.relative(REPO_ROOT, NEXT_PUBLIC_I18N_SHARD_ROOT) || "."}`,
  );

  const finalEn = path.join(CLIENT_PUBLIC_I18N_DIR, "en.json");
  console.log(`[i18n-final] repoRoot=${REPO_ROOT}`);
  console.log(`[i18n-final] appRoot=${APP_ROOT}`);
  console.log(`[i18n-final] finalOutputPath=${finalEn}`);
  if (!existsSync(finalEn)) {
    throw new Error(
      `[i18n] compile: expected English bundle missing after merge: ${finalEn} (CLIENT_PUBLIC_I18N_DIR=${CLIENT_PUBLIC_I18N_DIR})`,
    );
  }
}

if (import.meta.url === `file://${process.argv[1]}` || process.argv[1]?.endsWith("compile-i18n.ts")) {
  compileI18n().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
