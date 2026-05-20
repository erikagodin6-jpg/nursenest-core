/**
 * NP lesson fix plan: all production NP pathways with bundled catalog lessons.
 * Source: lesson-completeness-audit.json (priority queue currently omits NP pathways).
 *
 * Run: cd nursenest-core && npx tsx scripts/audit/build-np-lesson-fix-batch-1-plan.mts
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..", "..", "..");
const AUDIT_PATH = join(ROOT, "data", "audit", "lesson-completeness-audit.json");
const OUT = join(ROOT, "data", "audit", "np-lesson-fix-batch-1-plan.json");

/** NP pathways in exam registry (US tracks + Canada NP). Only pathways with bundled lessons appear in audit. */
const NP_PATHWAYS = [
  "us-np-fnp",
  "us-np-agpcnp",
  "us-np-pmhnp",
  "us-np-whnp",
  "us-np-pnp-pc",
  "ca-np-cnple",
] as const;

function pathwayPriority(id: string): number {
  const order = [...NP_PATHWAYS];
  const i = order.indexOf(id as (typeof NP_PATHWAYS)[number]);
  return i === -1 ? 99 : i;
}

type AuditRow = {
  lessonId: string;
  slug: string;
  title: string;
  pathwayId: string;
  exam: string;
  country: string;
  routable: boolean;
  overallScore: number;
  structuralScore: number;
  educationalScore: number;
  linkScore: number;
  localizationScore: number;
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
  if (r.includes("premium") || r.includes("tier_specific") || r.includes("related_next_steps"))
    return "scoped_gold_premium_spine";
  if (r.includes("Legacy section") || r.includes("legacy")) return "legacy_five_block_np_depth_and_internal_links";
  if (r.includes("internal") || r.includes("relatedLessonRefs")) return "internal_links_and_related_refs";
  if (r.includes("overlay") || r.includes("localization")) return "localization_overlay_follow_up";
  return "catalog_np_body_expansion_cert_relevant";
}

function main() {
  const auditDoc = JSON.parse(readFileSync(AUDIT_PATH, "utf8")) as { lessons: AuditRow[]; generatedAt: string };

  const rows = auditDoc.lessons
    .filter((l) => NP_PATHWAYS.includes(l.pathwayId as (typeof NP_PATHWAYS)[number]))
    .filter((l) => l.routable)
    .filter((l) => l.status !== "duplicate_or_unclear_source" && l.status !== "not_routable");

  rows.sort((x, y) => {
    const tg = contentGapTier(x) - contentGapTier(y);
    if (tg !== 0) return tg;
    const po = pathwayPriority(x.pathwayId) - pathwayPriority(y.pathwayId);
    if (po !== 0) return po;
    if (x.overallScore !== y.overallScore) return x.overallScore - y.overallScore;
    return x.lessonId.localeCompare(y.lessonId);
  });

  const selected = rows.slice(0, 100).map((ar) => ({
    lessonId: ar.lessonId,
    slug: ar.slug,
    title: ar.title,
    pathwayId: ar.pathwayId,
    country: ar.country,
    exam: ar.exam,
    currentScores: {
      overallScore: ar.overallScore,
      structuralScore: ar.structuralScore,
      educationalScore: ar.educationalScore,
      linkScore: ar.linkScore,
      localizationScore: ar.localizationScore,
    },
    currentStatus: ar.status,
    contentReadinessStatus: ar.contentReadinessStatus,
    localizationReadinessStatus: ar.localizationReadinessStatus,
    topFailureReasons: (ar.reasons ?? []).slice(0, 12),
    intendedFixScope: intendedFixScope(ar.reasons ?? []),
  }));

  mkdirSync(dirname(OUT), { recursive: true });
  writeFileSync(
    OUT,
    `${JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        sourceAuditGeneratedAt: auditDoc.generatedAt,
        batchSize: selected.length,
        npPathways: [...NP_PATHWAYS],
        selectionRules:
          "NP pathways (registry list); routable; exclude duplicate_or_unclear_source and not_routable; sort structural/content gaps first, then US NP track order (FNP→AGPCNP→PMHNP→WHNP→PNP-PC→CA NP), then overallScore asc; cap 100.",
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
