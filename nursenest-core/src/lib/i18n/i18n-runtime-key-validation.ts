import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";

export type I18nRuntimeKeyValidationResult = {
  scannedFiles: number;
  codeKeys: string[];
  missingKeys: string[];
  localeKeySetErrors: string[];
  loggedMissingKeys: string[];
  loggedMissingStillMissing: string[];
  dynamicKeys: Array<{ file: string; key: string }>;
};

const SOURCE_DIRS = ["src/components", "src/app", "src/lib", "src/config", "src/hooks"] as const;
const SCAN_EXTENSIONS = new Set([".ts", ".tsx"]);
const SKIP_DIRS = new Set(["node_modules", ".next", "dist", "build"]);

const EXPLICIT_RUNTIME_KEY_PATTERNS = [
  /(?:safeHomepageMarketingT|formatMarketingMessage|getRequiredMarketingMessage|getRequiredPublicMessage|getOptionalPublicMessage)\(\s*[^,]+,\s*["']([^"']+)["']/g,
  /resolveMarketingCopy\(\s*[^,]+,\s*["']([^"']+)["']/g,
];

const HOMEPAGE_HELPER_KEY_PATTERNS = [
  /\b(?:tr|pickMsg)\(\s*["'](pages\.home\.[^"']+)["']/g,
  /\bt\(\s*["'](pages\.home\.[^"']+)["']/g,
];

const DYNAMIC_KEY_PATTERNS = [
  /(?:safeHomepageMarketingT|formatMarketingMessage|getRequiredMarketingMessage|getRequiredPublicMessage|getOptionalPublicMessage)\([^,\n]+,\s*`([^`]*\$\{[^`]+)`/g,
  /\b(?:tr|t)\(\s*`([^`]*\$\{[^`]+)`/g,
];

function repoRootFromCwd(): string {
  const cwd = process.cwd();
  if (existsSync(path.join(cwd, "package.json")) && existsSync(path.join(cwd, "src"))) return cwd;
  const app = path.join(cwd, "nursenest-core");
  if (existsSync(path.join(app, "package.json")) && existsSync(path.join(app, "src"))) return app;
  return cwd;
}

function walkFiles(dir: string, out: string[]): void {
  if (!existsSync(dir)) return;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (SKIP_DIRS.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkFiles(full, out);
      continue;
    }
    if (entry.isFile() && SCAN_EXTENSIONS.has(path.extname(entry.name)) && !isTestOrFixtureFile(full)) out.push(full);
  }
}

function isTestOrFixtureFile(file: string): boolean {
  const normalized = file.replaceAll(path.sep, "/");
  return (
    normalized.includes("/__tests__/") ||
    normalized.includes("/fixtures/") ||
    /\.(?:test|spec|contract\.test)\.[cm]?[tj]sx?$/.test(normalized)
  );
}

function loadJson(file: string): Record<string, string> {
  return JSON.parse(readFileSync(file, "utf8")) as Record<string, string>;
}

function loadNextMergedLocale(appRoot: string, locale: string): Record<string, string> {
  const localeDir = path.join(appRoot, "public/i18n", locale);
  const merged: Record<string, string> = {};
  if (!existsSync(localeDir) || !statSync(localeDir).isDirectory()) return merged;
  for (const shard of readdirSync(localeDir).filter((f) => f.endsWith(".json")).sort()) {
    Object.assign(merged, loadJson(path.join(localeDir, shard)));
  }
  return merged;
}

function extractLoggedMissingKeys(appRoot: string): string[] {
  const roots = ["playwright-report-full-regression", "reports", "tmp", "data", "logs"];
  const files: string[] = [];
  for (const root of roots) walkAny(path.join(appRoot, root), files);
  const keys = new Set<string>();
  for (const file of files) {
    const source = readFileSync(file, "utf8");
    const patterns = [
      /"event":"missing_or_invalid","key":"([^"]+)"/g,
      /missing_or_invalid\\?",\\?"key\\?":\\?"([^"\\]+)\\?"/g,
    ];
    for (const pattern of patterns) {
      let match: RegExpExecArray | null;
      while ((match = pattern.exec(source)) !== null) keys.add(match[1]);
    }
  }
  return [...keys].sort();
}

function walkAny(dir: string, out: string[]): void {
  if (!existsSync(dir)) return;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkAny(full, out);
      continue;
    }
    if (entry.isFile() && /\.(json|log|md|txt)$/i.test(entry.name)) out.push(full);
  }
}

export function validateI18nRuntimeKeys(appRoot = repoRootFromCwd()): I18nRuntimeKeyValidationResult {
  const files: string[] = [];
  for (const dir of SOURCE_DIRS) walkFiles(path.join(appRoot, dir), files);

  const codeKeys = new Set<string>();
  const dynamicKeys: I18nRuntimeKeyValidationResult["dynamicKeys"] = [];
  for (const file of files) {
    const source = readFileSync(file, "utf8");
    const patterns = [...EXPLICIT_RUNTIME_KEY_PATTERNS];
    if (file.replaceAll(path.sep, "/").includes("/src/components/marketing/home/")) {
      patterns.push(...HOMEPAGE_HELPER_KEY_PATTERNS);
    }
    for (const pattern of patterns) {
      let match: RegExpExecArray | null;
      while ((match = pattern.exec(source)) !== null) {
        const key = match[1]?.trim();
        if (key && !key.includes("${")) codeKeys.add(key);
      }
    }
    for (const pattern of DYNAMIC_KEY_PATTERNS) {
      let match: RegExpExecArray | null;
      while ((match = pattern.exec(source)) !== null) {
        dynamicKeys.push({ file: path.relative(appRoot, file), key: match[1] });
      }
    }
  }

  const clientI18n = path.resolve(appRoot, "../client/public/i18n");
  const en = loadJson(path.join(clientI18n, "en.json"));
  const enKeys = new Set(Object.keys(en));
  const missingKeys = [...codeKeys].filter((key) => !enKeys.has(key)).sort();

  const localeKeySetErrors: string[] = [];
  for (const localeFile of readdirSync(clientI18n).filter((f) => f.endsWith(".json")).sort()) {
    const locale = localeFile.replace(/\.json$/, "");
    if (locale !== "en") continue;
    const data = loadJson(path.join(clientI18n, localeFile));
    const keys = new Set(Object.keys(data));
    for (const key of keys) {
      if (!enKeys.has(key)) localeKeySetErrors.push(`[${locale}] orphan key: ${key}`);
    }
    for (const key of codeKeys) {
      if (!keys.has(key)) localeKeySetErrors.push(`[${locale}] missing runtime code key: ${key}`);
    }
  }

  const loggedMissingKeys = extractLoggedMissingKeys(appRoot);
  const loggedMissingStillMissing = loggedMissingKeys.filter((key) => !enKeys.has(key)).sort();
  const enNextKeys = new Set(Object.keys(loadNextMergedLocale(appRoot, "en")));
  for (const key of enNextKeys) {
    if (!enKeys.has(key)) localeKeySetErrors.push(`[en] public Next shard orphan key: ${key}`);
  }
  for (const key of [...codeKeys, ...loggedMissingKeys]) {
    if (key.startsWith("pages.") && !enNextKeys.has(key)) {
      localeKeySetErrors.push(`[en] public Next shard missing runtime key: ${key}`);
    }
  }

  return {
    scannedFiles: files.length,
    codeKeys: [...codeKeys].sort(),
    missingKeys,
    localeKeySetErrors,
    loggedMissingKeys,
    loggedMissingStillMissing,
    dynamicKeys,
  };
}
