import "server-only";

import fs from "node:fs";
import path from "node:path";
import { getMonorepoRoot } from "@/lib/monorepo-root";

export type GlobalMarketEntry = {
  country: string;
  region?: string;
  defaultLocale?: string;
  languages?: string[];
  nursingTiers?: string[];
  exams?: Record<string, string>;
  terminologyOverrides?: Record<string, string>;
};

export type GlobalLocaleMatrixFile = {
  schemaVersion?: number;
  markets: GlobalMarketEntry[];
};

let cached: GlobalLocaleMatrixFile | null = null;

function matrixPath(): string {
  return path.join(getMonorepoRoot(), "data", "config", "global-locale-matrix.json");
}

/** Loads `data/config/global-locale-matrix.json` from the monorepo root (cached). */
export function loadGlobalLocaleMatrix(): GlobalLocaleMatrixFile | null {
  if (cached) return cached;
  const fp = matrixPath();
  if (!fs.existsSync(fp)) return null;
  try {
    const raw = fs.readFileSync(fp, "utf8");
    cached = JSON.parse(raw) as GlobalLocaleMatrixFile;
    return cached;
  } catch {
    return null;
  }
}

/**
 * Returns a human-facing exam label for UI copy (illustrative — verify against regulators).
 * `tier` should align with pathway tier strings used in product (RN, PN, NP, etc.).
 */
export function getExamLabelForMarket(country: string, tier: string): string | null {
  const m = loadGlobalLocaleMatrix();
  if (!m?.markets?.length) return null;
  const row = m.markets.find((x) => x.country.toUpperCase() === country.toUpperCase());
  if (!row?.exams) return null;
  const t = tier.trim();
  const upper = t.toUpperCase();
  const exams = row.exams;
  return exams[t] ?? exams[upper] ?? exams[t.toLowerCase()] ?? null;
}
