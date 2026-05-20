#!/usr/bin/env node
/**
 * Ingest `nursenest.ca-Coverage-YYYY-MM-DD.xlsx` (multi-sheet SEO audit export) and emit a normalized JSON inventory.
 *
 * Usage (from `nursenest-core/`):
 *   node --import tsx scripts/seo/ingest-nursenest-coverage-xlsx.mts [path-to.xlsx]
 *
 * Env:
 *   SEO_COVERAGE_XLSX_PATH — default `data/seo/nursenest.ca-Coverage-2026-05-10.xlsx` under cwd.
 *
 * Output: stdout JSON summary; optional `--out path.json`.
 */
import { existsSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import XLSX from "xlsx";

import type { SeoRemediationBucket } from "../../src/lib/seo/seo-coverage-classifier.ts";
import { classifySeoAuditText } from "../../src/lib/seo/seo-coverage-classifier.ts";

const DEFAULT_REL = "data/seo/nursenest.ca-Coverage-2026-05-10.xlsx";

/** Try common layouts: monorepo cwd, nested package, parent repo root. */
function resolveDefaultCoverageXlsxPath(): string | null {
  const candidates: string[] = [];
  const envRel = process.env.SEO_COVERAGE_XLSX_PATH?.trim();
  if (envRel) candidates.push(resolve(process.cwd(), envRel));
  candidates.push(resolve(process.cwd(), DEFAULT_REL));
  candidates.push(resolve(process.cwd(), "..", DEFAULT_REL));
  candidates.push(resolve(process.cwd(), "nursenest-core", DEFAULT_REL));
  const uniq = [...new Set(candidates)];
  return uniq.find((p) => existsSync(p)) ?? null;
}

function rowToRecord(row: unknown[], headers: string[]): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (let i = 0; i < headers.length; i += 1) {
    const k = headers[i]?.trim() || `col_${i}`;
    out[k] = row[i];
  }
  return out;
}

function classifyRecord(rec: Record<string, unknown>): SeoRemediationBucket[] {
  const blob = JSON.stringify(rec);
  return classifySeoAuditText(blob);
}

async function main() {
  const argv = process.argv.slice(2);
  let outPath: string | null = null;
  const args = argv.filter((a) => {
    if (a.startsWith("--out=")) {
      outPath = a.slice("--out=".length);
      return false;
    }
    return true;
  });

  let inputPath: string;
  if (args[0]) {
    inputPath = resolve(process.cwd(), args[0]);
    if (!existsSync(inputPath)) {
      console.error(`[seo:coverage:ingest] File not found: ${inputPath}`);
      process.exit(2);
    }
  } else {
    const found = resolveDefaultCoverageXlsxPath();
    if (!found) {
      console.error(`[seo:coverage:ingest] File not found. Tried:`);
      console.error(`  - explicit argv[1] (none)`);
      console.error(`  - SEO_COVERAGE_XLSX_PATH`);
      console.error(`  - ${resolve(process.cwd(), DEFAULT_REL)}`);
      console.error(`  - ${resolve(process.cwd(), "..", DEFAULT_REL)}`);
      console.error(`  - ${resolve(process.cwd(), "nursenest-core", DEFAULT_REL)}`);
      console.error(`[seo:coverage:ingest] Place ${DEFAULT_REL} or pass path to .xlsx`);
      process.exit(2);
    }
    inputPath = found;
  }

  const wb = XLSX.readFile(inputPath);
  const summary: {
    sourceFile: string;
    sheets: Array<{
      name: string;
      rowCount: number;
      buckets: Partial<Record<SeoRemediationBucket, number>>;
      samples: Array<{ row: Record<string, unknown>; buckets: SeoRemediationBucket[] }>;
    }>;
  } = { sourceFile: inputPath, sheets: [] };

  for (const sheetName of wb.SheetNames) {
    const ws = wb.Sheets[sheetName];
    if (!ws) continue;
    const rows = XLSX.utils.sheet_to_json<unknown[]>(ws, { header: 1, raw: false }) as unknown[][];
    if (rows.length === 0) {
      summary.sheets.push({ name: sheetName, rowCount: 0, buckets: {}, samples: [] });
      continue;
    }
    const headerRow = rows[0]?.map((c) => String(c ?? "")) ?? [];
    const buckets: Partial<Record<SeoRemediationBucket, number>> = {};
    const samples: Array<{ row: Record<string, unknown>; buckets: SeoRemediationBucket[] }> = [];

    for (let r = 1; r < rows.length; r += 1) {
      const row = rows[r];
      if (!Array.isArray(row)) continue;
      const rec = rowToRecord(row, headerRow);
      const cls = classifyRecord(rec);
      for (const b of cls) {
        buckets[b] = (buckets[b] ?? 0) + 1;
      }
      if (samples.length < 5) {
        samples.push({ row: rec, buckets: cls });
      }
    }

    summary.sheets.push({
      name: sheetName,
      rowCount: Math.max(0, rows.length - 1),
      buckets,
      samples,
    });
  }

  const json = JSON.stringify(summary, null, 2);
  console.log(json);
  if (outPath) {
    writeFileSync(resolve(process.cwd(), outPath), json, "utf8");
    console.error(`[seo:coverage:ingest] wrote ${outPath}`);
  }
}

await main();
