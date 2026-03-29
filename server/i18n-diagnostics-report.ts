/**
 * Static analysis of tools/i18n/source + compiled JSON + marketing overlays.
 * Used by /api/admin/i18n-diagnostics and scripts/generate-i18n-status.ts
 */
import fs from "fs";
import path from "path";

/** Must match script/compile-i18n.ts and script/merge-marketing-i18n.ts */
export const I18N_LANGS = [
  "en", "fr", "tl", "hi", "es", "zh", "zh-tw", "ar", "ko",
  "pt", "pa", "vi", "ht", "ur", "ja", "fa", "de", "th", "tr", "id",
] as const;

export type I18nSurface = {
  id: string;
  label: string;
  description: string;
  keyCount?: number;
  path?: string;
  status: "ok" | "missing" | "partial";
};

export type LocaleDiagnostics = {
  locale: string;
  sourceFile: string;
  sourceExists: boolean;
  totalKeys: number;
  missingKeys: string[];
  extraKeys: string[];
  emptyKeys: string[];
  placeholderLikeKeys: string[];
  englishLeakageCandidates: string[];
  percentComplete: number;
  drift: "ok" | "missing" | "extra" | "empty" | "mixed";
  compiledClientJson: { path: string; exists: boolean; keyCount: number };
  compiledNextJson: { path: string; exists: boolean; keyCount: number };
  marketingOverlayKeys: number;
  namespacesAffected: { namespace: string; missingCount: number }[];
};

export type I18nDiagnosticsReport = {
  generatedAt: string;
  repoRoot: string;
  summary: {
    totalLocales: number;
    canonicalKeyCount: number;
    localesFullyComplete: number;
    localesWithMissing: number;
    localesWithExtra: number;
    localesWithEmpty: number;
    lastCompileIso: string | null;
    compileStatus: "ok" | "partial" | "unknown";
    validationStatus: "pass" | "warn" | "fail" | "unknown";
  };
  validation: {
    scanReportPath: string | null;
    scanTimestamp: string | null;
    hardcodedViolationsTotal: number;
    bySeverity: Record<string, number>;
  };
  surfaces: I18nSurface[];
  locales: LocaleDiagnostics[];
  preNursingNote: string;
};

export function extractTranslationsFromSource(filePath: string): Record<string, string> | null {
  if (!fs.existsSync(filePath)) return null;
  const source = fs.readFileSync(filePath, "utf-8");
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

function loadJsonFile(p: string): Record<string, string> | null {
  if (!fs.existsSync(p)) return null;
  try {
    const raw = JSON.parse(fs.readFileSync(p, "utf-8"));
    if (raw && typeof raw === "object" && !Array.isArray(raw)) return raw as Record<string, string>;
  } catch {
    return null;
  }
  return null;
}

const PLACEHOLDER_SUBSTRINGS = ["[missing", "__MISSING", "TODO_TRANSLATE", "TRANSLATION_NEEDED", "[TODO"];

function isPlaceholderLike(v: string): boolean {
  const t = v.trim();
  if (!t) return true;
  if (/^\[[^\]]+\]$/.test(t) && t.length < 80) return true;
  return PLACEHOLDER_SUBSTRINGS.some((s) => t.includes(s));
}

function namespaceOf(key: string): string {
  const dot = key.indexOf(".");
  return dot === -1 ? "(root)" : key.slice(0, dot);
}

function buildNamespaceMissing(missingKeys: string[]): { namespace: string; missingCount: number }[] {
  const m = new Map<string, number>();
  for (const k of missingKeys) {
    const ns = namespaceOf(k);
    m.set(ns, (m.get(ns) ?? 0) + 1);
  }
  return [...m.entries()]
    .map(([namespace, missingCount]) => ({ namespace, missingCount }))
    .sort((a, b) => b.missingCount - a.missingCount)
    .slice(0, 40);
}

function readScanReport(cwd: string): I18nDiagnosticsReport["validation"] {
  const scanPath = path.join(cwd, "scripts/i18n-scan-report.json");
  if (!fs.existsSync(scanPath)) {
    return {
      scanReportPath: null,
      scanTimestamp: null,
      hardcodedViolationsTotal: 0,
      bySeverity: {},
    };
  }
  try {
    const j = JSON.parse(fs.readFileSync(scanPath, "utf-8")) as {
      timestamp?: string;
      totalViolations?: number;
      bySeverity?: Record<string, number>;
    };
    return {
      scanReportPath: scanPath,
      scanTimestamp: j.timestamp ?? null,
      hardcodedViolationsTotal: j.totalViolations ?? 0,
      bySeverity: j.bySeverity ?? {},
    };
  } catch {
    return {
      scanReportPath: scanPath,
      scanTimestamp: null,
      hardcodedViolationsTotal: 0,
      bySeverity: {},
    };
  }
}

