/**
 * Global i18n batch audit (safe, reversible — no MT, no DB writes).
 *
 * - Reads `data/config/global-locale-matrix.json`
 * - Optionally scans `nursenest-core/public/i18n/{locale}.json` key counts vs `en.json`
 * - Updates `data/audit/translation-progress-global.json`
 *
 * Usage (repo root):
 *   npx tsx scripts/i18n/run-global-translation.ts
 *   npx tsx scripts/i18n/run-global-translation.ts --batch-size=25
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.join(__dirname, "..", "..");
const MATRIX = path.join(REPO_ROOT, "data/config/global-locale-matrix.json");
const PROGRESS_OUT = path.join(REPO_ROOT, "data/audit/translation-progress-global.json");
const NEXT_PUBLIC_I18N = path.join(REPO_ROOT, "nursenest-core/public/i18n");
const COMPILE_LANGS = [
  "en", "fr", "tl", "hi", "es", "zh", "zh-tw", "ar", "ko",
  "pt", "pa", "vi", "ht", "ur", "ja", "fa", "de", "th", "tr", "id", "it", "ru",
];

function countKeys(obj: unknown): number {
  if (obj === null || typeof obj !== "object") return 0;
  return Object.keys(obj as Record<string, unknown>).length;
}

function loadJson<T>(p: string): T | null {
  try {
    return JSON.parse(fs.readFileSync(p, "utf8")) as T;
  } catch {
    return null;
  }
}

function parseArgs(): { batchSize: number } {
  let batchSize = 25;
  const b = process.argv.find((a) => a.startsWith("--batch-size="));
  if (b) {
    const n = Number(b.split("=", 2)[1]);
    if (Number.isFinite(n) && n >= 1 && n <= 100) batchSize = Math.floor(n);
  }
  return { batchSize };
}

function main(): void {
  const { batchSize } = parseArgs();
  const matrix = loadJson<{ markets?: unknown[] }>(MATRIX);
  const markets = Array.isArray(matrix?.markets) ? matrix!.markets!.length : 0;

  const enPath = path.join(NEXT_PUBLIC_I18N, "en.json");
  const en = loadJson<Record<string, string>>(enPath);
  const enKeys = en ? countKeys(en) : 0;

  const localeStats: Array<{ locale: string; mergedKeys: number | null; fileExists: boolean }> = [];

  for (let i = 0; i < COMPILE_LANGS.length; i += batchSize) {
    const slice = COMPILE_LANGS.slice(i, i + batchSize);
    for (const loc of slice) {
      const fp = path.join(NEXT_PUBLIC_I18N, `${loc}.json`);
      const exists = fs.existsSync(fp);
      const data = exists ? loadJson<Record<string, string>>(fp) : null;
      localeStats.push({
        locale: loc,
        mergedKeys: data ? countKeys(data) : null,
        fileExists: exists,
      });
    }
  }

  const overlayRoot = path.join(REPO_ROOT, "nursenest-core/public/i18n/educational-overlays");
  let overlayFiles = 0;
  if (fs.existsSync(overlayRoot)) {
    const walk = (dir: string) => {
      for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
        const p = path.join(dir, ent.name);
        if (ent.isDirectory()) walk(p);
        else if (ent.name.endsWith(".json")) overlayFiles += 1;
      }
    };
    walk(overlayRoot);
  }

  const progress = {
    schemaVersion: 1,
    generatedAt: new Date().toISOString(),
    lastBatchIndex: 0,
    batchSize,
    status: "completed_scan",
    totals: {
      localesScanned: COMPILE_LANGS.length,
      overlayFilesChecked: overlayFiles,
      uiKeyParityWarnings: enKeys > 0
        ? localeStats.filter((s) => s.fileExists && s.mergedKeys !== null && s.mergedKeys < enKeys * 0.95).length
        : 0,
      marketsInMatrix: markets,
      englishBaselineKeys: enKeys,
    },
    batches: [
      {
        index: 0,
        locales: COMPILE_LANGS,
        localeStats,
      },
    ],
    note: "Parity warning = merged key count < 95% of en.json (rough heuristic). Clinical accuracy requires human QA.",
  };

  fs.mkdirSync(path.dirname(PROGRESS_OUT), { recursive: true });
  fs.writeFileSync(PROGRESS_OUT, JSON.stringify(progress, null, 2), "utf8");
  console.log(JSON.stringify({ wrote: PROGRESS_OUT, marketsInMatrix: markets, overlayJsonFiles: overlayFiles, enKeys }, null, 2));
}

main();
