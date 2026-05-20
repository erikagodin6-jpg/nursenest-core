/**
 * Server-only helpers for reading planned blog manifests (JSON) without pulling rows into the client bundle.
 * Use for ISR pages, audits, and build-time validation — not for root layout.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { PilotCountrySlug } from "@/config/country-localization-types";
import { COUNTRY_BLOG_PRIORITY_MAP } from "@/config/country-blog-priority-map";

type ManifestRow = { slug?: string; language?: string };

type ManifestShape = {
  generatedAt?: string;
  count?: number;
  entries: ManifestRow[];
  note?: string;
};

function repoRoot(): string {
  return join(process.cwd());
}

export function readPilotManifestSummary(country: PilotCountrySlug): ManifestShape | null {
  const rel = COUNTRY_BLOG_PRIORITY_MAP[country].manifestRelativePath;
  try {
    const raw = readFileSync(join(repoRoot(), rel), "utf8");
    return JSON.parse(raw) as ManifestShape;
  } catch {
    return null;
  }
}

export type PilotManifestValidation = {
  country: PilotCountrySlug;
  manifestPath: string;
  exists: boolean;
  rowCount: number;
  reportedCount?: number;
  duplicateSlugs: string[];
  languageDistribution: Record<string, number>;
  issues: string[];
};

/**
 * Server-only manifest integrity summary for dashboards, audits, and ISR props.
 * Does not load manifest in client components.
 */
export function validatePilotManifestSummary(country: PilotCountrySlug): PilotManifestValidation {
  const manifestPath = COUNTRY_BLOG_PRIORITY_MAP[country].manifestRelativePath;
  const summary = readPilotManifestSummary(country);
  const issues: string[] = [];

  if (!summary) {
    return {
      country,
      manifestPath,
      exists: false,
      rowCount: 0,
      duplicateSlugs: [],
      languageDistribution: {},
      issues: ["manifest missing or unreadable"],
    };
  }

  const entries = summary.entries ?? [];
  const rowCount = entries.length;
  if (typeof summary.count === "number" && summary.count !== rowCount) {
    issues.push(`count field (${summary.count}) does not match entries.length (${rowCount})`);
  }

  const slugCounts = new Map<string, number>();
  const languageDistribution: Record<string, number> = {};
  for (const e of entries) {
    const s = e.slug?.trim() ?? "";
    slugCounts.set(s, (slugCounts.get(s) ?? 0) + 1);
    const lang = e.language ?? "unknown";
    languageDistribution[lang] = (languageDistribution[lang] ?? 0) + 1;
  }

  const duplicateSlugs = [...slugCounts.entries()].filter(([slug, c]) => slug && c > 1).map(([slug]) => slug);
  if (duplicateSlugs.length) {
    issues.push(`${duplicateSlugs.length} duplicate slug(s)`);
  }

  if (rowCount === 0 && country === "philippines") {
    issues.push("Philippines manifest empty — optional until NLE 200-row feed is wired");
  }

  return {
    country,
    manifestPath,
    exists: true,
    rowCount,
    reportedCount: summary.count,
    duplicateSlugs,
    languageDistribution,
    issues,
  };
}

/** One-line report for logging or admin diagnostics. */
export function formatPilotManifestReport(v: PilotManifestValidation): string {
  if (!v.exists) return `[manifest] ${v.country}: MISSING (${v.manifestPath})`;
  const dup = v.duplicateSlugs.length ? ` dupSlugs=${v.duplicateSlugs.length}` : "";
  const iss = v.issues.length ? ` issues=${v.issues.join("; ")}` : "";
  return `[manifest] ${v.country}: rows=${v.rowCount} langs=${JSON.stringify(v.languageDistribution)}${dup}${iss}`;
}