function mtimeIso(p: string): string | null {
  try {
    if (!fs.existsSync(p)) return null;
    return new Date(fs.statSync(p).mtimeMs).toISOString();
  } catch {
    return null;
  }
}

export function buildI18nDiagnosticsReport(cwd: string = process.cwd()): I18nDiagnosticsReport {
  const generatedAt = new Date().toISOString();
  const canonicalPath = path.join(cwd, "tools/i18n/source/i18n-en.ts");
  const enMap = extractTranslationsFromSource(canonicalPath) || {};
  const canonicalKeys = new Set(Object.keys(enMap));
  const canonicalKeyCount = canonicalKeys.size;

  const marketingEnPath = path.join(cwd, "tools/i18n/marketing/marketing-en.json");
  const marketingEn = loadJsonFile(marketingEnPath);
  const marketingEnKeyCount = marketingEn ? Object.keys(marketingEn).length : 0;

  const clientI18nDir = path.join(cwd, "client/public/i18n");
  const nextI18nDir = path.join(cwd, "nursenest-core/public/i18n");
  const enJsonPath = path.join(clientI18nDir, "en.json");
  const enCompiled = loadJsonFile(enJsonPath);
  const compiledEnKeys = enCompiled ? Object.keys(enCompiled).length : 0;

  let lastCompileIso: string | null = null;
  for (const lang of I18N_LANGS) {
    const iso = mtimeIso(path.join(clientI18nDir, `${lang}.json`));
    if (iso && (!lastCompileIso || iso > lastCompileIso)) lastCompileIso = iso;
  }

  const compileStatus: I18nDiagnosticsReport["summary"]["compileStatus"] =
    !fs.existsSync(clientI18nDir)
      ? "unknown"
      : compiledEnKeys >= canonicalKeyCount * 0.9
        ? "ok"
        : "partial";

  const validation = readScanReport(cwd);
  const crit = validation.bySeverity.critical ?? 0;
  const high = validation.bySeverity.high ?? 0;
  const validationStatus: I18nDiagnosticsReport["summary"]["validationStatus"] = !validation.scanReportPath
    ? "unknown"
    : crit + high > 0
      ? "fail"
      : validation.hardcodedViolationsTotal > 0
        ? "warn"
        : "pass";

  const surfaces: I18nSurface[] = [
    {
      id: "canonical-ts",
      label: "Canonical TS (tools/i18n/source)",
      description: "Source-of-truth translation objects compiled to JSON.",
      keyCount: canonicalKeyCount,
      path: "tools/i18n/source/i18n-*.ts",
      status: fs.existsSync(canonicalPath) ? "ok" : "missing",
    },
    {
      id: "compiled-json",
      label: "Compiled runtime (client/public/i18n)",
      description: "Output of script/compile-i18n.ts before/after marketing merge.",
      keyCount: compiledEnKeys || undefined,
      path: "client/public/i18n/*.json",
      status: enCompiled ? "ok" : "missing",
    },
    {
      id: "marketing",
      label: "Marketing layer",
      description: "marketing-en.json merged into each locale JSON (canonical copy under tools/i18n/marketing/).",
      keyCount: marketingEnKeyCount || undefined,
      path: "tools/i18n/marketing/marketing-en.json",
      status: marketingEn ? "ok" : "missing",
    },
    {
      id: "marketing-overlays",
      label: "Marketing locale overlays",
      description: "Per-locale marketing-*.json in tools/i18n/marketing/locale/",
      keyCount: undefined,
      path: "tools/i18n/marketing/locale/marketing-*.json",
      status: fs.existsSync(path.join(cwd, "tools/i18n/marketing/locale")) ? "ok" : "missing",
    },
    {
      id: "next-static",
      label: "Next.js static i18n",
      description: "nursenest-core/public/i18n (should mirror client after merge).",
      keyCount: undefined,
      path: "nursenest-core/public/i18n/*.json",
      status: fs.existsSync(nextI18nDir) ? "ok" : "missing",
    },
    {
      id: "i18n-scan",
      label: "Hardcoded string scan",
      description: "scripts/i18n-scan.ts → scripts/i18n-scan-report.json",
      keyCount: validation.hardcodedViolationsTotal || undefined,
      path: "scripts/i18n-scan-report.json",
      status: validation.scanReportPath ? "ok" : "partial",
    },
  ];

  const locales: LocaleDiagnostics[] = [];
  let localesFullyComplete = 0;
  let localesWithMissing = 0;
  let localesWithExtra = 0;
  let localesWithEmpty = 0;

  for (const locale of I18N_LANGS) {
    const sourceFile = path.join(cwd, `tools/i18n/source/i18n-${locale}.ts`);
    const sourceExists = fs.existsSync(sourceFile);
    const locMap = sourceExists ? extractTranslationsFromSource(sourceFile) || {} : {};
    const locKeys = new Set(Object.keys(locMap));

    const missingKeys = [...canonicalKeys].filter((k) => !locKeys.has(k));
    const extraKeys = [...locKeys].filter((k) => !canonicalKeys.has(k));
    const emptyKeys = [...locKeys].filter((k) => (locMap[k] ?? "").trim() === "");
    const placeholderLikeKeys = [...locKeys].filter((k) => isPlaceholderLike(locMap[k] ?? ""));

    const englishLeakageCandidates: string[] = [];
    if (locale !== "en") {
      for (const k of locKeys) {
        if (!canonicalKeys.has(k)) continue;
        const ev = enMap[k] ?? "";
        const lv = locMap[k] ?? "";
        if (ev.length > 12 && lv === ev && !/^[\d\s$%.]+$/.test(ev)) {
          englishLeakageCandidates.push(k);
        }
      }
    }

    const denom = canonicalKeyCount || 1;
    const percentComplete = Math.round(((canonicalKeyCount - missingKeys.length) / denom) * 10000) / 100;

    let drift: LocaleDiagnostics["drift"] = "ok";
    if (missingKeys.length && extraKeys.length) drift = "mixed";
    else if (missingKeys.length) drift = "missing";
    else if (extraKeys.length) drift = "extra";
    else if (emptyKeys.length) drift = "empty";

    if (missingKeys.length === 0 && extraKeys.length === 0 && emptyKeys.length === 0) localesFullyComplete++;
    if (missingKeys.length) localesWithMissing++;
    if (extraKeys.length) localesWithExtra++;
    if (emptyKeys.length) localesWithEmpty++;

    const cj = path.join(clientI18nDir, `${locale}.json`);
    const nj = path.join(nextI18nDir, `${locale}.json`);
    const cjData = loadJsonFile(cj);
    const njData = loadJsonFile(nj);

    const overlayPath = path.join(cwd, "tools/i18n/marketing/locale", `marketing-${locale}.json`);
    const overlay = loadJsonFile(overlayPath);
    const marketingOverlayKeys = overlay ? Object.keys(overlay).length : 0;

    locales.push({
      locale,
      sourceFile: path.relative(cwd, sourceFile),
      sourceExists,
      totalKeys: locKeys.size,
      missingKeys,
      extraKeys,
      emptyKeys,
      placeholderLikeKeys,
      englishLeakageCandidates: englishLeakageCandidates.slice(0, 500),
      percentComplete,
      drift,
      compiledClientJson: {
        path: path.relative(cwd, cj),
        exists: fs.existsSync(cj),
        keyCount: cjData ? Object.keys(cjData).length : 0,
      },
      compiledNextJson: {
        path: path.relative(cwd, nj),
        exists: fs.existsSync(nj),
        keyCount: njData ? Object.keys(njData).length : 0,
      },
      marketingOverlayKeys,
      namespacesAffected: buildNamespaceMissing(missingKeys),
    });
  }

  return {
    generatedAt,
    repoRoot: cwd,
    summary: {
      totalLocales: I18N_LANGS.length,
      canonicalKeyCount,
      localesFullyComplete: localesFullyComplete,
      localesWithMissing,
      localesWithExtra,
      localesWithEmpty,
      lastCompileIso,
      compileStatus,
      validationStatus,
    },
    validation,
    surfaces,
    locales,
    preNursingNote:
      "Pre-nursing uses `nursenest-core/src/content/pre-nursing/pre-nursing-i18n.tsx` (separate from flat-key i18n). DB-backed lesson/content translations are content-layer, not static UI JSON. Canonical static UI + marketing strings: tools/i18n/source + tools/i18n/marketing → compile → client/public/i18n + nursenest-core/public/i18n.",
  };
}
