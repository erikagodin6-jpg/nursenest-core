/**
 * Builds data/audit/lesson-fix-batch-2-plan.json from lesson-completeness-priority-queue.json
 * Priority: nursing RN/PN/NP pathways, lowest overallScore, structural gaps before localization-only.
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..", "..", "..");
const QUEUE_PATH = join(ROOT, "data", "audit", "lesson-completeness-priority-queue.json");
const OUT = join(ROOT, "data", "audit", "lesson-fix-batch-2-plan.json");

const NURSING = new Set([
  "us-rn-nclex-rn",
  "ca-rn-nclex-rn",
  "us-lpn-nclex-pn",
  "ca-rpn-rex-pn",
  "us-rn-new-grad-transition",
  "us-np-fnp",
  "us-np-agpcnp",
  "us-np-pmhnp",
  "us-np-whnp",
  "us-np-pnp-pc",
  "ca-np-cnple",
]);

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

function main() {
  const raw = JSON.parse(readFileSync(QUEUE_PATH, "utf8")) as { queue: QueueRow[]; generatedAt: string };
  const nursing = raw.queue.filter((r) => NURSING.has(r.pathwayId));

  const structuralFirst = (r: QueueRow) =>
    r.contentReadinessStatus === "structurally_incomplete" || r.status === "structurally_incomplete" ? 0 : 1;

  nursing.sort((a, b) => {
    const s = structuralFirst(a) - structuralFirst(b);
    if (s !== 0) return s;
    return a.overallScore - b.overallScore;
  });

  const selected = nursing.slice(0, 100).map((r) => ({
    lessonId: r.lessonId,
    slug: r.slug,
    title: r.title,
    pathwayId: r.pathwayId,
    currentScores: { overallScore: r.overallScore },
    currentStatus: r.status,
    contentReadinessStatus: r.contentReadinessStatus ?? null,
    localizationReadinessStatus: r.localizationReadinessStatus ?? null,
    topFailureReasons: r.reasons.slice(0, 8),
    intendedFixScope:
      r.reasons.some((x) => x.includes("labs_diagnostics") || x.includes("Section \"labs"))
        ? "scoped_gold_premium_labs_and_spine"
        : r.reasons.some((x) => x.includes("Legacy section"))
          ? "legacy_spine_depth_clinical_scenario"
          : r.reasons.some((x) => x.includes("internal") || x.includes("relatedLessonRefs"))
            ? "internal_links_and_related_refs"
            : r.reasons.some((x) => x.includes("overlay") || x.includes("localization"))
              ? "localization_overlay_follow_up"
              : "catalog_or_provider_body_expansion",
  }));

  mkdirSync(dirname(OUT), { recursive: true });
  writeFileSync(
    OUT,
    `${JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        sourceQueueGeneratedAt: raw.generatedAt,
        batchSize: selected.length,
        selectionRules:
          "Nursing pathways only; structurally_incomplete first; then ascending overallScore; cap 100.",
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
