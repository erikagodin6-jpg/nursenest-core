/**
 * Marketing lessons hub — **diagnostic-only** classification of why prepared rows fail strict
 * public-hub verification (prepare → verify → optional fill prefilter taxonomy).
 * Does not change production filters.
 */
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import type { HubMarketingLessonDetailFailureReason } from "@/lib/lessons/pathway-lesson-marketing-link-integrity-reasons";

/** Same shape as {@link HubLessonDetailExcluded} — defined here to avoid importing verify module (cycles). */
export type HubLessonVerifyExcludedRow = { slug: string; reason: HubMarketingLessonDetailFailureReason };
import type { PathwayLessonRecord } from "@/lib/lessons/pathway-lesson-types";
import { pathwayLessonHasRenderableHubSlug } from "@/lib/lessons/pathway-lesson-types";

/** Public-facing taxonomy for ops / scripts (maps internal verify + prepare signals). */
export type LessonHubVisibilityExclusionReason =
  | "not_renderable_slug"
  | "no_marketing_detail_href"
  | "review_required"
  | "not_public_marketing_eligible"
  | "pathway_context_mismatch"
  | "cross_link_integrity_failed"
  | "suppressed_professional_practice"
  | "workflow_not_published_or_released"
  | "missing_required_metadata"
  | "unknown";

export type LessonHubVisibilitySampleRow = {
  slug: string;
  title: string;
  pathwayId: string;
  careerSlug: string | null;
  exam: string | null;
  workflowStatus: string | null;
  publishStatus: string | null;
  hubMarketingDegraded: boolean;
  exclusionReason?: LessonHubVisibilityExclusionReason;
  failedGate?: string;
};

/** Maps internal hub verify failure codes into the diagnostic taxonomy. */
export function mapHubMarketingFailureToVisibilityReason(
  reason: HubMarketingLessonDetailFailureReason,
): LessonHubVisibilityExclusionReason {
  switch (reason) {
    case "missing_slug":
      return "not_renderable_slug";
    case "detail_loader_miss":
      return "cross_link_integrity_failed";
    case "detail_not_public_complete":
      return "not_public_marketing_eligible";
    case "pathway_context_mismatch":
      return "pathway_context_mismatch";
    case "professional_hub_corpus_guard":
      return "suppressed_professional_practice";
    case "taxonomy_review_required":
      return "review_required";
    default:
      return "unknown";
  }
}

function firstNonEmpty(...vals: Array<string | null | undefined>): string | null {
  for (const v of vals) {
    const t = typeof v === "string" ? v.trim() : "";
    if (t) return t;
  }
  return null;
}

function sampleRowBase(
  pathwayId: string,
  row: PathwayLessonRecord,
  extras: {
    hubMarketingDegraded: boolean;
    exclusionReason?: LessonHubVisibilityExclusionReason;
    failedGate?: string;
    workflowStatus: string | null;
    publishStatus: string | null;
  },
): LessonHubVisibilitySampleRow {
  const active = row.activeExamMeta;
  return {
    slug: String(row.slug ?? "").slice(0, 500),
    title: String(row.title ?? "").slice(0, 500),
    pathwayId,
    careerSlug: firstNonEmpty(active?.careerSlug, (row as { careerSlug?: string }).careerSlug) ?? null,
    exam: firstNonEmpty(active?.exam, (row as { exam?: string }).exam) ?? null,
    workflowStatus: extras.workflowStatus,
    publishStatus: extras.publishStatus,
    hubMarketingDegraded: extras.hubMarketingDegraded,
    ...(extras.exclusionReason ? { exclusionReason: extras.exclusionReason } : {}),
    ...(extras.failedGate ? { failedGate: extras.failedGate } : {}),
  };
}

export type LessonHubPreparedRowVisibilityOutcome = {
  slug: string;
  strictKept: boolean;
  exclusionReason: LessonHubVisibilityExclusionReason | null;
  failedGate: string;
};

/**
 * Per prepared row: strict kept vs excluded-with-reason (degraded rows count as excluded from strict).
 */
