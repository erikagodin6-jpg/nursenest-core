/**
 * Normalizes repo-root E-E-A-T audit JSON into an editorial operations view model.
 * Read-only — no DB. Safe for admin reporting.
 */
import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { getMonorepoRoot } from "@/lib/monorepo-root";

const AUDIT_FILES = {
  pageScores: "eeat-page-scores.json",
  completionQueue: "eeat-completion-queue.json",
  finalStatus: "eeat-final-status.json",
  topicalClusters: "topical-clusters.json",
  contentFreshness: "content-freshness.json",
} as const;

export type EeatEditorialPriority = "critical" | "high" | "medium" | "low";

export type EeatEditorialRow = {
  id: string;
  pathwayKey: string;
  pathwayLabel: string;
  contentType: string;
  urlPattern: string;
  eeatScore: number;
  sectionCompleteness: number;
  internalLinksCount: number;
  wordCount: number;
  authorPresent: boolean;
  lastUpdated: string | null;
  flags: string[];
  lossReasons: string[];
  recommendedActions: string[];
  priority: EeatEditorialPriority;
  staleContent: boolean;
  thinProgrammatic: boolean;
  missingAttribution: boolean;
  missingInternalLinks: boolean;
  structureIncomplete: boolean;
  recommendedFixesCopy: string;
};

export type PathwayEeatRollup = {
  pathwayKey: string;
  pathwayLabel: string;
  pageCount: number;
  averageScore: number;
  minScore: number;
};

export type EeatEditorialDashboardVm = {
  generatedAtPageScores: string | null;
  generatedAtFinalStatus: string | null;
  thresholds: { minimumPassingEeatScore: number; minimumInternalLinks: number } | null;
  finalStatusSummary: Record<string, unknown> | null;
  overview: {
    totalPages: number;
    averageScore: number;
    belowThreshold: number;
    internalLinkGaps: number;
    thinProgrammaticCount: number;
    staleFlaggedCount: number;
    missingAttributionCount: number;
    structureIncompleteCount: number;
  };
  rows: EeatEditorialRow[];
  pathwayRollups: PathwayEeatRollup[];
  thinProgrammaticRows: EeatEditorialRow[];
  staleQueueRows: EeatEditorialRow[];
  attributionQueueRows: EeatEditorialRow[];
  topicalClusterCount: number;
  freshnessMeta: {
    catalogBundleMtime: string | null;
    staleBlogPostsSample: { slug: string; updatedAt: string }[];
    policy: { staleDaysBlog: number; staleDaysLessonCatalog: number } | null;
  };
  loadWarnings: string[];
  /** First slice of eeat-completion-queue.json (audit tool order). */
  completionQueuePreview: Array<{ id: string; score: number; flags: string[] }>;
};

type RawPage = {
  id: string;
  urlPattern: string;
  contentType: string;
  wordCount: number;
  sectionCompleteness: number;
  internalLinksCount: number;
  lastUpdated: string | null;
  authorPresent: boolean;
  schemaPresent: boolean;
  eeatScore: number;
  flags: string[];
};

function humanizePathwayId(id: string): string {
  return id
    .replace(/-/g, " ")
    .replace(/\bnclex\b/gi, "NCLEX")
    .replace(/\brn\b/gi, "RN")
    .replace(/\bpn\b/gi, "PN")
    .replace(/\bnp\b/gi, "NP")
    .replace(/\bfnp\b/gi, "FNP")
    .replace(/\bus\b/g, "US ")
    .replace(/\bca\b/g, "CA ")
    .trim();
}

/** Parse `lesson:pathwayId:slug` | `blog:slug` | `seo:slug` */
export function parseEeatPageId(id: string): { pathwayKey: string; pathwayLabel: string } {
  if (id.startsWith("lesson:")) {
    const rest = id.slice("lesson:".length);
    const idx = rest.indexOf(":");
    const pathwayId = idx === -1 ? rest : rest.slice(0, idx);
    return { pathwayKey: pathwayId, pathwayLabel: humanizePathwayId(pathwayId) };
  }
  if (id.startsWith("blog:")) {
    return { pathwayKey: "blog", pathwayLabel: "Blog" };
  }
  if (id.startsWith("seo:")) {
    return { pathwayKey: "programmatic_seo", pathwayLabel: "Programmatic SEO" };
  }
  return { pathwayKey: "unknown", pathwayLabel: "Other" };
}

const FLAG_TO_LOSS: Record<string, string> = {
  below_score_70: "Score below passing threshold (70)",
  internal_links_low: "Internal links below minimum (3)",
  structure_incomplete: "Lesson structure / section spine incomplete vs E-E-A-T checklist",
  thin_programmatic: "Thin programmatic SEO page (low word count + shallow sections)",
  stale_content: "Content flagged as stale (blog updated > policy days)",
  stale_or_unknown_date: "Stale date signal (catalog bundle age or unknown freshness)",
  author_missing: "Missing named author attribution (blog)",
};

