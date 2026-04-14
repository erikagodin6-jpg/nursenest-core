/**
 * Normalizes repo-root E-E-A-T audit JSON into an editorial operations view model.
 * Read-only — no DB. Safe for admin reporting.
 */
import { readFile } from "node:fs/promises";
import { basename, join } from "node:path";

import { getMonorepoRoot } from "@/lib/monorepo-root";
import type {
  EeatEditorialDashboardVm,
  EeatEditorialPriority,
  EeatEditorialRow,
  EeatRawPage,
  PathwayEeatRollup,
} from "@/lib/admin/eeat-editorial-model";

export type {
  EeatEditorialDashboardVm,
  EeatEditorialPriority,
  EeatEditorialRow,
  EeatRawPage,
  PathwayEeatRollup,
} from "@/lib/admin/eeat-editorial-model";

export { filterEeatEditorialRows, type EditorialFilterState } from "@/lib/admin/eeat-editorial-filters";

const AUDIT_FILES = {
  pageScores: "eeat-page-scores.json",
  completionQueue: "eeat-completion-queue.json",
  finalStatus: "eeat-final-status.json",
  topicalClusters: "topical-clusters.json",
  contentFreshness: "content-freshness.json",
} as const;

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
  const s = Number.isFinite(score) ? score : 0;
  if (s < 45 || (flags.includes("thin_programmatic") && s < 50)) return "critical";
  if (s < 55) return "high";
  if (s < 70) return "medium";
  return "low";
}

function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Math.min(1, Math.max(0, n));
}

function asFiniteNumber(v: unknown, fallback: number): number {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "string" && v.trim() !== "") {
    const n = Number(v);
    if (Number.isFinite(n)) return n;
  }
  return fallback;
}

function asInt(v: unknown, fallback: number): number {
  const n = Math.round(asFiniteNumber(v, fallback));
  return Number.isFinite(n) ? n : fallback;
}

/** Defensive coercion so malformed audit rows never throw during dashboard build. */
export function normalizeRawPage(raw: unknown, index: number): EeatRawPage {
  const o = raw !== null && typeof raw === "object" && !Array.isArray(raw) ? (raw as Record<string, unknown>) : {};
  const id = typeof o.id === "string" && o.id.trim() ? o.id.trim() : `invalid-row:${index}`;
  const contentType = typeof o.contentType === "string" ? o.contentType : "unknown";
  const urlPattern = typeof o.urlPattern === "string" ? o.urlPattern : "";
  const wordCount = Math.max(0, asInt(o.wordCount, 0));
  let sectionCompleteness = asFiniteNumber(o.sectionCompleteness, 0);
  if (sectionCompleteness > 1 && sectionCompleteness <= 100) sectionCompleteness = sectionCompleteness / 100;
  sectionCompleteness = clamp01(sectionCompleteness);
  const internalLinksCount = Math.max(0, asInt(o.internalLinksCount, 0));
  const lastUpdated =
    o.lastUpdated === null
      ? null
      : typeof o.lastUpdated === "string"
        ? o.lastUpdated
        : null;
  const authorPresent = Boolean(o.authorPresent);
  const schemaPresent = Boolean(o.schemaPresent);
  let score = asFiniteNumber(o.eeatScore, 0);
  if (score > 0 && score <= 1) score *= 100;
  score = Math.min(100, Math.max(0, score));

  const flags = Array.isArray(o.flags) ? o.flags.map((f) => String(f)) : [];

  return {
    id,
    urlPattern,
    contentType,
    wordCount,
    sectionCompleteness,
    internalLinksCount,
    lastUpdated,
    authorPresent,
    schemaPresent,
    eeatScore: score,
    flags,
  };
}