export function classifyPreparedRowsForMarketingHubVisibility(args: {
  pathwayId: string;
  prepared: readonly PathwayLessonRecord[];
  verifyKept: readonly PathwayLessonRecord[];
  verifyExcluded: readonly HubLessonVerifyExcludedRow[];
}): {
  outcomes: LessonHubPreparedRowVisibilityOutcome[];
  exclusionReasonCounts: Record<LessonHubVisibilityExclusionReason, number>;
  totalPrepared: number;
  totalVerifyKeptStrict: number;
  totalExcluded: number;
} {
  const slugToVerifyReason = new Map<string, HubMarketingLessonDetailFailureReason>();
  for (const e of args.verifyExcluded) {
    const k = e.slug.trim();
    if (!slugToVerifyReason.has(k)) slugToVerifyReason.set(k, e.reason);
  }

  /** True when this prepared slug has at least one non-degraded kept row (strict). */
  const strictKeptSlugs = new Set<string>();
  for (const row of args.verifyKept) {
    if (!pathwayLessonHasRenderableHubSlug(row)) continue;
    if (row.hubMarketingDegraded) continue;
    strictKeptSlugs.add(row.slug.trim());
  }

  const outcomes: LessonHubPreparedRowVisibilityOutcome[] = [];
  const exclusionReasonCounts: Record<LessonHubVisibilityExclusionReason, number> = {
    not_renderable_slug: 0,
    no_marketing_detail_href: 0,
    review_required: 0,
    not_public_marketing_eligible: 0,
    pathway_context_mismatch: 0,
    cross_link_integrity_failed: 0,
    suppressed_professional_practice: 0,
    workflow_not_published_or_released: 0,
    missing_required_metadata: 0,
    unknown: 0,
  };

  for (const row of args.prepared) {
    if (!pathwayLessonHasRenderableHubSlug(row)) {
      const slug = String(row.slug ?? "");
      const r: LessonHubVisibilityExclusionReason = "not_renderable_slug";
      exclusionReasonCounts[r] += 1;
      outcomes.push({ slug, strictKept: false, exclusionReason: r, failedGate: "pathwayLessonHasRenderableHubSlug" });
      continue;
    }
    const slug = row.slug.trim();
    if (strictKeptSlugs.has(slug)) {
      outcomes.push({ slug, strictKept: true, exclusionReason: null, failedGate: "" });
      continue;
    }

    const degraded = args.verifyKept.find((k) => k.slug.trim() === slug && k.hubMarketingDegraded);
    if (degraded) {
      const r: LessonHubVisibilityExclusionReason =
        degraded.hubMarketingDegradedReason === "pathway_mismatch"
          ? "pathway_context_mismatch"
          : "not_public_marketing_eligible";
      exclusionReasonCounts[r] += 1;
      outcomes.push({
        slug,
        strictKept: false,
        exclusionReason: r,
        failedGate: degraded.hubMarketingDegradedReason ?? "hubMarketingDegraded",
      });
      continue;
    }

    const internal = slugToVerifyReason.get(slug) ?? "detail_loader_miss";
    const listIncomplete = row.structuralQuality?.publicComplete === false;
    let r = mapHubMarketingFailureToVisibilityReason(internal);
    let failedGate = internal;
    if (internal === "detail_loader_miss" && listIncomplete) {
      r = "missing_required_metadata";
      failedGate = "list_row_incomplete_then_detail_miss";
    }
    exclusionReasonCounts[r] += 1;
    outcomes.push({ slug, strictKept: false, exclusionReason: r, failedGate });
  }

  const totalPrepared = args.prepared.length;
  const totalVerifyKeptStrict = outcomes.filter((o) => o.strictKept).length;
  const totalExcluded = totalPrepared - totalVerifyKeptStrict;

  return {
    outcomes,
    exclusionReasonCounts,
    totalPrepared,
    totalVerifyKeptStrict,
    totalExcluded,
  };
}

export type TopVisibilityExclusionReason = { reason: LessonHubVisibilityExclusionReason; count: number };