function lossReasonsForFlags(flags: string[]): string[] {
  const out: string[] = [];
  for (const f of flags) {
    if (FLAG_TO_LOSS[f]) out.push(FLAG_TO_LOSS[f]);
    else if (f.startsWith("below_score_")) out.push(`Score below passing threshold (${f.replace("below_score_", "")})`);
    else out.push(`Flag: ${f.replace(/_/g, " ")}`);
  }
  return out;
}

const ACTION_BY_FLAG: Record<string, string> = {
  internal_links_low: "add internal links",
  structure_incomplete: "complete lesson structure",
  author_missing: "add reviewer attribution",
  stale_content: "refresh stale content",
  stale_or_unknown_date: "refresh stale content",
  thin_programmatic: "expand thin programmatic page",
};

function recommendedActionsForFlags(flags: string[]): string[] {
  const actions = new Set<string>();
  for (const f of flags) {
    const a = ACTION_BY_FLAG[f];
    if (a) actions.add(a);
  }
  if (flags.some((x) => x.startsWith("below_score_")) && !actions.size) {
    actions.add("raise E-E-A-T score (links, structure, depth)");
  }
  return [...actions];
}

function computePriority(score: number, flags: string[]): EeatEditorialPriority {
  if (score < 45 || (flags.includes("thin_programmatic") && score < 50)) return "critical";
  if (score < 55) return "high";
  if (score < 70) return "medium";
  return "low";
}

function buildRow(raw: RawPage): EeatEditorialRow {
  const { pathwayKey, pathwayLabel } = parseEeatPageId(raw.id);
  const flags = raw.flags ?? [];
  const lossReasons = lossReasonsForFlags(flags);
  const recommendedActions = recommendedActionsForFlags(flags);
  const staleContent = flags.some((f) => f === "stale_content" || f === "stale_or_unknown_date");
  const thinProgrammatic = flags.includes("thin_programmatic");
  const missingAttribution =
    flags.includes("author_missing") || (raw.contentType === "blog" && !raw.authorPresent);
  const missingInternalLinks = flags.includes("internal_links_low");
  const structureIncomplete = flags.includes("structure_incomplete") || raw.sectionCompleteness < 0.65;

  const copyLines = [
    `ID: ${raw.id}`,
    `Score: ${raw.eeatScore} · ${raw.urlPattern}`,
    `Why: ${lossReasons.join("; ") || "—"}`,
    `Suggested: ${recommendedActions.join("; ") || "review flags"}`,
  ];
  const recommendedFixesCopy = copyLines.join("\n");

  return {
    id: raw.id,
    pathwayKey,
    pathwayLabel,
    contentType: raw.contentType,
    urlPattern: raw.urlPattern,
    eeatScore: raw.eeatScore,
    sectionCompleteness: raw.sectionCompleteness,
    internalLinksCount: raw.internalLinksCount,
    wordCount: raw.wordCount,
    authorPresent: raw.authorPresent,
    lastUpdated: raw.lastUpdated,
    flags,
    lossReasons,
    recommendedActions,
    priority: computePriority(raw.eeatScore, flags),
    staleContent,
    thinProgrammatic,
    missingAttribution,
    missingInternalLinks,
    structureIncomplete,
    recommendedFixesCopy,
  };
}

function rollupByPathway(rows: EeatEditorialRow[]): PathwayEeatRollup[] {
  const map = new Map<string, { scores: number[]; label: string }>();
  for (const r of rows) {
    const prev = map.get(r.pathwayKey);
    if (!prev) {
      map.set(r.pathwayKey, { scores: [r.eeatScore], label: r.pathwayLabel });
    } else {
      prev.scores.push(r.eeatScore);
    }
  }
  const out: PathwayEeatRollup[] = [];
  for (const [pathwayKey, { scores, label }] of map) {
    const sum = scores.reduce((a, b) => a + b, 0);
    out.push({
      pathwayKey,
      pathwayLabel: label,
      pageCount: scores.length,
      averageScore: Math.round((sum / scores.length) * 10) / 10,
      minScore: Math.min(...scores),
    });
  }
  out.sort((a, b) => a.averageScore - b.averageScore);
  return out;
}

async function readJsonSafe<T>(path: string): Promise<{ ok: true; data: T } | { ok: false; error: string }> {
  try {
    const raw = await readFile(path, "utf8");
    return { ok: true, data: JSON.parse(raw) as T };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e) };
  }
}

