/**
 * RN-only lesson fix plan: us-rn-nclex-rn → ca-rn-nclex-rn → us-rn-new-grad-transition.
 * Excludes duplicate_or_unclear_source and not_routable. Prioritizes structural/content gaps, then score.
 *
 * Run: cd nursenest-core && npx tsx scripts/audit/build-rn-lesson-fix-batch-1-plan.mts
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..", "..", "..");
const QUEUE_PATH = join(ROOT, "data", "audit", "lesson-completeness-priority-queue.json");
const AUDIT_PATH = join(ROOT, "data", "audit", "lesson-completeness-audit.json");
const OUT = join(ROOT, "data", "audit", "rn-lesson-fix-batch-1-plan.json");

const RN_PATHWAYS = ["us-rn-nclex-rn", "ca-rn-nclex-rn", "us-rn-new-grad-transition"] as const;

function pathwayPriority(id: string): number {
  if (id === "us-rn-nclex-rn") return 0;
  if (id === "ca-rn-nclex-rn") return 1;
  if (id === "us-rn-new-grad-transition") return 2;
  return 9;
}

type QueueRow = {
  lessonId: string;
  pathwayId: string;
  slug: string;
  title: string;
  status: string;
  contentReadinessStatus?: string;
  localizationReadinessStatus?: string;
  overallScore: number;
  reasons: string[];
  recommendedActions?: string[];
};

type AuditRow = {
  lessonId: string;
  slug: string;
  title: string;
  pathwayId: string;
  routable: boolean;
  overallScore: number;
  status: string;
  contentReadinessStatus: string;
  localizationReadinessStatus: string;
  reasons: string[];
};

function contentGapTier(a: AuditRow): number {
  const crs = a.contentReadinessStatus;
  const st = a.status;
  if (st === "duplicate_or_unclear_source" || st === "not_routable") return 99;
  if (crs === "structurally_incomplete" || crs === "content_incomplete") return 0;
  if (st === "structurally_incomplete" || st === "content_incomplete") return 0;
  if (crs === "usable_but_thin_en" || st === "usable_but_thin") return 1;
  if (crs === "production_ready_en" && a.localizationReadinessStatus === "localization_incomplete") return 3;
  if (st === "localization_incomplete") return 3;
  return 2;
}

function intendedFixScope(reasons: string[]): string {
  const r = reasons.join(" ");
  if (r.includes("duplicate") || r.includes("canonical")) return "resolve_duplicate_source_or_document_canonical";
  if (r.includes("premium") || r.includes("tier_specific") || r.includes("related_next_steps")) return "scoped_gold_premium_spine";
  if (r.includes("Legacy section")) return "legacy_spine_depth_clinical_scenario";
  if (r.includes("internal") || r.includes("relatedLessonRefs")) return "internal_links_and_related_refs";
  if (r.includes("overlay") || r.includes("localization")) return "localization_overlay_follow_up";
  return "catalog_body_expansion_nclex_relevant";
}

function main() {
  const raw = JSON.parse(readFileSync(QUEUE_PATH, "utf8")) as { queue: QueueRow[]; generatedAt: string };
  const auditDoc = JSON.parse(readFileSync(AUDIT_PATH, "utf8")) as { lessons: AuditRow[]; generatedAt: string };
  const auditById = new Map(auditDoc.lessons.map((x) => [x.lessonId, x]));

  const rnQueue = raw.queue.filter((q) => RN_PATHWAYS.includes(q.pathwayId as (typeof RN_PATHWAYS)[number]));

  const enriched = rnQueue
    .map((q) => {
      const a = auditById.get(q.lessonId);
      return { q, a };
    })
    .filter(({ a }) => a && a.routable)
    .filter(({ a }) => a!.status !== "duplicate_or_unclear_source" && a!.status !== "not_routable");

  enriched.sort((x, y) => {
    const ax = x.a!;
    const ay = y.a!;
    const tg = contentGapTier(ax) - contentGapTier(ay);
    if (tg !== 0) return tg;
    const po = pathwayPriority(ax.pathwayId) - pathwayPriority(ay.pathwayId);
    if (po !== 0) return po;
    if (ax.overallScore !== ay.overallScore) return ax.overallScore - ay.overallScore;
    return ax.lessonId.localeCompare(ay.lessonId);
  });

  const selected = enriched.slice(0, 100).map(({ q, a }) => {
    const ar = a!;
    return {
      lessonId: ar.lessonId,
      slug: ar.slug,
      title: ar.title,
      pathwayId: ar.pathwayId,
      currentScores: { overallScore: ar.overallScore },
      currentStatus: ar.status,
      contentReadinessStatus: ar.contentReadinessStatus,
      localizationReadinessStatus: ar.localizationReadinessStatus,
      topFailureReasons: (ar.reasons?.length ? ar.reasons : q.reasons).slice(0, 10),
      intendedFixScope: intendedFixScope(ar.reasons?.length ? ar.reasons : q.reasons),
    };
  });

  mkdirSync(dirname(OUT), { recursive: true });
  writeFileSync(
    OUT,
    `${JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        sourceQueueGeneratedAt: raw.generatedAt,
        sourceAuditGeneratedAt: auditDoc.generatedAt,
        batchSize: selected.length,
        selectionRules:
          "RN pathways only (us-rn-nclex-rn, ca-rn-nclex-rn, us-rn-new-grad-transition); routable; exclude duplicate_or_unclear_source and not_routable; sort content/structural gaps first, then pathway order US→CA→new-grad, then overallScore asc; cap 100.",
        lessons: selected,
      },
      null,
      2,
    )}\n`,
    "utf8",
  );
  console.log("Wrote", OUT, "count", selected.length);
}

main();