/** Safe log payload: counts + top reasons only (no slug lists). */
export function buildMarketingLessonHubVerifySummaryLogFields(args: {
  pathwayId: string;
  preparedCount: number;
  verifyKeptStrictCount: number;
  excludedCount: number;
  exclusionReasonCounts: Record<LessonHubVisibilityExclusionReason, number>;
  topN?: number;
}): Record<string, string> {
  const n = Math.max(1, Math.min(20, args.topN ?? 8));
  const top: TopVisibilityExclusionReason[] = (
    Object.entries(args.exclusionReasonCounts) as Array<[LessonHubVisibilityExclusionReason, number]>
  )
    .filter(([, c]) => c > 0)
    .map(([reason, count]) => ({ reason, count }))
    .sort((a, b) => b.count - a.count || a.reason.localeCompare(b.reason))
    .slice(0, n);

  return {
    stage: "marketing_lesson_hub_verify_summary",
    pathway_id: args.pathwayId,
    prepared_count: String(args.preparedCount),
    verify_kept_strict_count: String(args.verifyKeptStrictCount),
    excluded_count: String(args.excludedCount),
    top_exclusion_reasons_json: JSON.stringify(top),
  };
}

export type LessonHubVisibilityDiagnosticsReport = {
  pathwayId: string;
  country: string;
  locale: string;
  totalPrepared: number;
  totalVerifyKept: number;
  totalExcluded: number;
  exclusionReasonCounts: Record<LessonHubVisibilityExclusionReason, number>;
  keptSamples: LessonHubVisibilitySampleRow[];
  excludedSamples: LessonHubVisibilitySampleRow[];
};

export async function buildLessonHubVisibilityDiagnosticsReport(args: {
  pathway: ExamPathwayDefinition;
  countrySlug: string;
  lessonContentLocale: string;
  prepared: readonly PathwayLessonRecord[];
  verifyKept: readonly PathwayLessonRecord[];
  verifyExcluded: readonly HubLessonVerifyExcludedRow[];
  sampleKept: number;
  sampleExcluded: number;
  /** Optional slug → DB status for sample enrichment (script-only). */
  prismaStatusBySlug?: ReadonlyMap<string, string> | null;
}): Promise<LessonHubVisibilityDiagnosticsReport> {
  const classified = classifyPreparedRowsForMarketingHubVisibility({
    pathwayId: args.pathway.id,
    prepared: args.prepared,
    verifyKept: args.verifyKept,
    verifyExcluded: args.verifyExcluded,
  });

  const preparedBySlug = new Map<string, PathwayLessonRecord>();
  for (const row of args.prepared) {
    if (!pathwayLessonHasRenderableHubSlug(row)) continue;
    const k = row.slug.trim();
    if (!preparedBySlug.has(k)) preparedBySlug.set(k, row);
  }

  const statusMap = args.prismaStatusBySlug ?? null;

  function enrich(row: PathwayLessonRecord, o: LessonHubPreparedRowVisibilityOutcome): LessonHubVisibilitySampleRow {
    const slug = row.slug.trim();
    const pub = statusMap?.get(slug) ?? null;
    return sampleRowBase(args.pathway.id, row, {
      hubMarketingDegraded: Boolean(row.hubMarketingDegraded),
      exclusionReason: o.exclusionReason ?? undefined,
      failedGate: o.failedGate || undefined,
      workflowStatus: null,
      publishStatus: pub,
    });
  }

  const strictKeptOutcomes = classified.outcomes.filter((o) => o.strictKept);
  const excludedOutcomes = classified.outcomes.filter((o) => !o.strictKept);

  const keptSamples: LessonHubVisibilitySampleRow[] = [];
  for (const o of strictKeptOutcomes.slice(0, Math.max(0, args.sampleKept))) {
    const row = preparedBySlug.get(o.slug);
    if (!row) continue;
    keptSamples.push(enrich(row, o));
  }

  const excludedSamples: LessonHubVisibilitySampleRow[] = [];
  for (const o of excludedOutcomes.slice(0, Math.max(0, args.sampleExcluded))) {
    const row = preparedBySlug.get(o.slug);
    if (!row) continue;
    excludedSamples.push(enrich(row, o));
  }

  return {
    pathwayId: args.pathway.id,
    country: args.countrySlug,
    locale: args.lessonContentLocale,
    totalPrepared: classified.totalPrepared,
    totalVerifyKept: classified.totalVerifyKeptStrict,
    totalExcluded: classified.totalExcluded,
    exclusionReasonCounts: classified.exclusionReasonCounts,
    keptSamples,
    excludedSamples,
  };
}