export async function loadEeatEditorialDashboard(): Promise<EeatEditorialDashboardVm> {
  const root = getMonorepoRoot();
  const auditDir = join(root, "data", "audit");
  const warnings: string[] = [];

  const pageScoresPath = join(auditDir, AUDIT_FILES.pageScores);
  const finalPath = join(auditDir, AUDIT_FILES.finalStatus);
  const freshnessPath = join(auditDir, AUDIT_FILES.contentFreshness);
  const clustersPath = join(auditDir, AUDIT_FILES.topicalClusters);
  const queuePath = join(auditDir, AUDIT_FILES.completionQueue);

  const [scoresRes, finalRes, freshRes, clustersRes, queueRes] = await Promise.all([
    readJsonSafe<{ generatedAt?: string; thresholds?: { minimumPassingEeatScore: number; minimumInternalLinks: number }; summary?: Record<string, number>; pages?: RawPage[] }>(
      pageScoresPath,
    ),
    readJsonSafe<Record<string, unknown>>(finalPath),
    readJsonSafe<{
      catalogBundleMtime?: string | null;
      staleBlogPostsSample?: { slug: string; updatedAt: string }[];
      policy?: { staleDaysBlog: number; staleDaysLessonCatalog: number };
    }>(freshnessPath),
    readJsonSafe<{ clusterCount?: number }>(clustersPath),
    readJsonSafe<{ prioritized?: Array<{ id: string; score: number; flags: string[] }> }>(queuePath),
  ]);

  if (!scoresRes.ok) {
    warnings.push(`Missing or invalid ${AUDIT_FILES.pageScores}: ${scoresRes.error}`);
  }
  if (!finalRes.ok) warnings.push(`Optional ${AUDIT_FILES.finalStatus}: ${finalRes.error}`);
  if (!freshRes.ok) warnings.push(`Optional ${AUDIT_FILES.contentFreshness}: ${freshRes.error}`);
  if (!clustersRes.ok) warnings.push(`Optional ${AUDIT_FILES.topicalClusters}: ${clustersRes.error}`);
  if (!queueRes.ok) warnings.push(`Optional ${AUDIT_FILES.completionQueue}: ${queueRes.error}`);

  const pages = scoresRes.ok ? scoresRes.data.pages ?? [] : [];
  const rows = pages.map(buildRow).sort((a, b) => a.eeatScore - b.eeatScore);

  const summary = scoresRes.ok ? scoresRes.data.summary : undefined;
  const thresholds = scoresRes.ok ? scoresRes.data.thresholds ?? null : null;

  const thinProgrammaticRows = rows.filter((r) => r.thinProgrammatic);
  const staleQueueRows = rows.filter((r) => r.staleContent);
  const attributionQueueRows = rows.filter((r) => r.missingAttribution);

  const overview = {
    totalPages: summary?.pageCount ?? rows.length,
    averageScore: summary?.averageEeatScore ?? (rows.length ? Math.round(rows.reduce((a, r) => a + r.eeatScore, 0) / rows.length) : 0),
    belowThreshold: summary?.pagesBelowThreshold ?? rows.filter((r) => r.eeatScore < (thresholds?.minimumPassingEeatScore ?? 70)).length,
    internalLinkGaps: summary?.internalLinkGaps ?? rows.filter((r) => r.missingInternalLinks).length,
    thinProgrammaticCount: thinProgrammaticRows.length,
    staleFlaggedCount: staleQueueRows.length,
    missingAttributionCount: attributionQueueRows.length,
    structureIncompleteCount: rows.filter((r) => r.structureIncomplete).length,
  };

  return {
    generatedAtPageScores: scoresRes.ok ? scoresRes.data.generatedAt ?? null : null,
    generatedAtFinalStatus: finalRes.ok ? (finalRes.data.generatedAt as string) ?? null : null,
    thresholds,
    finalStatusSummary: finalRes.ok ? finalRes.data : null,
    overview,
    rows,
    pathwayRollups: rollupByPathway(rows),
    thinProgrammaticRows,
    staleQueueRows,
    attributionQueueRows,
    topicalClusterCount: clustersRes.ok ? clustersRes.data.clusterCount ?? 0 : 0,
    freshnessMeta: {
      catalogBundleMtime: freshRes.ok ? freshRes.data.catalogBundleMtime ?? null : null,
      staleBlogPostsSample: freshRes.ok ? freshRes.data.staleBlogPostsSample ?? [] : [],
      policy: freshRes.ok ? freshRes.data.policy ?? null : null,
    },
    loadWarnings: warnings,
    completionQueuePreview: queueRes.ok ? (queueRes.data.prioritized ?? []).slice(0, 40) : [],
  };
}