/** Exported for unit tests — production code uses `loadEeatEditorialDashboard` → normalized `EeatRawPage`. */
export function buildEeatEditorialRowFromRaw(raw: EeatRawPage): EeatEditorialRow {
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

export function rollupByPathway(rows: EeatEditorialRow[]): PathwayEeatRollup[] {
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

function normalizeCompletionQueueEntry(raw: unknown, index: number): { id: string; score: number; flags: string[] } | null {
  if (raw === null || typeof raw !== "object" || Array.isArray(raw)) return null;
  const o = raw as Record<string, unknown>;
  const id = typeof o.id === "string" && o.id.trim() ? o.id.trim() : `queue:${index}`;
  const score = asFiniteNumber(o.score, 0);
  const flags = Array.isArray(o.flags) ? o.flags.map((x) => String(x)) : [];
  return { id, score, flags };
}

export function normalizePrioritizedQueue(input: unknown, max = 40): Array<{ id: string; score: number; flags: string[] }> {
  if (!Array.isArray(input)) return [];
  const out: Array<{ id: string; score: number; flags: string[] }> = [];
  for (let i = 0; i < input.length && out.length < max; i++) {
    const row = normalizeCompletionQueueEntry(input[i], i);
    if (row) out.push(row);
  }
  return out;
}

export type AuditJsonFileKind = "pageScores" | "completionQueue" | "genericObject";

/**
 * Coerce parsed audit JSON into an object record. Arrays are wrapped only for known exports
 * (page list, completion queue). Exported for unit tests.
 */
export function coerceAuditJsonRoot(
  parsed: unknown,
  fileLabel: string,
  kind: AuditJsonFileKind,
  sink: string[],
): { ok: true; data: Record<string, unknown> } | { ok: false; error: string } {
  if (parsed === null) {
    return { ok: false, error: `${fileLabel}: JSON root is null (expected object)` };
  }
  const t = typeof parsed;
  if (t === "string" || t === "number" || t === "boolean") {
    return { ok: false, error: `${fileLabel}: JSON root is ${t} (expected object)` };
  }
  if (Array.isArray(parsed)) {
    if (kind === "pageScores") {
      sink.push(
        `${fileLabel}: JSON root is an array — wrapped as { pages: [...] } (expected an object with a "pages" field)`,
      );
      return { ok: true, data: { pages: parsed } };
    }
    if (kind === "completionQueue") {
      const first = parsed[0];
      const looksLikeQueueEntry =
        first !== null &&
        typeof first === "object" &&
        !Array.isArray(first) &&
        typeof (first as Record<string, unknown>).id === "string" &&
        "score" in (first as Record<string, unknown>);
      if (looksLikeQueueEntry) {
        sink.push(
          `${fileLabel}: JSON root is an array — wrapped as { prioritized: [...] } (expected an object with a "prioritized" field)`,
        );
        return { ok: true, data: { prioritized: parsed as unknown[] } };
      }
      sink.push(
        `${fileLabel}: JSON root is an array but entries are not queue-shaped ({ id: string, score, ... }) — skipping queue preview`,
      );
      return { ok: true, data: {} };
    }
    sink.push(
      `${fileLabel}: JSON root is an array (expected object) — cannot infer fields; using empty object`,
    );
    return { ok: true, data: {} };
  }
  return { ok: true, data: parsed as Record<string, unknown> };
}

async function readAuditJsonFile(
  path: string,
  kind: AuditJsonFileKind,
  sink: string[],
): Promise<{ ok: true; data: Record<string, unknown> } | { ok: false; error: string; isMissing?: boolean }> {
  const fileLabel = basename(path);
  try {
    const raw = await readFile(path, "utf8");
    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch {
      return { ok: false, error: `${fileLabel}: invalid JSON (parse error)` };
    }
    const coerced = coerceAuditJsonRoot(parsed, fileLabel, kind, sink);
    if (!coerced.ok) {
      return { ok: false, error: coerced.error };
    }
    return { ok: true, data: coerced.data };
  } catch (e) {
    const err = e as NodeJS.ErrnoException;
    if (err.code === "ENOENT") {
      return { ok: false, error: `${fileLabel}: file not found`, isMissing: true };
    }
    return { ok: false, error: `${fileLabel}: ${e instanceof Error ? e.message : String(e)}` };
  }
}

function extractPageScoresPayload(
  data: Record<string, unknown>,
  warnings: string[],
): {
  generatedAt?: string;
  thresholds?: { minimumPassingEeatScore: number; minimumInternalLinks: number };
  summary?: Record<string, number>;
  pages: EeatRawPage[];
} {
  const generatedAt = typeof data.generatedAt === "string" ? data.generatedAt : undefined;
  let thresholds: { minimumPassingEeatScore: number; minimumInternalLinks: number } | undefined;
  const t = data.thresholds;
  if (t && typeof t === "object" && !Array.isArray(t)) {
    const to = t as Record<string, unknown>;
    const minScore = asFiniteNumber(to.minimumPassingEeatScore, 70);
    const minLinks = asFiniteNumber(to.minimumInternalLinks, 3);
    thresholds = { minimumPassingEeatScore: minScore, minimumInternalLinks: minLinks };
  }
  const summary = typeof data.summary === "object" && data.summary !== null && !Array.isArray(data.summary) ? (data.summary as Record<string, number>) : undefined;

  const rawPages = data.pages;
  if (rawPages === undefined) {
    const keys = Object.keys(data);
    warnings.push(
      `${AUDIT_FILES.pageScores}: missing "pages" key — object keys: ${keys.length ? keys.slice(0, 16).join(", ") : "(none)"} — treating as empty array`,
    );
    return { generatedAt, thresholds, summary, pages: [] };
  }
  if (!Array.isArray(rawPages)) {
    warnings.push(
      `${AUDIT_FILES.pageScores}: "pages" field has wrong type (${typeof rawPages}) — expected array — treating as empty`,
    );
    return { generatedAt, thresholds, summary, pages: [] };
  }
  if (rawPages.length === 0) {
    warnings.push(`${AUDIT_FILES.pageScores}: empty pages array`);
  }

  const pages = rawPages.map((item, index) => normalizeRawPage(item, index));
  return { generatedAt, thresholds, summary, pages };
}

function normalizeStaleBlogSample(input: unknown): { slug: string; updatedAt: string }[] {
  if (!Array.isArray(input)) return [];
  const out: { slug: string; updatedAt: string }[] = [];
  for (const item of input) {
    if (!item || typeof item !== "object" || Array.isArray(item)) continue;
    const o = item as Record<string, unknown>;
    const slug = typeof o.slug === "string" ? o.slug : "";
    const updatedAt = typeof o.updatedAt === "string" ? o.updatedAt : "";
    if (slug) out.push({ slug, updatedAt });
  }
  return out;
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
    readAuditJsonFile(pageScoresPath, "pageScores", warnings),
    readAuditJsonFile(finalPath, "genericObject", warnings),
    readAuditJsonFile(freshnessPath, "genericObject", warnings),
    readAuditJsonFile(clustersPath, "genericObject", warnings),
    readAuditJsonFile(queuePath, "completionQueue", warnings),
  ]);

  if (!scoresRes.ok) {
    warnings.push(
      scoresRes.isMissing
        ? `Required ${AUDIT_FILES.pageScores}: missing — run E-E-A-T audit or copy artifact into data/audit/`
        : `${AUDIT_FILES.pageScores}: ${scoresRes.error}`,
    );
  }

  if (!finalRes.ok && !finalRes.isMissing) warnings.push(`Optional ${AUDIT_FILES.finalStatus}: ${finalRes.error}`);
  if (!finalRes.ok && finalRes.isMissing) warnings.push(`Optional ${AUDIT_FILES.finalStatus}: file not found`);

  if (!freshRes.ok && !freshRes.isMissing) warnings.push(`Optional ${AUDIT_FILES.contentFreshness}: ${freshRes.error}`);
  if (!freshRes.ok && freshRes.isMissing) warnings.push(`Optional ${AUDIT_FILES.contentFreshness}: file not found`);

  if (!clustersRes.ok && !clustersRes.isMissing) warnings.push(`Optional ${AUDIT_FILES.topicalClusters}: ${clustersRes.error}`);
  if (!clustersRes.ok && clustersRes.isMissing) warnings.push(`Optional ${AUDIT_FILES.topicalClusters}: file not found`);

  if (!queueRes.ok && !queueRes.isMissing) warnings.push(`Optional ${AUDIT_FILES.completionQueue}: ${queueRes.error}`);
  if (!queueRes.ok && queueRes.isMissing) warnings.push(`Optional ${AUDIT_FILES.completionQueue}: file not found`);

  let pages: EeatRawPage[] = [];
  let generatedAtPageScores: string | null = null;
  let thresholds: EeatEditorialDashboardVm["thresholds"] = null;
  let summary: Record<string, number> | undefined;

  if (scoresRes.ok) {
    const extracted = extractPageScoresPayload(scoresRes.data, warnings);
    pages = extracted.pages;
    generatedAtPageScores = extracted.generatedAt ?? null;
    thresholds = extracted.thresholds ?? null;
    summary = extracted.summary;
  }

  const rows = pages.map(buildEeatEditorialRowFromRaw).sort((a, b) => a.eeatScore - b.eeatScore);

  const thinProgrammaticRows = rows.filter((r) => r.thinProgrammatic);
  const staleQueueRows = rows.filter((r) => r.staleContent);
  const attributionQueueRows = rows.filter((r) => r.missingAttribution);

  const overview = {
    totalPages: summary?.pageCount ?? rows.length,
    averageScore:
      summary?.averageEeatScore ??
      (rows.length ? Math.round(rows.reduce((a, r) => a + r.eeatScore, 0) / rows.length) : 0),
    belowThreshold:
      summary?.pagesBelowThreshold ??
      rows.filter((r) => r.eeatScore < (thresholds?.minimumPassingEeatScore ?? 70)).length,
    internalLinkGaps:
      summary?.internalLinkGaps ?? rows.filter((r) => r.missingInternalLinks).length,
    thinProgrammaticCount: thinProgrammaticRows.length,
    staleFlaggedCount: staleQueueRows.length,
    missingAttributionCount: attributionQueueRows.length,
    structureIncompleteCount: rows.filter((r) => r.structureIncomplete).length,
  };

  const finalStatusSummary = finalRes.ok ? (finalRes.data as Record<string, unknown>) : null;
  const generatedAtFinalStatus =
    finalRes.ok && typeof finalRes.data.generatedAt === "string" ? finalRes.data.generatedAt : null;

  let topicalClusterCount = 0;
  if (clustersRes.ok) {
    const cc = clustersRes.data.clusterCount;
    topicalClusterCount = typeof cc === "number" && Number.isFinite(cc) ? Math.max(0, Math.floor(cc)) : 0;
  }

  let freshnessMeta: EeatEditorialDashboardVm["freshnessMeta"] = {
    catalogBundleMtime: null,
    staleBlogPostsSample: [],
    policy: null,
  };
  if (freshRes.ok) {
    const d = freshRes.data;
    const mtime = d.catalogBundleMtime;
    freshnessMeta = {
      catalogBundleMtime: typeof mtime === "string" || mtime === null ? mtime : null,
      staleBlogPostsSample: normalizeStaleBlogSample(d.staleBlogPostsSample),
      policy:
        d.policy && typeof d.policy === "object" && !Array.isArray(d.policy)
          ? {
              staleDaysBlog: asInt((d.policy as Record<string, unknown>).staleDaysBlog, 0),
              staleDaysLessonCatalog: asInt((d.policy as Record<string, unknown>).staleDaysLessonCatalog, 0),
            }
          : null,
    };
  }

  let completionQueuePreview: EeatEditorialDashboardVm["completionQueuePreview"] = [];
  if (queueRes.ok) {
    const prioritized = (queueRes.data as Record<string, unknown>).prioritized;
    completionQueuePreview = normalizePrioritizedQueue(prioritized, 40);
    if (prioritized !== undefined && !Array.isArray(prioritized)) {
      warnings.push(
        `${AUDIT_FILES.completionQueue}: "prioritized" has wrong type (${typeof prioritized}) — expected array — queue preview empty`,
      );
    }
  }

  return {
    generatedAtPageScores,
    generatedAtFinalStatus,
    thresholds,
    finalStatusSummary,
    overview,
    rows,
    pathwayRollups: rollupByPathway(rows),
    thinProgrammaticRows,
    staleQueueRows,
    attributionQueueRows,
    topicalClusterCount,
    freshnessMeta,
    loadWarnings: warnings,
    completionQueuePreview,
  };
}
