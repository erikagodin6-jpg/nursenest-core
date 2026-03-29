import * as fs from "fs";
import * as path from "path";
import { createHash } from "crypto";

/** Optional breakdown for ai_cache → exam_questions extract (see import-pipeline extractFromAiCacheOutputs). */
export type NursingAiCacheExtractReport = {
  examQuestionsInserted: number;
  /** Rows that failed exam mapping after enrichment (not flashcards). */
  skippedInvalid: number;
  /** Same rows captured in review queue artifact when applicable. */
  sentToReview: number;
  unresolvedUniqueCacheKeys: number;
  reviewQueuePath: string | null;
};

export type ImportStats = {
  file: string;
  table?: string;
  inserted: number;
  updated: number;
  skipped: number;
  skipReasons: Record<string, number>;
  errors: string[];
  nursingAiCacheExtract?: NursingAiCacheExtractReport;
};

export function createStats(file: string, table?: string): ImportStats {
  return {
    file,
    table,
    inserted: 0,
    updated: 0,
    skipped: 0,
    skipReasons: {},
    errors: [],
  };
}

export function bumpSkip(stats: ImportStats, reason: string): void {
  stats.skipped += 1;
  stats.skipReasons[reason] = (stats.skipReasons[reason] ?? 0) + 1;
}

export function snakeToCamel(s: string): string {
  return s.replace(/_([a-z])/g, (_, c: string) => c.toUpperCase());
}

/** Read value from export row supporting snake_case (DB) and camelCase (some serializers). */
export function rowVal(row: Record<string, unknown>, key: string): unknown {
  if (Object.prototype.hasOwnProperty.call(row, key) && row[key] !== undefined && row[key] !== null) {
    return row[key];
  }
  const camel = snakeToCamel(key);
  if (Object.prototype.hasOwnProperty.call(row, camel) && row[camel] !== undefined && row[camel] !== null) {
    return row[camel];
  }
  return undefined;
}

export function str(row: Record<string, unknown>, key: string, fallback = ""): string {
  const v = rowVal(row, key);
  if (v === undefined || v === null) return fallback;
  return String(v);
}

export function optStr(row: Record<string, unknown>, key: string): string | null {
  const v = rowVal(row, key);
  if (v === undefined || v === null || v === "") return null;
  return String(v);
}

export function num(row: Record<string, unknown>, key: string, fallback: number | null = null): number | null {
  const v = rowVal(row, key);
  if (v === undefined || v === null) return fallback;
  const n = typeof v === "number" ? v : Number(v);
  return Number.isFinite(n) ? n : fallback;
}

export function bool(row: Record<string, unknown>, key: string, fallback: boolean): boolean {
  const v = rowVal(row, key);
  if (v === undefined || v === null) return fallback;
  if (typeof v === "boolean") return v;
  if (v === "true" || v === "1") return true;
  if (v === "false" || v === "0") return false;
  return fallback;
}

export function jsonb(row: Record<string, unknown>, key: string): unknown {
  const v = rowVal(row, key);
  return v === undefined ? null : v;
}

export function parseTimestamp(v: unknown): string | null {
  if (v === undefined || v === null || v === "") return null;
  if (typeof v === "number" && Number.isFinite(v)) {
    return new Date(v).toISOString();
  }
  const s = String(v);
  const d = new Date(s);
  if (Number.isNaN(d.getTime())) return null;
  return d.toISOString();
}

export function contentHash(text: string): string {
  return createHash("sha256").update(text.trim().toLowerCase()).digest("hex");
}

/**
 * Parse a JSON export file into an array of row objects.
 * Supports: T[], { rows: T[] }, { data: T[] }, single object T.
 */
export function loadJsonRows(filePath: string): Record<string, unknown>[] {
  const raw = fs.readFileSync(filePath, "utf8");
  const trimmed = raw.trim();
  if (!trimmed) return [];
  const parsed: unknown = JSON.parse(trimmed);
  if (Array.isArray(parsed)) {
    return parsed.filter((x) => x && typeof x === "object" && !Array.isArray(x)) as Record<string, unknown>[];
  }
  if (parsed && typeof parsed === "object") {
    const o = parsed as Record<string, unknown>;
    for (const k of ["rows", "data", "records", "items"]) {
      const inner = o[k];
      if (Array.isArray(inner)) {
        return inner.filter((x) => x && typeof x === "object" && !Array.isArray(x)) as Record<string, unknown>[];
      }
    }
    return [o];
  }
  return [];
}

export function listJsonFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".json"))
    .map((f) => path.join(dir, f))
    .sort();
}

export function safeJsonForPg(value: unknown): string | null {
  if (value === undefined) return null;
  return JSON.stringify(value);
}
